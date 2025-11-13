// WebSocket Service for Real-time Updates
// Connects to Docker backend WebSocket endpoint for live service monitoring

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'wss://localhost/ws';
const WS_RECONNECT_INTERVAL = 5000;
const WS_MAX_RECONNECT_ATTEMPTS = 10;
const DEBUG_WS = process.env.NEXT_PUBLIC_DEBUG_API === 'true';

export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: string;
}

export interface ServiceUpdate {
  service_id: string;
  service_name: string;
  status: 'healthy' | 'unhealthy' | 'unknown';
  response_time?: number;
  error_message?: string;
  timestamp: string;
}

export interface WorkspaceUpdate {
  workspace_id: string;
  action: 'created' | 'updated' | 'deleted';
  data?: any;
  user_id?: string;
  timestamp: string;
}

type EventCallback<T = any> = (data: T) => void;

export class WebSocketService {
  private static instance: WebSocketService;
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private isConnecting = false;
  private isDestroyed = false;
  private eventListeners: Map<string, Set<EventCallback>> = new Map();

  private constructor() {
    this.connect();
  }

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  private connect(): void {
    if (this.isConnecting || this.isDestroyed) return;

    this.isConnecting = true;

    try {
      if (DEBUG_WS) {
        console.log('[WebSocket] Connecting to:', WS_URL);
      }

      this.ws = new WebSocket(WS_URL);

      this.ws.onopen = () => {
        this.isConnecting = false;
        this.reconnectAttempts = 0;

        if (DEBUG_WS) {
          console.log('[WebSocket] Connected');
        }

        this.emit('connection', { status: 'connected' });

        // Authenticate if token exists
        const token = localStorage.getItem(
          process.env.NEXT_PUBLIC_SESSION_STORAGE_KEY || 'estation_session'
        );
        
        if (token) {
          this.send('auth', { token });
        }

        // Subscribe to default channels
        this.send('subscribe', { channels: ['services', 'workspaces'] });
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          
          if (DEBUG_WS) {
            console.log('[WebSocket] Received:', message);
          }

          this.handleMessage(message);
        } catch (error) {
          console.error('[WebSocket] Failed to parse message:', error);
        }
      };

      this.ws.onclose = (event) => {
        this.isConnecting = false;
        this.ws = null;

        if (DEBUG_WS) {
          console.log('[WebSocket] Closed:', event.code, event.reason);
        }

        this.emit('connection', { status: 'disconnected', code: event.code });

        if (!this.isDestroyed && event.code !== 1000) {
          this.scheduleReconnect();
        }
      };

      this.ws.onerror = (error) => {
        this.isConnecting = false;
        
        if (DEBUG_WS) {
          console.error('[WebSocket] Error:', error);
        }

        this.emit('connection', { status: 'error', error });
      };

    } catch (error) {
      this.isConnecting = false;
      console.error('[WebSocket] Connection failed:', error);
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= WS_MAX_RECONNECT_ATTEMPTS || this.isDestroyed) {
      console.error('[WebSocket] Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(WS_RECONNECT_INTERVAL * this.reconnectAttempts, 30000);

    if (DEBUG_WS) {
      console.log(`[WebSocket] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
    }

    this.reconnectTimeout = setTimeout(() => {
      this.connect();
    }, delay);
  }

  private handleMessage(message: WebSocketMessage): void {
    switch (message.type) {
      case 'service_update':
        this.emit('serviceUpdate', message.data as ServiceUpdate);
        break;
      
      case 'workspace_update':
        this.emit('workspaceUpdate', message.data as WorkspaceUpdate);
        break;
      
      case 'auth_response':
        this.emit('authResponse', message.data);
        break;
      
      case 'error':
        this.emit('error', message.data);
        break;
      
      case 'heartbeat':
        this.send('heartbeat_response', {});
        break;
      
      default:
        this.emit(message.type, message.data);
        break;
    }
  }

  public send(type: string, data: any): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const message: WebSocketMessage = {
        type,
        data,
        timestamp: new Date().toISOString(),
      };

      if (DEBUG_WS) {
        console.log('[WebSocket] Sending:', message);
      }

      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('[WebSocket] Cannot send message, connection not open');
    }
  }

  public on<T = any>(event: string, callback: EventCallback<T>): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(callback);
  }

  public off<T = any>(event: string, callback: EventCallback<T>): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.delete(callback);
      if (listeners.size === 0) {
        this.eventListeners.delete(event);
      }
    }
  }

  private emit<T = any>(event: string, data: T): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`[WebSocket] Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  public subscribe(channels: string[]): void {
    this.send('subscribe', { channels });
  }

  public unsubscribe(channels: string[]): void {
    this.send('unsubscribe', { channels });
  }

  public isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  public getConnectionState(): string {
    if (!this.ws) return 'DISCONNECTED';
    
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING: return 'CONNECTING';
      case WebSocket.OPEN: return 'CONNECTED';
      case WebSocket.CLOSING: return 'CLOSING';
      case WebSocket.CLOSED: return 'DISCONNECTED';
      default: return 'UNKNOWN';
    }
  }

  public destroy(): void {
    this.isDestroyed = true;

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.ws) {
      this.ws.close(1000, 'Service destroyed');
      this.ws = null;
    }

    this.eventListeners.clear();
  }

  // Convenience methods for common operations
  public onServiceUpdate(callback: EventCallback<ServiceUpdate>): void {
    this.on('serviceUpdate', callback);
  }

  public onWorkspaceUpdate(callback: EventCallback<WorkspaceUpdate>): void {
    this.on('workspaceUpdate', callback);
  }

  public onConnectionChange(callback: EventCallback<{ status: string; code?: number; error?: any }>): void {
    this.on('connection', callback);
  }
}

// Export singleton instance
export const wsService = WebSocketService.getInstance();