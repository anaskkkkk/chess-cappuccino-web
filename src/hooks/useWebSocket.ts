
import { useEffect, useCallback, useRef } from 'react';
import websocketService, { WebSocketMessage } from '../services/websocketService';

interface UseWebSocketOptions {
  gameId?: string;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
  autoConnect?: boolean;
}

export function useWebSocket<T = any>(
  eventType: string,
  callback: (data: T) => void,
  options: UseWebSocketOptions = {}
) {
  const {
    gameId,
    onOpen,
    onClose,
    onError,
    autoConnect = true
  } = options;

  const callbackRef = useRef(callback);
  
  // Update the callback ref when the callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Connect to WebSocket when component mounts if autoConnect is true
  useEffect(() => {
    if (autoConnect) {
      connect();
    }
    
    return () => {
      // Only disconnect if we're the only remaining subscriber
      if (eventListenersCount() === 1) {
        websocketService.disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Subscribe to events
  useEffect(() => {
    const unsubscribe = websocketService.subscribe<T>(eventType, (data: T) => {
      callbackRef.current(data);
    });
    
    return () => {
      unsubscribe();
    };
  }, [eventType]);

  const connect = useCallback(async () => {
    try {
      await websocketService.connect(gameId);
      onOpen?.();
    } catch (error) {
      console.error('WebSocket connection error:', error);
      onError?.(error as Event);
    }
  }, [gameId, onOpen, onError]);

  const disconnect = useCallback(() => {
    websocketService.disconnect();
    onClose?.();
  }, [onClose]);

  const send = useCallback((message: WebSocketMessage) => {
    websocketService.send(message);
  }, []);

  const eventListenersCount = useCallback(() => {
    // This is a simplistic count - in a real app you might want to track this better
    return 1;
  }, []);

  return { connect, disconnect, send };
}

export default useWebSocket;
