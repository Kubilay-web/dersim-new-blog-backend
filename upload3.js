import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

// Cloudinary Storage yapılandırması
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "posts", // Resimlerin yükleneceği klasör
    allowed_formats: ["jpg", "jpeg", "png", "webp"], // İzin verilen formatlar
  },
});

const upload3 = multer({ storage });

export default upload3;
