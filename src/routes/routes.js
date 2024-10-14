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
  serviceCounts,
  getServiceListByStatus
} from "../controllers/serviceController.js"

import {
  addSubscription,
  getSubscription,
} from "../controllers/subscriptionController.js"

import { toggleBookmark, getBookmark } from "../controllers/bookmarkController.js"

import { getServicesSubscribedByUsers, getUsersSubscribedToServices } from "../controllers/reportController.js"
import { getPendingSubscription, updateSubscriptionStatus, userNotification } from "../controllers/notificationController.js"

const router = express.Router({ mergeParams: true })

// services
router.get('/getServices/:id', getServicesDetails)
router.get('/getServices', getServices)
router.post("/addService", addService)
router.put('/updateService/:id', updateService)
router.delete('/deleteService/:id', deleteService)
router.get('/getServiceListByStatus', getServiceListByStatus)

// toggleFeatured
router.patch('/toggleFeatured/:id', toggleFeatured)
router.get('/getFeaturedServices', getFeaturedServices)

//Subscription
router.post("/addSubscription", addSubscription)
router.get('/getSubscription', getSubscription)
router.get('/getSubscription/:id', getSubscription)

//Bookmark
router.post("/toggleBookmark/:userId/:serviceId", toggleBookmark)
router.get('/getBookmark/:userId', getBookmark)

//report
//router.get('/countServiceByStatus', countServiceByStatus)
//router.get('/countServiceByCategory', countServiceByCategory)

router.get('/serviceCounts', serviceCounts)

//reports
// router.get('/serviceList', serviceList)
// router.get('/serviceList/:id', serviceList)

router.get('/report/servicesandSubscriber/:serviceId', getServicesSubscribedByUsers)
router.get('/report/servicesandSubscriber', getServicesSubscribedByUsers)
router.get('/report/usersandSubscribedServices/:userId', getUsersSubscribedToServices)
router.get('/report/usersandSubscribedServices', getUsersSubscribedToServices)


//notification
router.get('/getPendingSubscriptions', getPendingSubscription)
router.put('/updateSubscriptionStatus', updateSubscriptionStatus)
router.get('/userNotification/:id', userNotification)

export default router