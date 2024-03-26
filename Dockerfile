# User official image of Node.js
FROM node:lts

# Define the environnement as production
ENV NODE_ENV=development

# Remove and create a group 'admins'
USER root
RUN groupdel admins || true
RUN groupadd -g 1005 admins

# Remove and create a user not root named 'viami' and add it to the group 'admins'
RUN userdel viami || true
RUN useradd -m -u 1001 viami
RUN usermod -aG admins viami

# Create a repository for the application
RUN mkdir -p /home/viami/app
RUN mkdir -p /home/viami/app/api
RUN mkdir -p /home/viami/app/tests

# Use the repository /app
WORKDIR /home/node/app

# Copy the package file to the project
COPY ["package.json", "package-lock.json", "./"]

# Installe les dépendances
RUN npm ci


# Copy the rest of the code of the application inside the container
COPY ./ /home/viami/app

# Install all the dependencies needed 
RUN npm install --production

# Install nodemon package so that the project can run using the command run watch
RUN npm install -g nodemon

# Install Jest globally
RUN npm install -g jest

# Expose the port 3000 for the application
EXPOSE 3000

# Run and watch the project
CMD ["npm", "run", "watch"]