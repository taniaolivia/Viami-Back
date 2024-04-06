# User official image of Node.js
FROM node:lts

# Define the environnement as production
ENV NODE_ENV=production

# Remove and create a group 'admins'
# Remove and create a user not root named 'viami' and add it to the group 'admins'
USER root
RUN groupdel admins || true && \
    groupadd -g 1005 admins && \
    userdel viami || true && \
    useradd -m -u 1001 -g admins viami

# Use the repository /app
WORKDIR /home/viami/app

# Create a repository for the application
RUN mkdir -p /home/viami/app/api /home/viami/app/tests

# Copy the package file to the project
COPY package.json*.json ./

# Installe les dépendances
RUN npm ci --only=production

# Install nodemon package so that the project can run using the command run watch
# Install Jest globally
RUN npm install -g nodemon jest

# Copy the rest of the code
COPY . .

# Making sure that the user 'viami' has the permission to the directory of the application
RUN chown -R viami:viami /home/viami/app

# Switch to the non-root user
USER viami

# Expose the port 3000 for the application
EXPOSE 3000

# Run and watch the project
CMD ["npm", "run", "watch"]