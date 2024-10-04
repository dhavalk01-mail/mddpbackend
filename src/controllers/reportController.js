import Subscription from "../models/subscriptionModel.js";
import { getUserIdFromToken } from './helperController.js';
const serviceList = async (req, res) => {
  const query = {};
  try {
    if (req.params.id) {
      const serviceId = req.params.id
      console.log(serviceId)
      const totalServices = await Subscription.countDocuments({ serviceId });
      const serviceList = await Subscription.find({ serviceId });
      //console.log(serviceDetails)
      res.json(
        {
          totalServices: totalServices,
          serviceList
        });
    }
    else {
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
          {
            totalServices: totalServices,
            serviceDetails
          });
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};

/*
 added by dhaval
*/
const getServicesSubscribedByUsers = async (req, res) => {
  try {
    const servicesWithSubscribers = await Subscription.aggregate([
      {
        $group: {
          _id: '$serviceId', //group by service id,
          subscribers: { $push: '$userId' } // collect all userids for this services
        }
      },
      {
        $lookup: {
          from: 'services',
          localField: '_id',
          foreignField: '_id',
          as: 'serviceDetails'
        }
      },
      {
        $unwind: '$serviceDetails' // unwind the service details
      },
      {
        $project: {
          _id: 0,
          serviceId: '@serviceDetails._id',
          serviceTitle: '@serviceDetails.title',
          subscribers: 1
        }
      }
    ]);

    res.status(200).json(servicesWithSubscribers);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}


const getUsersSubscribedToServices = async (req, res) => {
  try {
    const usersWithSubscriptions = await Subscription.aggregate([
      {
        $group: {
          _id: '$userId', // Group by user id
          subscribedServices: { $push: '$serviceId' } //collect all servicesIds for this user
        }
      },
      {
        $lookup: {
          from: 'services', //Lookup from the service model
          localField: 'subscribedServices',
          foreignField: '_id',
          as: 'serviceDetails'
        }
      },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          services: {
            $map: {
              input: '$serviceDetails',
              as: 'service',
              in: {
                serviceId: '$service,_id',
                serviceTitle: '$service.title'
              }
            }
          }
        }
      }
    ]);

    res.status(200).json(usersWithSubscriptions);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }

}


export {
  serviceList,
  getServicesSubscribedByUsers,
  getUsersSubscribedToServices
};