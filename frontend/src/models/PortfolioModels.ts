// Portfolio data models and interfaces

export interface ProductCategory {
  id: string;
  name: string;
  description: string;
  themeGroup: string;
  region: string[];
  products: Product[];
}

export interface Product {
  id: string;
  name: string;
  code: string;
  version: string;
  description: string;
  category: string;
  themeGroup: string;
  region: string[];
  status: ProductStatus;
  spatialResolution?: string;
  temporalResolution?: string;
  dataFormat: string[];
  lastUpdated: Date;
  provider: string;
  metadata: ProductMetadata;
}

export interface ProductMetadata {
  keywords: string[];
  license: string;
  documentation: string;
  apiEndpoint?: string;
  downloadUrl?: string;
}

export type ProductStatus = 'active' | 'inactive' | 'pending' | 'deprecated';

export interface PortfolioService {
  id: string;
  name: string;
  description: string;
  status: ServiceStatus;
  products: string[]; // Product IDs
  configuration: ServiceConfiguration;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceConfiguration {
  autoUpdate: boolean;
  notificationEmail?: string;
  qualityThreshold: number;
  retentionPeriod: number; // days
  processingSchedule: ProcessingSchedule;
}

export interface ProcessingSchedule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'on-demand';
  time?: string; // HH:MM format
  dayOfWeek?: number; // 0-6, Sunday=0
  dayOfMonth?: number; // 1-31
}

export type ServiceStatus = 'active' | 'inactive' | 'pending' | 'error';

export interface PortfolioFilter {
  searchTerm: string;
  selectedThemes: string[];
  selectedCategories: string[];
  selectedRegions: string[];
  showActiveOnly: boolean;
}

export interface PortfolioStats {
  totalServices: number;
  totalProducts: number;
  activeServices: number;
  activeProducts: number;
  productCategories: number;
  storageUsed: number; // in GB
  lastSyncTime: Date;
}

