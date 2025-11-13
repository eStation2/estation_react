import { useState, useEffect } from 'react';

// Models for Analysis workspace data
export interface MapPanel {
  id: string;
  title: string;
  x: number;
  y: number;
  w: number;
  h: number;
  products?: string[];
  dateRange?: string;
}

export interface GraphPanel {
  id: string;
  title: string;
  x: number;
  y: number;
  w: number;
  h: number;
  chartType?: 'line' | 'bar' | 'scatter';
  dataSource?: string;
}

export interface Workspace {
  id: string;
  name: string;
  isDefault: boolean;
  mapPanels: MapPanel[];
  graphPanels: GraphPanel[];
  lastModified: Date;
}

// Legacy models for backward compatibility
export interface AnalysisTool {
  name: string;
  description: string;
  availability: 'available' | 'busy' | 'maintenance';
}

export interface AnalysisProject {
  id: string;
  name: string;
  description: string;
  status: 'completed' | 'in_progress' | 'queued' | 'failed';
  progress?: number;
  startDate: Date;
  estimatedCompletion?: Date;
  datasetSize: string;
}

export interface AnalysisCapability {
  title: string;
  description: string;
  performanceMetric: string;
}

export interface AnalysisStats {
  totalProjects: number;
  completedThisMonth: number;
  activeProjects: number;
  avgProcessingTime: string;
}

export interface AnalysisViewModelState {
  // Workspace management
  workspaces: Workspace[];
  activeWorkspaceId: string;
  refWorkspaces: Workspace[];
  myWorkspaces: Workspace[];
  
  // Legacy properties for backward compatibility
  tools: AnalysisTool[];
  recentProjects: AnalysisProject[];
  capabilities: AnalysisCapability[];
  stats: AnalysisStats;
  loading: boolean;
  error: string | null;
}

