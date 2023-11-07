# User official image of Node.js
FROM node:lts

# Define the environnement as preproduction
ENV NODE_ENV=preproduction

# Set the user as root
USER root

# Use the repository /app/preprod
WORKDIR /app/preprod

# Copy the package file to the project
COPY ["package.json", "package-lock.json*", "./"]

# Install all the dependencies needed 
RUN npm install --preproduction

# Install nodemon package so that the project can run using the command run watch
RUN npm install -g nodemon

# Copy the source code
COPY . .

# Expose the port 3000 for the application
EXPOSE 3000

# Run and watch the project
CMD ["npm", "run", "watch"]
