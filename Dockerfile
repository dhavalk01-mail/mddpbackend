FROM node:20-alpine
WORKDIR /mddp-backend
COPY package.json ./
RUN npm install
COPY . .
EXPOSE 4000
CMD ["npm", "start"]