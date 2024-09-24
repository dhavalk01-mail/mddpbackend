import mongoose from "mongoose";
import { type } from "os";

const serviceSchema = new mongoose.Schema(
  {
    title: String,
    short_description: String,
    detailed_description: String,
    service_category: [String],
    endpoint: String,
    git_endpoint: String,
    helm_endpoint: String,
    status: {
      type: String,
      enum: ["Active", "Under Development", "Ideation", "Archive"]
    },
    dependent_service: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service"
      }
    ], // Array of 
    tags: [String],
    lead_instructor: String,
    developers: [String],
    is_featured: {
      type: Boolean,
      default: false
    },
  },
  { timestamps: true },
  { versionKey: false });

const service = mongoose.model("Service", serviceSchema);
export default service;
