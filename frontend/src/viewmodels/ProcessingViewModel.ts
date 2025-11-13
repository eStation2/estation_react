import { useState, useEffect } from 'react';

// Models for Processing data
export interface ProcessingJob {
  id: string;
  name: string;
  type: 'vegetation_indices' | 'land_surface_temp' | 'precipitation' | 'fire_detection';
  status: 'running' | 'queued' | 'completed' | 'failed';
  progress: number;
  startTime: Date;
  estimatedCompletion?: Date;
  inputData: string;
  outputSize?: string;
}

export interface ProcessingChain {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  jobsToday: number;
}

export interface SystemResources {
  cpuUsage: number;
  memoryUsage: number;
  storageUsage: number;
  temperature: number;
}

export interface ProcessingViewModelState {
  runningJobs: ProcessingJob[];
  queuedJobs: ProcessingJob[];
  completedJobsToday: number;
  processingChains: ProcessingChain[];
  systemResources: SystemResources;
  loading: boolean;
  error: string | null;
}

export const useProcessingViewModel = (): ProcessingViewModelState & {
  refreshData: () => void;
  startJob: (jobName: string, inputData: string) => void;
  cancelJob: (jobId: string) => void;
  toggleProcessingChain: (chainId: string) => void;
} => {
  const [state, setState] = useState<ProcessingViewModelState>({
    runningJobs: [
      {
        id: '1',
        name: 'NDVI Analysis Europe',
        type: 'vegetation_indices',
        status: 'running',
        progress: 65,
        startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        estimatedCompletion: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour from now
        inputData: 'Sentinel-2 L2A 2024-01-15'
      },
      {
        id: '2',
        name: 'Fire Detection Portugal',
        type: 'fire_detection',
        status: 'running',
        progress: 20,
        startTime: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        estimatedCompletion: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
        inputData: 'MODIS Thermal 2024-01-15'
      }
    ],
    queuedJobs: [
      {
        id: '3',
        name: 'Precipitation Estimates',
        type: 'precipitation',
        status: 'queued',
        progress: 0,
        startTime: new Date(),
        inputData: 'GPM IMERG 2024-01-15'
      }
    ],
    completedJobsToday: 247,
    processingChains: [
      {
        id: '1',
        name: 'Vegetation Indices',
        description: 'NDVI, EVI, SAVI calculations',
        isActive: true,
        jobsToday: 45
      },
      {
        id: '2',
        name: 'Land Surface Temperature',
        description: 'LST from thermal infrared data',
        isActive: true,
        jobsToday: 23
      },
      {
        id: '3',
        name: 'Precipitation Estimates',
        description: 'Rain rate from satellite data',
        isActive: false,
        jobsToday: 0
      },
      {
        id: '4',
        name: 'Fire Detection',
        description: 'Active fire and burned area mapping',
        isActive: true,
        jobsToday: 12
      }
    ],
    systemResources: {
      cpuUsage: 78,
      memoryUsage: 65,
      storageUsage: 45,
      temperature: 52
    },
    loading: false,
    error: null
  });

  // Business Logic: Load processing data
  const loadProcessingData = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 700));
      
      // Update job progress and system resources
      setState(prev => ({
        ...prev,
        runningJobs: prev.runningJobs.map(job => ({
          ...job,
          progress: Math.min(job.progress + Math.random() * 10, 100)
        })),
        systemResources: {
          cpuUsage: Math.max(50, Math.min(90, prev.systemResources.cpuUsage + (Math.random() - 0.5) * 10)),
          memoryUsage: Math.max(40, Math.min(80, prev.systemResources.memoryUsage + (Math.random() - 0.5) * 5)),
          storageUsage: prev.systemResources.storageUsage + Math.random() * 0.1,
          temperature: Math.max(45, Math.min(65, prev.systemResources.temperature + (Math.random() - 0.5) * 3))
        },
        loading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load processing data',
        loading: false
      }));
    }
  };

  // Business Logic: Start new job
  const startJob = (jobName: string, inputData: string) => {
    const newJob: ProcessingJob = {
      id: Date.now().toString(),
      name: jobName,
      type: 'vegetation_indices',
      status: 'queued',
      progress: 0,
      startTime: new Date(),
      inputData
    };

    setState(prev => ({
      ...prev,
      queuedJobs: [...prev.queuedJobs, newJob]
    }));
  };

  // Business Logic: Cancel job
  const cancelJob = (jobId: string) => {
    setState(prev => ({
      ...prev,
      runningJobs: prev.runningJobs.filter(job => job.id !== jobId),
      queuedJobs: prev.queuedJobs.filter(job => job.id !== jobId)
    }));
  };

  // Business Logic: Toggle processing chain
  const toggleProcessingChain = (chainId: string) => {
    setState(prev => ({
      ...prev,
      processingChains: prev.processingChains.map(chain =>
        chain.id === chainId ? { ...chain, isActive: !chain.isActive } : chain
      )
    }));
  };

  // Auto-refresh every 10 seconds
  useEffect(() => {
    const interval = setInterval(loadProcessingData, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    loadProcessingData();
  }, []);

  const refreshData = () => {
    loadProcessingData();
  };

  return {
    ...state,
    refreshData,
    startJob,
    cancelJob,
    toggleProcessingChain
  };
};