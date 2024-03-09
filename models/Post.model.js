import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    userRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
export default Post;
