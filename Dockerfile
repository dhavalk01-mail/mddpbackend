#https://medium.com/@muhammadnaqeeb/building-a-dockerized-node-express-and-mongodb-app-with-docker-compose-d6ec78e5897e

FROM node:latest
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY . .
EXPOSE 4000
CMD [ "node", "index.js" ]

# Build the Docker Image
# docker build -t "mddp-api-server" .