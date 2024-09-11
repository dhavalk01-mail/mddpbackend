import Service from "./serviceModel.js";
import zod from "zod";

const schema = zod.object({
  title: zod.string().trim(),
  short_description: zod.string(),
  detailed_description: zod.string(),
  service_category: zod.array(zod.string()),
  endpoint: zod.string(),
  git_endpoint: zod.string(),
  helm_endpoint: zod.string(),
  status: zod.enum(["Active", "Under Development", "Ideation", "Archive"]),
  dependent_service: zod.array(zod.string()),
  tags: zod.array(zod.string()),
});

// const updateservice = async (req, res) => {
//   const id = req.headers.id;
//   const updServ = req.body;
//   const updatedServ = await service.findByIdAndUpdate(id, {
//     $set: updServ,
//   });
//   if (!updatedServ) {
//     return res.status(404).json({
//       msg: "error while update service",
//     });
//   }
//   res.json({ msg: "task done" });



// };

// const deleteservice = (req, res) => {
//   const id = req.headers.id;

//   const updatedServ = service.findByIdAndDelete(id);
//   if (!updatedServ) {
//     return res.status(404).json({
//       msg: "error while deleting service",
//     });
//   }
//   return res.json({ msg: "task done" });
// };

// const countservicesbystatus = async (req, res) => {
//   const status = req.params.status;

//   const documents = service.countDocuments({ status: status });
//   if (!documents) {
//     return res.json({
//       msg: "No services exist for the status",
//     });
//   } else {
//     return res.json({
//       count: `The number of services for status : ${status} are ${documents} `,
//     });
//   }
// };


/*
* modified by Dhaval 06-09
*/

// generate code for /getServices with pagination, search and filter
const getServices = async (req, res) => {
  try {
    if (req.params.id) {
      const reqSer = await Service.findById(req.params.id);
      if (!reqSer) {
        return res.status(404).json({ message: 'Service not found' });
      }
      res.json(reqSer);
    } else {

      // Pagination: page number and limit per page (default 5)
      const page = parseInt(req.query.page) || 1;
      const limitQuery = req.query.limit;
      const limit = limitQuery === 'all' ? 0 : parseInt(req.query.limit) || 5;
      const skip = (page - 1) * limit;

      // Search query
      const searchQuery = req.query.search || '';

      // Fliter options
      const serviceCategory = req.query.service_category || '';
      const status = req.query.status || '';

      // Build query object
      const query = {};

      //Search query in title, short_description, description
      if (searchQuery) {
        query.$or = [
          { title: { $regex: searchQuery, $options: 'i' } },
          { short_description: { $regex: searchQuery, $options: 'i' } },
          { detailed_description: { $regex: searchQuery, $options: 'i' } }
        ];
      }

      // Filter by service_category
      if (serviceCategory) {
        query.service_category = serviceCategory;
      }

      // Filter by status
      if (status) {
        query.status = status;
      }

      // Get total count of services
      const totalServices = await Service.countDocuments(query);

      // Get services with pagination and filter
      const services = await Service
                                    .find(query)
                                    .limit(limit)
                                    .skip(skip)
                                    .sort({ createdAt: -1});
      res.json({
        totalServices,
        currentPage: limitQuery === 'all' ? 1 : page,
        totalPages: limitQuery === 'all' ? 1 : Math.ceil(totalServices / limit),
        services
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const addService = async (req, res) => {
  const newSer = schema.safeParse(req.body);

  if (!newSer.success) {
    return res.status(404).json({
      err: "incorrect inputs",
      msg: newSer.error.issues
    });
  }

  const newService = await Service.create({
    title: req.body.title,
    short_description: req.body.short_description,
    detailed_description: req.body.detailed_description,
    service_category: req.body.service_category,
    git_endpoint: req.body.git_endpoint,
    endpoint: req.body.endpoint,
    helm_endpoint: req.body.helm_endpoint,
    dependent_service: req.body.dependent_service,
    tags: req.body.tags,
    status: req.body.status,
    lead_instructor: req.body.lead_instructor,
    developers: req.body.developers
  });

  const serviceID = newService._id;
  return res.json({ msg: `service created with id = ${serviceID} ` });
};


export {

  getServices,
  addService,
  
  // getservicebyid,
  //   getservicebytype,
  // deleteservice,
  // updateservice,
  // getservice,
  

  //   getservicebypage,
  //   countservicesbystatus,
  //   getservicebyddescription,
  //   getservicebysdescription,
  // countservicesbystatus,
  // exampletest,

};
