import express from "express";
import upload from "../upload.js";
import {
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogsByCategory,
  getBlogById,
} from "../controllers/blogController.js";

const router = express.Router();

// Blog listeleme
router.get("/blogs", getBlogsByCategory);

// Yeni blog oluştur (resim yükleme)
router.post("/blogs", upload.single("image"), createBlog);

// Blog güncelleme (resim yükleme)
router.put("/blogs/:id", upload.single("image"), updateBlog);

// Blog silme
router.delete("/blogs/:id", deleteBlog);

// Blog detayını getir
router.get("/blogs/:slug", getBlogById);

export default router;
