import Subscription from "../models/subscriptionModel.js";
import { getUserIdFromToken } from './helperController.js';
const serviceList = async (req, res) => {
    const query = {};
    try {
      if (req.params.id) {
        const serviceId=req.params.id
        console.log(serviceId)
        const totalServices = await Subscription.countDocuments({ serviceId });
        const serviceList = await Subscription.find({ serviceId });
        //console.log(serviceDetails)
        res.json(
          {   totalServices:totalServices,
            serviceList
          });
    }
    else{
      const token = req.headers.authorization.split(' ')[1];
      console.log(token)
      const tokenResponse = await getUserIdFromToken(token);
    const userId = tokenResponse.userId;
    console.log(userId)
    // Get Subscription by userID
    if (userId) {
      const totalServices = await Subscription.countDocuments({ userId });
      console.log(totalServices)
      const serviceDetails = await Subscription.find({ userId }).populate('serviceId');
      //console.log(reqSer)

      if (!serviceDetails) {
        return res.status(404).json({ message: 'No Subscription found' });
      }
      res.json(
          {   totalServices:totalServices,
              serviceDetails
          });
    } 
    }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  
  };

  export {
    serviceList
  };