import Post from "../models/Post.model.js";
import { errorHandler } from "../utils/error.js";
import User from "../models/User.model.js";

// Create a new post
export const createPost = async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content) return next(errorHandler(400, "Content is required"));
    const newPost = new Post({
      userRef: req.user.id, // Assuming req.user contains the authenticated user's information
      content,
    });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    next(error);
  }
};

// View post by postId
export const getPostById = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    if (!post) {
      return next(errorHandler(404, "Post not found"));
    }
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

// Update post by postId
export const updatePost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    if (!post) {
      return next(errorHandler(404, "Post not found"));
    }
    if (req.user.id !== post.userRef.toString()) {
      return next(
        errorHandler(403, "You are not allowed to update someone else's post")
      );
    }
    const { content } = req.body;
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { content },
      { new: true }
    );
    if (!updatedPost) {
      return next(errorHandler(404, "Post not found"));
    }
    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};

// Delete post by postId
export const deletePost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    if (!post) {
      return next(errorHandler(404, "Post not found"));
    }
    if (req.user.id !== post.userRef.toString()) {
      return next(
        errorHandler(403, "You are not allowed to delete someone else's post")
      );
    }
    const deletedPost = await Post.findByIdAndDelete(postId);
    if (!deletedPost) {
      return next(errorHandler(404, "Post not found or already deleted"));
    }
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const getLatestPostsFromFollowedUsers = async (req, res, next) => {
  try {
    const userId = req.user.id; // Assuming the user ID is stored in req.user
    const currentUser = await User.findById(userId);
    // console.log("Following:", currentUser.following);
    // console.log("Data type:", typeof currentUser.following);

    // Fetch posts from followed users and sort them by timestamp in descending order
    const latestPosts = await Post.aggregate([
      { $match: { userRef: { $in: currentUser.following } } }, // Match posts from followed users
      { $sort: { createdAt: -1 } }, // Sort by timestamp in descending order
    ]).limit(10); // Limit the number of posts returned (e.g., 10)

    res.status(200).json(latestPosts);
  } catch (error) {
    next(error);
  }
};