export const useAnalysisViewModel = (): AnalysisViewModelState & {
  // Workspace management methods
  createMapPanel: () => void;
  createGraphPanel: () => void;
  removePanel: (panelId: string, type: 'map' | 'graph') => void;
  updatePanelLayout: (panelId: string, layout: { x: number; y: number; w: number; h: number }, type: 'map' | 'graph') => void;
  switchWorkspace: (workspaceId: string) => void;
  saveWorkspace: () => void;
  
  // Legacy methods for backward compatibility
  refreshData: () => void;
  startAnalysis: (projectName: string, datasetSize: string) => void;
  cancelAnalysis: (projectId: string) => void;
  getActiveProjectsCount: () => number;
  getCompletionRate: () => number;
} => {
  const [state, setState] = useState<AnalysisViewModelState>({
    // Initialize workspace management
    workspaces: [
      {
        id: 'default',
        name: 'DEFAULT WORKSPACE',
        isDefault: true,
        mapPanels: [],
        graphPanels: [],
        lastModified: new Date()
      }
    ],
    activeWorkspaceId: 'default',
    refWorkspaces: [],
    myWorkspaces: [],
    
    // Legacy data
    tools: [
      { name: 'Time Series Analysis', description: 'Long-term trend detection', availability: 'available' },
      { name: 'Change Detection', description: 'Land cover change monitoring', availability: 'available' },
      { name: 'Trend Analysis', description: 'Statistical trend identification', availability: 'busy' },
      { name: 'Statistical Modeling', description: 'Advanced statistical methods', availability: 'available' },
      { name: 'Machine Learning', description: 'AI-powered pattern recognition', availability: 'available' },
      { name: 'Spectral Analysis', description: 'Multi-spectral data processing', availability: 'maintenance' }
    ],
    recentProjects: [
      {
        id: '1',
        name: 'Vegetation Trends',
        description: '2010-2024 NDVI analysis for European forests',
        status: 'completed',
        progress: 100,
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        datasetSize: '2.5 TB'
      },
      {
        id: '2',
        name: 'Climate Anomalies',
        description: 'Temperature anomaly detection using ML',
        status: 'in_progress',
        progress: 65,
        startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        estimatedCompletion: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
        datasetSize: '1.8 TB'
      },
      {
        id: '3',
        name: 'Land Cover Change',
        description: 'Urban expansion monitoring 2020-2024',
        status: 'queued',
        progress: 0,
        startDate: new Date(),
        datasetSize: '3.2 TB'
      }
    ],
    capabilities: [
      {
        title: 'Real-time Processing',
        description: 'Near real-time analysis of incoming satellite data streams',
        performanceMetric: '< 15 minutes latency'
      },
      {
        title: 'Multi-temporal',
        description: 'Long-term trend analysis across multiple decades',
        performanceMetric: '1980-2024 coverage'
      },
      {
        title: 'Multi-spectral',
        description: 'Analysis across visible, NIR, SWIR, and thermal bands',
        performanceMetric: '13+ spectral bands'
      }
    ],
    stats: {
      totalProjects: 156,
      completedThisMonth: 23,
      activeProjects: 5,
      avgProcessingTime: '4.2 hours'
    },
    loading: false,
    error: null
  });

  // Business Logic: Load analysis data
  const loadAnalysisData = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Update project progress
      setState(prev => ({
        ...prev,
        recentProjects: prev.recentProjects.map(project => {
          if (project.status === 'in_progress' && project.progress !== undefined) {
            return {
              ...project,
              progress: Math.min(100, project.progress + Math.random() * 5)
            };
          }
          return project;
        }),
        loading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load analysis data',
        loading: false
      }));
    }
  };

  // Business Logic: Start new analysis
  const startAnalysis = (projectName: string, datasetSize: string) => {
    const newProject: AnalysisProject = {
      id: Date.now().toString(),
      name: projectName,
      description: `New analysis project: ${projectName}`,
      status: 'queued',
      progress: 0,
      startDate: new Date(),
      datasetSize
    };

    setState(prev => ({
      ...prev,
      recentProjects: [newProject, ...prev.recentProjects.slice(0, 9)], // Keep last 10
      stats: {
        ...prev.stats,
        totalProjects: prev.stats.totalProjects + 1,
        activeProjects: prev.stats.activeProjects + 1
      }
    }));
  };

  // Business Logic: Cancel analysis
  const cancelAnalysis = (projectId: string) => {
    setState(prev => ({
      ...prev,
      recentProjects: prev.recentProjects.filter(project => project.id !== projectId),
      stats: {
        ...prev.stats,
        activeProjects: Math.max(0, prev.stats.activeProjects - 1)
      }
    }));
  };

  // Business Logic: Get active projects count
  const getActiveProjectsCount = (): number => {
    return state.recentProjects.filter(p => p.status === 'in_progress' || p.status === 'queued').length;
  };

  // Business Logic: Calculate completion rate
  const getCompletionRate = (): number => {
    const completedProjects = state.recentProjects.filter(p => p.status === 'completed').length;
    return state.recentProjects.length > 0 ? (completedProjects / state.recentProjects.length) * 100 : 0;
  };

  // Auto-refresh every 15 seconds
  useEffect(() => {
    const interval = setInterval(loadAnalysisData, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    loadAnalysisData();
  }, []);

  // Business Logic: Create new map panel
  const createMapPanel = () => {
    const currentWorkspace = state.workspaces.find(w => w.id === state.activeWorkspaceId);
    const allPanels = [...(currentWorkspace?.mapPanels || []), ...(currentWorkspace?.graphPanels || [])];
    
    // Find available position in grid
    let x = 0;
    let y = 0;
    
    if (allPanels.length > 0) {
      // Calculate next available position
      const cols = 12;
      const panelWidth = 6;
      const panelHeight = 8;
      
      // Simple placement: place panels side by side, then wrap to next row
      const panelsPerRow = Math.floor(cols / panelWidth);
      const row = Math.floor(allPanels.length / panelsPerRow);
      const col = allPanels.length % panelsPerRow;
      
      x = col * panelWidth;
      y = row * panelHeight;
    }
    
    const newPanel: MapPanel = {
      id: `map-${Date.now()}`,
      title: `Map Panel ${(currentWorkspace?.mapPanels.length || 0) + 1}`,
      x: x,
      y: y,
      w: 6,
      h: 8
    };

    setState(prev => ({
      ...prev,
      workspaces: prev.workspaces.map(workspace =>
        workspace.id === prev.activeWorkspaceId
          ? {
              ...workspace,
              mapPanels: [...workspace.mapPanels, newPanel],
              lastModified: new Date()
            }
          : workspace
      )
    }));
  };

  // Business Logic: Create new graph panel
  const createGraphPanel = () => {
    const currentWorkspace = state.workspaces.find(w => w.id === state.activeWorkspaceId);
    const allPanels = [...(currentWorkspace?.mapPanels || []), ...(currentWorkspace?.graphPanels || [])];
    
    // Find available position in grid
    let x = 0;
    let y = 0;
    
    if (allPanels.length > 0) {
      // Calculate next available position
      const cols = 12;
      const panelWidth = 6;
      const panelHeight = 8;
      
      // Simple placement: place panels side by side, then wrap to next row
      const panelsPerRow = Math.floor(cols / panelWidth);
      const row = Math.floor(allPanels.length / panelsPerRow);
      const col = allPanels.length % panelsPerRow;
      
      x = col * panelWidth;
      y = row * panelHeight;
    }
    
    const newPanel: GraphPanel = {
      id: `graph-${Date.now()}`,
      title: `Graph Panel ${(currentWorkspace?.graphPanels.length || 0) + 1}`,
      x: x,
      y: y,
      w: 6,
      h: 8
    };

    setState(prev => ({
      ...prev,
      workspaces: prev.workspaces.map(workspace =>
        workspace.id === prev.activeWorkspaceId
          ? {
              ...workspace,
              graphPanels: [...workspace.graphPanels, newPanel],
              lastModified: new Date()
            }
          : workspace
      )
    }));
  };

  // Business Logic: Remove panel
  const removePanel = (panelId: string, type: 'map' | 'graph') => {
    setState(prev => ({
      ...prev,
      workspaces: prev.workspaces.map(workspace =>
        workspace.id === prev.activeWorkspaceId
          ? {
              ...workspace,
              mapPanels: type === 'map' ? workspace.mapPanels.filter(p => p.id !== panelId) : workspace.mapPanels,
              graphPanels: type === 'graph' ? workspace.graphPanels.filter(p => p.id !== panelId) : workspace.graphPanels,
              lastModified: new Date()
            }
          : workspace
      )
    }));
  };

  // Business Logic: Update panel layout
  const updatePanelLayout = (panelId: string, layout: { x: number; y: number; w: number; h: number }, type: 'map' | 'graph') => {
    setState(prev => ({
      ...prev,
      workspaces: prev.workspaces.map(workspace =>
        workspace.id === prev.activeWorkspaceId
          ? {
              ...workspace,
              mapPanels: type === 'map' ? workspace.mapPanels.map(p => p.id === panelId ? { ...p, ...layout } : p) : workspace.mapPanels,
              graphPanels: type === 'graph' ? workspace.graphPanels.map(p => p.id === panelId ? { ...p, ...layout } : p) : workspace.graphPanels,
              lastModified: new Date()
            }
          : workspace
      )
    }));
  };

  // Business Logic: Switch workspace
  const switchWorkspace = (workspaceId: string) => {
    setState(prev => ({ ...prev, activeWorkspaceId: workspaceId }));
  };

  // Business Logic: Save workspace
  const saveWorkspace = () => {
    // In a real app, this would save to backend
    console.log('Workspace saved:', state.workspaces.find(w => w.id === state.activeWorkspaceId));
  };

  const refreshData = () => {
    loadAnalysisData();
  };

  return {
    ...state,
    // Workspace methods
    createMapPanel,
    createGraphPanel,
    removePanel,
    updatePanelLayout,
    switchWorkspace,
    saveWorkspace,
    // Legacy methods
    refreshData,
    startAnalysis,
    cancelAnalysis,
    getActiveProjectsCount,
    getCompletionRate
  };
};