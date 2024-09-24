import express from "express"
import {
  getServices,
  addService,
  updateService,
  deleteService,
  countServiceByStatus,
  toggleFeatured,
  getFeaturedServices,
  countServiceByCategory
} from "../controllers/serviceController.js"

import {
  addSubscription,
  getSubscription,
  serviceList
} from "../controllers/subscriptionController.js"

import { addBookmark, getBookmark } from "../controllers/bookmarkController.js"


const router = express.Router({ mergeParams: true })


router.get('/getServices/:id', getServices)
router.get('/getServices', getServices)
router.post("/addService", addService)
router.put('/updateService/:id', updateService)
router.delete('/deleteService/:id', deleteService)


router.patch('/toggleFeatured/:id', toggleFeatured)
router.get('/getFeaturedServices', getFeaturedServices)


//Subscription routes.
router.post("/addSubscription", addSubscription),
router.get('/getSubscription', getSubscription),
router.get('/getSubscription/:id', getSubscription)
router.get('/serviceList', serviceList),
router.get('/serviceList/:id', serviceList)

//Bookmark routes.
router.post("/addBookmark", addBookmark),
router.get('/getBookmark', getBookmark),
router.get('/getBookmark/:id', getBookmark)


//report
router.get('/countServiceByStatus', countServiceByStatus)
router.get('/countServiceByCategory', countServiceByCategory)


export default router