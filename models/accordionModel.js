import mongoose from "mongoose";

const accordionSchema = new mongoose.Schema(
  {
    categoryId: { type: String, required: true },
    key: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    language: { type: String, required: true, default: "turkish" },
  },
  { timestamps: true }
);

const Accordion = mongoose.model("Accordion", accordionSchema);

export default Accordion;
