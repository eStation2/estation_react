# eStation Docker Backend Services

This directory contains the Docker configuration for eStation's backend services, including PostgreSQL with PostGIS, Python API server, Redis, Celery workers, GeoServer, and Nginx reverse proxy.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Nginx (Reverse Proxy)                │
│                     SSL Termination & Load Balancing        │
└─────────────────────┬───────────────────────────────────────┘
                      │
         ┌────────────┼────────────┐
         │            │            │
         ▼            ▼            ▼
   ┌─────────┐  ┌──────────┐  ┌──────────┐
   │ FastAPI │  │GeoServer │  │ Static   │
   │   API   │  │   WMS    │  │  Files   │
   └─────────┘  └──────────┘  └──────────┘
         │            │
         ▼            ▼
   ┌─────────┐  ┌──────────┐
   │ Celery  │  │PostgreSQL│
   │ Worker  │  │ PostGIS  │
   └─────────┘  └──────────┘
         │
         ▼
   ┌─────────┐
   │  Redis  │
   │ Cache   │
   └─────────┘
```

## 🚀 Quick Start

### Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- At least 4GB RAM available for containers
- Ports 80, 443, 5432, 6379, 8000, 8080 available

### Start Services

```bash
# Development environment (with debugging tools)
./scripts/start.sh dev

# Production environment  
./scripts/start.sh prod

# Or manually:
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

### Stop Services

```bash
docker-compose down

# Stop and remove volumes (⚠️ data loss)
docker-compose down -v
```

## 🔧 Services Overview

### Core Services

| Service | Port | Purpose | Health Check |
|---------|------|---------|--------------|
| **nginx** | 80, 443 | Reverse proxy, SSL termination | `/health` |
| **backend** | 8000 | FastAPI application server | `/health` |
| **postgres** | 5432 | PostgreSQL with PostGIS | `pg_isready` |
| **redis** | 6379 | Cache and message broker | `redis-cli ping` |
| **geoserver** | 8080 | Geospatial data server (WMS/WFS) | `/geoserver/web` |

### Background Services

| Service | Purpose | Scaling |
|---------|---------|---------|
| **celery-worker** | Background task processing | Horizontal |
| **celery-beat** | Scheduled task management | Single instance |

### Development Tools (dev only)

| Service | Port | Purpose |
|---------|------|---------|
| **pgadmin** | 5050 | Database administration |
| **redis-commander** | 8081 | Redis data browser |

## 📁 Directory Structure

```
docker/
├── docker-compose.yml          # Main service definitions
├── docker-compose.dev.yml      # Development overrides
├── docker-compose.prod.yml     # Production overrides
├── .env                        # Environment variables
├── .env.example               # Environment template
├── scripts/
│   └── start.sh               # Service startup script
├── services/
│   ├── backend/
│   │   ├── Dockerfile         # Python API container
│   │   ├── requirements.txt   # Production dependencies
│   │   └── requirements-dev.txt # Development dependencies
│   ├── nginx/
│   │   ├── Dockerfile         # Nginx container
│   │   ├── nginx.conf         # Main nginx config
│   │   └── conf.d/
│   │       └── default.conf   # Site configuration
│   └── postgres/
│       └── init-scripts/
│           └── 01-init-db.sql # Database initialization
└── README.md                  # This file
```

## 🔐 Configuration

### Environment Variables

Copy `.env.example` to `.env` and customize:

```bash
cp .env.example .env
# Edit .env with your settings
```

Key variables:

```bash
# Database
POSTGRES_DB=estation
POSTGRES_USER=estation_user
POSTGRES_PASSWORD=secure_password

# Security (⚠️ Change in production!)
SECRET_KEY=your-super-secret-key
JWT_SECRET_KEY=jwt-secret-key

# Services
BACKEND_PORT=8000
GEOSERVER_PORT=8080
```

### SSL Certificates

For production, replace self-signed certificates:

```bash
# Place your certificates in:
docker/services/nginx/ssl/
├── nginx.crt    # SSL certificate
└── nginx.key    # Private key
```

## 🛠️ Development

### Hot Reloading

Development mode includes:
- Code hot reloading for backend
- Volume mounts for live code editing
- Debug logging enabled
- Direct port access to services

### Database Access

```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U estation_user -d estation

# View database with PgAdmin
# http://localhost:5050
# Email: admin@estation.dev
# Password: admin123
```

### Redis Access

```bash
# Connect to Redis CLI
docker-compose exec redis redis-cli -a dev_redis_123

# View Redis with Redis Commander
# http://localhost:8081
```

### Logs

```bash
# View all logs
docker-compose logs -f

# Specific service logs
docker-compose logs -f backend
docker-compose logs -f postgres
docker-compose logs -f celery-worker
```

## 📊 Monitoring

### Health Checks

All services include health checks:

```bash
# Check service health
docker-compose ps

# Detailed health status
docker inspect $(docker-compose ps -q backend) | jq '.[0].State.Health'
```

### Service Status

```bash
# API health endpoint
curl https://localhost/health

# GeoServer status
curl https://localhost/geoserver/web

# Direct backend health (dev mode)
curl http://localhost:8000/health
```

## 🚀 Production Deployment

### Resource Requirements

Minimum production requirements:
- **CPU**: 4 cores
- **RAM**: 8GB
- **Storage**: 100GB SSD
- **Network**: 100Mbps

### Security Checklist

- [ ] Update all default passwords
- [ ] Generate strong SECRET_KEY and JWT_SECRET_KEY
- [ ] Install proper SSL certificates
- [ ] Configure firewall rules
- [ ] Enable PostgreSQL SSL
- [ ] Set up log rotation
- [ ] Configure backup strategy

### Backup Strategy

```bash
# Database backup
docker-compose exec postgres pg_dump -U estation_user estation > backup.sql

# Full volume backup
docker run --rm -v estation_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres-data.tar.gz -C /data .
```

## 🐛 Troubleshooting

### Common Issues

**Services won't start:**
```bash
# Check Docker daemon
docker info

# Check port conflicts
netstat -tulpn | grep -E ':(80|443|5432|6379|8000|8080)'

# Check logs
docker-compose logs [service-name]
```

**Database connection issues:**
```bash
# Test database connection
docker-compose exec backend python -c "import asyncpg; print('AsyncPG imported successfully')"

# Check PostgreSQL logs
docker-compose logs postgres
```

**Memory issues:**
```bash
# Check container resource usage
docker stats

# Increase Docker Desktop memory allocation (macOS/Windows)
# Docker Desktop → Settings → Resources → Memory
```

### Performance Tuning

**PostgreSQL optimization:**
```bash
# Edit postgresql.conf in container
docker-compose exec postgres vi /var/lib/postgresql/data/postgresql.conf

# Key settings for performance:
shared_buffers = 256MB
effective_cache_size = 1GB
work_mem = 4MB
```

**Redis optimization:**
```bash
# Monitor Redis performance
docker-compose exec redis redis-cli --latency-history

# Check memory usage
docker-compose exec redis redis-cli info memory
```

## 📚 API Documentation

Once services are running:

- **Interactive API docs**: https://localhost/docs
- **OpenAPI JSON**: https://localhost/openapi.json
- **GeoServer admin**: https://localhost/geoserver/web

## 🤝 Contributing

1. Test changes with development environment
2. Ensure all health checks pass
3. Update documentation
4. Test production configuration
5. Submit pull request

## 📄 License

This Docker configuration is part of the eStation project and follows the same license terms.