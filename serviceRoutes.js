import express from "express"
import {
  getServices,
  addService
} from "./serviceController.js"

const router = express.Router({ mergeParams: true })


router.get('/getServices/:id', getServices)
router.get('/getServices', getServices)
router.post("/addService", addService)



export default router