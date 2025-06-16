# 🐳 IT4082 Apartment Management Frontend Dockerfile
# =================================================

# Build stage
FROM node:18-alpine AS build
LABEL description="IT4082 Frontend Build Stage"

# Install system dependencies
RUN apk add --no-cache git

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --silent

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage with Nginx
FROM nginx:1.25-alpine AS production
LABEL maintainer="IT4082 Team"
LABEL description="Apartment Management System Frontend"
LABEL version="1.0.0"

# Install curl for health checks
RUN apk add --no-cache curl

# Copy built application from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create nginx cache directories
RUN mkdir -p /var/cache/nginx/client_temp \
             /var/cache/nginx/proxy_temp \
             /var/cache/nginx/fastcgi_temp \
             /var/cache/nginx/uwsgi_temp \
             /var/cache/nginx/scgi_temp

# Set proper permissions
RUN chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

# Development stage
FROM node:18-alpine AS development
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# Build arguments for CI/CD
ARG BUILD_DATE
ARG VCS_REF
ARG VERSION

# Metadata
LABEL org.label-schema.build-date=$BUILD_DATE \
      org.label-schema.name="IT4082 Frontend" \
      org.label-schema.description="Apartment Management System Frontend" \
      org.label-schema.vcs-ref=$VCS_REF \
      org.label-schema.vcs-url="https://github.com/your-repo/it4082" \
      org.label-schema.vendor="IT4082 Team" \
      org.label-schema.version=$VERSION \
      org.label-schema.schema-version="1.0"