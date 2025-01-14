import express from "express";
import subscribeController from "../controllers/subscribeController.js";

const router = express.Router();

// POST isteği: /api/subscribe
router.post("/", subscribeController);

export default router;
