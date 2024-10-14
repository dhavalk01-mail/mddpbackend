import { Bookmark } from '../models/bookmarkModel.js';
import { Service, serviceCategoryEnum, statusEnum } from '../models/serviceModel.js';
// import { getUserIdFromToken } from './helperController.js';

// Toggle a bookmark
const toggleBookmark = async (req, res) => {
  try {
    // const token = req.headers.authorization.split(' ')[1]; // Token comes as "Bearer token"
    // const tokenResponse = await getUserIdFromToken(token);
    // if (tokenResponse.userId == null) {
    //   return res.status(401).json({ error: tokenResponse.error });
    // }
    // const userId = req.query.userId;
    const userId = req.params.userId;
    const serviceId = req.params.serviceId;

    // console.log(serviceId)
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const existingBookmark = await Bookmark.findOne({ userId, serviceId });

    if (existingBookmark) {
      // Remove the bookmark if it exists
      const response = await Bookmark.deleteOne({ userId, serviceId });
      return res.status(200).json({ message: 'Service removed from bookmarks', service: response });
    } else {
      // Add a new bookmark
      const bookmark = new Bookmark({ userId, serviceId });
      const response = await bookmark.save();
      return res.status(200).json({ message: 'Service bookmarked successfully', service: response });
    }
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all bookmarks for the user
const getBookmark = async (req, res) => {

  // const token = req.headers.authorization.split(' ')[1]; // Token comes as "Bearer token"
  // if (!token) return res.status(404).json({ message: "Token not found" });

  // const tokenResponse = await getUserIdFromToken(token);
  // if (tokenResponse.userId == null) {
  //   return res.status(401).json({ error: tokenResponse.error });
  // }
  const userId = req.params.userId;
  // const userId = req.query.userId;

  try {
    const services = await Bookmark.find({ userId }).populate('serviceId');
    
    // Convert into Human Readble Format
    const serviceResponce = services.map(service => ({
      ...service.serviceId.toObject(),
      service_category: service.serviceId.service_category.map(sc => serviceCategoryEnum[sc]),
      status: statusEnum[service.serviceId.status],
    }));

    res.status(200).json({
      services: serviceResponce
    });

  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


export {
  toggleBookmark,
  getBookmark
};
