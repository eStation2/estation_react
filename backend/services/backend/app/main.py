"""
eStation FastAPI Backend Application
Main application with CORS configuration for frontend integration
"""

import os
import logging
import asyncio
from contextlib import asynccontextmanager
from typing import List

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.security import HTTPBearer
from fastapi.responses import JSONResponse
import uvicorn

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Security
security = HTTPBearer()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    logger.info("🚀 eStation Backend Starting...")
    
    # Startup tasks
    # TODO: Initialize database connections
    # TODO: Initialize Redis connections
    # TODO: Setup Celery
    
    yield
    
    # Shutdown tasks
    logger.info("🛑 eStation Backend Shutting down...")

# Create FastAPI application
app = FastAPI(
    title="eStation Earth Observation Processing Service",
    description="Backend API for eStation with geospatial data processing capabilities",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS Configuration for Frontend Integration
# Allow frontend running on localhost:3000 to connect to Docker backend
ALLOWED_ORIGINS = [
    "http://localhost:3000",    # Next.js development server
    "https://localhost:3000",   # Next.js development server (HTTPS)
    "http://127.0.0.1:3000",    # Alternative localhost
    "https://127.0.0.1:3000",   # Alternative localhost (HTTPS)
]

# Add additional origins from environment variable
EXTRA_ORIGINS = os.getenv("CORS_ORIGINS", "").split(",")
ALLOWED_ORIGINS.extend([origin.strip() for origin in EXTRA_ORIGINS if origin.strip()])

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Trusted host middleware for security
ALLOWED_HOSTS = ["localhost", "127.0.0.1", "0.0.0.0"]
EXTRA_HOSTS = os.getenv("ALLOWED_HOSTS", "").split(",")
ALLOWED_HOSTS.extend([host.strip() for host in EXTRA_HOSTS if host.strip()])

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=ALLOWED_HOSTS
)

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring"""
    return {
        "status": "healthy",
        "message": "eStation Backend is running",
        "timestamp": "2024-01-01T00:00:00Z",
        "version": "1.0.0",
        "services": {
            "database": "unknown",  # TODO: Check database connection
            "redis": "unknown",     # TODO: Check Redis connection
            "geoserver": "unknown", # TODO: Check GeoServer connection
        }
    }

# Service monitoring endpoints
@app.get("/monitoring/services")
async def get_service_status():
    """Get status of all monitored services"""
    # TODO: Implement actual service monitoring
    return [
        {
            "name": "Eumetcast",
            "status": "healthy",
            "response_time": 45,
            "last_check": "2024-01-01T00:00:00Z"
        },
        {
            "name": "Internet Connectivity", 
            "status": "healthy",
            "response_time": 12,
            "last_check": "2024-01-01T00:00:00Z"
        },
        {
            "name": "Data Store",
            "status": "healthy", 
            "response_time": 8,
            "last_check": "2024-01-01T00:00:00Z"
        },
        {
            "name": "Processing Service",
            "status": "healthy",
            "response_time": 156,
            "last_check": "2024-01-01T00:00:00Z"
        }
    ]

# Authentication endpoints
@app.post("/auth/login")
async def login(credentials: dict):
    """User login endpoint"""
    # TODO: Implement actual authentication
    username = credentials.get("username")
    password = credentials.get("password")
    
    if not username or not password:
        raise HTTPException(status_code=400, detail="Username and password required")
    
    # Mock authentication for development
    if username == "admin" and password == "admin":
        return {
            "token": "mock_jwt_token_12345",
            "user": {
                "id": 1,
                "username": "admin",
                "email": "admin@estation.dev",
                "is_admin": True
            }
        }
    
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.post("/auth/logout")
async def logout():
    """User logout endpoint"""
    return {"message": "Logged out successfully"}

@app.post("/auth/refresh")
async def refresh_token():
    """Refresh JWT token"""
    # TODO: Implement actual token refresh
    return {"token": "refreshed_mock_jwt_token_67890"}

# Workspace management endpoints
@app.get("/workspaces")
async def get_workspaces():
    """Get user workspaces"""
    # TODO: Implement actual workspace retrieval from database
    return [
        {
            "id": "workspace-001",
            "name": "Default Workspace",
            "panels": [
                {
                    "id": "panel-001",
                    "type": "map",
                    "position": {"x": 0, "y": 0, "w": 6, "h": 4},
                    "config": {"center": [51.505, -0.09], "zoom": 13}
                },
                {
                    "id": "panel-002", 
                    "type": "graph",
                    "position": {"x": 6, "y": 0, "w": 6, "h": 4},
                    "config": {"chart_type": "timeseries"}
                }
            ],
            "created_at": "2024-01-01T00:00:00Z",
            "updated_at": "2024-01-01T00:00:00Z"
        }
    ]

@app.post("/workspaces")
async def create_workspace(workspace: dict):
    """Create new workspace"""
    # TODO: Implement actual workspace creation
    return {
        "id": "workspace-new",
        "name": workspace.get("name", "New Workspace"),
        "panels": workspace.get("panels", []),
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
    }

# Geospatial data endpoints
@app.get("/geospatial/datasets")
async def get_datasets():
    """Get available datasets"""
    # TODO: Implement actual dataset retrieval
    return [
        {
            "id": "dataset-001",
            "name": "MODIS Terra",
            "description": "MODIS data from Terra satellite",
            "temporal_coverage": "2000-present"
        }
    ]

@app.get("/geospatial/products")
async def get_products():
    """Get available products"""
    # TODO: Implement actual product retrieval
    return [
        {
            "id": "product-001",
            "name": "NDVI",
            "category": "Vegetation",
            "dataset_id": "dataset-001"
        }
    ]

@app.get("/geospatial/products/categories")
async def get_product_categories():
    """Get product categories for dashboard charts"""
    # TODO: Implement actual category statistics
    return [
        {"category": "Vegetation", "count": 45},
        {"category": "Land Cover", "count": 32},
        {"category": "Climate", "count": 28},
        {"category": "Atmosphere", "count": 15},
        {"category": "Ocean", "count": 12}
    ]

# Analytics endpoints for dashboard charts
@app.get("/analytics/dataset-completeness")
async def get_dataset_completeness():
    """Get dataset completeness metrics for charts"""
    # TODO: Implement actual completeness calculations
    return [
        {"date": "2024-01-01", "completeness": 98.5},
        {"date": "2024-01-02", "completeness": 97.2},
        {"date": "2024-01-03", "completeness": 99.1},
        {"date": "2024-01-04", "completeness": 96.8},
        {"date": "2024-01-05", "completeness": 98.9}
    ]

@app.get("/analytics/product-distribution")
async def get_product_distribution():
    """Get product distribution for pie charts"""
    # TODO: Implement actual distribution calculations
    total = 132
    return [
        {"category": "Vegetation", "count": 45, "percentage": 34.1},
        {"category": "Land Cover", "count": 32, "percentage": 24.2}, 
        {"category": "Climate", "count": 28, "percentage": 21.2},
        {"category": "Atmosphere", "count": 15, "percentage": 11.4},
        {"category": "Ocean", "count": 12, "percentage": 9.1}
    ]

# WebSocket endpoint for real-time updates
@app.websocket("/ws")
async def websocket_endpoint(websocket):
    """WebSocket endpoint for real-time service updates"""
    # TODO: Implement WebSocket connection handling
    await websocket.accept()
    try:
        while True:
            # Send periodic service updates
            await websocket.send_json({
                "type": "service_update",
                "data": {
                    "service_id": "eumetcast",
                    "service_name": "Eumetcast",
                    "status": "healthy",
                    "response_time": 45,
                    "timestamp": "2024-01-01T00:00:00Z"
                },
                "timestamp": "2024-01-01T00:00:00Z"
            })
            await asyncio.sleep(30)  # Send updates every 30 seconds
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
    finally:
        await websocket.close()

# Error handler
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Custom HTTP exception handler"""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.detail,
            "status_code": exc.status_code,
            "timestamp": "2024-01-01T00:00:00Z"
        }
    )

if __name__ == "__main__":
    # Development server
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )