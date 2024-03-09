import express from "express";
import mongoose from "mongoose";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/User.route.js";
import postRouter from "./routes/Post.route.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";

dotenv.config();

const app = express();

mongoose
  .connect(
    "mongodb+srv://8ghappy:panchalh@cluster0.tcxyc1h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.log("DB connection error: ", err);
  });

app.use(express.json());
app.use(cookieParser());

// Apply rate limiting middleware
app.use(
  "/",
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later",
  })
);

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/post", postRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
