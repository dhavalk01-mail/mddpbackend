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

const updateSubscriptionStatus = async (req, res) => {
  try {
    const existingSubscription = await Subscription.findOne({
      userId: req.body.userId,
      serviceId: req.body.serviceId,
    });
    if (existingSubscription) {
      const updateSubscriptions = await Subscription.findOneAndUpdate(
        { userId: req.body.userId, serviceId: req.body.serviceId },
        { is_approved: req.body.action },
        { new: true }
      );

      res.status(200).json({
        updateSubscriptions
      });
    }
    else {
      return res.status(404).json({ message: 'Subscription not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const userNotification = async (req, res) => {
  try {
    console.log(req.params.id)
    const existingSubscription = await Subscription.find({
      userId: req.params.id,
      approvedStatus: { $ne: null },
    });
    console.log(existingSubscription)
    if (existingSubscription) {
      res.status(200).json({
        existingSubscription
      });
    }
    else {
      return res.status(404).json({ message: 'Subscription not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export {
  getPendingSubscription,
  updateSubscriptionStatus,
  userNotification
}