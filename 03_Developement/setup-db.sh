#!/bin/bash

# Database Setup Script for Production
echo "🗄️ Setting up production database..."

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_status() {
    echo -e "${YELLOW}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Change to server directory
cd server

# Wait for database to be ready
print_status "Waiting for database to be ready..."
sleep 15

# Run migrations
print_status "Running database migrations..."
if npm run migrate; then
    print_success "Database migrations completed"
else
    print_error "Database migrations failed"
    exit 1
fi

# Run seeders
print_status "Running database seeders..."
if npm run seed; then
    print_success "Database seeders completed"
else
    print_error "Database seeders failed"
    exit 1
fi

# Create admin user
print_status "Creating admin user..."
if node scripts/createTestUsers.js; then
    print_success "Admin user created"
else
    print_error "Failed to create admin user"
    exit 1
fi

print_success "🎉 Database setup completed!"
echo ""
echo "📋 Default Login Credentials:"
echo "   Admin: username=admin, password=admin123"
echo "   Accountant: username=accountant, password=accountant123"
echo "   Manager: username=manager, password=manager123"
