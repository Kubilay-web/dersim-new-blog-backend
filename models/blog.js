import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
  category: { type: String, required: true },
});

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
