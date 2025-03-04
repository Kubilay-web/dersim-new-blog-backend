import mongoose from "mongoose";

const ContentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    language: { type: String, required: true },
    contentId: { type: String, unique: true }, // Yeni contentId alanı
  },
  { timestamps: true }
);

export default mongoose.model("Content", ContentSchema);
