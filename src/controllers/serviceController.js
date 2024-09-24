import { Service, statusEnum, serviceCategoryEnum} from "../models/serviceModel.js";
import zod from "zod";

const schema = zod.object({
  title: zod.string().trim(),
  short_description: zod.string(),
  detailed_description: zod.string(),
  service_category: zod.array(zod.enum(["common", "reusable", "domain_specific", "platform_specific"])),
  endpoint: zod.string(),
  git_endpoint: zod.string(),
  helm_endpoint: zod.string(),
  status: zod.enum(["active", "under_development", "ideation", "archive"]),
  tags: zod.array(zod.string()),
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

const deleteService = async (req, res) => {

  try {
    const delServ = await Service.findByIdAndDelete(req.params.id)
    if (!delServ) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(delServ);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};

/*
* modified by Dhaval 06-09
*/

// generate code for /getServices with pagination, search and filter
const getServices = async (req, res) => {
  try {
    if (req.params.id) {
      const reqSer = await Service.findById(req.params.id).populate('dependent_service');
      if (!reqSer) {
        return res.status(404).json({ message: 'Service not found' });
      }
      res.json(reqSer);
    } else {

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

      // Get total count of services
      const totalServices = await Service.countDocuments(query);

      // Get services with pagination and filter
      const services = await Service
        .find(query)
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: -1 });

        const serviceResponce = services.map(service => ({
          ...service.toObject(),
          service_category: service.service_category.map(sc => serviceCategoryEnum[sc]),
          status: statusEnum[service.status],
        }));

      res.json({
        totalServices,
        currentPage: limitQuery === 'all' ? 1 : page,
        totalPages: limitQuery === 'all' ? 1 : Math.ceil(totalServices / limit),
        serviceResponce
      });
    }
  } catch (error) {
    console.log('============')
    res.status(500).json({ message: error.message });
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

const countServiceByStatus = async (req, res) => {

  try {
    // Get all Subscriptions
    const allServices = await Service.aggregate([{
      $group: {
        _id: null,
        total: { $sum: 1 },
        Active: {
          $sum: {
            $cond: [{ $eq: ["$status", "Active"] }, 1, 0]
          }
        },
        Ideation: {
          $sum: {
            $cond: [{ $eq: ["$status", "Ideation"] }, 1, 0]
          }
        },
        'Under Development': {
          $sum: {
            $cond: [{ $eq: ["$status", "Under Development"] }, 1, 0]
          }
        },
        Archive: {
          $sum: {
            $cond: [{ $eq: ["$status", "Archive"] }, 1, 0]
          }
        },
      }
    }]);

    res.json({
      allServices
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};

const countServiceByCategory = async (req, res) => {

  try {
    // Get all Subscriptions
    const allServices = await Service.aggregate([
      { $unwind: "$service_category" },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          "Common Services": {
            $sum: {
              $cond: [{ $eq: ["$service_category", "Common Services"] }, 1, 0]
            }
          },
          "Re-Usable": {
            $sum: {
              $cond: [{ $eq: ["$service_category", "Re-Usable"] }, 1, 0]
            }
          },
          'Domain Specific': {
            $sum: {
              $cond: [{ $eq: ["$service_category", "Domain Specific"] }, 1, 0]
            }
          },
          "Platform Specific": {
            $sum: {
              $cond: [{ $eq: ["$service_category", "Platform Specific"] }, 1, 0]
            }
          },
        }
      }]);

    res.json({
      allServices
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};

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


export {

  getServices,
  addService,
  updateService,
  deleteService,
  countServiceByStatus,
  toggleFeatured,
  getFeaturedServices,
  countServiceByCategory
};