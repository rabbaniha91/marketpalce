const cloudinary = require("cloudinary").v2;
const { cloudinaryCloudName, cloudinaryPublicKey, cloudinarySecretKey } = require("./env_vars");

cloudinary.config({
  cloud_name: cloudinaryCloudName,
  api_key: cloudinaryPublicKey,
  api_secret: cloudinarySecretKey,
  secure: true,
});

const upload = async (file) => {
  const result = await cloudinary.uploader(file);

  const url = cloudinary.url(result.public_id, {
    transformation: [
      { quality: "auto", fetch_format: "auto" },
      { crop: "fill", gravity: "auto" },
    ],
  });

  return url;
};

module.exports = upload;
