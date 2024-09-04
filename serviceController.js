import { log } from "console";
import service from "./serviceModel.js";
import zod, { array } from "zod";

const schema = zod.object({
  title: zod.string(),
  short_description: zod.string(),
  detailed_description: zod.string(),
  service_category: zod.string(),
  endpoint: zod.string(),
  git_endpoint: zod.string(),
  helm_endpoint: zod.string(),
  status: zod.enum(["Active", "Under Development", "Ideation", "Archive"]),
  dependent_service: zod.array(zod.string()),
  tags: zod.array(zod.string()),
});
const exampletest = async (req, res) => {
  const test = req.params.test;
  console.log(test);
};
const addservice = async (req, res) => {
  const newSer = schema.safeParse(req.body);

  if (!newSer.success) {
    return res.status(404).json({
      msg: "incorrect inputs",
    });
  }

  const newService = await service.create({
    title: req.body.title,
    short_description: req.body.short_description,
    detailed_description: req.body.detailed_description,
    service_category: req.body.service_category,
    git_endpoint: req.body.git_endpoint,
    endpoint: req.body.endpoint,
    helm_endpoint: req.body.helm_endpoint,
    dependent_service: req.body.dependent_service,
    tags: req.body.tags,
  });
  const serviceID = newService._id;

  return res.json({ msg: `service created with id = ${serviceID} ` });
};

const getservicebyid = async (req, res) => {
  const id = req.headers.id;
  const reqSer = await service.findById(id);
  return res.json({ reqSer });
};
const getservice = async (req, res) => {
  const page = parseInt(req.params.page);
  let skip;
  let limit;
  if (page != 0) {
    limit = 5;
    skip = (page - 1) * limit;
  } else {
    skip = 0;
    limit = 0;
  }
  let filter = {};
  if (req.headers.service_category) {
    filter.service_category = req.headers.service_category;
  }
  if (req.headers.ddescription) {
    filter.detailed_description = req.headers.ddescription;
  }
  if (req.headers.sdescription) {
    filter.short_description = req.headers.sdescription;
  }

  const services = await service.find(filter).limit(limit).skip(skip);
  const totalServ = await service.countDocuments();
  const totalP = Math.ceil(totalServ / limit);
  if (!services) {
    return res.status(404).json({
      msg: "no services found",
    });
  }
  return res.json({
    services,
    pages: page == 0 ? "all" : page,
    currentPage: page == 0 ? "all" : page,
    totalServ: totalServ,
    totalP : totalP
  });
};

const updateservice = async (req, res) => {
  const id = req.headers.id;
  const updServ = req.body;
  const updatedServ = await service.findByIdAndUpdate(id, {
    $set: updServ,
  });
  if (!updatedServ) {
    return res.status(404).json({
      msg: "error while update service",
    });
  }
   res.json({ msg: "task done" });



};

const deleteservice = (req, res) => {
  const id = req.headers.id;

  const updatedServ = service.findByIdAndDelete(id);
  if (!updatedServ) {
    return res.status(404).json({
      msg: "error while deleting service",
    });
  }
  return res.json({ msg: "task done" });
};

const countservicesbystatus = async (req, res) => {
  const status = req.params.status;

  const documents = service.countDocuments({ status: status });
  if (!documents) {
    return res.json({
      msg: "No services exist for the status",
    });
  } else {
    return res.json({
      count: `The number of services for status : ${status} are ${documents} `,
    });
  }
};

export {
  getservicebyid,
  //   getservicebytype,
  deleteservice,
  updateservice,
  getservice,
  addservice,

  //   getservicebypage,
  //   countservicesbystatus,
  //   getservicebyddescription,
  //   getservicebysdescription,
  countservicesbystatus,
  exampletest,
};
