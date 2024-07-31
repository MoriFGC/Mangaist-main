import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import "dotenv/config";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "blog_covers", // Nome della cartella su Cloudinary
    allowed_formats: ["jpg", "png", "jpeg", "gif"], // Formati consentiti
  },
});

const cloudinaryUploader = multer({ storage: storage });

export default cloudinaryUploader;