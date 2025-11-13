#!/bin/bash

# eStation Backend Services Comprehensive Test Script
# Tests all backend services for proper configuration and functionality

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Configuration
TIMEOUT=30
RETRY_COUNT=3
TEST_START_TIME=$(date +%s)

# Function to print colored output
print_header() {
    echo -e "\n${CYAN}===========================================${NC}"
    echo -e "${CYAN}$1${NC}"
    echo -e "${CYAN}===========================================${NC}\n"
}

print_section() {
    echo -e "\n${BLUE}📋 $1${NC}"
    echo -e "${BLUE}$(echo "$1" | sed 's/./=/g')${NC}"
}

print_test() {
    echo -e "${PURPLE}🔍 Testing: $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
    ((PASSED_TESTS++))
}

print_failure() {
    echo -e "${RED}❌ $1${NC}"
    ((FAILED_TESTS++))
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${CYAN}ℹ️  $1${NC}"
}

# Function to increment test counter
run_test() {
    ((TOTAL_TESTS++))
}

# Function to wait for service with retry logic
wait_for_service() {
    local service_name=$1
    local test_command=$2
    local max_attempts=$3
    local attempt=1

    while [ $attempt -le $max_attempts ]; do
        if eval "$test_command" > /dev/null 2>&1; then
            return 0
        fi
        if [ $attempt -lt $max_attempts ]; then
            echo -e "${YELLOW}⏳ Waiting for $service_name... (attempt $attempt/$max_attempts)${NC}"
            sleep 5
        fi
        ((attempt++))
    done
    return 1
}

# Function to check if Docker is running
check_docker() {
    print_section "Docker Environment Checks"

    run_test
    print_test "Docker daemon status"
    if docker info > /dev/null 2>&1; then
        print_success "Docker daemon is running"
    else
        print_failure "Docker daemon is not running"
        exit 1
    fi

    run_test
    print_test "Docker Compose availability"
    if docker-compose --version > /dev/null 2>&1; then
        local version=$(docker-compose --version)
        print_success "Docker Compose available: $version"
    else
        print_failure "Docker Compose is not available"
        exit 1
    fi
}