// Mock data for all 10 product categories
export const mockProductCategories: ProductCategory[] = [
  {
    id: 'vegetation',
    name: 'Vegetation',
    description: 'Vegetation monitoring and analysis products',
    themeGroup: 'Vegetation',
    region: ['Global', 'Africa'],
    products: [
      {
        id: 'ndvi-product',
        name: 'NDVI - Normalized Difference Vegetation Index',
        code: 'VGT-NDVI-1KM',
        version: 'v2.1',
        description: 'Vegetation index for monitoring plant health and coverage',
        category: 'vegetation',
        themeGroup: 'Vegetation',
        region: ['Global'],
        status: 'active',
        spatialResolution: '1km',
        temporalResolution: 'Daily',
        dataFormat: ['NetCDF', 'GeoTIFF'],
        lastUpdated: new Date('2024-01-15'),
        provider: 'EUMETSAT',
        metadata: {
          keywords: ['vegetation', 'ndvi', 'monitoring'],
          license: 'CC BY 4.0',
          documentation: 'https://docs.estation.eu/vegetation/ndvi',
          apiEndpoint: '/api/products/vegetation/ndvi',
          downloadUrl: '/download/vegetation/ndvi'
        }
      },
      {
        id: 'lai-product',
        name: 'LAI - Leaf Area Index',
        code: 'VGT-LAI-1KM',
        version: 'v1.8',
        description: 'Leaf area index for vegetation density assessment',
        category: 'vegetation',
        themeGroup: 'Vegetation',
        region: ['Global', 'Africa'],
        status: 'active',
        spatialResolution: '1km',
        temporalResolution: 'Daily',
        dataFormat: ['NetCDF', 'HDF5'],
        lastUpdated: new Date('2024-01-12'),
        provider: 'EUMETSAT',
        metadata: {
          keywords: ['vegetation', 'lai', 'density'],
          license: 'CC BY 4.0',
          documentation: 'https://docs.estation.eu/vegetation/lai'
        }
      }
    ]
  },
  {
    id: 'fire',
    name: 'Fire',
    description: 'Fire monitoring and burned area products',
    themeGroup: 'Fire',
    region: ['Global', 'Africa', 'Europe'],
    products: [
      {
        id: 'fire-alerts-product',
        name: 'Fire Alerts',
        code: 'FIRE-ALERT-1KM',
        version: 'v3.0',
        description: 'Real-time fire detection and alerts',
        category: 'fire',
        themeGroup: 'Fire',
        region: ['Global'],
        status: 'active',
        spatialResolution: '1km',
        temporalResolution: 'Hourly',
        dataFormat: ['JSON', 'GeoJSON', 'NetCDF'],
        lastUpdated: new Date('2024-01-16'),
        provider: 'EUMETSAT',
        metadata: {
          keywords: ['fire', 'alerts', 'real-time'],
          license: 'CC BY 4.0',
          documentation: 'https://docs.estation.eu/fire/alerts'
        }
      }
    ]
  },
  {
    id: 'precipitation-monitoring',
    name: 'Precipitation (Monitoring)',
    description: 'Real-time precipitation monitoring products',
    themeGroup: 'Precipitation (Monitoring)',
    region: ['Global', 'Africa'],
    products: [
      {
        id: 'rainfall-estimates',
        name: 'Rainfall Estimates',
        code: 'PRECIP-RF-10KM',
        version: 'v4.2',
        description: 'Satellite-based rainfall estimates',
        category: 'precipitation-monitoring',
        themeGroup: 'Precipitation (Monitoring)',
        region: ['Global', 'Africa'],
        status: 'active',
        spatialResolution: '10km',
        temporalResolution: '3-hourly',
        dataFormat: ['NetCDF', 'GeoTIFF'],
        lastUpdated: new Date('2024-01-14'),
        provider: 'EUMETSAT',
        metadata: {
          keywords: ['precipitation', 'rainfall', 'monitoring'],
          license: 'CC BY 4.0',
          documentation: 'https://docs.estation.eu/precipitation/rainfall'
        }
      }
    ]
  },
  {
    id: 'precipitation-forecast',
    name: 'Precipitation (Forecast)',
    description: 'Precipitation forecast products',
    themeGroup: 'Precipitation (Forecast)',
    region: ['Global', 'Africa', 'Europe'],
    products: [
      {
        id: 'precipitation-forecast-7day',
        name: '7-Day Precipitation Forecast',
        code: 'PRECIP-FC-7D-25KM',
        version: 'v2.3',
        description: 'Seven-day precipitation forecast',
        category: 'precipitation-forecast',
        themeGroup: 'Precipitation (Forecast)',
        region: ['Global'],
        status: 'active',
        spatialResolution: '25km',
        temporalResolution: 'Daily',
        dataFormat: ['NetCDF', 'GRIB2'],
        lastUpdated: new Date('2024-01-13'),
        provider: 'ECMWF',
        metadata: {
          keywords: ['precipitation', 'forecast', 'weather'],
          license: 'CC BY-NC 4.0',
          documentation: 'https://docs.estation.eu/precipitation/forecast'
        }
      }
    ]
  },
  {
    id: 'temperature-monitoring',
    name: 'Temperature (Monitoring)',
    description: 'Real-time temperature monitoring products',
    themeGroup: 'Temperature (Monitoring)',
    region: ['Global', 'Africa'],
    products: [
      {
        id: 'land-surface-temp',
        name: 'Land Surface Temperature',
        code: 'TEMP-LST-1KM',
        version: 'v3.1',
        description: 'Land surface temperature from satellite observations',
        category: 'temperature-monitoring',
        themeGroup: 'Temperature (Monitoring)',
        region: ['Global'],
        status: 'active',
        spatialResolution: '1km',
        temporalResolution: 'Daily',
        dataFormat: ['NetCDF', 'GeoTIFF'],
        lastUpdated: new Date('2024-01-15'),
        provider: 'EUMETSAT',
        metadata: {
          keywords: ['temperature', 'land surface', 'monitoring'],
          license: 'CC BY 4.0',
          documentation: 'https://docs.estation.eu/temperature/lst'
        }
      }
    ]
  },
  {
    id: 'temperature-forecast',
    name: 'Temperature (Forecast)',
    description: 'Temperature forecast products',
    themeGroup: 'Temperature (Forecast)',
    region: ['Global', 'Europe'],
    products: [
      {
        id: 'temp-forecast-5day',
        name: '5-Day Temperature Forecast',
        code: 'TEMP-FC-5D-25KM',
        version: 'v2.0',
        description: 'Five-day temperature forecast',
        category: 'temperature-forecast',
        themeGroup: 'Temperature (Forecast)',
        region: ['Global'],
        status: 'pending',
        spatialResolution: '25km',
        temporalResolution: 'Daily',
        dataFormat: ['NetCDF', 'GRIB2'],
        lastUpdated: new Date('2024-01-10'),
        provider: 'ECMWF',
        metadata: {
          keywords: ['temperature', 'forecast', 'weather'],
          license: 'CC BY-NC 4.0',
          documentation: 'https://docs.estation.eu/temperature/forecast'
        }
      }
    ]
  },
  {
    id: 'continental-water',
    name: 'Continental Water',
    description: 'Water body monitoring and analysis products',
    themeGroup: 'Continental Water',
    region: ['Global', 'Africa'],
    products: [
      {
        id: 'water-level-monitoring',
        name: 'Water Level Monitoring',
        code: 'WATER-LEVEL-1KM',
        version: 'v1.5',
        description: 'Surface water level monitoring',
        category: 'continental-water',
        themeGroup: 'Continental Water',
        region: ['Africa'],
        status: 'active',
        spatialResolution: '1km',
        temporalResolution: 'Weekly',
        dataFormat: ['NetCDF', 'GeoTIFF'],
        lastUpdated: new Date('2024-01-11'),
        provider: 'EUMETSAT',
        metadata: {
          keywords: ['water', 'level', 'monitoring'],
          license: 'CC BY 4.0',
          documentation: 'https://docs.estation.eu/water/level'
        }
      }
    ]
  },
  {
    id: 'oceanography',
    name: 'Oceanography',
    description: 'Ocean monitoring and analysis products',
    themeGroup: 'Oceanography',
    region: ['Global'],
    products: [
      {
        id: 'sea-surface-temp',
        name: 'Sea Surface Temperature',
        code: 'OCEAN-SST-4KM',
        version: 'v2.8',
        description: 'Sea surface temperature from satellite observations',
        category: 'oceanography',
        themeGroup: 'Oceanography',
        region: ['Global'],
        status: 'active',
        spatialResolution: '4km',
        temporalResolution: 'Daily',
        dataFormat: ['NetCDF', 'HDF5'],
        lastUpdated: new Date('2024-01-16'),
        provider: 'EUMETSAT',
        metadata: {
          keywords: ['ocean', 'temperature', 'sst'],
          license: 'CC BY 4.0',
          documentation: 'https://docs.estation.eu/ocean/sst'
        }
      }
    ]
  },
  {
    id: 'various',
    name: 'Various',
    description: 'Miscellaneous environmental products',
    themeGroup: 'Various',
    region: ['Global', 'Africa'],
    products: [
      {
        id: 'aerosol-optical-depth',
        name: 'Aerosol Optical Depth',
        code: 'VAR-AOD-10KM',
        version: 'v1.2',
        description: 'Atmospheric aerosol optical depth',
        category: 'various',
        themeGroup: 'Various',
        region: ['Global'],
        status: 'inactive',
        spatialResolution: '10km',
        temporalResolution: 'Daily',
        dataFormat: ['NetCDF'],
        lastUpdated: new Date('2023-12-15'),
        provider: 'EUMETSAT',
        metadata: {
          keywords: ['aerosol', 'atmosphere', 'optical depth'],
          license: 'CC BY 4.0',
          documentation: 'https://docs.estation.eu/various/aod'
        }
      }
    ]
  },
  {
    id: 'miscellaneous',
    name: 'Miscellaneous',
    description: 'Other environmental monitoring products',
    themeGroup: 'Miscellaneous',
    region: ['Global'],
    products: [
      {
        id: 'snow-cover',
        name: 'Snow Cover',
        code: 'MISC-SNOW-1KM',
        version: 'v1.0',
        description: 'Snow cover extent and depth',
        category: 'miscellaneous',
        themeGroup: 'Miscellaneous',
        region: ['Global', 'Europe'],
        status: 'pending',
        spatialResolution: '1km',
        temporalResolution: 'Daily',
        dataFormat: ['NetCDF', 'GeoTIFF'],
        lastUpdated: new Date('2024-01-08'),
        provider: 'EUMETSAT',
        metadata: {
          keywords: ['snow', 'cover', 'winter'],
          license: 'CC BY 4.0',
          documentation: 'https://docs.estation.eu/misc/snow'
        }
      }
    ]
  }
];

