import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema(
  {
    userId: String,
    bookmarkId: String,
  },
  { timestamps: true },
  { versionKey: false });

const subscription = mongoose.model("bookmark", bookmarkSchema);
export default subscription;
