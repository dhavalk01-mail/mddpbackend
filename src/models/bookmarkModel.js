import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema(
  {
    userId: String,
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: false,
      default: []
    }, 
  },
  { timestamps: true },
  { versionKey: false });

const Bookmark = mongoose.model("Bookmark", bookmarkSchema);
export {
  Bookmark,
}