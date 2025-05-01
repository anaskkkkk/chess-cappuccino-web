export interface WebSocketMessage {
  type: string;
  payload: any;
}

class WebSocketService {
  private socket: WebSocket | null = null;
  private url: string;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 1000;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();
  private isConnecting: boolean = false;
  private messageQueue: WebSocketMessage[] = [];
  private connectionPromise: Promise<void> | null = null;
  
  constructor() {
    // TODO: Use environment variable for WebSocket URL
    this.url = import.meta.env.VITE_WS_URL || 'ws://localhost:3000/ws';
  }
  
  public connect(gameId?: string): Promise<void> {
    if (this.socket?.readyState === WebSocket.OPEN) {
      return Promise.resolve();
    }
    
    if (this.isConnecting) {
      return this.connectionPromise || Promise.resolve();
    }
    
    this.isConnecting = true;
    
    this.connectionPromise = new Promise((resolve, reject) => {
      try {
        const token = localStorage.getItem('auth_token');
        const wsUrl = gameId ? `${this.url}?gameId=${gameId}&token=${token}` : `${this.url}?token=${token}`;
        
        this.socket = new WebSocket(wsUrl);
        
        this.socket.onopen = () => {
          console.log('WebSocket connection established');
          this.reconnectAttempts = 0;
          this.isConnecting = false;
          
          // Process any queued messages
          while (this.messageQueue.length > 0) {
            const message = this.messageQueue.shift();
            if (message) this.send(message);
          }
          
          resolve();
          
          // Send heartbeat every 30 seconds to keep connection alive
          const heartbeatInterval = setInterval(() => {
            if (this.socket?.readyState === WebSocket.OPEN) {
              this.send({ type: 'heartbeat', payload: { timestamp: Date.now() } });
            } else {
              clearInterval(heartbeatInterval);
            }
          }, 30000);
        };
        
        this.socket.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data) as WebSocketMessage;
            this.handleMessage(message);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };
        
        this.socket.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.isConnecting = false;
          reject(error);
        };
        
        this.socket.onclose = (event) => {
          console.log('WebSocket connection closed:', event.code, event.reason);
          this.isConnecting = false;
          this.connectionPromise = null;
          
          // Only try to reconnect if closure wasn't intentional (code 1000)
          if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            const delay = this.reconnectDelay * Math.pow(1.5, this.reconnectAttempts - 1);
            console.log(`Attempting to reconnect in ${delay}ms...`);
            setTimeout(() => this.connect(gameId), delay);
          } else if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error('Max reconnect attempts reached. Giving up.');
          }
        };
      } catch (error) {
        this.isConnecting = false;
        this.connectionPromise = null;
        console.error('Error creating WebSocket:', error);
        reject(error);
      }
    });
    
    return this.connectionPromise;
  }
  
  public disconnect(): void {
    if (this.socket) {
      this.socket.close(1000, 'Intentional disconnect');
      this.socket = null;
      this.messageQueue = [];
    }
  }
  
  public send(message: WebSocketMessage): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else if (this.isConnecting) {
      // Queue message if still connecting
      this.messageQueue.push(message);
    } else {
      console.error('Cannot send message, socket not connected');
      // Maybe try to reconnect?
      this.connect().then(() => {
        this.send(message);
      }).catch(error => {
        console.error('Failed to reconnect:', error);
      });
    }
  }
  
  public subscribe<T>(eventType: string, callback: (data: T) => void): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    
    this.listeners.get(eventType)!.add(callback as any);
    
    return () => {
      const callbacks = this.listeners.get(eventType);
      if (callbacks) {
        callbacks.delete(callback as any);
        if (callbacks.size === 0) {
          this.listeners.delete(eventType);
        }
      }
    };
  }
  
  public getConnectionStatus(): 'connected' | 'connecting' | 'disconnected' | 'error' {
    if (!this.socket) return 'disconnected';
    
    switch (this.socket.readyState) {
      case WebSocket.CONNECTING:
        return 'connecting';
      case WebSocket.OPEN:
        return 'connected';
      case WebSocket.CLOSING:
      case WebSocket.CLOSED:
      default:
        return 'disconnected';
    }
  }
  
  private handleMessage(message: WebSocketMessage): void {
    const { type, payload } = message;
    const callbacks = this.listeners.get(type);
    
    if (callbacks) {
      callbacks.forEach(callback => callback(payload));
    }
  }
}

export default new WebSocketService();
