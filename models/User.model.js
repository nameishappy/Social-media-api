import mongoose from "mongoose";
const Schema = mongoose.Schema;
// import { v4 as uuidv4 } from "uuid";
const userSchema = new Schema({
  //   _id: { type: String, required: true }, // Using UUID for user-id
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  bio: { type: String, default: "ok" },
  profilePictureUrl: { type: String, default: "pl" },
  following: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const User = mongoose.model("User", userSchema);
export default User;
