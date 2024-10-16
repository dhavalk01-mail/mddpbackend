import Subscription from "../models/subscriptionModel.js";
import { Notification } from "../models/notificationModel.js";
import { Service } from "../models/serviceModel.js";
// Get all pending subscriptions

const adminNotification = async (req, res) => {
  try {

    const notification = await Notification.find({ //do same to admin
      receiverId: 0,
      read: false,
    });
    const newNotification = await Notification.countDocuments({ $and: [{ read: false }, { receiverId: 0 }] });

    if (notification) {
      res.status(200).json({
        notificationcount: newNotification,
        notification
      });
    }
    else {
      return res.status(404).json({ message: 'Notification not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const getPendingSubscription = async (req, res) => {

  try {
    const subscriptions = await Subscription.find({ is_approved: "pending" }).populate('serviceId');
    //const newNotification = await Notification.countDocuments({ $and: [{ read: false }, { receiverId: 0 }] });

    res.status(200).json({
      //unreadNotificationCount:newNotification,
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
      if (updateSubscriptions) { // create new notification
        const service = await Service.findById(req.body.serviceId).select('_id, title'); // fetch id and title only

        const addUserNotification = await Notification.create({
          senderId: 0,
          receiverId: req.body.userId,
          message: { ...service.toObject(), ...{ 'subscriptionStatus': req.body.action } } // all service data+ subscriptionstatus
        });
      }

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

const userNotification = async (req, res) => { //create same function adminnotification
  try {

    const notification = await Notification.find({ //do same to admin
      receiverId: req.params.userId,
      read: false,
    });
    const newNotification = await Notification.countDocuments({ $and: [{ read: false }, { receiverId: req.params.userId }] });

    if (notification) {
      res.status(200).json({
        notificationcount: newNotification,
        notification
      });
    }
    else {
      return res.status(404).json({ message: 'notification not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const MarkOneNotificationRead = async (req, res) => {
  try {
    const updatenotification = await Notification.findByIdAndUpdate(
      req.params.notificationId,
      { read: true }
    );
    res.status(200).json({
      updatenotification
    });

  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const MarkReadAllNotification = async (req, res) => {
  try {
    const id = req.params.userId ? req.params.userId : 0;

    const updatenotification = await Notification.updateMany(
      { receiverId: id },
      { read: true }
    );
    res.status(200).json({
      updatenotification
    });

  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


export {
  getPendingSubscription,
  updateSubscriptionStatus,
  userNotification,
  //MarkAllReadByAdmin,
  MarkReadAllNotification,
  adminNotification,
  MarkOneNotificationRead
}