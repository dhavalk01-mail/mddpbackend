import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    userId: String,
    serviceId: { type: mongoose.Schema.ObjectId, required: true},
    //incharge: { type: mongoose.Schema.ObjectId, required: true},
  },
  { timestamps: true },
  { versionKey: false });

const subscription = mongoose.model("subscription", subscriptionSchema);
export default subscription;
