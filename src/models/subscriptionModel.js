import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    userId: String,
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service"
    },
    is_approved: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },
    fullname: {
      type: String
    },
    start_date: {
      type: Date,
      default: Date.now()
    },
    expiry_date: {
      type: Date,
      default: () => new Date(+new Date() + 60 * 24 * 60 * 60 * 1000) // 60 days from now
    }
  },
  { timestamps: true },
  { versionKey: false });

const subscription = mongoose.model("subscription", subscriptionSchema);
export default subscription;
