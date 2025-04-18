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
  getServiceListByStatus,
  addBulkJsonServices
} from "../controllers/serviceController.js"

import {
  addSubscription,
  getSubscription,
  getUserSubscriptionServices,
} from "../controllers/subscriptionController.js"

import { toggleBookmark, getBookmark } from "../controllers/bookmarkController.js"

import {
  getServicesSubscribedByUsers,
  getUsersSubscribedToServices,
  getPopularSubscription,
  getMonthWiseSubscription
} from "../controllers/reportController.js"

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

import { getMetricsController, getHealthStatus, getGrafanaURL } from "../controllers/matricsController.js"

import {
  publishComposableApp,
  getInactiveApps,
  getActiveApps,
  publishInactiveApp,
  updateComposableApp,
  deleteComposableApp,
  getComposableAppById
} from "../controllers/composableAppsController.js"

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
router.post('/addBulkJsonServices',
  // #swagger.tags = ['Services']
  addBulkJsonServices);

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
router.get('/getUserSubscriptionServices/:userId',
  // #swagger.tags = ['Subscription']
  getUserSubscriptionServices)

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
router.get('/report/popular_services_with_count',
  // #swagger.tags = ['Report']
  getPopularSubscription)
router.get('/report/monthwise_services',
  // #swagger.tags = ['Report']
  getMonthWiseSubscription)

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


//metricsController
router.get('/metrics',
  // #swagger.tags = ['Metrics Data']
  getMetricsController);

router.get('/healthstatus',
  // #swagger.tags = ['Metrics Data']
  getHealthStatus);

router.get('/grafana',
  // #swagger.tags = ['Metrics Data']
  getGrafanaURL);

//composableAppController
router.post('/publishComposableApp',
  // #swagger.tags = ['Composable Apps']
  publishComposableApp);
router.get('/getInactiveApps',
  // #swagger.tags = ['Composable Apps']
  getInactiveApps);
router.get('/getActiveApps',
  // #swagger.tags = ['Composable Apps']
  getActiveApps);
router.patch('/publishInactiveApp/:id',
  // #swagger.tags = ['Composable Apps']
  publishInactiveApp);
router.put('/updateComposableApp/:id',
  // #swagger.tags = ['Composable Apps']
  updateComposableApp);
router.delete('/deleteComposableApp/:id',
  // #swagger.tags = ['Composable Apps']
  deleteComposableApp);
router.get('/getComposableAppById/:id',
  // #swagger.tags = ['Composable Apps']
  getComposableAppById);

export default router