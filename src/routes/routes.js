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
import {
  getPendingSubscription,
  updateSubscriptionStatus,
  userNotification,
  //MarkAllReadByAdmin, 
  markReadAllNotification,
  adminNotification,
  markOneNotificationRead,
  allReadNotifications
} from "../controllers/notificationController.js"

const router = express.Router({ mergeParams: true })

// services
router.get('/getServices/:id',
  // #swagger.tags = ['Services'] 
  getServicesDetails
)
router.get('/getServices',
  // #swagger.tags = ['Services'] 
  getServices)
router.post("/addService",
  // #swagger.tags = ['Services'] 
  addService)
router.put('/updateService/:id',
  // #swagger.tags = ['Services'] 
  updateService)
router.delete('/deleteService/:id',
  // #swagger.tags = ['Services'] 
  deleteService)
router.get('/getServiceListByStatus',
  // #swagger.tags = ['Services'] 
  getServiceListByStatus)

// toggleFeatured
router.patch('/toggleFeatured/:id',
  // #swagger.tags = ['Services'] 
  toggleFeatured)
router.get('/getFeaturedServices',
  // #swagger.tags = ['Services'] 
  getFeaturedServices)

//Subscription
router.post("/addSubscription",
  // #swagger.tags = ['Subscription']
  addSubscription)
router.get('/getSubscription',
  // #swagger.tags = ['Subscription']
  getSubscription)
router.get('/getSubscription/:id',
  // #swagger.tags = ['Subscription']
  getSubscription)

//Bookmark
router.post("/toggleBookmark/:userId/:serviceId",
  // #swagger.tags = ['Bookmark']
  toggleBookmark)
router.get('/getBookmark/:userId',
  // #swagger.tags = ['Bookmark']
  getBookmark)

//report
//router.get('/countServiceByStatus', countServiceByStatus)
//router.get('/countServiceByCategory', countServiceByCategory)
router.get('/serviceCounts',
  // #swagger.tags = ['Report']
  serviceCounts)
router.get('/report/servicesandSubscriber/:serviceId',
  // #swagger.tags = ['Report']
  getServicesSubscribedByUsers)
router.get('/report/servicesandSubscriber',
  // #swagger.tags = ['Report']
  getServicesSubscribedByUsers)
router.get('/report/usersandSubscribedServices/:userId',
  // #swagger.tags = ['Report']
  getUsersSubscribedToServices)
router.get('/report/usersandSubscribedServices',
  // #swagger.tags = ['Report']
  getUsersSubscribedToServices)


//notification
router.get('/getPendingSubscriptions',
  // #swagger.tags = ['Notification']
  getPendingSubscription)
router.put('/updateSubscriptionStatus',
  // #swagger.tags = ['Notification']
  updateSubscriptionStatus)
router.get('/userNotification/:userId',
  // #swagger.tags = ['Notification']
  userNotification)
router.put('/markReadAllNotification',
  // #swagger.tags = ['Notification']
  markReadAllNotification)
router.put('/markReadAllNotification/:userId',
  // #swagger.tags = ['Notification']
  markReadAllNotification)
router.get('/adminNotification',
  // #swagger.tags = ['Notification']
  adminNotification)
router.put('/markOneNotificationRead/:notificationId',
  // #swagger.tags = ['Notification']
  markOneNotificationRead)
router.get('/allReadNotifications',
  // #swagger.tags = ['Notification']
  allReadNotifications)
router.get('/allReadNotifications/:userId',
  // #swagger.tags = ['Notification']
  allReadNotifications)

export default router