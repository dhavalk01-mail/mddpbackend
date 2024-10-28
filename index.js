import cors from "cors";
import 'dotenv/config'
import express from "express";
import connectDB from "./src/config/db.js";
import router from "./src/routes/routes.js";
import importExportRoute from './src/routes/importExportRoutes.js'
//Swagger
import swaggerUIPath from "swagger-ui-express";
import swaggerjsonFilePath from "./src/swagger/docs/swagger.json" assert { type: "json" };

// import servicedata from './servicedata.json' with { type: "json" };
// import fs from 'fs'


const app = express();
app.set('views', './src/views');
app.set('view engine', 'ejs');
// Allow request from any source. In real production, this should be limited to allowed origins only
app.use(cors());

app.use(express.json());
connectDB();

app.use("/api", router);
app.use('/importExport', importExportRoute)


app.get("/ready", (req, res) => {
  res.send("Hello World!");
});
app.get('/upload', function(req, res) {
  res.render('index');
});


app.use("/api-docs", swaggerUIPath.serve, swaggerUIPath.setup(swaggerjsonFilePath));

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
  fs.writeFile("./output.json", JSON.stringify(new_data), function (err) {
    if (err) throw err;
    console.log('complete');
  });

  res.json({ new_data });
});

const convertData = (tags) => {
  // category
  if (tags.includes("commonServices")) return "common";
  if (tags.includes("reusuableServices")) return "reusable";
  if (tags.includes("domainSpecificServices")) return "domain_specific";
  // status
  if (tags.includes("readyForApplicationsUse")) return "active";
  if (tags.includes("developmentInProgress")) return "under_development";
  if (tags.includes("ideation")) return "ideation";
}
*/

//connection
const PORT = process.env.NODE_LOCAL_PORT || 4000;
/** start server only when we have valid connection */
try {
  app.listen(PORT, () => {
    if (process.env.ENVIRONMENT === 'PROD') {
      var mongourl = process.env.MONGO_URL || process.env.MONGODB_PROD_URL;
    } else {
      var mongourl = process.env.MONGODB_DEV_URL;
    }
    console.log(`Server running on port: ${PORT} AND Your Database host is: ${mongourl}`);
 
  })
  // swaggerDocs(app, PORT);

} catch (error) {
  console.error('Cannot connect to the server ->' + error.message);
}