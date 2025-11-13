#!/bin/bash

# eStation Docker Start Script
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DOCKER_DIR="$(dirname "$SCRIPT_DIR")"

echo -e "${GREEN}🚀 Starting eStation Backend Services${NC}"
echo "========================================"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

# Check if .env file exists
if [ ! -f "$DOCKER_DIR/.env" ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from example...${NC}"
    cp "$DOCKER_DIR/.env.example" "$DOCKER_DIR/.env"
    echo -e "${YELLOW}📝 Please review and update $DOCKER_DIR/.env with your settings${NC}"
fi

# Change to docker directory
cd "$DOCKER_DIR"

# Determine environment
ENVIRONMENT=${1:-dev}

case $ENVIRONMENT in
    "dev"|"development")
        echo -e "${GREEN}🔧 Starting in DEVELOPMENT mode${NC}"
        docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
        ;;
    "prod"|"production")
        echo -e "${GREEN}🏭 Starting in PRODUCTION mode${NC}"
        docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
        ;;
    *)
        echo -e "${RED}❌ Invalid environment: $ENVIRONMENT${NC}"
        echo "Usage: $0 [dev|prod]"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}✅ Services started successfully!${NC}"
echo ""
echo "📊 Service URLs:"
echo "  • API Documentation: https://localhost/docs"
echo "  • Backend API: https://localhost/api/"
echo "  • GeoServer: https://localhost/geoserver/"

if [ "$ENVIRONMENT" = "dev" ] || [ "$ENVIRONMENT" = "development" ]; then
    echo "  • Direct Backend: http://localhost:8000"
    echo "  • Direct GeoServer: http://localhost:8080"
    echo "  • PgAdmin: http://localhost:5050"
    echo "  • Redis Commander: http://localhost:8081"
fi

echo ""
echo "🔍 Check service status:"
echo "  docker-compose ps"
echo ""
echo "📋 View logs:"
echo "  docker-compose logs -f [service-name]"
echo ""
echo "🛑 Stop services:"
echo "  docker-compose down"