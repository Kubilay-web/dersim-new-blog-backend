import express from "express";
import accordionController from "../controllers/accordionController.js";

const router = express.Router();

// Get accordion data for a category
router.get(
  "/accordion-category/:categoryId",
  accordionController.getAccordionDataForCategory
);

// Create a new accordion for a category
router.post(
  "/accordion-category/:categoryId/create",
  accordionController.createAccordionDataForCategory
);

// Update page title for a category
router.put("/accordion-title/:categoryId", accordionController.updatePageTitle);

export default router;
