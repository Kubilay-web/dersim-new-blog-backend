import express from "express";
import {
  getBlogsByCategory,
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogById,
} from "../controllers/blogController.js";

const router = express.Router();

// Blog listeleme (kategoriye göre veya tüm bloglar)
router.get("/blogs", getBlogsByCategory);

// Yeni blog oluştur
router.post("/blogs", createBlog);

// Blog güncelleme
router.put("/blogs/:id", updateBlog);

// Blog silme
router.delete("/blogs/:id", deleteBlog);

// Blog detayını getir
router.get("/blogs/:slug", getBlogById);

export default router;
