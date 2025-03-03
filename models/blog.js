import mongoose from "mongoose";
import slugify from "slugify";

const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
  category: { type: String, required: true },
  image: String,
  slug: { type: String },
  language: { type: String, default: "turkish" }, // Dil alanı ekleniyor, varsayılan olarak 'turkish' olacak
});

blogSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
