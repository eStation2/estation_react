
# README.md

# eStation Earth Observation Processing Service - Development Guide

## 🎯 Project Overview
eStation is a comprehensive Earth Observation Processing Service built with Next.js 15.3.5, TypeScript 5.x, and MVVM architecture. It features advanced workspace management with React Grid Layout, data visualization using Apache ECharts, multi-language support (English/French), and integrated mapping with OpenLayers.

### Technology Stack
- **Frontend**: Next.js 15.3.5 with Turbopack, TypeScript 5.x, Tailwind CSS, React Grid Layout 1.5.2
- **UI Components**: Shadcn UI (accessible component library), Lucide React (icons). Replace with Material UI (component library), React Icons, Material Icons (MUI Icons).
- **State Management**: Zustand (lightweight store), TanStack Query v5 (data fetching)
- **Forms & Validation**: React Hook Form + Zod (type-safe form handling)
- **Visualization**: Apache ECharts 5.6.0, OpenLayers 10.x for mapping
- **Real-time**: Socket.io-client (WebSocket connections)
- **Utilities**: date-fns (date handling), jsPDF (PDF generation)
- **Testing**: Jest, React Testing Library
- **Monitoring**: Sentry for error tracking and performance monitoring
- **Backend**: Python 3.12+ with FastAPI, PostgreSQL 17 + PostGIS, Redis, Celery, GeoServer
- **Infrastructure**: Docker-based microservices architecture with Nginx reverse proxy
- **Architecture**: MVVM pattern with Zustand state management

## 🛠️ Development Commands

### Essential Commands
```bash
# Frontend development
cd frontend
npm install              # Install dependencies
npm run dev              # Start development server with Turbopack
npm run build            # Build production version
npm run start            # Start production server
npm run lint             # Run ESLint

# Application management
./run-app.sh start       # Start application
./run-app.sh stop        # Stop application  
./run-app.sh restart     # Restart application
./run-app.sh status      # Check status
./run-app.sh logs        # View logs

# Testing with MCP servers
./tests/setup-test-env.sh    # Setup test environment (directories + config)
./tests/scripts/run-tests.js # Run comprehensive test suite

# Backend Services
cd backend
./scripts/start.sh dev   # Start development backend services
./scripts/start.sh prod  # Start production backend services
./quick-health-check.sh  # Quick health verification of all services
./test-services.sh       # Comprehensive service testing and validation
docker-compose ps        # Check service status
docker-compose logs -f   # View service logs
docker-compose down      # Stop all services

# Hybrid Development (Recommended)
./start-hybrid-dev.sh    # Start backend + frontend setup instructions
```


## 🏗️ Architecture Overview

### Full Stack Architecture
```
Frontend (Next.js)          Backend Services (Docker)
┌─────────────────┐        ┌─────────────────────────────┐
│     Next.js     │   →    │    Nginx (Reverse Proxy)   │
│   React App     │        │      SSL + Load Balancer   │
└─────────────────┘        └─────────────┬───────────────┘
                                         │
                           ┌─────────────┼───────────────┐
                           │             │               │
                           ▼             ▼               ▼
                    ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
                    │   FastAPI   │ │  GeoServer  │ │  Frontend   │
                    │     API     │ │  WMS/WFS    │ │   Static    │
                    └─────────────┘ └─────────────┘ └─────────────┘
                           │             │
                           ▼             ▼
                    ┌─────────────┐ ┌─────────────┐
                    │   Celery    │ │ PostgreSQL  │
                    │   Worker    │ │   PostGIS   │
                    └─────────────┘ └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │    Redis    │
                    │   Cache     │
                    └─────────────┘
```

### Frontend MVVM Structure
```
frontend/src/
├── components/          # View layer - React components
│   ├── workspace/       # Analysis workspace components
│   ├── panels/          # MapPanel, GraphPanel components
│   └── ui/              # Shadcn UI components and reusable components
├── stores/              # Zustand state management stores
├── hooks/               # Custom React hooks (React Query, form hooks)
├── lib/                 # Utility functions and configurations
├── models/              # Data structures and Zod schemas
├── contexts/            # React Context providers (legacy, migrating to Zustand)
├── services/            # API services (with TanStack Query integration)
└── styles/              # Global styles and CSS modules
```

### Backend Services Structure
```
backend/
├── services/
│   ├── backend/         # FastAPI application
│   ├── nginx/           # Reverse proxy configuration
│   ├── postgres/        # Database initialization
│   └── geoserver/       # Geospatial data configuration
├── docker-compose.yml   # Main service orchestration
├── docker-compose.dev.yml   # Development overrides
├── docker-compose.prod.yml  # Production overrides
└── .env                 # Environment configuration
```


### UI Component Migration Status
✅ **Shadcn UI Migration Complete** 
All frontend components have been migrated from custom styling to Shadcn UI:

**Core Components Migrated:**
- `ServiceButton.tsx` - Button + DropdownMenu components
- `Header.tsx` - Button variants + Select component for language switching
- `HamburgerMenu.tsx` - DropdownMenu with proper semantic structure
- `Analysis.tsx` - Button variants for workspace management
- `SystemSettings.tsx` - Input, Switch, Label, Select components
- `Help.tsx` - Enhanced Card structure with Button components
- `Dashboard.tsx` - Professional Card implementations for charts
- `Panel.tsx` - Complete Card-based restructure (ExtJS → Shadcn)
- `MapPanel.tsx` - Card overlays, Checkbox + Label for products
- `GraphPanel.tsx` - Select dropdowns, Input fields, Card statistics


## 🐳 Backend Services Architecture

### Service Architecture
The backend uses a microservices architecture with 6 main services:

| Service | Purpose | Technology | Ports |
|---------|---------|------------|-------|
| **nginx** | Reverse proxy, SSL termination, load balancing | Nginx Alpine | 80, 443 |
| **backend** | FastAPI application server with async support | Python 3.12 + FastAPI | 8000 |
| **postgres** | Database with geospatial extensions | PostgreSQL 17 + PostGIS 3.5 | 5432 |
| **redis** | Caching, sessions, message broker | Redis 7 Alpine | 6379 |
| **celery-worker** | Background task processing | Python 3.12 + Celery | - |
| **geoserver** | Geospatial data server (WMS/WFS/WCS) | GeoServer 2.25 | 8080 |

### Development vs Production
- **Development**: Includes debugging tools (PgAdmin, Redis Commander), hot reloading, direct port access
- **Production**: Resource limits, optimized configurations, SSL certificates, monitoring

### Service URLs (Development)
```bash
# Frontend Application
http://localhost:3000           # Next.js frontend (npm run dev)

# Backend API (via Nginx proxy)
https://localhost/api/          # FastAPI backend API
https://localhost/geoserver/    # GeoServer web interface
https://localhost/docs          # OpenAPI documentation

# Development tools (dev mode only)
http://localhost:5050           # PgAdmin (database admin)
http://localhost:8081           # Redis Commander
http://localhost:8000           # Direct backend access
http://localhost:8080           # Direct GeoServer access
```

## 🔗 Frontend-Backend Integration

### Hybrid Development Workflow (Recommended)
eStation uses a hybrid development approach where:
- **Backend services** run in Docker containers (PostgreSQL, Redis, FastAPI, etc.)
- **Frontend** runs standalone via Next.js development server
- **Communication** happens via HTTP/WebSocket APIs with CORS enabled

### Quick Start
```bash
# 1. Start backend services and get frontend instructions
./start-hybrid-dev.sh

# 2. In a new terminal, start frontend
cd frontend
npm install
npm run dev

# 3. Access application at http://localhost:3000
```
