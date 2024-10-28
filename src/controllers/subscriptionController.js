import Subscription from "../models/subscriptionModel.js";
import zod from "zod";
import { Notification } from "../models/notificationModel.js";
import { Service } from "../models/serviceModel.js";

const schema = zod.object({
  userId: zod.string(),
  serviceId: zod.string(),
});

const addSubscription = async (req, res) => {
  const newSub = schema.safeParse(req.body);

  if (!newSub.success) {
    return res.status(400).json({
      err: "incorrect inputs",
      msg: newSub.error.issues
    });
  }

  // first check if the subscription already exists
  const existingSubscription = await Subscription.findOne({
    userId: req.body.userId,
    serviceId: req.body.serviceId,
    // is_approved: "approved"
  });

  if (existingSubscription) {
    const status = existingSubscription.is_approved
    if (status == 'pending' || status == 'rejected') {
      return res.status(400).json({ msg: "Subscription is " + status });
    }
    else {
      return res.status(400).json({
        msg: "Subscription already exists",
        status: status
      });
    }
  } else {
    // create a record in the database
    try {
      const newSubscription = await Subscription.create({
        userId: req.body.userId,
        serviceId: req.body.serviceId,
        fullname: req.body.fullname
      });

      if (newSubscription) {

        const service = await Service.findById(req.body.serviceId).select('_id, title'); // fetch id and title only

        const notification = await Notification.create({
          senderId: req.body.userId,
          receiverId: 0, // 0 is for Admin
          message: { ...service.toObject(), ...{ 'subscriptionStatus': 'pending' }, ...{ 'fullname': req.body.fullname } } // all service data+ subscriptionstatus
        });
      }
      // const subscriptionID = newSubscription._id;
      return res.status(200).json({
        newSubscription,
        msg: "Subscription added successfully as Status Pending"
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  }
};

const getSubscription = async (req, res) => {
  try {
    // Get Subscription by ID
    if (req.params.id) {
      //const reqSer = await Subscription.find( {userId: req.params.id});

      const reqSer = await Subscription.aggregate([{
        "$match": { userId: req.params.id }          // Or without this $match part, to get all users
      },
      { $set: { serviceId: { $toObjectId: "$serviceId" } } },
      {
        "$lookup": {
          from: 'services',
          localField: 'serviceId',
          foreignField: '_id',
          as: 'serviceDetails'
        },


      },
      {
        $project: {
          userId: 1,
          serviceId: 1,
          "serviceDetails.title": 1,
          "serviceDetails.short_description": 1,
          "serviceDetails.detailed_description": 1
        }
      }
      ]);
      if (!reqSer) {
        return res.status(404).json({ message: 'No Subscription found' });
      }
      res.json(reqSer);
    } else {
      const totalSub = await Subscription.countDocuments();

      // Get all Subscriptions
      const subscription = await Subscription.aggregate([
        {
          $lookup:
          {
            from: 'services',
            localField: 'serviceId',
            foreignField: '_id',
            as: 'serviceDetails'
          }
        }
      ])

      res.json({
        totalSubscription: totalSub,
        subscription
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  addSubscription,
  getSubscription,
};
