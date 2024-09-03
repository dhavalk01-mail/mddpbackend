

import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
title: String,
short_description: String,
detailed_description: String,
service_category: String,
endpoint: String,
git_endpoint: String,
helm_endpoint: String,
status: {
String ,
enum : ["Active" , "Under Development" , "Ideation" , "Archive" , "Deployed" , "Dependent"]
},
dependent_service: [String],
tags: [String],
});

const service = mongoose.model("service" , serviceSchema);
export default service