# Function to validate docker-compose configuration
validate_compose_config() {
    print_section "Docker Compose Configuration"

    run_test
    print_test "docker-compose.yml syntax validation"
    if docker-compose config > /dev/null 2>&1; then
        print_success "Docker Compose configuration is valid"
    else
        print_failure "Docker Compose configuration has errors"
        docker-compose config
        return 1
    fi

    run_test
    print_test "Environment file validation"
    if [ -f .env ]; then
        print_success "Environment file (.env) exists"
        print_info "Environment variables loaded from .env"
    else
        print_warning "No .env file found, using defaults"
    fi

    run_test
    print_test "Required environment variables"
    local required_vars=("POSTGRES_DB" "POSTGRES_USER" "POSTGRES_PASSWORD" "REDIS_PASSWORD")
    local missing_vars=()

    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ] && ! grep -q "^$var=" .env 2>/dev/null; then
            missing_vars+=("$var")
        fi
    done

    if [ ${#missing_vars[@]} -eq 0 ]; then
        print_success "All required environment variables are set"
    else
        print_failure "Missing environment variables: ${missing_vars[*]}"
    fi
}

# Function to check service containers
check_service_containers() {
    print_section "Service Container Status"

    local services=("postgres" "redis" "backend" "celery-worker" "geoserver" "nginx")

    for service in "${services[@]}"; do
        run_test
        print_test "$service container status"

        local status=$(docker-compose ps -q $service 2>/dev/null)
        if [ -n "$status" ]; then
            local container_status=$(docker inspect --format='{{.State.Status}}' $status 2>/dev/null || echo "not found")
            if [ "$container_status" = "running" ]; then
                print_success "$service container is running"
            else
                print_failure "$service container status: $container_status"
            fi
        else
            print_failure "$service container not found"
        fi
    done
}

# Function to test service health checks
test_service_health() {
    print_section "Service Health Checks"

    # PostgreSQL health check
    run_test
    print_test "PostgreSQL database connectivity"
    if wait_for_service "PostgreSQL" "docker-compose exec -T postgres pg_isready -U \${POSTGRES_USER:-estation_user} -d \${POSTGRES_DB:-estation}" $RETRY_COUNT; then
        print_success "PostgreSQL is healthy and accepting connections"
    else
        print_failure "PostgreSQL health check failed"
    fi

    # Redis health check
    run_test
    print_test "Redis connectivity"
    if wait_for_service "Redis" "docker-compose exec -T redis redis-cli --no-auth-warning -a \${REDIS_PASSWORD:-redis_password} ping" $RETRY_COUNT; then
        print_success "Redis is healthy and responding"
    else
        print_failure "Redis health check failed"
    fi

    # Backend API health check
    run_test
    print_test "Backend API health endpoint"
    if wait_for_service "Backend API" "curl -f -s http://localhost:8000/health" $RETRY_COUNT; then
        print_success "Backend API is healthy"

        # Test additional API endpoints
        run_test
        print_test "Backend API documentation endpoint"
        if curl -f -s http://localhost:8000/docs > /dev/null 2>&1; then
            print_success "API documentation is accessible"
        else
            print_failure "API documentation is not accessible"
        fi

        run_test
        print_test "Backend monitoring endpoints"
        if curl -f -s http://localhost:8000/monitoring/services > /dev/null 2>&1; then
            print_success "Monitoring endpoints are accessible"
        else
            print_failure "Monitoring endpoints are not accessible"
        fi
    else
        print_failure "Backend API health check failed"
    fi

    # GeoServer health check
    run_test
    print_test "GeoServer web interface"
    if wait_for_service "GeoServer" "curl -f -s http://localhost:8082/geoserver/web" $RETRY_COUNT; then
        print_success "GeoServer is healthy and web interface is accessible"
    else
        print_failure "GeoServer health check failed"
    fi

    # Nginx proxy health check
    run_test
    print_test "Nginx reverse proxy"
    if wait_for_service "Nginx" "curl -f -s http://localhost/health" $RETRY_COUNT; then
        print_success "Nginx reverse proxy is healthy"

        # Test proxy endpoints
        run_test
        print_test "API proxy via Nginx"
        if curl -f -s https://localhost/api/health -k > /dev/null 2>&1; then
            print_success "API accessible via Nginx proxy"
        else
            print_warning "API not accessible via Nginx proxy (SSL/HTTPS might not be configured)"
        fi

        run_test
        print_test "GeoServer proxy via Nginx"
        if curl -f -s https://localhost/geoserver/web -k > /dev/null 2>&1; then
            print_success "GeoServer accessible via Nginx proxy"
        else
            print_warning "GeoServer not accessible via Nginx proxy"
        fi
    else
        print_failure "Nginx health check failed"
    fi
}

# Function to test inter-service communication
test_inter_service_communication() {
    print_section "Inter-Service Communication"

    # Test backend to database connection
    run_test
    print_test "Backend to PostgreSQL connection"
    local health_response=$(curl -s http://localhost:8000/health 2>/dev/null || echo "failed")
    if echo "$health_response" | grep -q "healthy"; then
        print_success "Backend can communicate with database"
    else
        print_failure "Backend to database communication failed"
    fi

    # Test backend to Redis connection
    run_test
    print_test "Backend to Redis connection"
    # This would require implementing Redis status in the health endpoint
    print_info "Backend to Redis connection (check via application logs)"

    # Test Celery worker functionality
    run_test
    print_test "Celery worker process"
    local worker_status=$(docker-compose exec -T celery-worker ps aux | grep celery | grep -v grep | wc -l)
    if [ "$worker_status" -gt 0 ]; then
        print_success "Celery worker processes are running"
    else
        print_failure "Celery worker processes not found"
    fi
}

# Function to test data persistence
test_data_persistence() {
    print_section "Data Persistence & Volumes"

    local volumes=("postgres_data" "redis_data" "geoserver_data" "logs")

    for volume in "${volumes[@]}"; do
        run_test
        print_test "$volume volume mount"

        if docker volume inspect "${PWD##*/}_$volume" > /dev/null 2>&1; then
            print_success "$volume volume exists and is mounted"
        else
            print_failure "$volume volume not found"
        fi
    done

    # Test volume directories in backend/volumes/
    run_test
    print_test "Local volume directories"
    if [ -d "volumes" ]; then
        print_success "Local volumes directory exists"
        local vol_dirs=("postgres-data" "redis-data" "geoserver-data" "logs")
        for vol_dir in "${vol_dirs[@]}"; do
            if [ -d "volumes/$vol_dir" ]; then
                print_info "✓ volumes/$vol_dir directory exists"
            else
                print_warning "volumes/$vol_dir directory not found"
            fi
        done
    else
        print_failure "Local volumes directory not found"
    fi
}

# Function to test network connectivity
test_network_connectivity() {
    print_section "Network Connectivity"

    run_test
    print_test "Docker network existence"
    local network_name="${PWD##*/}_estation_network"
    if docker network inspect "$network_name" > /dev/null 2>&1; then
        print_success "eStation Docker network exists"
    else
        print_failure "eStation Docker network not found"
    fi

    # Test port accessibility
    local ports=("5432:PostgreSQL" "6379:Redis" "8000:Backend" "8082:GeoServer" "80:Nginx-HTTP" "443:Nginx-HTTPS")

    for port_info in "${ports[@]}"; do
        local port="${port_info%:*}"
        local service="${port_info#*:}"

        run_test
        print_test "$service port $port accessibility"

        if nc -z localhost "$port" 2>/dev/null; then
            print_success "$service port $port is accessible"
        else
            if [ "$port" = "443" ]; then
                print_warning "$service port $port not accessible (SSL might not be configured)"
            else
                print_failure "$service port $port is not accessible"
            fi
        fi
    done
}

# Function to test performance metrics
test_performance_metrics() {
    print_section "Performance Metrics"

    # Test API response times
    run_test
    print_test "API response time"
    local start_time=$(date +%s%N)
    if curl -f -s http://localhost:8000/health > /dev/null 2>&1; then
        local end_time=$(date +%s%N)
        local response_time=$(( (end_time - start_time) / 1000000 ))
        if [ $response_time -lt 1000 ]; then
            print_success "API response time: ${response_time}ms (excellent)"
        elif [ $response_time -lt 3000 ]; then
            print_success "API response time: ${response_time}ms (good)"
        else
            print_warning "API response time: ${response_time}ms (slow)"
        fi
    else
        print_failure "Could not measure API response time"
    fi

    # Test resource usage
    run_test
    print_test "Container resource usage"
    local total_memory=$(docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}" | grep -E "(postgres|redis|backend|geoserver|nginx)" | wc -l)
    if [ "$total_memory" -gt 0 ]; then
        print_success "Resource usage monitoring available"
        print_info "Use 'docker stats' for detailed resource monitoring"
    else
        print_warning "Could not retrieve resource usage statistics"
    fi
}

# Function to generate test report
generate_test_report() {
    local test_end_time=$(date +%s)
    local test_duration=$((test_end_time - TEST_START_TIME))

    print_header "Test Results Summary"

    echo -e "${BLUE}📊 Test Statistics:${NC}"
    echo -e "   Total Tests: $TOTAL_TESTS"
    echo -e "   ${GREEN}Passed: $PASSED_TESTS${NC}"
    echo -e "   ${RED}Failed: $FAILED_TESTS${NC}"
    echo -e "   Success Rate: $(( PASSED_TESTS * 100 / TOTAL_TESTS ))%"
    echo -e "   Test Duration: ${test_duration}s"
    echo ""

    if [ $FAILED_TESTS -eq 0 ]; then
        echo -e "${GREEN}🎉 All tests passed! Backend services are healthy and properly configured.${NC}"
        echo ""
        echo -e "${CYAN}🔗 Service URLs:${NC}"
        echo -e "   • Backend API: http://localhost:8000"
        echo -e "   • API Documentation: http://localhost:8000/docs"
        echo -e "   • GeoServer: http://localhost:8082/geoserver"
        echo -e "   • Nginx Proxy: http://localhost"
        echo ""
        return 0
    else
        echo -e "${RED}❌ Some tests failed. Please check the services and configuration.${NC}"
        echo ""
        echo -e "${YELLOW}🔧 Troubleshooting:${NC}"
        echo -e "   • Check service logs: docker-compose logs -f [service_name]"
        echo -e "   • Restart services: docker-compose restart"
        echo -e "   • Check Docker resources: docker stats"
        echo -e "   • Verify environment: cat .env"
        echo ""
        return 1
    fi
}

# Main execution
main() {
    print_header "eStation Backend Services Comprehensive Test"
    echo -e "${CYAN}Starting comprehensive backend services testing...${NC}"
    echo -e "${CYAN}Timestamp: $(date)${NC}\n"

    # Change to backend directory if not already there
    if [ ! -f "docker-compose.yml" ]; then
        if [ -f "backend/docker-compose.yml" ]; then
            cd backend
            print_info "Changed to backend directory"
        else
            echo -e "${RED}Error: docker-compose.yml not found. Please run from project root or backend directory.${NC}"
            exit 1
        fi
    fi

    # Run all test phases
    check_docker
    validate_compose_config
    check_service_containers
    test_service_health
    test_inter_service_communication
    test_data_persistence
    test_network_connectivity
    test_performance_metrics

    # Generate final report
    generate_test_report
}

# Script execution
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi