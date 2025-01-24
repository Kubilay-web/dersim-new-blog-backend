import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
    },
    blogContent: {
      type: String,
    },
    title: {
      type: String,
    },
    image: {
      type: String,
      default:
        "https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png",
    },
    category: {
      type: String,
      default: "uncategorized",
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    color: {
      type: String,
      default: "#fff", // Varsayılan renk
    },
    event: {
      type: String,
      required: false, // You can make this required if needed
    },
    date: {
      type: Date,
      required: false, // You can make this required if needed
    },
    price: {
      type: Number,
      required: false, // You can make this required if needed
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
