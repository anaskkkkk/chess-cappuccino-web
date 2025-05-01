
import React, { useState, useEffect } from 'react';
import { GameState } from '@/services/gameService';
import { UserCircle, Clock, Shield, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import useGameStore from '@/stores/gameStore';

interface GameInfoProps {
  gameState: GameState | null;
}

const GameInfo: React.FC<GameInfoProps> = ({ gameState }) => {
  const [whiteTime, setWhiteTime] = useState(gameState?.timers?.w || 600);
  const [blackTime, setBlackTime] = useState(gameState?.timers?.b || 600);
  const [activePlayer, setActivePlayer] = useState<'w' | 'b'>('w'); // Assuming white starts
  const { inCheck } = useGameStore();

  // Parse FEN to determine active player
  useEffect(() => {
    if (gameState?.fen) {
      const fenParts = gameState.fen.split(' ');
      if (fenParts.length > 1) {
        setActivePlayer(fenParts[1] as 'w' | 'b');
      }
    }
  }, [gameState?.fen]);

  // Update timers
  useEffect(() => {
    if (!gameState?.timers) return;
    
    setWhiteTime(gameState.timers.w);
    setBlackTime(gameState.timers.b);
  }, [gameState?.timers]);

  // Countdown active player's timer
  useEffect(() => {
    if (gameState?.result) return; // Game is over, stop timers
    
    const timer = setInterval(() => {
      if (activePlayer === 'w') {
        setWhiteTime(prevTime => Math.max(0, prevTime - 1));
      } else {
        setBlackTime(prevTime => Math.max(0, prevTime - 1));
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [activePlayer, gameState?.result]);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-chess-dark border border-[rgba(255,255,255,0.12)] rounded-lg p-4 shadow-md">
      <h2 className="text-xl font-bold text-chess-text-light mb-4">Game Info</h2>
      
      {/* Black player info */}
      <div className={cn(
        "flex items-center justify-between mb-4 p-2 rounded-md",
        activePlayer === 'b' && !gameState?.result && "bg-chess-accent/20 transition-all"
      )}>
        <div className="flex items-center gap-3">
          <UserCircle className="h-8 w-8 text-chess-text-light" />
          <div>
            <p className="font-semibold text-chess-text-light">{gameState?.blackPlayer?.name || 'Black'}</p>
            <p className="text-sm text-gray-400">{gameState?.blackPlayer?.rating || '1200'}</p>
          </div>
        </div>
        <div className={cn(
          "flex items-center gap-2 px-3 py-1 rounded-md bg-chess-dark border border-[rgba(255,255,255,0.12)]",
          blackTime < 30 && "text-red-500 animate-pulse"
        )}>
          <Clock className="h-4 w-4" />
          <span className="font-mono">{formatTime(blackTime)}</span>
        </div>
      </div>
      
      {/* Game status */}
      <div className="text-center my-4 py-2 bg-chess-dark border border-[rgba(255,255,255,0.08)] rounded-md">
        {gameState?.result ? (
          <div className="flex items-center justify-center gap-2 text-chess-accent font-bold">
            <Trophy className="h-5 w-5" />
            {gameState.result === '1-0' ? 'White wins' : 
             gameState.result === '0-1' ? 'Black wins' : 'Draw'}
          </div>
        ) : inCheck ? (
          <div className="flex items-center justify-center gap-2 text-red-500 font-bold">
            <Shield className="h-5 w-5" />
            {activePlayer === 'w' ? 'White' : 'Black'} is in check!
          </div>
        ) : (
          <p className="text-chess-text-light">
            {activePlayer === 'w' ? 'White to move' : 'Black to move'}
          </p>
        )}
      </div>
      
      {/* White player info */}
      <div className={cn(
        "flex items-center justify-between p-2 rounded-md",
        activePlayer === 'w' && !gameState?.result && "bg-chess-accent/20 transition-all"
      )}>
        <div className="flex items-center gap-3">
          <UserCircle className="h-8 w-8 text-chess-text-light" />
          <div>
            <p className="font-semibold text-chess-text-light">{gameState?.whitePlayer?.name || 'White'}</p>
            <p className="text-sm text-gray-400">{gameState?.whitePlayer?.rating || '1200'}</p>
          </div>
        </div>
        <div className={cn(
          "flex items-center gap-2 px-3 py-1 rounded-md bg-chess-dark border border-[rgba(255,255,255,0.12)]",
          whiteTime < 30 && "text-red-500 animate-pulse"
        )}>
          <Clock className="h-4 w-4" />
          <span className="font-mono">{formatTime(whiteTime)}</span>
        </div>
      </div>
    </div>
  );
};

export default GameInfo;
