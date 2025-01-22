import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  create,
  getposts,
  deletepost,
  updatepost,
  getPostsByCategory,
  copyPostsToNewCategory,
} from "../controllers/post.controller.js";

const router = express.Router();

router.post("/create", create);
router.get("/copy", copyPostsToNewCategory);
router.get("/getposts", getposts);
router.get("/getposts/category", getPostsByCategory);
router.delete("/deletepost/:postId/:userId", deletepost);
router.put("/updatepost/:postId/:userId", updatepost);

export default router;
