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
    folder: "manga_covers", // Puoi cambiare il nome della cartella se lo desideri
    allowed_formats: ["jpg", "png", "jpeg", "webp"], // Modificato qui
    transformation: [{ width: 500, height: 750, crop: "limit" }], // Opzionale: per standardizzare le dimensioni
  },
});

const cloudinaryUploader = multer({ storage: storage });

export default cloudinaryUploader;