# Start your image with a node base image
FROM node:21

# The /app directory should act as the main application directory
WORKDIR /app

# Copy the app package and package-lock.json file
COPY package*.json ./
COPY package-lock.json package-lock.json

# Copy local directories to the current local directory of our docker image (/app)
COPY . .

# Install node packages. 
RUN npm install 

# Expose the server port
EXPOSE 8080

# Start the container
CMD [ "npm", "run", "prod"]