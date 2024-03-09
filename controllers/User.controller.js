import User from "../models/User.model.js";
import { errorHandler } from "../utils/error.js";

export const getUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.userId) {
      return next(errorHandler(403, "You are not allowed to update this user"));
    }
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          bio: req.body.bio,
          profilePictureUrl: req.body.profilePictureUrl,
        },
      },
      { new: true }
    );
    // console.log(updatedUser);
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You can only delete your account"));
  }
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.clearCookie("access_token");
    res.status(200).json("Account has been deleted");
  } catch (error) {
    next(error);
  }
};

// Follow a user
export const followUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const currentUser = await User.findById(req.user.id);
    const userToFollow = await User.findById(userId);
    if (!userToFollow) {
      return res.status(404).json({ message: "User to follow not found" });
    }

    // Check if the user is already followed
    // console.log(req.user);
    if (currentUser.following.includes(userId)) {
      return res.status(400).json({ message: "User is already followed" });
    }

    // Add the user to the following list of the current user
    currentUser.following.push(userId);
    await currentUser.save();

    res.status(200).json({ message: "User followed successfully" });
  } catch (error) {
    next(error);
  }
};

// Unfollow a user
export const unfollowUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const currentUser = await User.findById(req.user.id);
    const userToUnfollow = await User.findById(userId);
    if (!userToUnfollow) {
      return res.status(404).json({ message: "User to unfollow not found" });
    }

    // Check if the user is already followed
    if (!currentUser.following.includes(userId)) {
      return res.status(400).json({ message: "User is not followed" });
    }
    // console.log("Current user following before:", currentUser.following);
    // Remove the user from the following list of the current user

    // Remove the user from the following list of the current user
    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== userId.toString()
    );
    await currentUser.save();

    res.status(200).json({ message: "User unfollowed successfully" });
  } catch (error) {
    next(error);
  }
};

// Retrieve users followed by a given user
export const getFollowing = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).populate("following", "username");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user.following);
  } catch (error) {
    next(error);
  }
};

// Retrieve users following a given user
export const getFollowers = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const users = await User.find({ following: userId }, "username");
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};
