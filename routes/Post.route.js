import express from "express";
import {
  createPost,
  deletePost,
  getLatestPostsFromFollowedUsers,
  getPostById,
  updatePost,
} from "../controllers/post.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/", verifyToken, createPost);
router.get("/get/:postId", verifyToken, getPostById);
router.put("/update/:postId", verifyToken, updatePost);
router.delete("/delete/:postId", verifyToken, deletePost);

router.get("/followed", verifyToken, getLatestPostsFromFollowedUsers);

export default router;
