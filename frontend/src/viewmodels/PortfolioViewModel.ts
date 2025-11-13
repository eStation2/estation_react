import { useState, useEffect } from 'react';

// Models for Portfolio data
export interface Dataset {
  id: string;
  name: string;
  category: string;
  size: string;
  lastUpdated: Date;
  status: 'active' | 'inactive' | 'processing';
}

export interface PortfolioStats {
  totalDatasets: number;
  totalDataSize: string;
  categories: number;
  availability: number;
}

export interface PortfolioViewModelState {
  datasets: Dataset[];
  stats: PortfolioStats;
  searchQuery: string;
  selectedCategory: string;
  loading: boolean;
  error: string | null;
}

export const usePortfolioViewModel = (): PortfolioViewModelState & {
  refreshData: () => void;
  searchDatasets: (query: string) => void;
  filterByCategory: (category: string) => void;
  getFilteredDatasets: () => Dataset[];
} => {
  const [state, setState] = useState<PortfolioViewModelState>({
    datasets: [
      {
        id: '1',
        name: 'Vegetation Monitoring Data',
        category: 'Vegetation',
        size: '2.5 TB',
        lastUpdated: new Date('2024-01-15'),
        status: 'active'
      },
      {
        id: '2',
        name: 'Climate Forecast Models',
        category: 'Climate',
        size: '1.8 TB',
        lastUpdated: new Date('2024-01-14'),
        status: 'active'
      },
      {
        id: '3',
        name: 'Precipitation Analysis',
        category: 'Weather',
        size: '3.2 TB',
        lastUpdated: new Date('2024-01-13'),
        status: 'processing'
      },
      {
        id: '4',
        name: 'Temperature Records',
        category: 'Climate',
        size: '1.1 TB',
        lastUpdated: new Date('2024-01-12'),
        status: 'active'
      },
      {
        id: '5',
        name: 'Satellite Imagery',
        category: 'Remote Sensing',
        size: '15.7 TB',
        lastUpdated: new Date('2024-01-11'),
        status: 'active'
      }
    ],
    stats: {
      totalDatasets: 150,
      totalDataSize: '25TB',
      categories: 12,
      availability: 98
    },
    searchQuery: '',
    selectedCategory: 'all',
    loading: false,
    error: null
  });

  // Business Logic: Load portfolio data
  const loadPortfolioData = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In real app, this would fetch from backend
      setState(prev => ({ ...prev, loading: false }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load portfolio data',
        loading: false
      }));
    }
  };

  // Business Logic: Search datasets
  const searchDatasets = (query: string) => {
    setState(prev => ({ ...prev, searchQuery: query }));
  };

  // Business Logic: Filter by category
  const filterByCategory = (category: string) => {
    setState(prev => ({ ...prev, selectedCategory: category }));
  };

  // Business Logic: Get filtered datasets
  const getFilteredDatasets = (): Dataset[] => {
    let filtered = state.datasets;

    // Apply search filter
    if (state.searchQuery) {
      filtered = filtered.filter(dataset =>
        dataset.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        dataset.category.toLowerCase().includes(state.searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (state.selectedCategory !== 'all') {
      filtered = filtered.filter(dataset => dataset.category === state.selectedCategory);
    }

    return filtered;
  };

  useEffect(() => {
    loadPortfolioData();
  }, []);

  const refreshData = () => {
    loadPortfolioData();
  };

  return {
    ...state,
    refreshData,
    searchDatasets,
    filterByCategory,
    getFilteredDatasets
  };
};