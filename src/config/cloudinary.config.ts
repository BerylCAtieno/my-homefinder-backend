import { v2 as cloudinary, ConfigOptions } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
} from ".";

const config: ConfigOptions = {
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
};

cloudinary.config(config);

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    // Use folder and format from req if available, fallback to defaults
    const folder = req.cloudinaryFolder || "documents";
    const format = req.cloudinaryFormat || "pdf";
    return {
      folder,
      format,
      public_id: `${Date.now()}-${file.originalname}`,
    };
  },
});

export { storage, cloudinary };