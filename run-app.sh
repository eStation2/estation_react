#!/bin/bash

# eStation Application Runner Script
# This script starts or restarts the eStation frontend application

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Project paths
PROJECT_ROOT=""
FRONTEND_DIR="$PROJECT_ROOT/frontend"
LOG_FILE="$PROJECT_ROOT/app.log"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

print_error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

# Function to check if app is running
is_app_running() {
    pgrep -f "next dev" > /dev/null 2>&1
}

# Function to stop the app
stop_app() {
    print_status "Stopping eStation application..."
    pkill -f "next dev"
    sleep 2
    
    if is_app_running; then
        print_warning "Forcefully terminating application..."
        pkill -9 -f "next dev"
        sleep 1
    fi
    
    if ! is_app_running; then
        print_success "Application stopped successfully"
        return 0
    else
        print_error "Failed to stop application"
        return 1
    fi
}

# Function to start the app
start_app() {
    print_status "Starting eStation application..."
    
    # Check if frontend directory exists
    if [ ! -d "$FRONTEND_DIR" ]; then
        print_error "Frontend directory not found: $FRONTEND_DIR"
        exit 1
    fi
    
    # Change to frontend directory
    cd "$FRONTEND_DIR" || {
        print_error "Failed to change to frontend directory"
        exit 1
    }
    
    # Check if package.json exists
    if [ ! -f "package.json" ]; then
        print_error "package.json not found in frontend directory"
        exit 1
    fi
    
    # Install dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
        print_status "Installing dependencies..."
        npm install
        if [ $? -ne 0 ]; then
            print_error "Failed to install dependencies"
            exit 1
        fi
    fi
    
    # Start the application in background
    print_status "Launching Next.js development server..."
    nohup npm run dev > "$LOG_FILE" 2>&1 &
    
    # Wait a moment for the server to start
    sleep 3
    
    # Check if the server started successfully
    if is_app_running; then
        print_success "eStation application started successfully!"
        print_success "Application is running at: http://localhost:3000"
        print_success "Network access at: http://$(hostname -I | awk '{print $1}'):3000"
        print_status "Log file: $LOG_FILE"
        print_status "To view logs: tail -f $LOG_FILE"
    else
        print_error "Failed to start application"
        print_error "Check the log file for details: $LOG_FILE"
        exit 1
    fi
}

# Function to restart the app
restart_app() {
    print_status "Restarting eStation application..."
    stop_app
    sleep 1
    start_app
}

# Function to show status
show_status() {
    if is_app_running; then
        print_success "eStation application is running"
        print_status "PID: $(pgrep -f 'next dev')"
        print_status "Application URL: http://localhost:3000"
        print_status "Log file: $LOG_FILE"
    else
        print_warning "eStation application is not running"
    fi
}

# Function to show logs
show_logs() {
    if [ -f "$LOG_FILE" ]; then
        print_status "Showing last 50 lines of log file:"
        echo "----------------------------------------"
        tail -n 50 "$LOG_FILE"
        echo "----------------------------------------"
        print_status "To follow logs in real-time: tail -f $LOG_FILE"
    else
        print_warning "Log file not found: $LOG_FILE"
    fi
}

# Function to show help
show_help() {
    echo "eStation Application Runner"
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  start     Start the application"
    echo "  stop      Stop the application"
    echo "  restart   Restart the application"
    echo "  status    Show application status"
    echo "  logs      Show application logs"
    echo "  help      Show this help message"
    echo ""
    echo "If no command is provided, the script will start the application if it's not running,"
    echo "or restart it if it's already running."
    echo ""
    echo "Examples:"
    echo "  $0              # Start or restart the app"
    echo "  $0 start        # Start the app"
    echo "  $0 restart      # Restart the app"
    echo "  $0 status       # Check if app is running"
    echo "  $0 logs         # View recent logs"
}

# Main script logic
case "${1:-default}" in
    "start")
        if is_app_running; then
            print_warning "Application is already running"
            show_status
        else
            start_app
        fi
        ;;
    "stop")
        if is_app_running; then
            stop_app
        else
            print_warning "Application is not running"
        fi
        ;;
    "restart")
        restart_app
        ;;
    "status")
        show_status
        ;;
    "logs")
        show_logs
        ;;
    "help")
        show_help
        ;;
    "default")
        if is_app_running; then
            print_status "Application is running, restarting..."
            restart_app
        else
            print_status "Application is not running, starting..."
            start_app
        fi
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac