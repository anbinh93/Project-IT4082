#!/bin/bash

# 🚀 IT4082 Project Setup and Cleanup Script
# ==========================================
# This script handles project setup, cleanup, and deployment tasks

set -e  # Exit on any error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_header() {
    echo -e "${PURPLE}================================${NC}"
    echo -e "${PURPLE} $1${NC}"
    echo -e "${PURPLE}================================${NC}"
}

# Check if running from correct directory
check_directory() {
    if [[ ! -f "docker-compose.yml" ]] || [[ ! -d "server" ]] || [[ ! -d "fe" ]]; then
        log_error "Please run this script from the project root directory (03_Developement)"
        exit 1
    fi
}

# Clean up debug and temporary files
cleanup_debug_files() {
    log_header "🧹 CLEANING UP DEBUG AND TEMPORARY FILES"
    
    # Remove debug files
    log_info "Removing debug files..."
    find . -name "debug-*.js" -delete 2>/dev/null || true
    find . -name "*-debug.js" -delete 2>/dev/null || true
    find . -name "test-*.js" -not -path "./04_Testing/*" -delete 2>/dev/null || true
    
    # Remove temporary files
    log_info "Removing temporary files..."
    find . -name "*.tmp" -delete 2>/dev/null || true
    find . -name "*.temp" -delete 2>/dev/null || true
    find . -name ".DS_Store" -delete 2>/dev/null || true
    
    # Remove empty files
    log_info "Removing empty files..."
    find . -name "*.js" -size 0 -delete 2>/dev/null || true
    find . -name "*.md" -size 0 -delete 2>/dev/null || true
    
    # Remove log files
    log_info "Cleaning up log files..."
    find . -name "*.log" -delete 2>/dev/null || true
    
    log_success "Debug files cleaned up"
}

# Setup Node.js dependencies
setup_dependencies() {
    log_header "📦 SETTING UP DEPENDENCIES"
    
    # Backend dependencies
    log_info "Installing backend dependencies..."
    cd server
    if [[ -f "package.json" ]]; then
        npm ci --silent
        log_success "Backend dependencies installed"
    else
        log_error "Backend package.json not found"
        return 1
    fi
    cd ..
    
    # Frontend dependencies
    log_info "Installing frontend dependencies..."
    cd fe
    if [[ -f "package.json" ]]; then
        npm ci --silent
        log_success "Frontend dependencies installed"
    else
        log_error "Frontend package.json not found"
        return 1
    fi
    cd ..
    
    # Testing dependencies
    log_info "Installing testing dependencies..."
    cd ../04_Testing
    if [[ -f "package.json" ]]; then
        npm ci --silent
        log_success "Testing dependencies installed"
    else
        log_warning "Testing package.json not found, skipping..."
    fi
    cd ../03_Developement
}

# Database setup
setup_database() {
    log_header "🗄️ SETTING UP DATABASE"
    
    cd server
    
    # Check if database exists and create backup
    if [[ -f "database.sqlite" ]]; then
        log_warning "Database already exists. Creating backup..."
        cp database.sqlite "database.sqlite.backup.$(date +%Y%m%d_%H%M%S)"
    fi
    
    # Check database connection (if using PostgreSQL)
    if [[ -n "${DB_HOST:-}" ]]; then
        log_info "Testing database connection..."
        timeout 10 node -e "
            const { sequelize } = require('./db/models');
            sequelize.authenticate()
                .then(() => { console.log('✅ Database connection successful'); process.exit(0); })
                .catch(err => { console.error('❌ Database connection failed:', err.message); process.exit(1); });
        " || {
            log_error "Database connection failed. Please check your database configuration."
            return 1
        }
    fi
    
    # Run migrations
    log_info "Running database migrations..."
    if npm run migrate; then
        log_success "Database migrations completed"
    else
        log_error "Database migrations failed"
        return 1
    fi
    
    # Validate migration success
    log_info "Validating database schema..."
    if node -e "
        const { sequelize } = require('./db/models');
        sequelize.sync({ force: false })
            .then(() => { console.log('✅ Schema validation successful'); process.exit(0); })
            .catch(err => { console.error('❌ Schema validation failed:', err.message); process.exit(1); });
    "; then
        log_success "Database schema validated"
    else
        log_error "Database schema validation failed"
        return 1
    fi
    
    # Run seeders
    log_info "Running database seeders..."
    if npm run seed; then
        log_success "Database seeders completed"
    else
        log_warning "Database seeders failed, continuing..."
    fi
    
    # Create admin users
    log_info "Creating admin users..."
    if [[ -f "scripts/createTestUsers.js" ]]; then
        if node scripts/createTestUsers.js; then
            log_success "Admin users created"
        else
            log_warning "Admin user creation failed, continuing..."
        fi
    else
        log_warning "createTestUsers.js script not found, skipping..."
    fi
    
    cd ..
}

