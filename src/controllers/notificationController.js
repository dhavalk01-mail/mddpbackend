import Subscription from "../models/subscriptionModel.js";


// Get all bookmarks for the user
const getPendingSubscription = async (req, res) => {

  try {
    const subscriptions = await Subscription.find({ is_approved: "pending" }).populate('serviceId');
    res.status(200).json({
      pending_notifications: subscriptions
    });

  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


export default getPendingSubscription

