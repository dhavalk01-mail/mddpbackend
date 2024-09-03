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
status: zod.enum(["Active" , "Under Development" , "Ideation" , "Archive" , "Deployed" , "Dependent"]),
dependent_service: zod.array(zod.string()),
tags: zod.array(zod.string()),
});

const getservicebypage = async (req, res) => {
const page = parseInt(req.params.page) || 1
const limit = 10;
const skip = (page - 1) * limit
const services = await service.find().skip(skip).limit(limit);
const totalServ = await service.countDocuments()
const totalP = Math.ceil(totalServ/limit)
if (!services) {
res.status(404).json({
msg: "no services found",
});
}

res.json({ services ,
"totalPages" : totalP ,
"totalServices" : totalServ
});
};

const getservice = async (req, res) => {
const services = await service.find();
if (!services) {
res.status(404).json({
msg: "no services found",
});
}
res.json({ services });
};

const addservice = async (req, res) => {
const newSer = schema.safeParse(req.body);

if (!newSer.success) {
res.status(404).json({
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

res.json({ msg: `service created with id = ${serviceID} `});
};

const getservicebyid = async (req, res) => {
const id = req.headers.id;
const reqSer = await service.findById(id);
res.json({ reqSer });
};

const getservicebytype = async (req, res) => {
const category = req.headers.type;
const reqSer = await service.find({
service_category: category,
});
res.json({ reqSer });
};

const getservicebyddescription = async (req, res) => {
const ddesc = req.headers.type;
const reqSer = await service.find({
detailed_description: ddesc,
});
res.json({ reqSer });
};

const getservicebysdescription = async (req, res) => {
const sdesc = req.headers.type;
const reqSer = await service.find({
short_description: sdesc,
});
res.send(reqSer);
};

const updateservice = async (req, res) => {
const id = req.headers.id
const updServ = req.body;
const updatedServ = service.findByIdAndUpdate(id, {
$set : updServ
});
if(!updatedServ){
res.status(404).json({
msg : "error while update service"
})
}
res.json({msg : "task done"})
}

const deleteservice = (req, res) => {
const id = req.headers.id;

const updatedServ = service.findByIdAndDelete(id);
if(!updatedServ){
res.status(404).json({
msg : "error while deleting service"
})
}
res.json({msg : "task done"})
}


const countservicesbystatus = async(req , res) =>{
const status = req.params.status;

const documents = service.countDocuments({status : status})
if(!documents){
    res.json({
        msg :"No services exist for the status"
    })
}else{
    return res.json({
        count : `The number of services for status : ${status} are ${documents} `
    })
}
}

export {getservicebyid , getservicebytype , deleteservice , updateservice , getservice , addservice ,getservicebypage , countservicesbystatus , getservicebyddescription , getservicebysdescription}