# Docker setup
setup_docker() {
    log_header "🐳 SETTING UP DOCKER ENVIRONMENT"
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install Docker first."
        return 1
    fi
    
    # Check if Docker Compose is available
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        log_error "Docker Compose is not available. Please install Docker Compose."
        return 1
    fi
    
    # Create necessary directories
    log_info "Creating Docker directories..."
    mkdir -p database/data
    mkdir -p database/init
    mkdir -p server/uploads
    mkdir -p server/logs
    
    log_success "Docker environment setup completed"
}

# Build production assets
build_production() {
    log_header "🏗️ BUILDING PRODUCTION ASSETS"
    
    # Build frontend
    log_info "Building frontend for production..."
    cd fe
    if npm run build; then
        log_success "Frontend build completed"
    else
        log_error "Frontend build failed"
        return 1
    fi
    cd ..
    
    # Verify build
    if [[ -d "fe/dist" ]]; then
        log_success "Frontend build artifacts created in fe/dist"
    else
        log_error "Frontend build artifacts not found"
        return 1
    fi
}

# Health check
health_check() {
    log_header "🔍 RUNNING HEALTH CHECKS"
    
    # Check backend
    log_info "Checking backend configuration..."
    cd server
    if node -e "require('./config/config.js'); console.log('Backend config OK')"; then
        log_success "Backend configuration is valid"
    else
        log_error "Backend configuration has issues"
        return 1
    fi
    
    # Check database models
    log_info "Checking database models..."
    if node -e "
        const db = require('./db/models');
        console.log('Available models:', Object.keys(db).filter(key => key !== 'sequelize' && key !== 'Sequelize'));
        console.log('Database models OK');
    "; then
        log_success "Database models are valid"
    else
        log_error "Database models have issues"
        return 1
    fi
    
    # Check database tables
    log_info "Checking database tables..."
    if node -e "
        const { sequelize } = require('./db/models');
        sequelize.getQueryInterface().showAllTables()
            .then(tables => {
                console.log('Database tables:', tables.length);
                if (tables.length === 0) {
                    console.error('No tables found! Run migrations first.');
                    process.exit(1);
                }
                process.exit(0);
            })
            .catch(err => {
                console.error('Database check failed:', err.message);
                process.exit(1);
            });
    "; then
        log_success "Database tables are present"
    else
        log_error "Database tables check failed"
        return 1
    fi
    cd ..
    
    # Check frontend
    log_info "Checking frontend configuration..."
    cd fe
    if [[ -f "vite.config.ts" ]] && [[ -f "package.json" ]]; then
        log_success "Frontend configuration is valid"
    else
        log_error "Frontend configuration files missing"
        return 1
    fi
    cd ..
    
    log_success "All health checks passed"
}

