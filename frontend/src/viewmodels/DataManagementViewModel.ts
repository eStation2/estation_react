import { useState, useEffect } from 'react';

// Models for Data Management
export interface StorageInfo {
  totalCapacity: string;
  usedSpace: string;
  availableSpace: string;
  usageRate: number;
}

export interface DataCategory {
  name: string;
  size: string;
  percentage: number;
}

export interface ManagementFeature {
  title: string;
  description: string;
  status: 'active' | 'inactive' | 'maintenance';
}

export interface DataManagementViewModelState {
  storageInfo: StorageInfo;
  dataCategories: DataCategory[];
  features: ManagementFeature[];
  loading: boolean;
  error: string | null;
  lastBackup: Date;
  integrityChecks: number;
}

export const useDataManagementViewModel = (): DataManagementViewModelState & {
  refreshData: () => void;
  runBackup: () => void;
  runIntegrityCheck: () => void;
  getStorageUsagePercentage: () => number;
} => {
  const [state, setState] = useState<DataManagementViewModelState>({
    storageInfo: {
      totalCapacity: '500 TB',
      usedSpace: '325 TB',
      availableSpace: '175 TB',
      usageRate: 65
    },
    dataCategories: [
      { name: 'Raw Satellite Data', size: '180 TB', percentage: 55.4 },
      { name: 'Processed Products', size: '95 TB', percentage: 29.2 },
      { name: 'Derived Indices', size: '35 TB', percentage: 10.8 },
      { name: 'Metadata & Catalogs', size: '15 TB', percentage: 4.6 }
    ],
    features: [
      {
        title: 'Automated Backup',
        description: 'Daily incremental backups with 30-day retention policy',
        status: 'active'
      },
      {
        title: 'Data Integrity',
        description: 'Continuous checksum validation and corruption detection',
        status: 'active'
      },
      {
        title: 'Access Control',
        description: 'Role-based permissions and audit trail logging',
        status: 'active'
      }
    ],
    loading: false,
    error: null,
    lastBackup: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    integrityChecks: 1247
  });

  // Business Logic: Load data management information
  const loadDataManagementData = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update storage usage slightly
      setState(prev => ({
        ...prev,
        storageInfo: {
          ...prev.storageInfo,
          usageRate: Math.min(95, prev.storageInfo.usageRate + Math.random() * 0.5)
        },
        integrityChecks: prev.integrityChecks + Math.floor(Math.random() * 5),
        loading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load data management information',
        loading: false
      }));
    }
  };

  // Business Logic: Run backup
  const runBackup = () => {
    setState(prev => ({
      ...prev,
      lastBackup: new Date(),
      loading: true
    }));
    
    setTimeout(() => {
      setState(prev => ({ ...prev, loading: false }));
    }, 2000);
  };

  // Business Logic: Run integrity check
  const runIntegrityCheck = () => {
    setState(prev => ({
      ...prev,
      integrityChecks: prev.integrityChecks + 1,
      loading: true
    }));
    
    setTimeout(() => {
      setState(prev => ({ ...prev, loading: false }));
    }, 1500);
  };

  // Business Logic: Calculate storage usage percentage
  const getStorageUsagePercentage = (): number => {
    return state.storageInfo.usageRate;
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(loadDataManagementData, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    loadDataManagementData();
  }, []);

  const refreshData = () => {
    loadDataManagementData();
  };

  return {
    ...state,
    refreshData,
    runBackup,
    runIntegrityCheck,
    getStorageUsagePercentage
  };
};