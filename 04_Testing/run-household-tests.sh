#!/bin/bash

# 🏠 Household Management API Testing Script
# This script runs all household management API tests

echo "🏠 HOUSEHOLD MANAGEMENT API TESTING SUITE"
echo "========================================"
echo "📅 Start Time: $(date)"
echo "🌐 Environment: Development"
echo "🔧 API Base URL: http://localhost:8000/api"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "test-household-comprehensive.js" ]; then
    echo "❌ Please run this script from the 04_Testing directory."
    exit 1
fi

# Check if server is running
echo "🔍 Checking if API server is running..."
if curl -s http://localhost:8000/api/auth/login > /dev/null; then
    echo "✅ API server is accessible"
else
    echo "❌ API server is not accessible at http://localhost:8000"
    echo "Please make sure the backend server is running."
    exit 1
fi

echo ""
echo "📋 Available Test Options:"
echo "1. Run all tests (comprehensive)"
echo "2. Run household management tests only"
echo "3. Run member management tests only"
echo "4. Run fee management tests only"
echo "5. Run housing management tests only"
echo "6. Exit"
echo ""

read -p "Please select an option (1-6): " choice

case $choice in
    1)
        echo ""
        echo "🚀 Running comprehensive household management API tests..."
        echo ""
        node test-household-comprehensive.js
        ;;
    2)
        echo ""
        echo "🏠 Running household management API tests..."
        echo ""
        node test-household-management-api.js
        ;;
    3)
        echo ""
        echo "👥 Running household member management API tests..."
        echo ""
        node test-household-member-api.js
        ;;
    4)
        echo ""
        echo "💰 Running household fee management API tests..."
        echo ""
        node test-household-fee-api.js
        ;;
    5)
        echo ""
        echo "🏢 Running household housing management API tests..."
        echo ""
        node test-household-housing-api.js
        ;;
    6)
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo "❌ Invalid option. Please run the script again and select 1-6."
        exit 1
        ;;
esac

echo ""
echo "⏱️ End Time: $(date)"
echo "✅ Test execution completed!"
echo ""
echo "📊 For detailed test documentation, see: household-api-test-documentation.md"
echo "🔧 For individual test files, check the current directory"
