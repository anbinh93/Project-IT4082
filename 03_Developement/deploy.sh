#!/bin/bash

# Apartment Management System Deployment Script
echo "🏢 Starting Apartment Management System Deployment..."

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Change to the project directory
cd "$(dirname "$0")"

print_status "Current directory: $(pwd)"

# Stop any running containers
print_status "Stopping existing containers..."
docker-compose down

# Build and start the services
print_status "Building and starting services..."
docker-compose up --build -d

# Wait for services to be ready
print_status "Waiting for services to start..."
sleep 10

# Check if services are running
print_status "Checking service status..."

if docker-compose ps | grep -q "postgres.*Up"; then
    print_success "Database service is running"
else
    print_error "Database service failed to start"
    docker-compose logs postgres
    exit 1
fi

if docker-compose ps | grep -q "backend.*Up"; then
    print_success "Backend service is running"
else
    print_error "Backend service failed to start"
    docker-compose logs backend
    exit 1
fi

if docker-compose ps | grep -q "frontend.*Up"; then
    print_success "Frontend service is running"
else
    print_error "Frontend service failed to start"
    docker-compose logs frontend
    exit 1
fi

# Test health endpoints
print_status "Testing health endpoints..."

# Wait a bit more for services to fully initialize
sleep 5

# Test backend health
if curl -s http://localhost:8000/api/health > /dev/null; then
    print_success "Backend health check passed"
else
    print_warning "Backend health check failed, but service might still be starting"
fi

# Test frontend
if curl -s http://localhost:3000 > /dev/null; then
    print_success "Frontend is accessible"
else
    print_warning "Frontend check failed, but service might still be starting"
fi

print_success "🎉 Deployment completed!"
echo ""
echo "📋 Service URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8000"
echo "   Health Check: http://localhost:8000/api/health"
echo ""
echo "📝 To view logs:"
echo "   docker-compose logs -f [service_name]"
echo ""
echo "🛑 To stop services:"
echo "   docker-compose down"
echo ""
echo "🔧 To restart services:"
echo "   docker-compose restart"
