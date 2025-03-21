import Subscription from "../models/subscriptionModel.js";
import mongoose from "mongoose";

/*
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
      // const token = req.headers.authorization.split(' ')[1];
      // console.log(token)
      // const tokenResponse = await getUserIdFromToken(token);
      const userId = req.query.userId;
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

*/

/*
 added by dhaval
*/
const getServicesSubscribedByUsers = async (req, res) => {
  try {
    // Step 1: Get serviceId from req.params, if provided
    const { serviceId } = req.params;

    const servicesWithSubscribedUsers = await Subscription.aggregate([
      // Optionally filter by serviceId
      ...(serviceId ? [{ $match: { serviceId: mongoose.Types.ObjectId.createFromHexString(serviceId) } }] : []),

      // filter those which is is_approved = approved
      { $match: { is_approved: "approved" } },

      {
        $group: {
          _id: '$serviceId', //group by service id,
          subscribedUsers: {
            $push: { userId: '$userId', fullname: '$fullname' } // Collect userId and fullname 
          }
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
          _id: 0, // Exclude the internal _id
          serviceId: '$_id', // Rename _id to serviceId
          serviceTitle: '$serviceDetails.title', // Get the service title
          subscribers: '$subscribedUsers' // Include the array of subscribed users
        }
      }
    ]);

    // Handle the case where no subscriptions are found
    if (!servicesWithSubscribedUsers || servicesWithSubscribedUsers.length === 0) {
      return res.status(404).json({ message: 'No subscriptions found.' });
    }

    // Return the result
    res.status(200).json(servicesWithSubscribedUsers);
  } catch (error) {
    console.error('Error fetching services with subscribed users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getUsersSubscribedToServices = async (req, res) => {
  try {
    // Get userId from req.params, if provided
    const { userId } = req.params;

    // Aggregate subscriptions, optionally filtering by userId
    const usersWithSubscriptions = await Subscription.aggregate([
      // Optionally filter by userId
      ...(userId ? [{ $match: { userId: userId } }] : []),

      // filter those which is is_approved = approved
      { $match: { is_approved: "approved" } },

      // Group by userId and collect all serviceIds for this user
      {
        $group: {
          _id: '$userId', // Group by userId
          subscribedServices: { $push: '$serviceId' }, // Collect all serviceIds for this user
          fullname: { $first: '$fullname' } // Collect fullname for this user
        }
      },
      // Convert serviceId to ObjectId if necessary
      {
        $addFields: {
          subscribedServices: {
            $map: {
              input: '$subscribedServices',
              as: 'serviceId',
              in: {
                $cond: {
                  if: { $eq: [{ $type: '$$serviceId' }, 'objectId'] }, // If already an ObjectId
                  then: '$$serviceId',
                  else: { $toObjectId: '$$serviceId' } // Convert to ObjectId if string
                }
              }
            }
          },
        },
        // // add fullname in reposonce
        $addFields: {
          fullname: '$fullname'
        }
      },
      // Lookup to fetch service details
      {
        $lookup: {
          from: 'services', // Ensure the collection name is correct
          localField: 'subscribedServices',
          foreignField: '_id',
          as: 'serviceDetails'
        }
      },
      // Project the relevant details
      {
        $project: {
          _id: 0, // Exclude internal _id field
          userId: '$_id', // Rename _id to userId
          fullname: '$fullname', // Include fullname
          services: {
            $map: {
              input: '$serviceDetails', // Iterate over serviceDetails
              as: 'service',
              in: {
                serviceId: '$$service._id', // Fetch the service ID
                serviceTitle: '$$service.title' // Fetch the service title
              }
            }
          }
        }
      }
    ]);

    // Handle the case where no subscriptions are found
    if (!usersWithSubscriptions || usersWithSubscriptions.length === 0) {
      return res.status(404).json({ message: 'No subscriptions found.' });
    }

    // Return the result
    res.status(200).json(usersWithSubscriptions);
  } catch (error) {
    console.error('Error fetching users subscribed to services:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Popular Services
const getPopularSubscription = async(req,res) =>{
  try{
    const topServices= await Subscription.aggregate([
      {$match: {is_approved: "approved"}},
      {$group: {_id: "$serviceId", count: {$sum:1 } }},
      {$sort: {count: -1, _id: 1}},
      {$limit: 5},
      {
        $lookup:{
          from: "services",
          localField: "_id",
          foreignField: "_id",
          as: "serviceDetails"
        }
      },
      {
        $unwind: "$serviceDetails"
      },
      {
        $project:{
          serviceId: "$_id",
          title: "$serviceDetails.title",
          count: 1,
          _id: 0
        }
      }
    ])

    // console.log(topServices,'topServices-=-=')

    res.status(200).json({
      success: true,
      data: topServices
    })
  } catch(error){
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occured while fetching top subscribed services"
    })
  }
}

const getMonthWiseSubscription = async(req,res)=>{
  try {
    const result = await Subscription.aggregate([
      // Match documents within the last six months
      {
        $match: {
          start_date: {
            $gte: new Date(new Date().setMonth(new Date().getMonth() - 5)), // Last 6 months
          },
        },
      },
      // Extract month and year using $dateToParts
      {
        $addFields: {
          dateParts: {
            $dateToParts: { date: "$start_date", timezone: "Asia/Kolkata" },
          },
        },
      },
      {
        $project: {
          month: "$dateParts.month",
          year: "$dateParts.year",
          is_approved: 1,
        },
      },
      // Group by month, year, and approval status
      {
        $group: {
          _id: {
            month: "$month",
            year: "$year",
            is_approved: "$is_approved",
          },
          count: { $sum: 1 },
        },
      },
      // Sort by year and month in descending order
      {
        $sort: {
          "_id.year": -1,
          "_id.month": -1,
        },
      },
      // Group by approval status and prepare data array
      {
        $group: {
          _id: "$_id.is_approved",
          data: {
            $push: {
              month: "$_id.month",
              year: "$_id.year",
              count: "$count",
            },
          },
        },
      },
      // Map last six months dynamically
      {
        $project: {
          _id: 0,
          is_approved: "$_id",
          data: {
            $map: {
              input: [0, 1, 2, 3, 4, 5], // Indices for the last 6 months
              as: "offset",
              in: {
                month: {
                  $arrayElemAt: [
                    ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                    {
                      $subtract: [
                        {
                          $mod: [
                            { $add: [{ $month: new Date() }, { $subtract: [0, "$$offset"] }] },
                            12,
                          ],
                        },
                        1, // Adjust for 0-indexed array
                      ],
                    },
                  ],
                },
                count: {
                  $reduce: {
                    input: "$data",
                    initialValue: 0,
                    in: {
                      $cond: [
                        {
                          $and: [
                            { $eq: ["$$this.month", { $add: [{ $month: new Date() }, { $subtract: [0, "$$offset"] }] }] },
                            { $eq: ["$$this.year", { $year: { $subtract: [new Date(), { $multiply: [30 * 24 * 60 * 60 * 1000, "$$offset"] }] } }] },
                          ],
                        },
                        "$$this.count",
                        "$$value",
                      ],
                    },
                  },
                },
              },
            },
          },
        },
      },
    ]);
 
    // Respond with the result
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export {
  getServicesSubscribedByUsers,
  getUsersSubscribedToServices,
  getPopularSubscription,
  getMonthWiseSubscription
};