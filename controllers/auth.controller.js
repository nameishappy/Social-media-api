import bcrypt from "bcryptjs";
import User from "../models/User.model.js";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
  const { username, email, password, bio, profilePictureUrl } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 12);
  try {
    const newUser = User({
      username,
      email,
      password: hashedPassword,
      bio,
      profilePictureUrl,
    });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(401, "Invalid email or password"));
    }
    const { password: pass, ...rest } = validUser._doc;
    const isPasswordValid = await bcrypt.compare(password, validUser.password);
    if (!isPasswordValid) {
      return next(errorHandler(401, "Invalid email or password"));
    }
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    res
      .cookie("token", token, {
        httpOnly: true,
      })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const signout = (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json("User signed out successfully");
  } catch (error) {
    next(error);
  }
};
