import express from "express";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  getAllProducts,
  getProductsByLanguage,
} from "../controllers/productController.js";
import upload2 from "../upload2.js";

const router = express.Router();

// POST yeni ürün oluştur (resim yükleme ile)
router.post("/", upload2.single("image"), createProduct);

// PUT ürünü güncelle
router.put("/:id", upload2.single("image"), updateProduct);

// DELETE ürünü sil
router.delete("/:id", deleteProduct);

router.get("/", getAllProducts);

// GET ürün detaylarını slug'a göre getir
router.get("/:slug", getProductById);

router.get("/language/:language", getProductsByLanguage);

export default router;
