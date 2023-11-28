# Start your image with a node base image
FROM node:21

ENV NPM_CONFIG_UPDATE_NOTIFIER false
ENV NPM_CONFIG_FUND false

# The /app directory should act as the main application directory
WORKDIR /app

# Copy in the package and package-lock.json file
COPY package*.json ./

# Install node packages
RUN npm ci  

# Copy local directories to the current local directory of our docker image (/app)
COPY . .

RUN npx prisma generate

# Expose the server port
EXPOSE 8080

# Start the container
CMD [ "npm", "run", "railway"]