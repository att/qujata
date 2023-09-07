# Choose a Node.js base image
ARG NODE_VERSION=18.17.1

FROM node:${NODE_VERSION}-alpine as node

# Set working directory
WORKDIR /user/src/app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the NestJS application for production
RUN npm run build

# Set working directory
WORKDIR /user/src/app

RUN apk add docker
# RUN curl https://get.docker.com/builds/Linux/x86_64/docker-latest.tgz | tar xvz -C /tmp/ && mv /tmp/docker/docker /usr/bin/docker


# Set the entrypoint for the application
CMD ["node", "dist/main.js"]

# Expose the application's port
EXPOSE 3010