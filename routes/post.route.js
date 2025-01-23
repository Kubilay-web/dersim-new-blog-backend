import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import upload3 from "../upload3.js";
import {
  create,
  getposts,
  deletepost,
  updatepost,
  getPostsByCategory,
  copyPostsToNewCategory,
} from "../controllers/post.controller.js";

const router = express.Router();

router.post("/create", upload3.single("image"), create);
router.get("/copy", copyPostsToNewCategory);
router.get("/getposts", getposts);
router.get("/getposts/category", getPostsByCategory);
router.delete("/deletepost/:postId", deletepost);
router.put("/updatepost/:postId", upload3.single("image"), updatepost);

export default router;
