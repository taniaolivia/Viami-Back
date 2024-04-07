# Use the official Node.js LTS image
FROM node:lts

# Define the environment as production
ENV NODE_ENV=production

# Set the user to root for setup tasks
USER root

# Create a repository for the application
RUN mkdir -p /home/viami/app /home/viami/app/api /home/viami/app/tests

# Set the working directory
WORKDIR /home/viami/app

# Copy the package file to the project
COPY ["./package.json", "./package-lock.json", "./"]

# Copy the rest of the code of the application inside the container
COPY ./ /home/viami/app

# Install dependencies, excluding dev dependencies
RUN npm ci && npm install --only=production

# Install nodemon package and Jest globally
RUN npm install -g nodemon jest

# Expose the port 3000 for the application
EXPOSE 3000

# Run and watch the project
CMD ["npm", "run", "watch"]