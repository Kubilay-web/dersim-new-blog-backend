import express from "express";
import {
  test,
  updateUser,
  deleteUser,
  signout,
  getUsers,
  getUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
import upload4 from "../upload4.js";

const router = express.Router();

router.get("/test", test);

// router.put("/update/:userId", verifyToken, updateUser);
router.put(
  "/update/:userId",
  verifyToken,
  upload4.single("profilePicture"),
  updateUser
);

router.delete("/delete/:userId", verifyToken, deleteUser);
router.post("/signout", signout);
router.get("/getusers", verifyToken, getUsers);
router.get("/:userId", getUser);

export default router;
