import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  create,
  getposts,
  deletepost,
  updatepost,
  getPostsByCategory,
  copyPostsToNewCategory,
  getPostBySlug,
  updateCategoryName,
  copyPostsToNewLanguage,
  updateSlugsByLanguage,
  getPostsByCategoryIdAndLanguage,
} from "../controllers/post.controller.js";
import upload3 from "../upload3.js";

const router = express.Router();

router.post("/create", upload3.single("image"), create);
router.get("/copy", copyPostsToNewCategory);

router.get("/getposts", getposts);

router.get("/:slug", getPostBySlug);
router.get("/getposts/category", getPostsByCategory);
router.delete("/deletepost/:postId", deletepost);
router.put("/updatepost/:postId", upload3.single("image"), updatepost);
router.post("/update-category-name", updateCategoryName);

router.get("/getposts/categoryIdAndLanguage", getPostsByCategoryIdAndLanguage);

router.post("/copylanguage", copyPostsToNewLanguage);
router.put("/update-slugs", updateSlugsByLanguage);

export default router;
