import { useState, useEffect } from 'react';

// Models for Dashboard data
export interface ChartDataPoint {
  value: number;
  name: string;
  itemStyle: { color: string };
}

export interface ServiceStatus {
  name: string;
  isActive: boolean;
}

export interface DashboardViewModelState {
  archiveStatusData: ChartDataPoint[];
  productsCategoryData: ChartDataPoint[];
  serviceStatuses: ServiceStatus[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export const useDashboardViewModel = (): DashboardViewModelState & {
  refreshData: () => void;
  updateServiceStatus: (serviceName: string, isActive: boolean) => void;
} => {
  const [state, setState] = useState<DashboardViewModelState>({
    archiveStatusData: [
      { value: 75, name: 'Present', itemStyle: { color: '#8BC34A' } },
      { value: 25, name: 'Missing', itemStyle: { color: '#2196F3' } }
    ],
    productsCategoryData: [
      { value: 20, name: 'Vegetation', itemStyle: { color: '#8BC34A' } },
      { value: 15, name: 'Temperature (Forecast)', itemStyle: { color: '#4CAF50' } },
      { value: 12, name: 'Precipitation (Monitoring)', itemStyle: { color: '#F44336' } },
      { value: 10, name: 'Continental Water', itemStyle: { color: '#2196F3' } },
      { value: 8, name: 'Precipitation (Forecast)', itemStyle: { color: '#FF9800' } },
      { value: 8, name: 'Temperature (Monitoring)', itemStyle: { color: '#FFD700' } },
      { value: 5, name: 'Various', itemStyle: { color: '#9C27B0' } }
    ],
    serviceStatuses: [
      { name: 'Eumetcast', isActive: true },
      { name: 'Internet', isActive: true },
      { name: 'Data Store', isActive: false },
      { name: 'Ingestion', isActive: true },
      { name: 'Processing', isActive: false },
      { name: 'System', isActive: true }
    ],
    loading: false,
    error: null,
    lastUpdated: new Date()
  });

  // Business Logic: Load dashboard data
  const loadDashboardData = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      // Simulate API call - in real app this would fetch from backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update with fresh data
      setState(prev => ({
        ...prev,
        loading: false,
        lastUpdated: new Date()
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load dashboard data',
        loading: false
      }));
    }
  };

  // Business Logic: Update service status
  const updateServiceStatus = (serviceName: string, isActive: boolean) => {
    setState(prev => ({
      ...prev,
      serviceStatuses: prev.serviceStatuses.map(service =>
        service.name === serviceName ? { ...service, isActive } : service
      ),
      lastUpdated: new Date()
    }));
  };

  // Business Logic: Auto-refresh data
  useEffect(() => {
    const interval = setInterval(loadDashboardData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const refreshData = () => {
    loadDashboardData();
  };

  return {
    ...state,
    refreshData,
    updateServiceStatus
  };
};