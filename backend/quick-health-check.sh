#!/bin/bash

# eStation Backend Services Quick Health Check
# Fast verification that all services are running and healthy

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Quick check function
quick_check() {
    local service_name=$1
    local test_command=$2
    local max_attempts=${3:-3}
    local attempt=1

    while [ $attempt -le $max_attempts ]; do
        if eval "$test_command" > /dev/null 2>&1; then
            echo -e "${GREEN}✅ $service_name${NC}"
            return 0
        fi
        if [ $attempt -lt $max_attempts ]; then
            sleep 2
        fi
        ((attempt++))
    done
    echo -e "${RED}❌ $service_name${NC}"
    return 1
}

echo -e "${BLUE}🚀 eStation Backend Quick Health Check${NC}"
echo -e "${BLUE}=====================================${NC}"
echo ""

# Change to backend directory if needed
if [ ! -f "docker-compose.yml" ] && [ -f "backend/docker-compose.yml" ]; then
    cd backend
fi

# Quick service checks
echo -e "${BLUE}Checking service health...${NC}"
echo ""

all_healthy=true

quick_check "Docker Daemon" "docker info" || all_healthy=false
quick_check "PostgreSQL" "docker-compose exec -T postgres pg_isready -U \${POSTGRES_USER:-estation_user} -d \${POSTGRES_DB:-estation}" || all_healthy=false
quick_check "Redis" "docker-compose exec -T redis redis-cli --no-auth-warning ping" || all_healthy=false
quick_check "Backend API" "curl -f -s http://localhost:8000/health" || all_healthy=false
quick_check "GeoServer" "curl -f -s http://localhost:8082/geoserver/web" || all_healthy=false
quick_check "Nginx Proxy" "curl -f -s http://localhost/health" || all_healthy=false

echo ""

if [ "$all_healthy" = true ]; then
    echo -e "${GREEN}🎉 All services are healthy!${NC}"
    echo ""
    echo -e "${BLUE}Service URLs:${NC}"
    echo -e "  • Backend API: ${GREEN}http://localhost:8000${NC}"
    echo -e "  • API Docs: ${GREEN}http://localhost:8000/docs${NC}"
    echo -e "  • GeoServer: ${GREEN}http://localhost:8082/geoserver${NC}"
    echo -e "  • Proxy: ${GREEN}http://localhost${NC}"
    exit 0
else
    echo -e "${RED}❌ Some services are unhealthy${NC}"
    echo ""
    echo -e "${YELLOW}Troubleshooting:${NC}"
    echo -e "  • Check logs: ${YELLOW}docker-compose logs -f [service]${NC}"
    echo -e "  • Restart: ${YELLOW}docker-compose restart${NC}"
    echo -e "  • Full test: ${YELLOW}./test-services.sh${NC}"
    exit 1
fi