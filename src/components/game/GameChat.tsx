
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import useWebSocket from '@/hooks/useWebSocket';
import { WebSocketMessageType } from '@/services/websocketService';

interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
}

interface GameChatProps {
  gameId: string;
}

const GameChat: React.FC<GameChatProps> = ({ gameId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // WebSocket connection for chat
  const { send } = useWebSocket<Message>(
    WebSocketMessageType.CHAT_MESSAGE,
    (message) => {
      setMessages(prev => [...prev, message]);
    },
    { gameId }
  );

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    // Send message via WebSocket
    send({
      type: WebSocketMessageType.CHAT_MESSAGE,
      payload: {
        gameId,
        text: inputValue
      }
    });
    
    // Clear input
    setInputValue('');
  };

  // Handle key press (Enter to send)
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bg-chess-dark border border-[rgba(255,255,255,0.12)] rounded-lg p-4 shadow-md flex flex-col h-64">
      <h2 className="text-xl font-bold text-chess-text-light mb-2">Chat</h2>
      
      {/* Messages container */}
      <div className="flex-grow overflow-y-auto mb-4 pr-1 scrollbar-thin scrollbar-thumb-chess-accent scrollbar-track-transparent">
        {messages.length > 0 ? (
          <div className="space-y-2">
            {messages.map((message) => (
              <div key={message.id} className="flex flex-col">
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-chess-accent">{message.sender}:</span>
                  <span className="text-chess-text-light">{message.text}</span>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <p className="text-gray-400 text-center py-4">No messages yet</p>
        )}
      </div>
      
      {/* Input box */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          className="w-full px-3 py-2 bg-chess-dark border border-[rgba(255,255,255,0.2)] rounded-md text-chess-text-light focus:outline-none focus:border-chess-accent"
          placeholder="Type a message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Button 
          type="button" 
          className="px-3 py-2 bg-chess-accent text-chess-text-light rounded-md hover:bg-opacity-90 focus:outline-none"
          onClick={handleSendMessage}
          disabled={!inputValue.trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default GameChat;
