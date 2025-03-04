import express from "express";
import {
  getContents,
  getContentById,
  createContent,
  updateContent,
  deleteContent,
  getContentsByTitle,
  getContentByIdAndLanguage,
} from "../controllers/content.controller.js";

const router = express.Router();

// Tüm içerikleri listele
router.get("/", getContents);

// ID'ye göre içerik getir
router.get("/:id", getContentById);

// Başlığa göre içerik arama
router.get("/title/:title", getContentsByTitle); // Başlığa göre içerik getirme

// Yeni içerik oluştur
router.post("/", createContent);

// İçeriği güncelle
router.put("/:id", updateContent);

// İçeriği sil
router.delete("/:id", deleteContent);

router.get("/:contentId/:language", getContentByIdAndLanguage);

export default router;
