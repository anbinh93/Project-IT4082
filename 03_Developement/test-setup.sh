#!/bin/bash

# Quick setup test script
# Tests the basic functionality of the setup script

set -e

echo "🧪 Running setup script tests..."
echo ""

# Test 1: Check if setup script exists and is executable
echo "1. Checking setup script..."
if [[ -f "./setup.sh" ]] && [[ -x "./setup.sh" ]]; then
    echo "✅ Setup script exists and is executable"
else
    echo "❌ Setup script missing or not executable"
    chmod +x ./setup.sh 2>/dev/null || true
fi

# Test 2: Check directory structure
echo ""
echo "2. Checking directory structure..."
required_dirs=("server" "fe" "server/db" "server/db/migrations" "server/db/seeders")
for dir in "${required_dirs[@]}"; do
    if [[ -d "$dir" ]]; then
        echo "✅ $dir exists"
    else
        echo "❌ $dir missing"
    fi
done

# Test 3: Check essential files
echo ""
echo "3. Checking essential files..."
required_files=(
    "docker-compose.yml"
    "server/package.json"
    "fe/package.json"
    "server/server.js"
    "server/config/config.js"
    "server/db/migrations/20250616000000-complete-database-schema.js"
    "server/db/seeders/20250616000001-production-data-seeder.js"
)

for file in "${required_files[@]}"; do
    if [[ -f "$file" ]]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
    fi
done

# Test 4: Check if Node.js is installed
echo ""
echo "4. Checking Node.js installation..."
if command -v node &> /dev/null; then
    node_version=$(node --version)
    echo "✅ Node.js installed: $node_version"
else
    echo "❌ Node.js not found"
fi

# Test 5: Check if npm is installed
echo ""
echo "5. Checking npm installation..."
if command -v npm &> /dev/null; then
    npm_version=$(npm --version)
    echo "✅ npm installed: $npm_version"
else
    echo "❌ npm not found"
fi

# Test 6: Check if Docker is available
echo ""
echo "6. Checking Docker installation..."
if command -v docker &> /dev/null; then
    docker_version=$(docker --version)
    echo "✅ Docker installed: $docker_version"
else
    echo "⚠️ Docker not found (optional for development)"
fi

# Test 7: Test setup script help
echo ""
echo "7. Testing setup script help..."
if ./setup.sh --help 2>/dev/null || ./setup.sh help 2>/dev/null; then
    echo "✅ Setup script help working"
else
    echo "⚠️ Setup script help not available (testing basic usage)"
    if ./setup.sh info 2>/dev/null; then
        echo "✅ Setup script basic commands working"
    else
        echo "❌ Setup script not responding to commands"
    fi
fi

echo ""
echo "🎉 Setup test completed!"
echo ""
echo "📋 Next steps:"
echo "   1. Run './setup.sh' to see the interactive menu"
echo "   2. Run './setup.sh setup' for full automated setup"
echo "   3. Run './setup.sh info' to see project information"
echo ""
