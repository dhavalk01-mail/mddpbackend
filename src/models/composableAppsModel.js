// create model from below json
/**
 * {
    "title": "Developer",
    "description": "fwaef",
    "designPattern": "fwef",
    "commonServices": [
        "66fb9bfc3b92b81b3f99639c", "66fb9c403b92b81b3f9963a0"
    ],
    "languagesUsed": [
        "java",
        ".net"
    ],
    "demoVideoLink": [
        {
            "urlTitle": "recording1",
            "url": "https://tcscomprod.sharepoint.com/:v:/r/sites/RIGCoEProductEngineering/Shared%20Documents/General/TSS%20Details/PoC/NextGenAI%20Hub%20Demos/Nextgen%20AI%20Hub%20Full.mp4?csf=1&web=1&e=Q2CmyS"
        },
        {
            "urlTitle": "recording2",
            "url": "https://tcscomprod.sharepoint.com/:v:/r/sites/RIGCoEProductEngineering/Shared%20Documents/General/TSS%20Details/PoC/NextGenAI%20Hub%20Demos/Nextgen%20AI%20Hub%20Full.mp4?csf=1&web=1&e=Q2CmyS"
        }
    ],
    "demoLink": [
        {
            "urlTitle": "product app",
            "url": "http://localhost:9802"
        },
        {
            "urlTitle": "order app",
            "url": "http://localhost:9804"
        }
    ],
    "appOwner": "tony shark",
    "userId": "321"
}
 */
import mongoose from "mongoose";

const composalbeAppsSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: false
        },
        designPattern: {
            type: String,
            required: true
        },
        commonServices: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Service",
                required: false,
                default: []
            }
        ],
        languagesUsed: [{
            type: String
        }],
        demoVideoLink: [{
            urlTitle: {
                type: String
            },
            url: {
                type: String
            }
        }],
        demoLink: [
            {
                urlTitle: {
                    type: String
                },
                url: {
                    type: String
                }
            }
        ],
        userId: {
            type: String,
            required: true
        },
        appOwner: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ['active', 'inactive', 'archive'],
            default: 'inactive'
        }
    },
    { timestamps: true },
    { versionKey: false }
);

const CompsableApp = mongoose.model('CompsableApp', composalbeAppsSchema);

export {
    CompsableApp
}