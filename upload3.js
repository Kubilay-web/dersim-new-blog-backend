import multer from "multer";
import cloudinary from "cloudinary";
import { v2 as cloudinaryV2 } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Cloudinary ayarları
cloudinaryV2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer diskStorage yerine, Cloudinary'yi kullanarak dosyayı yükleyeceğiz
const upload3 = multer({
  storage: multer.memoryStorage(), // Dosya bellek üzerine yüklenecek
  limits: { fileSize: 10 * 1024 * 1024 }, // Maksimum dosya boyutu (10 MB)
}).single("image");

const uploadImageToCloudinary = async (file) => {
  try {
    const result = await cloudinaryV2.uploader.upload(file.path, {
      folder: "posts", // Yükleme için klasör ismi
      resource_type: "auto", // Resim ve video dosyaları için
    });
    return result.url; // Yüklenen görselin URL'si
  } catch (error) {
    throw new Error("Görsel yükleme başarısız oldu");
  }
};

export { upload3, uploadImageToCloudinary };
