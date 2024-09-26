import cors from "cors";
import 'dotenv/config'
import express from "express";
import connectDB from "./src/config/db.js";
import router from "./src/routes/routes.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
// import servicedata from './servicedata.json' with { type: "json" };
// import fs from 'fs'

const app = express();

// Allow request from any source. In real production, this should be limited to allowed origins only
app.use(cors());

app.use(express.json());
connectDB();
app.use("/api", router);


app.get("/ready", (req, res) => {
  res.send("Hello World!");
});


/*
app.get('/import', function (req, res) {
  let old_data = servicedata.services;
  let new_data = old_data.map((e) => {
    return {
      title: e.title.trim(),
      short_description: e.description.trim(),
      detailed_description: e.description.trim(),
      service_category: convertData(e.tags[0]),
      endpoint: e.endpoint.trim('/'),
      git_endpoint: e.gitEndpoint.trim(),
      helm_endpoint: e.helmEndpoint.trim(),
      status: convertData(e.tags[1]),
    };
  });

  // create file and write with new data
  // fs.writeFile("./output.json", JSON.stringify(new_data), function (err) {
  //   if (err) throw err;
  //   console.log('complete');
  // });

  res.json({ new_data });
});

const convertData = (tags) => {
  // category
  if (tags.includes("commonServices")) return "Common Services";
  if (tags.includes("reusuableServices")) return "Re-usuable Services";
  if (tags.includes("domainSpecificServices")) return "Domain-specific Services";
  // status
  if (tags.includes("readyForApplicationsUse")) return "Active";
  if (tags.includes("developmentInProgress")) return "Under Development";
  if (tags.includes("ideation")) return "Ideation";
}
*/

//connection
const PORT = process.env.NODE_LOCAL_PORT || 4000;
/** start server only when we have valid connection */
try {
  app.listen(PORT, () => {
      console.log(`Server running on port: ${PORT} AND Your Database host is: ${process.env.MONGODB_DEV_URL}`);
  })
  // swaggerDocs(app, PORT);
} catch (error) {
  console.error('Cannot connect to the server ->' + error.message);
}
