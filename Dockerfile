# Use the official Node.js LTS image
FROM node:lts

# Define the environment as production
ENV NODE_ENV=production

# Set the user to root for setup tasks
USER root

# Remove and create a group 'admins' and a user not root named 'viami' and add it to the group 'admins'
RUN groupdel admins || true && \
    groupadd -g 1005 admins && \
    userdel viami || true && \
    useradd -m -u 1001 viami && \
    usermod -aG admins viami && \
    # Create a repository for the application
    mkdir -p /home/viami/app /home/viami/app/api /home/viami/app/tests && \
    # Copy the package file and the rest of the code of the application inside the container
    cp ./package.json ./package-lock.json /home/viami/app/ && \
    cp -R ./ /home/viami/app/ && \
    # Change ownership to the non-root user
    chown -R viami:admins /home/viami/app

# Switch to the non-root user
USER viami

# Set the working directory
WORKDIR /home/viami/app

# Install dependencies, excluding dev dependencies
RUN npm ci && npm install --only=production

# Install nodemon package and Jest globally
RUN npm install -g nodemon jest

# Expose the port 3000 for the application
EXPOSE 3000

# Run and watch the project
CMD ["npm", "run", "watch"]