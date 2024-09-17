import Subscription from "../models/subscriptionModel.js";
import zod from "zod";

const schema = zod.object({
  userId: zod.string(), 
  serviceId: zod.string(),
});

const addSubscription = async (req, res) => {
  console.log(req.body)
  const newSub = schema.safeParse(req.body);

  if (!newSub.success) {
    return res.status(404).json({
      err: "incorrect inputs",
      msg: newSub.error.issues
    });
  }

  const newSubscription = await Subscription.create({
    userId: req.body.userId,
    serviceId: req.body.serviceId,
  });

  const subscriptionID = newSubscription._id;
  return res.json({ msg: `subscription created with id = ${subscriptionID} ` });
};

const getSubscription = async (req, res) => {
  try {
    // Get Subscription by ID
    if (req.params.id) {
      const reqSer = await Subscription.find( {userId: req.params.id});
      if (!reqSer) {
        return res.status(404).json({ message: 'Subscription not found' });
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
    getSubscription
};
