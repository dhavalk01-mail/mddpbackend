import Subscription from "../models/subscriptionModel.js";
import zod from "zod";

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
  });
  if (existingSubscription) {
    return res.status(400).json({ msg: "Subscription already exists" });
  } else {
    // create a record in the database
    try {
      const newSubscription = await Subscription.create({
        userId: req.body.userId,
        serviceId: req.body.serviceId,
      });
      // const subscriptionID = newSubscription._id;
      return res.status(200).json({ msg: "Subscription added successfully" });
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
      {$set: {serviceId: {$toObjectId: "$serviceId"} }},
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
          serviceId:1,
          "serviceDetails.title":1,
          "serviceDetails.short_description":1,
          "serviceDetails.detailed_description":1
        }
      }
    ]);
      if (!reqSer) {
        return res.status(404).json({ message: 'No Subscription found' });
      }
      res.json(reqSer);
    } else {

      // Get all Subscriptions
      const subscription = await Subscription.aggregate([
        { $lookup:
           {
             from: 'service',
             localField: '_id',
             foreignField: 'serviceId',
             as: 'serviceDetails'
           }
         }
        ])
        
      res.json({
        subscription
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const serviceList = async (req, res) => {
  const query = {};
  console.log(req.params.id);
  try {
    // Get Subscription by ID
    if (req.params.id) {
      //const reqSer = await Subscription.find( {userId: req.params.id});

      const reqSer = await Subscription.aggregate([{
        "$match": { userId: req.params.id }          // Or without this $match part, to get all users
      },
      {$set: {serviceId: {$toObjectId: "$serviceId"} }},
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
          serviceId:1,
          "serviceDetails.title":1,
          "serviceDetails.short_description":1,
          "serviceDetails.detailed_description":1
        }
      }
    ]);
      if (!reqSer) {
        return res.status(404).json({ message: 'No Subscription found' });
      }
      res.json(reqSer);
    } else {

      // Get all Subscriptions
      const subscription = await Subscription.aggregate([
        { $lookup:
           {
             from: 'service',
             localField: '_id',
             foreignField: 'serviceId',
             as: 'serviceDetails'
           }
         }
        ])
        
      res.json({
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
    serviceList
};
