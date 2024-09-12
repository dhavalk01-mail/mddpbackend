import express from "express"
import {
  getServices,
  addService,
  updateService,
  deleteService
} from "../controllers/serviceController.js"

const router = express.Router({ mergeParams: true })


router.get('/getServices/:id', getServices)
router.get('/getServices', getServices)
router.post("/addService", addService)
router.put('/updateService/:id', updateService)
router.delete('/deleteService/:id', deleteService)



export default router