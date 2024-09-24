import mongoose from "mongoose";

const statusEnum = {
  "active": "Active",
  "under_development": "Under Development",
  "ideation": "Ideation",
  "archive": "Archive"
}

const serviceCategoryEnum = {
  "common": "Common",
  "reusable": "Re-Usable",
  "domain_specific": "Domain Specific",
  "platform_specific": "Platform Specific"
}

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    short_description: {
      type: String,
      required: true,
    },
    detailed_description: {
      type: String,
      required: true,
    },
    service_category: [{
      type: String,
      enum: Object.keys(serviceCategoryEnum),
      required: true,
    }],
    endpoint: {
      type: String,
    },
    git_endpoint: {
      type: String,
    },
    helm_endpoint: {
      type: String,
    },
    status: {
      type: String,
      enum: Object.keys(statusEnum),
      require: true,
    },
    dependent_service: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        required: false,
        default: []
      }
    ], // Array of 
    tags: [{
      type: String
    }],
    lead_instructor: {
      type: String
    },
    developers: [{
      type: String
    }],
    is_featured: {
      type: Boolean,
      default: false
    },
  },
  { timestamps: true },
  { versionKey: false });

const Service = mongoose.model("Service", serviceSchema);


export {
  Service,
  statusEnum,
  serviceCategoryEnum
}

// export default Service;