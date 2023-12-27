# Choose a Node.js base image
ARG NODE_VERSION=18.17.1

FROM node:${NODE_VERSION}-alpine AS node

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

# Choose the openquantumsafe/curl image for additional functionality
FROM openquantumsafe/curl:latest

# change to roo user
USER root

# Install the required dependencies for Node.js
RUN apk add --no-cache libgcc libstdc++

# Switch back to the original user
USER oqs

# Copy the Node.js executable and other required files from the node stage
COPY --from=node /usr/local/bin/node /usr/local/bin/
COPY --from=node /usr/local/lib/node_modules /usr/local/lib/node_modules
# Copy the built files and node_modules folder from the node stage to the openquantumsafe/curl stage
COPY --from=node /user/src/app/dist /user/src/app/dist
COPY --from=node /user/src/app/scripts /user/src/app/scripts
COPY --from=node /user/src/app/node_modules /user/src/app/node_modules

# Set working directory
WORKDIR /user/src/app

# Set the entrypoint for the application
CMD ["node", "dist/main.js"]

# Expose the application's port
EXPOSE 3010
