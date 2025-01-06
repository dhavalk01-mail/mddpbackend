import swaggerAutogen from 'swagger-autogen';

const swaggerDocument = {
    info: {
        title: 'MDDP UI API',
        version: '1.0.0',
        description: 'MDDP UI API - manage services data, subscription and notification data'
    },
    host: "mddpbackend.onrender.com",
    basePath: "/api",
    schemes: ["https"],
    consumes: ["application/json"],
    produces: ["application/json"],
    securityDefinitions: {},
    tags: {},
    definitions: {},
};

const outputFile = "./docs/swagger.json";
const apiRouteFile = ["./src/routes/routes.js"];

swaggerAutogen({openapi: '3.0.0'})(outputFile, apiRouteFile, swaggerDocument);