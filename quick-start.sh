#!/bin/bash

# LampandGlow - Quick Start Script
# This script helps you start all servers

echo "🚀 LampandGlow Quick Start"
echo "=========================="
echo ""
echo "Make sure MongoDB is running!"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to start a service
start_service() {
    local service=$1
    local port=$2
    
    echo -e "${YELLOW}Starting $service on port $port...${NC}"
    
    if [ "$service" == "Backend" ]; then
        cd backend
        npm run dev
    elif [ "$service" == "Frontend" ]; then
        cd frontend
        npm run dev
    elif [ "$service" == "Admin" ]; then
        cd admin
        npm run dev
    fi
}

# Check if running with arguments
if [ "$#" -eq 0 ]; then
    echo "Usage: ./start.sh [backend|frontend|admin|all]"
    echo ""
    echo "Examples:"
    echo "  ./start.sh backend              # Start backend only"
    echo "  ./start.sh frontend             # Start frontend only"
    echo "  ./start.sh admin                # Start admin dashboard"
    echo "  ./start.sh all                  # Start all (requires multiple terminals)"
    exit 1
fi

service=$1

case $service in
    backend)
        start_service "Backend" 5000
        ;;
    frontend)
        start_service "Frontend" 5173
        ;;
    admin)
        start_service "Admin" 5174
        ;;
    all)
        echo "Starting all services..."
        echo "Open 3 terminals and run:"
        echo "  Terminal 1: ./start.sh backend"
        echo "  Terminal 2: ./start.sh frontend"
        echo "  Terminal 3: ./start.sh admin"
        ;;
    *)
        echo -e "${RED}Unknown service: $service${NC}"
        echo "Use: backend, frontend, admin, or all"
        exit 1
        ;;
esac
