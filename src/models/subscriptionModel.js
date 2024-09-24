import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    userId: String,
    serviceId: String,
  },
  { timestamps: true },
  { versionKey: false });

const subscription = mongoose.model("subscription", subscriptionSchema);
export default subscription;
