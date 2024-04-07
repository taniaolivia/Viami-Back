# Stage 1: Build stage
FROM node:lts AS build

# Set the working directory
WORKDIR /home/viami/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Stage 2: Production stage
FROM node:lts AS production

# Set the working directory
WORKDIR /home/viami/app

# Copy built files from the build stage
COPY --from=build /home/viami/app .

# Install only production dependencies
RUN npm install --only=production

# Install nodemon and Jest globally (if needed)
# RUN npm install -g nodemon jest

# Expose port
EXPOSE 3000

# Run the application
CMD ["npm", "run", "watch"]
