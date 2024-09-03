import express from "express";
import connectDB from "./db.js";
import router from "./serviceRoutes.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express"

const app = express();
app.use(express.json());
connectDB();
app.use("api/" , router)

// const options = {
//   definition : {
//     openpi : "3.0.0" , 
//     info : {
//       title : "Service-API", 
//       version : "1.0.0" , 
//       description : "api"
//     }, 
//     servers : [
//       {
//         url : "https://localhost:3000"
//       }
//     ] ,
//   },
//   apis : ["./routes.js"]
// }

// const specs = swaggerJSDoc("./swagger-output.json")
// app.use("/api-docs" , swaggerUI.serve , swaggerUI.setup(specs))

const PORT = 3000;
app.listen(3000, () => {
  console.log(`listening on port ${PORT}`);
});
