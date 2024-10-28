# FROM node:alpine
# # RUN mkdir -p /usr/src/app
# WORKDIR /

# COPY package.json ./
# # RUN chown -R node:node /

# RUN ls -al

# USER root
# RUN npm install

# COPY . .
# RUN chown -R node:node /

# CMD ["npm", "start"]


# FROM node:14.16.0-alpine3.13

FROM node:18-alpine
#set user permission
#RUN addgroup app && adduser -S -G app app
#RUN mkdir /app && chown app:app /app
#USER app

WORKDIR /mddp-backend
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 4000
CMD ["npm", "start"]


# FROM node:18-alpine
# #set user permission
# RUN addgroup app && adduser -S -G app app
# RUN mkdir /app && chown app:app /app
# USER app

# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# EXPOSE 4000
# CMD ["npm", "start"]