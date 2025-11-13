-- Initialize eStation database with PostGIS extensions and initial schema

-- Enable PostGIS extensions
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;
CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;
CREATE EXTENSION IF NOT EXISTS postgis_tiger_geocoder;
CREATE EXTENSION IF NOT EXISTS uuid-ossp;

-- Create schemas
CREATE SCHEMA IF NOT EXISTS estation;
CREATE SCHEMA IF NOT EXISTS geospatial;
CREATE SCHEMA IF NOT EXISTS monitoring;

-- Set search path
ALTER DATABASE estation SET search_path TO estation, geospatial, monitoring, public, postgis;

-- Create initial tables
CREATE TABLE IF NOT EXISTS estation.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS estation.workspaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    owner_id UUID REFERENCES estation.users(id) ON DELETE CASCADE,
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    config JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS estation.panels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES estation.workspaces(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('map', 'graph')),
    title VARCHAR(255),
    position JSONB DEFAULT '{}',
    config JSONB DEFAULT '{}',
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Geospatial tables
CREATE TABLE IF NOT EXISTS geospatial.datasets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    source_url TEXT,
    bbox GEOMETRY(POLYGON, 4326),
    temporal_start TIMESTAMP WITH TIME ZONE,
    temporal_end TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS geospatial.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dataset_id UUID REFERENCES geospatial.datasets(id) ON DELETE CASCADE,
    product_code VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    processing_level VARCHAR(50),
    spatial_resolution FLOAT,
    temporal_resolution VARCHAR(50),
    bands JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Monitoring tables
CREATE TABLE IF NOT EXISTS monitoring.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    url TEXT,
    status VARCHAR(50) DEFAULT 'unknown',
    last_check TIMESTAMP WITH TIME ZONE,
    response_time_ms INTEGER,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS monitoring.service_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID REFERENCES monitoring.services(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    response_time_ms INTEGER,
    error_message TEXT,
    checked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_workspaces_owner_id ON estation.workspaces(owner_id);
CREATE INDEX IF NOT EXISTS idx_panels_workspace_id ON estation.panels(workspace_id);
CREATE INDEX IF NOT EXISTS idx_panels_type ON estation.panels(type);
CREATE INDEX IF NOT EXISTS idx_products_dataset_id ON geospatial.products(dataset_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON geospatial.products(category);
CREATE INDEX IF NOT EXISTS idx_datasets_bbox ON geospatial.datasets USING GIST(bbox);
CREATE INDEX IF NOT EXISTS idx_services_type ON monitoring.services(type);
CREATE INDEX IF NOT EXISTS idx_services_status ON monitoring.services(status);
CREATE INDEX IF NOT EXISTS idx_service_logs_service_id ON monitoring.service_logs(service_id);
CREATE INDEX IF NOT EXISTS idx_service_logs_checked_at ON monitoring.service_logs(checked_at);

-- Insert initial data
INSERT INTO monitoring.services (name, type, url, status) VALUES
('Eumetcast', 'data_ingestion', 'http://eumetcast.example.com', 'unknown'),
('Internet Connectivity', 'network', 'http://8.8.8.8', 'unknown'),
('Data Store', 'storage', 'file:///data/store', 'unknown'),
('Processing Service', 'compute', 'http://processing.internal', 'unknown')
ON CONFLICT DO NOTHING;

-- Create update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON estation.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_workspaces_updated_at BEFORE UPDATE ON estation.workspaces FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_panels_updated_at BEFORE UPDATE ON estation.panels FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_datasets_updated_at BEFORE UPDATE ON geospatial.datasets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON geospatial.products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON monitoring.services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();