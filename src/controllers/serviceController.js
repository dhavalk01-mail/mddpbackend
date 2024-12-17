import { Service, statusEnum, serviceCategoryEnum } from "../models/serviceModel.js";
import Subscription from "../models/subscriptionModel.js"
import { Bookmark } from "../models/bookmarkModel.js";
import { Notification } from "../models/notificationModel.js";
import zod from "zod";

const schema = zod.object({
  title: zod.string().trim(),
  short_description: zod.string(),
  detailed_description: zod.string(),
  service_category: zod.array(zod.enum(Object.keys(serviceCategoryEnum))),
  endpoint: zod.string(),
  git_endpoint: zod.string(),
  helm_endpoint: zod.string(),
  status: zod.enum(Object.keys(statusEnum)),
  tags: zod.array(zod.string())
});

const updateService = async (req, res) => {

  try {
    const updServ = await Service.findByIdAndUpdate(req.params.id, req.body)
    if (!updServ) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(updServ);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};


/*
* modified by Dhaval 06-09
*/
const deleteService = async (req, res) => {
  try {
    const serviceId = req.params.id;

    // Check if service exists
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Delete all related records in parallel for better performance
    const [deletedService, bookmarkResult, notificationResult, subscriptionResult] = await Promise.all([
      Service.findByIdAndDelete(serviceId),
      Bookmark.deleteMany({ serviceId }),
      Notification.deleteMany({ message: new RegExp(serviceId, 'i') }),
      Subscription.deleteMany({ serviceId })
    ]);

    // Log deletion results for monitoring
    console.log(`Deleted ${bookmarkResult.deletedCount} bookmarks`);
    console.log(`Deleted ${notificationResult.deletedCount} notifications`); 
    console.log(`Deleted ${subscriptionResult.deletedCount} subscriptions`);

    return res.status(200).json({ 
      message: "Service and all related records deleted successfully", 
      deletedService 
    });

  } catch (error) {
    return res.status(500).json({ 
      message: "Error deleting service",
      error: error.message 
    });
  }
};


// generate code for /getServices with pagination, search and filter
const getServices = async (req, res) => {
  try {
    const { userId, isBookmarked, subscriptionStatus } = req.query || false;
    // Pagination: page number and limit per page (default 5)
    const page = parseInt(req.query.page) || 1;
    const limitQuery = req.query.limit;
    const limit = limitQuery === 'all' ? 0 : parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    // Search query
    const searchQuery = req.query.search || '';

    // Fliter options
    const serviceCategory = req.query.service_category ? req.query.service_category.split(',') : [];
    const status = req.query.status ? req.query.status.split(',') : [];
    const tags = req.query.tags ? req.query.tags.split(',') : [];

    // Build query object
    const query = {};

    //Search query in title, short_description, description, tags
    if (searchQuery) {
      query.$or = [
        { title: { $regex: searchQuery, $options: 'i' } },
        { short_description: { $regex: searchQuery, $options: 'i' } },
        { detailed_description: { $regex: searchQuery, $options: 'i' } },
      ];
    }

    // Filter by service_category
    if (serviceCategory.length > 0) {
      query.service_category = { $in: serviceCategory };
    }

    // Filter by status
    if (status.length > 0) {
      query.status = { $in: status };
    }

    // Filter by tags (if tags are provided)
    if (tags.length > 0) {
      query.tags = { $in: tags };
    }

    // Filter by Bookmark (if userId is provided and isBookmarked=true)
    if (userId && isBookmarked === 'true') {
      const bookmarkedServices = await Bookmark.find({ userId: userId }).select('serviceId');
      const bookmarkedServiceIds = bookmarkedServices.map(bookmark => bookmark.serviceId);
      query._id = { $in: bookmarkedServiceIds };
    }

    // Filter by Subscription (if userId is provided and subscriptionStatus is provided)
    if (userId && subscriptionStatus) {
      const subscribedServices = await Subscription.find({ userId: userId, is_approved: subscriptionStatus }).select('serviceId');
      const subscribedServiceIds = subscribedServices.map(sub => sub.serviceId);
      query._id = { $in: subscribedServiceIds };
    }

    // Get total count of services
    const totalServices = await Service.countDocuments(query);

    // Get services with pagination and filter
    const services = await Service
      .find(query)
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    // Convert into Human Readble Format
    const serviceResponce = services.map(service => ({
      ...service.toObject(),
      service_category: service.service_category.map(sc => serviceCategoryEnum[sc]),
      status: statusEnum[service.status],
    }));

    res.json({
      totalServices,
      currentPage: limitQuery === 'all' ? 1 : page,
      totalPages: limitQuery === 'all' ? 1 : Math.ceil(totalServices / limit),
      services: serviceResponce
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getServicesDetails = async (req, res) => {
  if (req.params.id) {
    let subscribed = { subscribed: false };
    let is_subscribed = false;

    let bookmarked = { bookmarked: false };
    let is_bookmarked = false;

    //Getting user Details
    if (req.query.userId) {
      // const token = req.headers.authorization.split(' ')[1]; // Token comes as "Bearer token"
      // const tokenResponse = await getUserIdFromToken(token);
      // if (tokenResponse.userId == null) {
      //   return res.status(401).json({ error: tokenResponse.error });
      // }
      const userId = req.query.userId;
      //Checking service subscribed or not
      is_subscribed = await Subscription.findOne({ $and: [{ userId: userId }, { serviceId: req.params.id }] });
      is_bookmarked = await Bookmark.findOne({ $and: [{ userId: userId }, { serviceId: req.params.id }] });
    }

    const service = await Service.findById(req.params.id).populate('dependent_service');

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const serviceResponce = {
      ...service.toObject(),
      service_category: service.service_category.map(sc => serviceCategoryEnum[sc]),
      status: statusEnum[service.status],
      service_category_key: service.service_category,
      status_key: service.status
    };

    if (is_subscribed) {
      // console.log(is_subscribed);
      subscribed = { subscribed: is_subscribed.is_approved };
    }

    if (is_bookmarked) {
      bookmarked = { bookmarked: true };
    }

    res.status(200).json({ serviceDetails: { ...serviceResponce, ...subscribed, ...bookmarked } });

  } else {
    return res.status(404).json({ message: 'Invalid Service ID' });
  }
};


const addService = async (req, res) => {
  const newSer = schema.safeParse(req.body);

  if (!newSer.success) {
    return res.status(404).json({
      err: "incorrect inputs",
      msg: newSer.error.issues
    });
  }


  try {
    // create new service
    const newService = await Service.create({
      title: req.body.title,
      short_description: req.body.short_description,
      detailed_description: req.body.detailed_description,
      service_category: req.body.service_category,
      git_endpoint: req.body.git_endpoint,
      endpoint: req.body.endpoint,
      helm_endpoint: req.body.helm_endpoint,
      dependent_service: req.body.dependent_service || [],
      tags: req.body.tags,
      status: req.body.status,
      lead_instructor: req.body.lead_instructor,
      developers: req.body.developers,
      is_featured: req.body.is_featured
    });

    // Convert into Human Readble Format
    const serviceResponce = {
      ...newService.toObject(),
      service_category: newService.service_category.map(sc => serviceCategoryEnum[sc]),
      status: statusEnum[newService.status],
    };
    res.status(201).json({
      msg: "Service added successfully",
      service: serviceResponce,
    });

  } catch (error) {
    console.error('Error adding service:', error);
    res.status(500).json({ message: error.message });
  }
};

// const countServiceByStatus = async (req, res) => {

//   try {
//     // Get all Subscriptions
//     const allServices = await Service.aggregate([{
//       $group: {
//         _id: null,
//         total: { $sum: 1 },
//         Active: {
//           $sum: {
//             $cond: [{ $eq: ["$status", "Active"] }, 1, 0]
//           }
//         },
//         Ideation: {
//           $sum: {
//             $cond: [{ $eq: ["$status", "Ideation"] }, 1, 0]
//           }
//         },
//         'Under Development': {
//           $sum: {
//             $cond: [{ $eq: ["$status", "Under Development"] }, 1, 0]
//           }
//         },
//         Archive: {
//           $sum: {
//             $cond: [{ $eq: ["$status", "Archive"] }, 1, 0]
//           }
//         },
//       }
//     }]);

//     res.json({
//       allServices
//     });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }

// };

// const countServiceByCategory = async (req, res) => {

//   try {
//     // Get all Subscriptions
//     const allServices = await Service.aggregate([
//       { $unwind: "$service_category" },
//       {
//         $group: {
//           _id: null,
//           total: { $sum: 1 },
//           "Common Services": {
//             $sum: {
//               $cond: [{ $eq: ["$service_category", "Common Services"] }, 1, 0]
//             }
//           },
//           "Re-Usable": {
//             $sum: {
//               $cond: [{ $eq: ["$service_category", "Re-Usable"] }, 1, 0]
//             }
//           },
//           'Domain Specific': {
//             $sum: {
//               $cond: [{ $eq: ["$service_category", "Domain Specific"] }, 1, 0]
//             }
//           },
//           "Platform Specific": {
//             $sum: {
//               $cond: [{ $eq: ["$service_category", "Platform Specific"] }, 1, 0]
//             }
//           },
//         }
//       }]);

//     res.json({
//       allServices
//     });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }

// };

const toggleFeatured = async (req, res) => {
  try {
    const serviceId = req.params.id;
    // Find the service by ID
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    // Toggle the is_featured field
    service.is_featured = !service.is_featured;
    // Save the updated service
    await service.save();
    res.json({
      message: `Service featured status updated to ${service.is_featured}`,
      service
    });
  } catch (err) {
    console.error('Error toggling featured status:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const getFeaturedServices = async (req, res) => {
  try {
    // Query to find only featured services
    const query = { is_featured: true };
    // Get all featured services sorted by createdAt descending
    const services = await Service.find(query)
      .sort({ createdAt: -1 }); // Descending sort by createdAt
    res.json({
      totalServices: services.length,
      services
    });
  } catch (err) {
    console.error('Error fetching featured services:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}


const serviceCounts = async (req, res) => {
  try {
    const serviceCountsbyStatus = await Service.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const defaultStatusCount = Object.keys(statusEnum).reduce((acc, key) => {
      acc[key] = {
        status: statusEnum[key],
        count: 0
      };
      return acc;
    }, {});

    serviceCountsbyStatus.forEach(item => {
      const humanredableStatus = statusEnum[item.id] || item._id;
      defaultStatusCount[humanredableStatus] = {
        status: humanredableStatus,
        count: item.count
      };
    });

    const readbleStatus = Object.keys(defaultStatusCount).map(key => ({
      key,
      status: defaultStatusCount[key].status,
      count: defaultStatusCount[key].count
    }));

    // const readbleStatus = serviceCountsbyStatus.map(item => ({
    //   status: statusEnum[item._id] || item._id,
    //   status_key: item._id,
    //   count: item.count
    // }));

    const serviceCountsbyCategory = await Service.aggregate([
      { $unwind: '$service_category' },
      {
        $group: {
          _id: '$service_category',
          count: { $sum: 1 }
        }
      }
    ]);

    const defaultCategoryCount = Object.keys(serviceCategoryEnum).reduce((cat_acc, key) => {
      cat_acc[key] = {
        status: serviceCategoryEnum[key],
        count: 0
      };

      return cat_acc;
    }, {});

    serviceCountsbyCategory.forEach(item => {
      const humanredableCategory = serviceCategoryEnum[item.id] || item._id;
      defaultCategoryCount[humanredableCategory] = {
        status: humanredableCategory,
        count: item.count
      };
    });

    const readbleCategory = Object.keys(defaultCategoryCount).map(key => ({
      key,
      status: defaultCategoryCount[key].status,
      count: defaultCategoryCount[key].count
    }));




    // const readbleCategory = serviceCountsbyCategory.map(item => ({
    //   category: serviceCategoryEnum[item._id] || item._id,
    //   category_key: item._id,
    //   count: item.count
    // }));

    const totalServices = await Service.countDocuments();

    res.status(200).json({
      total: totalServices,
      serviceCountsbyStatus: readbleStatus,
      serviceCountsbyCategory: readbleCategory
    })

  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

const getServiceListByStatus = async (req, res) => {

  try {
    console.log(req.query.userId)
    // Get Subscription by userID
    const userId = req.query.userId;
    const status = req.query.status
    if (userId) {
      if (status != 'bookmark') {
        const totalServices = await Subscription.countDocuments({ userId });
        console.log(totalServices)
        const serviceDetails = await Subscription.find({ $and: [{ userId: req.query.userId }, { is_approved: status }] }).populate('serviceId');

        if (!serviceDetails) {
          return res.status(404).json({ message: 'No Subscription found' });
        }
        res.json(
          {
            totalServices: totalServices,
            serviceDetails
          });
      }
      else {
        const totalServices = await Bookmark.countDocuments({ userId });
        console.log(totalServices)
        const serviceDetails = await Bookmark.find({ userId: req.query.userId }).populate('serviceId');

        if (!serviceDetails) {
          return res.status(404).json({ message: 'No Bookmark found' });
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

export {
  getServices,
  getServicesDetails,
  addService,
  updateService,
  deleteService,
  //countServiceByStatus,
  toggleFeatured,
  getFeaturedServices,
  getServiceListByStatus,
  serviceCounts
};