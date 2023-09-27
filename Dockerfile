# Base image
FROM node:latest

# Set working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./

RUN npm i --force

# Bundle app source
COPY . .

# Expose port
EXPOSE 3000

# Start app with nodemon
CMD ["npm", "run", "start:dev"]

