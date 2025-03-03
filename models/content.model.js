import mongoose from "mongoose";

const ContentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    language: { type: String, required: true }, // Add language field
  },
  { timestamps: true }
);

export default mongoose.model("Content", ContentSchema);
