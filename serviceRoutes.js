import express from "express"
import {
  addService,
  countservicesbystatus,
  deleteservice,
  updateservice,
  getServices
} from "./serviceController.js"

const router = express.Router({ mergeParams: true })
/*
* @swagger
components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: integer
          example: 4
        name:
          type: string
          example: Arthur Dent
      # Both properties are required
      required:  
        - id
        - name
*/


router.get('/getServices/:id', getServices)
router.get('/getServices', getServices)
router.post("/addService", addService)

// router.get("/getservice/:page" , getservice ) 
// router.get("/test/:test" , exampletest)
router.get("/countservice" , countservicesbystatus )
// router.get("/getservicebyid" , getservicebyid)
// router.get("/getservicebytype" ,getservicebytype )
// router.get("/getservicebypage" ,getservicebypage )
// router.get("/getservicebyddesc" ,getservicebyddescription )
// router.get("/getservicebyddesc" , getservicebysdescription)
router.patch("/updateservice", updateservice)
router.delete("/deleteservice", deleteservice)


export default router