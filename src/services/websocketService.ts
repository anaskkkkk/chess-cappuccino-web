import apiService from './apiService';

export enum WebSocketMessageType {
  GAME_STATE = 'gameState',
  CHAT_MESSAGE = 'chatMessage',
  USER_JOINED = 'userJoined',
  USER_LEFT = 'userLeft',
  MOVE_MADE = 'moveMade',
  GAME_OVER = 'gameOver',
  DRAW_OFFERED = 'drawOffered',
  DRAW_DECLINED = 'drawDeclined',
  DRAW_ACCEPTED = 'drawAccepted',
  TIME_UPDATE = 'timeUpdate',
  TOURNAMENT_UPDATE = 'tournamentUpdate',
  BOARD_STATUS = 'boardStatus',
  NOTIFICATION = 'notification',
  ERROR = 'error'
}

export interface WebSocketMessage {
  type: WebSocketMessageType;
  payload: any;
}

type MessageHandler = (message: WebSocketMessage) => void;
type ConnectionHandler = () => void;
type ErrorHandler = (event: Event) => void;

class WebSocketService {
  private socket: WebSocket | null = null;
  private messageHandlers: Map<WebSocketMessageType | string, Set<MessageHandler>> = new Map();
  private connectionHandlers: Set<ConnectionHandler> = new Set();
  private disconnectionHandlers: Set<ConnectionHandler> = new Set();
  private errorHandlers: Set<ErrorHandler> = new Set();
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectTimeout: number = 3000;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private isConnecting: boolean = false;
  private wsUrl: string = '';
  private authToken: string = '';

  constructor() {
    // Initialize WebSocket URL
    this.wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3000/ws';
  }

  /**
   * Connect to the WebSocket server
   */
  public async connect(): Promise<void> {
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      console.log('WebSocket already connected or connecting');
      return;
    }

    if (this.isConnecting) {
      console.log('WebSocket connection already in progress');
      return;
    }

    this.isConnecting = true;

    try {
      // Get fresh auth token for WebSocket connection
      const response = await this.getWebSocketToken();
      this.authToken = response.token;

      // Connect to WebSocket server with auth token
      this.socket = new WebSocket(`${this.wsUrl}?token=${this.authToken}`);
      this.setupSocketListeners();
    } catch (error) {
      console.error('Failed to get WebSocket auth token:', error);
      this.isConnecting = false;
      this.handleReconnect();
    }
  }

  /**
   * Set up WebSocket event listeners
   */
  private setupSocketListeners(): void {
    if (!this.socket) return;

    this.socket.onopen = () => {
      console.log('WebSocket connected');
      this.isConnecting = false;
      this.reconnectAttempts = 0;
      this.connectionHandlers.forEach(handler => handler());
    };

    this.socket.onclose = (event) => {
      console.log(`WebSocket disconnected: ${event.code} - ${event.reason}`);
      this.isConnecting = false;
      this.disconnectionHandlers.forEach(handler => handler());
      
      // Only attempt to reconnect if the close was not initiated by the client
      if (event.code !== 1000) {
        this.handleReconnect();
      }
    };

    this.socket.onerror = (event) => {
      console.error('WebSocket error:', event);
      this.isConnecting = false;
      this.errorHandlers.forEach(handler => handler(event));
    };

    this.socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as WebSocketMessage;
        this.handleMessage(message);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
  }

  /**
   * Handle WebSocket message
   */
  private handleMessage(message: WebSocketMessage): void {
    const handlers = this.messageHandlers.get(message.type);
    if (handlers) {
      handlers.forEach(handler => handler(message));
    }
  }

  /**
   * Handle reconnection logic
   */
  private handleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnect attempts reached');
      return;
    }

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    this.reconnectAttempts++;
    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${this.reconnectTimeout / 1000}s`);
    
    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, this.reconnectTimeout);
    
    // Exponential backoff
    this.reconnectTimeout = Math.min(30000, this.reconnectTimeout * 1.5);
  }

  /**
   * Disconnect from the WebSocket server
   */
  public disconnect(): void {
    if (this.socket) {
      this.socket.close(1000, 'Client disconnected');
      this.socket = null;
    }

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    this.reconnectAttempts = 0;
    this.reconnectTimeout = 3000;
  }

  /**
   * Send a message to the WebSocket server
   */
  public sendMessage(type: WebSocketMessageType | string, payload: any): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error('WebSocket not connected');
      return;
    }

    const message: WebSocketMessage = { type: type as WebSocketMessageType, payload };
    this.socket.send(JSON.stringify(message));
  }

  /**
   * Add a message handler and return a function to remove it
   */
  public addMessageHandler(type: WebSocketMessageType | string, handler: MessageHandler): () => void {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, new Set());
    }

    const handlers = this.messageHandlers.get(type);
    if (handlers) {
      handlers.add(handler);
    }

    return () => this.removeMessageHandler(type, handler);
  }

  /**
   * Remove a message handler
   */
  public removeMessageHandler(type: WebSocketMessageType | string, handler: MessageHandler): void {
    const handlers = this.messageHandlers.get(type);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  /**
   * Add a connection handler
   */
  public onConnect(handler: ConnectionHandler): void {
    this.connectionHandlers.add(handler);
  }

  /**
   * Remove a connection handler
   */
  public offConnect(handler: ConnectionHandler): void {
    this.connectionHandlers.delete(handler);
  }

  /**
   * Add a disconnection handler
   */
  public onDisconnect(handler: ConnectionHandler): void {
    this.disconnectionHandlers.add(handler);
  }

  /**
   * Remove a disconnection handler
   */
  public offDisconnect(handler: ConnectionHandler): void {
    this.disconnectionHandlers.delete(handler);
  }

  /**
   * Add an error handler
   */
  public onError(handler: ErrorHandler): void {
    this.errorHandlers.add(handler);
  }

  /**
   * Remove an error handler
   */
  public offError(handler: ErrorHandler): void {
    this.errorHandlers.delete(handler);
  }

  /**
   * Check if WebSocket is connected
   */
  public isConnected(): boolean {
    return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
  }

  /**
   * Join a game room
   */
  public joinGame(gameId: string): void {
    this.sendMessage(WebSocketMessageType.USER_JOINED, { gameId });
  }

  /**
   * Leave a game room
   */
  public leaveGame(gameId: string): void {
    this.sendMessage(WebSocketMessageType.USER_LEFT, { gameId });
  }

  /**
   * Send a chat message
   */
  public sendChatMessage(gameId: string, message: string): void {
    this.sendMessage(WebSocketMessageType.CHAT_MESSAGE, { gameId, message });
  }

  /**
   * Make a move in a game
   */
  public makeMove(gameId: string, move: any): void {
    this.sendMessage(WebSocketMessageType.MOVE_MADE, { gameId, move });
  }

  /**
   * Offer a draw in a game
   */
  public offerDraw(gameId: string): void {
    this.sendMessage(WebSocketMessageType.DRAW_OFFERED, { gameId });
  }

  /**
   * Respond to a draw offer
   */
  public respondToDrawOffer(gameId: string, accept: boolean): void {
    const responseType = accept ? WebSocketMessageType.DRAW_ACCEPTED : WebSocketMessageType.DRAW_DECLINED;
    this.sendMessage(responseType, { gameId });
  }

  /**
   * Get WebSocket token
   */
  private async getWebSocketToken() {
    try {
      // Use direct apiService call instead of websocketApi
      return await apiService.getWebSocketToken();
    } catch (error) {
      console.error('Error getting WebSocket token:', error);
      throw error;
    }
  }
}

// Export singleton instance
const websocketService = new WebSocketService();
export default websocketService;
