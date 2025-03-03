import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    content: {
      type: String,
    },
    category: {
      type: String,
      default: "uncategorized", // Varsayılan kategori
    },
    categoryId: {
      type: String,
      unique: true, // Her postun benzersiz bir categoryId'ye sahip olmasını sağlar
    },
    slug: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default:
        "https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png",
    },
    color: {
      type: String,
      default: "#ffffff",
    },
    event: {
      type: String,
    },
    date: {
      type: Date,
    },
    price: {
      type: Number,
    },
    language: {
      type: String,
      default: "turkish", // Varsayılan dil
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
