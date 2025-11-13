import { useState, useEffect } from 'react';

// Models for Acquisition data
export interface AcquisitionSource {
  id: string;
  name: string;
  type: 'satellite' | 'ground' | 'model';
  status: 'active' | 'inactive' | 'maintenance';
  lastData: Date;
  coverage: number;
  dataQuality: 'excellent' | 'good' | 'fair' | 'poor';
}

export interface AcquisitionStats {
  dailyCoverage: number;
  dataQuality: string;
  processingTime: string;
  activeSources: number;
}

export interface AcquisitionViewModelState {
  sources: AcquisitionSource[];
  stats: AcquisitionStats;
  loading: boolean;
  error: string | null;
  lastRefresh: Date | null;
}

export const useAcquisitionViewModel = (): AcquisitionViewModelState & {
  refreshData: () => void;
  toggleSourceStatus: (sourceId: string) => void;
  getActiveSourcesCount: () => number;
} => {
  const [state, setState] = useState<AcquisitionViewModelState>({
    sources: [
      {
        id: '1',
        name: 'Sentinel-2 MSI Data',
        type: 'satellite',
        status: 'active',
        lastData: new Date(),
        coverage: 98.5,
        dataQuality: 'excellent'
      },
      {
        id: '2',
        name: 'MODIS Terra/Aqua',
        type: 'satellite',
        status: 'active',
        lastData: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        coverage: 95.2,
        dataQuality: 'good'
      },
      {
        id: '3',
        name: 'Landsat-8/9 OLI',
        type: 'satellite',
        status: 'maintenance',
        lastData: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
        coverage: 0,
        dataQuality: 'poor'
      },
      {
        id: '4',
        name: 'VIIRS NPP/NOAA-20',
        type: 'satellite',
        status: 'active',
        lastData: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        coverage: 92.8,
        dataQuality: 'excellent'
      }
    ],
    stats: {
      dailyCoverage: 98.5,
      dataQuality: 'Excellent',
      processingTime: 'Less than 2 hours',
      activeSources: 3
    },
    loading: false,
    error: null,
    lastRefresh: new Date()
  });

  // Business Logic: Load acquisition data
  const loadAcquisitionData = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Calculate dynamic stats
      const activeSources = state.sources.filter(s => s.status === 'active');
      const avgCoverage = activeSources.reduce((acc, s) => acc + s.coverage, 0) / activeSources.length;
      
      setState(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          dailyCoverage: avgCoverage,
          activeSources: activeSources.length
        },
        loading: false,
        lastRefresh: new Date()
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load acquisition data',
        loading: false
      }));
    }
  };

  // Business Logic: Toggle source status
  const toggleSourceStatus = (sourceId: string) => {
    setState(prev => ({
      ...prev,
      sources: prev.sources.map(source =>
        source.id === sourceId
          ? { 
              ...source, 
              status: source.status === 'active' ? 'inactive' : 'active',
              lastData: source.status === 'inactive' ? new Date() : source.lastData
            }
          : source
      )
    }));
  };

  // Business Logic: Get active sources count
  const getActiveSourcesCount = (): number => {
    return state.sources.filter(source => source.status === 'active').length;
  };

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(loadAcquisitionData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    loadAcquisitionData();
  }, []);

  const refreshData = () => {
    loadAcquisitionData();
  };

  return {
    ...state,
    refreshData,
    toggleSourceStatus,
    getActiveSourcesCount
  };
};