import express from "express";
import {
  getHomepage,
  updateHomepage,
  createHomepage,
} from "../controllers/homepage.controller.js";

const router = express.Router();

// Anasayfa verilerini almak (GET)
router.get("/homepage", getHomepage);

// Anasayfa verisini oluşturmak (POST)
router.post("/homepage", createHomepage);

// Anasayfa verilerini güncellemek (PUT)
router.put("/homepage", updateHomepage);

export default router;