# Display project information
show_info() {
    log_header "📋 PROJECT INFORMATION"
    
    echo -e "${CYAN}Project:${NC} IT4082 Apartment Management System"
    echo -e "${CYAN}Version:${NC} 1.0.0"
    echo -e "${CYAN}Environment:${NC} Development"
    echo ""
    echo -e "${CYAN}Services:${NC}"
    echo -e "  • Backend API: http://localhost:8000"
    echo -e "  • Frontend: http://localhost:5173" 
    echo -e "  • Database: SQLite (development)"
    echo ""
    echo -e "${CYAN}Docker Services:${NC}"
    echo -e "  • postgres: localhost:5432"
    echo -e "  • backend: localhost:8000"
    echo -e "  • frontend: localhost:5173"
    echo -e "  • redis: localhost:6379"
    echo ""
    echo -e "${CYAN}Default Users:${NC}"
    echo -e "  • Admin: admin / admin123"
    echo -e "  • Manager: manager / manager123"
    echo -e "  • Accountant: accountant / accountant123"
}

# Start development servers
start_dev() {
    log_header "🚀 STARTING DEVELOPMENT SERVERS"
    
    # Start backend
    log_info "Starting backend server..."
    cd server
    npm run dev &
    BACKEND_PID=$!
    cd ..
    
    # Start frontend
    log_info "Starting frontend server..."
    cd fe
    npm run dev &
    FRONTEND_PID=$!
    cd ..
    
    # Store PIDs for cleanup
    echo $BACKEND_PID > .backend.pid
    echo $FRONTEND_PID > .frontend.pid
    
    log_success "Development servers started"
    log_info "Backend: http://localhost:8000"
    log_info "Frontend: http://localhost:5173"
    log_info "Press Ctrl+C to stop servers"
    
    # Wait for interrupt
    trap 'kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; rm -f .backend.pid .frontend.pid; exit' INT
    wait
}

# Start with Docker
start_docker() {
    log_header "🐳 STARTING DOCKER SERVICES"
    
    if docker compose version &> /dev/null; then
        docker compose up -d
    else
        docker-compose up -d
    fi
    
    log_success "Docker services started"
    log_info "Backend: http://localhost:8000"
    log_info "Frontend: http://localhost:5173"
    log_info "Database: postgres://postgres:postgres123@localhost:5432/apartment_management"
}

# Stop Docker services
stop_docker() {
    log_header "🛑 STOPPING DOCKER SERVICES"
    
    if docker compose version &> /dev/null; then
        docker compose down
    else
        docker-compose down
    fi
    
    log_success "Docker services stopped"
}

# Database management
manage_database() {
    log_header "🗄️ DATABASE MANAGEMENT"
    
    echo "Please select a database operation:"
    echo ""
    echo "1) 🔄 Reset database (migrate + seed)"
    echo "2) 📊 Show database status"
    echo "3) ✅ Validate database"
    echo "4) 🔙 Rollback last migration"
    echo "5) 🌱 Run seeders only"
    echo "6) 🧹 Clear all data (keep structure)"
    echo "7) 👥 Create test users"
    echo "0) ← Back to main menu"
    echo ""
    
    read -p "Enter your choice [0-7]: " db_choice
    
    cd server
    
    case $db_choice in
        1)
            log_info "Resetting database..."
            npm run db:reset && log_success "Database reset complete"
            ;;
        2)
            log_info "Checking database status..."
            node -e "
                const { sequelize } = require('./db/models');
                sequelize.getQueryInterface().showAllTables()
                    .then(tables => {
                        console.log('📊 Database Status:');
                        console.log('Tables found:', tables.length);
                        console.log('Tables:', tables.join(', '));
                        return sequelize.query('SELECT name FROM sqlite_master WHERE type=\"table\"', { type: sequelize.QueryTypes.SELECT });
                    })
                    .then(result => {
                        console.log('✅ Database is accessible');
                        process.exit(0);
                    })
                    .catch(err => {
                        console.error('❌ Database error:', err.message);
                        process.exit(1);
                    });
            "
            ;;
        3)
            log_info "Validating database..."
            if [[ -f "scripts/validate-database.js" ]]; then
                node scripts/validate-database.js && log_success "Database validation complete"
            else
                log_error "validate-database.js script not found"
            fi
            ;;
        4)
            log_info "Rolling back last migration..."
            npm run migrate:undo && log_success "Migration rollback complete"
            ;;
        5)
            log_info "Running seeders..."
            npm run seed && log_success "Seeders complete"
            ;;
        6)
            log_info "Clearing all data..."
            npm run seed:undo && log_success "Data cleared"
            ;;
        7)
            log_info "Creating test users..."
            if [[ -f "scripts/createTestUsers.js" ]]; then
                node scripts/createTestUsers.js && log_success "Test users created"
            else
                log_error "createTestUsers.js script not found"
            fi
            ;;
        0)
            log_info "Returning to main menu..."
            ;;
        *)
            log_error "Invalid option. Please try again."
            ;;
    esac
    
    cd ..
}

