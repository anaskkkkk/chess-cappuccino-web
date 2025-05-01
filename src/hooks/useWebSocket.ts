
import { useEffect, useCallback, useRef, useState } from 'react';
import websocketService, { WebSocketMessage } from '../services/websocketService';

interface UseWebSocketOptions {
  gameId?: string;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
  autoConnect?: boolean;
}

export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected' | 'error';

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

  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const callbackRef = useRef(callback);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  
  // Update the callback ref when the callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Function to check connection status periodically
  useEffect(() => {
    const checkStatus = () => {
      const currentStatus = websocketService.getConnectionStatus();
      setStatus(currentStatus);
    };
    
    const statusInterval = setInterval(checkStatus, 5000);
    checkStatus(); // Initial check
    
    return () => {
      clearInterval(statusInterval);
    };
  }, []);

  // Connect to WebSocket when component mounts if autoConnect is true
  useEffect(() => {
    let isMounted = true;
    
    if (autoConnect) {
      setStatus('connecting');
      connect().then(() => {
        if (isMounted) {
          setStatus('connected');
        }
      }).catch(() => {
        if (isMounted) {
          setStatus('error');
        }
      });
    }
    
    return () => {
      isMounted = false;
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Subscribe to events
  useEffect(() => {
    // Clean up previous subscription if it exists
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }
    
    // Create new subscription
    unsubscribeRef.current = websocketService.subscribe<T>(eventType, (data: T) => {
      callbackRef.current(data);
    });
    
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [eventType]);

  const connect = useCallback(async () => {
    try {
      setStatus('connecting');
      await websocketService.connect(gameId);
      setStatus('connected');
      onOpen?.();
      return true;
    } catch (error) {
      console.error('WebSocket connection error:', error);
      setStatus('error');
      onError?.(error as Event);
      return false;
    }
  }, [gameId, onOpen, onError]);

  const disconnect = useCallback(() => {
    websocketService.disconnect();
    setStatus('disconnected');
    onClose?.();
  }, [onClose]);

  const send = useCallback((message: WebSocketMessage) => {
    if (status !== 'connected') {
      connect().then(() => {
        websocketService.send(message);
      });
    } else {
      websocketService.send(message);
    }
  }, [connect, status]);

  return { connect, disconnect, send, status };
}

export default useWebSocket;
