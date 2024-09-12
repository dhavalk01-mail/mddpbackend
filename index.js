import cors from "cors";
import express from "express";
import connectDB from "./src/config/db.js";
import router from "./src/routes/serviceRoutes.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express"

const app = express();

// Allow request from any source. In real production, this should be limited to allowed origins only
app.use(cors());

app.use(express.json());
connectDB();
app.use("/api" , router);


app.get('/ready', function (req, res) {
    res.send('{ "response": " Great!, It works!" }');
});



const PORT = 3000;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});