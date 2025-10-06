# Stage 1: Build Angular app
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Build the Angular app in production mode
RUN npm run build -- --output-path=dist/frontend-start --configuration production

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy built Angular app from previous stage
COPY --from=build /app/dist/frontend-start /usr/share/nginx/html

# Copy custom Nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
