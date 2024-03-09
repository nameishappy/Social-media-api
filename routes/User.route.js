import express from "express";
import {
  deleteUser,
  followUser,
  getFollowers,
  getFollowing,
  getUser,
  unfollowUser,
  updateUser,
} from "../controllers/User.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/", (req, res) => {
  res.send("Create a new user");
});

// GET /users/:userId - View user profile by userId
router.get("/search/:userId", getUser);

// PUT /users/:userId - Update user profile by userId
router.put("/update/:userId", verifyToken, updateUser);

// DELETE /users/:userId - Delete user profile by userId
router.delete("/delete/:userId", verifyToken, deleteUser);

// POST /users/follow/:userId - Follow a user
router.post("/follow/:userId", verifyToken, followUser);

// POST /users/unfollow/:userId - Unfollow a user
router.post("/unfollow/:userId", verifyToken, unfollowUser);

// GET /users/:userId/following - Retrieve users followed by a given user
router.get("/:userId/following", verifyToken, getFollowing);

// GET /users/:userId/followers - Retrieve users following a given user
router.get("/:userId/followers", verifyToken, getFollowers);

export default router;
