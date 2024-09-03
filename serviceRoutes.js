import express from "express"
import { addservice, countservicesbystatus, deleteservice, getservice, getservicebyddescription, getservicebyid, getservicebypage, getservicebysdescription, getservicebytype, updateservice } from "./serviceController.js"

const router = express.Router()
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


router.get("/getservice" , getservice ) 
router.get("/countservice" , countservicesbystatus )
router.get("/getservicebyid" , getservicebyid)
router.get("/getservicebytype" ,getservicebytype )
router.get("/getservicebypage" ,getservicebypage )
router.get("/getservicebyddesc" ,getservicebyddescription )
router.get("/getservicebyddesc" , getservicebysdescription)
router.post("/addservice" , addservice)
router.patch("/updateservice" , updateservice)
router.delete("/deleteservice" , deleteservice)


export default router