import swaggerAutogen from 'swagger-autogen';

const swaggerDocument = {
    info: {
        title: 'MDDP UI API',
        version: '1.0.0',
        description: 'MDDP UI API - manage services data, subscription and notification data'
    },
    host: "10.63.18.82:4000",
    basePath: "/api",
    schemes: ["http"],
    consumes: ["application/json"],
    produces: ["application/json"],
    securityDefinitions: {},
    tags: [
        { name: 'Services' },
        { name: "Subscription" },
        { name: "Notification" },
        { name: "Bookmark" },
        { name: "Report" },
      ],
    definitions: {},
};

const outputFile = "./docs/swagger.json";
const apiRouteFile = ["./src/routes/routes.js"];

swaggerAutogen({openapi: '3.0.0'})(outputFile, apiRouteFile, swaggerDocument);