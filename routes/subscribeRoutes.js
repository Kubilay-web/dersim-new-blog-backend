import express from "express";
import {
  subscribeController,
  getSubscriptions,
} from "../controllers/subscribeController.js";

const router = express.Router();

// POST isteği: /api/subscribe
router.post("/", subscribeController);

router.get("/get", getSubscriptions);

export default router;
