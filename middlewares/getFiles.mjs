import { fileTypeFromBuffer } from "file-type";
import AppError from "../configs/AppError.js";

export const getFilesBuffer = async (req, res) => {
  return new Promise((resolve, reject) => {
    try {
      let fileBuffer = [];
      let totalBytes = 0;

      req.on("data", (chunk) => {
        totalBytes += chunk.length;
        fileBuffer.push(chunk);
      });

      req.on("end", async () => {
        const buffer = Buffer.concat(fileBuffer);
        const fileMime = await fileTypeFromBuffer(buffer);

        if (!fileMime) {
          return reject(res.status(400).json({ error: "Failed to detect file type" }));
        }

        let maxFileSize;
        if (["video/mp4", "video/mpeg", "video/quicktime"].includes(fileMime.mime)) {
          maxFileSize = 50 * 1024 * 1024;
        } else if (["image/jpeg", "image/png", "image/gif"].includes(fileMime.mime)) {
          maxFileSize = 5 * 1024 * 1024;
        } else {
          return reject(res.status(400).json({ error: "Invalid file type" }));
        }

        if (totalBytes > maxFileSize) {
          return reject(res.status(400).json({ error: `File size exceeds limit for ${fileMime.mime}` }));
        }

        resolve(buffer);
      });
    } catch (error) {
      reject(new AppError(error.message, 500));
    }
  });
};
