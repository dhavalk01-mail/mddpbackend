import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema(
  {
    userId: String,
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service"
    }, 
  },
  { timestamps: true },
  { versionKey: false });

const Bookmark = mongoose.model("Bookmark", bookmarkSchema);

export {
  Bookmark,
}