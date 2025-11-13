#!/bin/bash

# eStation Hybrid Development Startup Script
# Starts Docker backend services and provides instructions for frontend

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 eStation Hybrid Development Environment${NC}"
echo "========================================"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

echo -e "${BLUE}📋 Starting Backend Services (Docker)...${NC}"
echo ""

# Start Docker backend services
cd backend
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  Creating .env file from template...${NC}"
    cp .env.example .env
fi

./scripts/start.sh dev

echo ""
echo -e "${GREEN}✅ Backend services started successfully!${NC}"
echo ""

# Wait for services to be ready
echo -e "${BLUE}🔍 Waiting for services to be ready...${NC}"
sleep 10

# Check service health
echo -e "${BLUE}🏥 Checking service health...${NC}"

# Function to check service health
check_service() {
    local service_name=$1
    local url=$2
    local max_attempts=10
    local attempt=1

    while [ $attempt -le $max_attempts ]; do
        if curl -f -s "$url" > /dev/null 2>&1; then
            echo -e "${GREEN}✅ $service_name is healthy${NC}"
            return 0
        fi
        echo -e "${YELLOW}⏳ Waiting for $service_name... (attempt $attempt/$max_attempts)${NC}"
        sleep 3
        ((attempt++))
    done
    
    echo -e "${RED}❌ $service_name health check failed${NC}"
    return 1
}

# Check all services
check_service "Backend API" "https://localhost/health" || echo -e "${YELLOW}⚠️  Backend API not ready, continuing...${NC}"
check_service "GeoServer" "https://localhost/geoserver/web/" || echo -e "${YELLOW}⚠️  GeoServer not ready, continuing...${NC}"

echo ""
echo -e "${GREEN}🎉 Backend Setup Complete!${NC}"
echo ""

# Instructions for frontend
echo -e "${BLUE}📱 Frontend Setup Instructions:${NC}"
echo "================================"
echo ""
echo "1. Open a new terminal window"
echo "2. Navigate to the frontend directory:"
echo -e "   ${YELLOW}cd frontend${NC}"
echo ""
echo "3. Install dependencies (if not already done):"
echo -e "   ${YELLOW}npm install${NC}"
echo ""
echo "4. Start the frontend development server:"
echo -e "   ${YELLOW}npm run dev${NC}"
echo ""
echo "5. Open your browser and visit:"
echo -e "   ${GREEN}http://localhost:3000${NC}"
echo ""

# Service URLs
echo -e "${BLUE}🔗 Service URLs:${NC}"
echo "==============="
echo ""
echo "Frontend Application:"
echo -e "  • ${GREEN}http://localhost:3000${NC} - Main application"
echo ""
echo "Backend Services (via Nginx):"
echo -e "  • ${GREEN}https://localhost/docs${NC} - API Documentation"
echo -e "  • ${GREEN}https://localhost/api/health${NC} - API Health Check"
echo -e "  • ${GREEN}https://localhost/geoserver${NC} - GeoServer Web Interface"
echo ""
echo "Development Tools:"
echo -e "  • ${GREEN}http://localhost:5050${NC} - PgAdmin (Database Admin)"
echo -e "  • ${GREEN}http://localhost:8081${NC} - Redis Commander"
echo ""
echo "Direct Access (for debugging):"
echo -e "  • ${GREEN}http://localhost:8000${NC} - Direct Backend API"
echo -e "  • ${GREEN}http://localhost:8080${NC} - Direct GeoServer"
echo ""

# Environment information
echo -e "${BLUE}🔧 Environment Configuration:${NC}"
echo "============================="
echo ""
echo "The frontend is configured to connect to Docker backend services via:"
echo -e "  • API_URL: ${YELLOW}https://localhost/api${NC}"
echo -e "  • GEOSERVER_URL: ${YELLOW}https://localhost/geoserver${NC}"
echo -e "  • WEBSOCKET_URL: ${YELLOW}wss://localhost/ws${NC}"
echo ""
echo "Configuration files:"
echo -e "  • ${YELLOW}frontend/.env.local${NC} - Frontend environment variables"
echo -e "  • ${YELLOW}backend/.env${NC} - Backend environment variables"
echo ""

# Useful commands
echo -e "${BLUE}🛠️  Useful Commands:${NC}"
echo "==================="
echo ""
echo "Backend management:"
echo -e "  • ${YELLOW}docker-compose ps${NC} - Check service status"
echo -e "  • ${YELLOW}docker-compose logs -f [service]${NC} - View service logs"
echo -e "  • ${YELLOW}docker-compose restart [service]${NC} - Restart a service"
echo -e "  • ${YELLOW}docker-compose down${NC} - Stop all services"
echo ""
echo "Frontend management:"
echo -e "  • ${YELLOW}npm run dev${NC} - Start development server"
echo -e "  • ${YELLOW}npm run build${NC} - Build for production"
echo -e "  • ${YELLOW}npm run lint${NC} - Run ESLint"
echo ""

# Troubleshooting
echo -e "${BLUE}🔍 Troubleshooting:${NC}"
echo "==================="
echo ""
echo "If you encounter issues:"
echo ""
echo "1. Check if all Docker services are running:"
echo -e "   ${YELLOW}docker-compose ps${NC}"
echo ""
echo "2. Check service logs:"
echo -e "   ${YELLOW}docker-compose logs -f backend${NC}"
echo ""
echo "3. Restart services if needed:"
echo -e "   ${YELLOW}docker-compose restart${NC}"
echo ""
echo "4. Check network connectivity:"
echo -e "   ${YELLOW}curl https://localhost/health${NC}"
echo ""

echo -e "${GREEN}🚀 Ready for development! Happy coding! 🎉${NC}"
echo ""