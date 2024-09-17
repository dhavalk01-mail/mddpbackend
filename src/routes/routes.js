import express from "express"
import {
  getServices,
  addService,
  updateService,
  deleteService,
  countServiceByStatus
} from "../controllers/serviceController.js"
import {
  addSubscription,
  getSubscription
} from "../controllers/subscriptionController.js"
import { addBookmark, getBookmark } from "../controllers/bookmarkController.js"

const router = express.Router({ mergeParams: true })


router.get('/getServices/:id', getServices)
router.get('/getServices', getServices)
router.post("/addService", addService)
router.put('/updateService/:id', updateService)
router.delete('/deleteService/:id', deleteService)
router.get('/countServiceByStatus', countServiceByStatus)

//Subscription routes.
router.post("/addSubscription", addSubscription),
router.get('/getSubscription', getSubscription),
router.get('/getSubscription/:id', getSubscription)

//Bookmark routes.
router.post("/addBookmark", addBookmark),
router.get('/getBookmark', getBookmark),
router.get('/getBookmark/:id', getBookmark)




export default router