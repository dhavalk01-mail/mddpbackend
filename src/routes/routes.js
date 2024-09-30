import express from "express"
import {
  getServices,
  getServicesDetails,
  addService,
  updateService,
  deleteService,
  //countServiceByStatus,
  toggleFeatured,
  getFeaturedServices,
  //countServiceByCategory,
  serviceCounts
} from "../controllers/serviceController.js"

import {
  addSubscription,
  getSubscription,
} from "../controllers/subscriptionController.js"

import { toggleBookmark, getBookmark } from "../controllers/bookmarkController.js"

import { serviceList} from "../controllers/reportController.js"
import getPendingSubscription from "../controllers/notificationController.js"

const router = express.Router({ mergeParams: true })

// services
router.get('/getServices/:id', getServicesDetails)
router.get('/getServices', getServices)
router.post("/addService", addService)
router.put('/updateService/:id', updateService)
router.delete('/deleteService/:id', deleteService)

// toggleFeatured
router.patch('/toggleFeatured/:id', toggleFeatured)
router.get('/getFeaturedServices', getFeaturedServices)

//Subscription
router.post("/addSubscription", addSubscription)
router.get('/getSubscription', getSubscription)
router.get('/getSubscription/:id', getSubscription)

//Bookmark
router.post("/toggleBookmark/:serviceId", toggleBookmark)
router.get('/getBookmark', getBookmark)

//report
//router.get('/countServiceByStatus', countServiceByStatus)
//router.get('/countServiceByCategory', countServiceByCategory)

router.get('/serviceCounts', serviceCounts)

//reports
router.get('/serviceList', serviceList)
router.get('/serviceList/:id', serviceList)


//notification
router.get('/getPendingSubscriptions', getPendingSubscription)

export default router