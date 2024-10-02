const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const { cloudinaryCloudName, cloudinaryPublicKey, cloudinarySecretKey } = require("./env_vars");

cloudinary.config({
  cloud_name: cloudinaryCloudName,
  api_key: cloudinaryPublicKey,
  api_secret: cloudinarySecretKey,
  secure: true,
});

// const upload = async (file) => {
//   const result = await cloudinary.uploader(file);

//   const url = cloudinary.url(result.public_id, {
//     transformation: [
//       { quality: "auto", fetch_format: "auto" },
//       { crop: "fill", gravity: "auto" },
//     ],
//   });

//   return url;
// };

const upload = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream({ folder: "test" }, (error, result) => {
      if (error) {
        console.error("Upload Error:", error); // چاپ خطا برای دیباگ
        return reject(error);
      } else {
        const url = cloudinary.url(result.public_id, {
          transformation: [
            { quality: "auto", fetch_format: "auto" },
            { crop: "fill", gravity: "auto" },
          ],
        });
        resolve(url);
      }
    });

    streamifier
      .createReadStream(buffer)
      .pipe(uploadStream)
      .on("error", (err) => {
        console.error("Stream Error:", err); // چاپ خطاهای مربوط به استریم
        reject(err);
      });
  });
};

const uploadWithRetry = async (buffer, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await upload(buffer);
    } catch (error) {
      console.error(`Upload failed (attempt ${i + 1}):`, error);
      if (i === retries - 1) throw error; // اگر آخرین تلاش است، خطا را پرتاب کنید
    }
  }
};

module.exports = uploadWithRetry;
