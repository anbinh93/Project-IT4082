# 🐳 IT4082 Apartment Management Backend Dockerfile
# ================================================

# Base stage with Node.js 18 LTS
FROM node:18-alpine AS base
LABEL maintainer="IT4082 Team"
LABEL description="Apartment Management System Backend API"
LABEL version="1.0.0"

# Install system dependencies
RUN apk add --no-cache \
    curl \
    postgresql-client \
    tzdata \
    && rm -rf /var/cache/apk/*

# Set timezone
ENV TZ=Asia/Ho_Chi_Minh
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Development stage
FROM base AS development
ENV NODE_ENV=development
RUN npm ci --include=dev
COPY . .
EXPOSE 8000
CMD ["npm", "run", "dev"]

# Production stage
FROM base AS production
ENV NODE_ENV=production

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy application code
COPY . .

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Create necessary directories
RUN mkdir -p uploads logs && \
    chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/api/health || exit 1

# Expose port
EXPOSE 8000

# Start the application
CMD ["npm", "start"]

# Build arguments for CI/CD
ARG BUILD_DATE
ARG VCS_REF
ARG VERSION

# Metadata
LABEL org.label-schema.build-date=$BUILD_DATE \
      org.label-schema.name="IT4082 Backend API" \
      org.label-schema.description="Apartment Management System Backend" \
      org.label-schema.vcs-ref=$VCS_REF \
      org.label-schema.vcs-url="https://github.com/your-repo/it4082" \
      org.label-schema.vendor="IT4082 Team" \
      org.label-schema.version=$VERSION \
      org.label-schema.schema-version="1.0"