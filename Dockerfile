# User official image of Node.js
FROM node:lts

# Define the environnement as production
ENV NODE_ENV=development

# Set the user as root
USER root

# Use the repository /app
WORKDIR /home/node/app

# Copy the package file to the project
COPY ["package.json", "package-lock.json", "./"]

# Installe les dépendances
RUN npm ci



# Install nodemon package so that the project can run using the command run watch
RUN npm install -g nodemon

# Install Jest globally
RUN npm install -g jest

# Copy the source code
COPY . .

# Expose the port 3000 for the application
EXPOSE 3000

# Run and watch the project
CMD ["npm", "run", "watch"]