# Main menu
show_menu() {
    echo ""
    echo -e "${PURPLE}🏢 IT4082 Apartment Management System${NC}"
    echo -e "${PURPLE}=====================================${NC}"
    echo ""
    echo "Please select an option:"
    echo ""
    echo "1) 🧹 Clean up debug files"
    echo "2) 📦 Setup dependencies"
    echo "3) 🗄️ Setup database"
    echo "4) 🔧 Manage database"
    echo "5) 🐳 Setup Docker"
    echo "6) 🏗️ Build production"
    echo "7) 🔍 Run health checks"
    echo "8) 🚀 Start development servers"
    echo "9) 🐳 Start with Docker"
    echo "10) 🛑 Stop Docker services"
    echo "11) 📋 Show project info"
    echo "12) 🔄 Full setup (1-3,5-7)"
    echo "0) ❌ Exit"
    echo ""
}

# Full setup
full_setup() {
    cleanup_debug_files
    setup_dependencies
    setup_database
    setup_docker
    build_production
    health_check
    show_info
}

# Main execution
main() {
    check_directory
    
    if [[ $# -eq 0 ]]; then
        # Interactive mode
        while true; do
            show_menu
            read -p "Enter your choice [0-12]: " choice
            case $choice in
                1) cleanup_debug_files ;;
                2) setup_dependencies ;;
                3) setup_database ;;
                4) manage_database ;;
                5) setup_docker ;;
                6) build_production ;;
                7) health_check ;;
                8) start_dev ;;
                9) start_docker ;;
                10) stop_docker ;;
                11) show_info ;;
                12) full_setup ;;
                0) log_info "Goodbye!"; exit 0 ;;
                *) log_error "Invalid option. Please try again." ;;
            esac
            echo ""
            read -p "Press Enter to continue..."
        done
    else
        # Command line mode
        case $1 in
            clean) cleanup_debug_files ;;
            setup) full_setup ;;
            deps) setup_dependencies ;;
            db) setup_database ;;
            db-manage) manage_database ;;
            docker) setup_docker ;;
            build) build_production ;;
            health) health_check ;;
            dev) start_dev ;;
            up) start_docker ;;
            down) stop_docker ;;
            info) show_info ;;
            *) 
                echo "Usage: $0 [clean|setup|deps|db|db-manage|docker|build|health|dev|up|down|info]"
                echo ""
                echo "Commands:"
                echo "  clean      - Clean up debug and temporary files"
                echo "  setup      - Full project setup"
                echo "  deps       - Install dependencies"
                echo "  db         - Setup database (migrate + seed)"
                echo "  db-manage  - Interactive database management"
                echo "  docker     - Setup Docker environment"
                echo "  build      - Build production assets"
                echo "  health     - Run health checks"
                echo "  dev        - Start development servers"
                echo "  up         - Start Docker services"
                echo "  down       - Stop Docker services"
                echo "  info       - Show project information"
                exit 1
                ;;
        esac
    fi
}

# Run main function
main "$@"