// Mock portfolio services
export const mockPortfolioServices: PortfolioService[] = [
  {
    id: 'vegetation-service',
    name: 'Vegetation Monitoring Service',
    description: 'Comprehensive vegetation monitoring and analysis',
    status: 'active',
    products: ['ndvi-product', 'lai-product'],
    configuration: {
      autoUpdate: true,
      notificationEmail: 'admin@estation.eu',
      qualityThreshold: 85,
      retentionPeriod: 365,
      processingSchedule: {
        frequency: 'daily',
        time: '02:00'
      }
    },
    createdAt: new Date('2023-06-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'fire-service',
    name: 'Fire Monitoring Service',
    description: 'Real-time fire detection and monitoring',
    status: 'active',
    products: ['fire-alerts-product'],
    configuration: {
      autoUpdate: true,
      qualityThreshold: 95,
      retentionPeriod: 180,
      processingSchedule: {
        frequency: 'daily',
        time: '01:00'
      }
    },
    createdAt: new Date('2023-07-01'),
    updatedAt: new Date('2024-01-16')
  },
  {
    id: 'precipitation-service',
    name: 'Precipitation Monitoring Service',
    description: 'Rainfall monitoring and drought assessment',
    status: 'active',
    products: ['rainfall-estimates'],
    configuration: {
      autoUpdate: true,
      qualityThreshold: 80,
      retentionPeriod: 730,
      processingSchedule: {
        frequency: 'daily',
        time: '03:00'
      }
    },
    createdAt: new Date('2023-08-01'),
    updatedAt: new Date('2024-01-14')
  }
];