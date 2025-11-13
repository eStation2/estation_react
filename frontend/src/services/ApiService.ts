import { User, Post } from '@/models/User';

// API Configuration from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost/api';
const API_DIRECT_URL = process.env.NEXT_PUBLIC_API_DIRECT_URL || 'http://localhost:8000';
const API_TIMEOUT = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000');
const API_RETRY_ATTEMPTS = parseInt(process.env.NEXT_PUBLIC_API_RETRY_ATTEMPTS || '3');
const DEBUG_API = process.env.NEXT_PUBLIC_DEBUG_API === 'true';

// Types for API responses
interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
}

interface ServiceStatus {
  name: string;
  status: 'healthy' | 'unhealthy' | 'unknown';
  response_time?: number;
  last_check?: string;
}

interface WorkspaceConfig {
  id: string;
  name: string;
  panels: PanelConfig[];
  created_at: string;
  updated_at: string;
}

interface PanelConfig {
  id: string;
  type: 'map' | 'graph';
  position: { x: number; y: number; w: number; h: number };
  config: Record<string, unknown>;
}

export class ApiService {
  private static getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem(process.env.NEXT_PUBLIC_SESSION_STORAGE_KEY || 'estation_session');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  private static async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private static async fetchWithRetry<T>(
    endpoint: string, 
    options: RequestInit = {},
    attempt = 1
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    try {
      const url = `${API_BASE_URL}${endpoint}`;
      
      if (DEBUG_API) {
        console.log(`[API] ${options.method || 'GET'} ${url} (attempt ${attempt})`);
      }

      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getAuthHeaders(),
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 401) {
          // Handle authentication error
          localStorage.removeItem(process.env.NEXT_PUBLIC_SESSION_STORAGE_KEY || 'estation_session');
          throw new Error('Authentication required');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (DEBUG_API) {
        console.log(`[API] Response:`, data);
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (DEBUG_API) {
        console.error(`[API] Error (attempt ${attempt}):`, error);
      }

      // Retry logic
      if (attempt < API_RETRY_ATTEMPTS && 
          (error instanceof TypeError || // Network error
           (error instanceof Error && error.message.includes('fetch')))) {
        await this.sleep(1000 * attempt); // Exponential backoff
        return this.fetchWithRetry(endpoint, options, attempt + 1);
      }

      throw error;
    }
  }

  private static async fetchData<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.fetchWithRetry<T>(endpoint, options);
  }

  // Legacy methods (for backwards compatibility)
  static async getUsers(): Promise<User[]> {
    return this.fetchData<User[]>('/users');
  }

  static async getUser(id: number): Promise<User> {
    return this.fetchData<User>(`/users/${id}`);
  }

  static async getPosts(): Promise<Post[]> {
    return this.fetchData<Post[]>('/posts');
  }

  static async getPost(id: number): Promise<Post> {
    return this.fetchData<Post>(`/posts/${id}`);
  }

  // eStation-specific API methods

  // Health and Service Monitoring
  static async healthCheck(): Promise<{ status: string; message: string; timestamp: string }> {
    return this.fetchData<{ status: string; message: string; timestamp: string }>('/health');
  }

  static async getServiceStatus(): Promise<ServiceStatus[]> {
    return this.fetchData<ServiceStatus[]>('/monitoring/services');
  }

  static async getServiceHistory(serviceId: string, hours = 24): Promise<ServiceStatus[]> {
    return this.fetchData<ServiceStatus[]>(`/monitoring/services/${serviceId}/history?hours=${hours}`);
  }

  // Authentication
  static async login(credentials: { username: string; password: string }): Promise<{ token: string; user: User }> {
    const response = await this.fetchData<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // Store token
    localStorage.setItem(process.env.NEXT_PUBLIC_SESSION_STORAGE_KEY || 'estation_session', response.token);
    
    return response;
  }

  static async logout(): Promise<void> {
    try {
      await this.fetchData<void>('/auth/logout', { method: 'POST' });
    } finally {
      localStorage.removeItem(process.env.NEXT_PUBLIC_SESSION_STORAGE_KEY || 'estation_session');
    }
  }

  static async refreshToken(): Promise<{ token: string }> {
    const response = await this.fetchData<{ token: string }>('/auth/refresh', { method: 'POST' });
    localStorage.setItem(process.env.NEXT_PUBLIC_SESSION_STORAGE_KEY || 'estation_session', response.token);
    return response;
  }

  // Workspace Management
  static async getWorkspaces(): Promise<WorkspaceConfig[]> {
    return this.fetchData<WorkspaceConfig[]>('/workspaces');
  }

  static async getWorkspace(id: string): Promise<WorkspaceConfig> {
    return this.fetchData<WorkspaceConfig>(`/workspaces/${id}`);
  }

  static async createWorkspace(workspace: Omit<WorkspaceConfig, 'id' | 'created_at' | 'updated_at'>): Promise<WorkspaceConfig> {
    return this.fetchData<WorkspaceConfig>('/workspaces', {
      method: 'POST',
      body: JSON.stringify(workspace),
    });
  }

  static async updateWorkspace(id: string, updates: Partial<WorkspaceConfig>): Promise<WorkspaceConfig> {
    return this.fetchData<WorkspaceConfig>(`/workspaces/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  static async deleteWorkspace(id: string): Promise<void> {
    return this.fetchData<void>(`/workspaces/${id}`, { method: 'DELETE' });
  }

  // Geospatial Data
  static async getDatasets(): Promise<any[]> {
    return this.fetchData<any[]>('/geospatial/datasets');
  }

  static async getProducts(datasetId?: string): Promise<any[]> {
    const endpoint = datasetId ? `/geospatial/products?dataset_id=${datasetId}` : '/geospatial/products';
    return this.fetchData<any[]>(endpoint);
  }

  static async getProductCategories(): Promise<{ category: string; count: number }[]> {
    return this.fetchData<{ category: string; count: number }[]>('/geospatial/products/categories');
  }

  // Analytics and Charts Data
  static async getDatasetCompleteness(): Promise<{ date: string; completeness: number }[]> {
    return this.fetchData<{ date: string; completeness: number }[]>('/analytics/dataset-completeness');
  }

  static async getProductDistribution(): Promise<{ category: string; count: number; percentage: number }[]> {
    return this.fetchData<{ category: string; count: number; percentage: number }[]>('/analytics/product-distribution');
  }

  // Direct backend access (for development)
  static async getDirectHealth(): Promise<any> {
    try {
      const response = await fetch(`${API_DIRECT_URL}/health`);
      return await response.json();
    } catch (error) {
      console.error('Direct backend health check failed:', error);
      throw error;
    }
  }

  // Utility methods
  static getApiUrls() {
    return {
      main: API_BASE_URL,
      direct: API_DIRECT_URL,
      geoserver: process.env.NEXT_PUBLIC_GEOSERVER_URL || 'https://localhost/geoserver',
      websocket: process.env.NEXT_PUBLIC_WS_URL || 'wss://localhost/ws',
    };
  }

  static isDebugMode(): boolean {
    return DEBUG_API;
  }
}