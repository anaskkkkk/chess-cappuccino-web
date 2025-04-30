
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ChessboardComponent from '@/components/game/Chessboard';
import GameInfo from '@/components/game/GameInfo';
import MoveList from '@/components/game/MoveList';
import GameChat from '@/components/game/GameChat';
import GameControls from '@/components/game/GameControls';
import ResultModal from '@/components/game/ResultModal';
import { GameState } from '@/services/gameService';
import useWebSocket from '@/hooks/useWebSocket';
import { toast } from 'sonner';
import useGameStore from '@/stores/gameStore';
import { Loader2 } from 'lucide-react';
import { getGame } from '@/services/gameService';

const Game = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showResultModal, setShowResultModal] = useState(false);
  
  const { 
    gameState, 
    setGameState,
    playerColor,
    setPlayerColor,
    lastMove,
    setLastMove,
    selectedSquare,
    setSelectedSquare,
    legalMoves,
    setLegalMoves
  } = useGameStore();

  // Connect to WebSocket for this game
  const { send } = useWebSocket<GameState>(
    'game_update',
    (data) => {
      console.log('Received game update:', data);
      setGameState(data);
      
      // Check if game is over
      if (data.result) {
        setShowResultModal(true);
      }
    },
    {
      gameId,
      onOpen: () => {
        console.log('WebSocket connected for game:', gameId);
        toast.success('Connected to game server');
      },
      onClose: () => {
        console.log('WebSocket disconnected');
        toast.error('Disconnected from game server');
      },
      onError: (error) => {
        console.error('WebSocket error:', error);
        toast.error('Connection error. Please try again.');
      }
    }
  );

  // Fetch initial game state
  useEffect(() => {
    const fetchGameState = async () => {
      if (!gameId) {
        navigate('/play');
        return;
      }

      try {
        setLoading(true);
        const gameData = await getGame(gameId);
        setGameState(gameData);
        
        // Determine player color based on player ID (simplified, would use auth in real app)
        const isWhite = gameData.whitePlayer?.id === 'user_1'; // This would use the actual user ID in a real app
        setPlayerColor(isWhite ? 'w' : 'b');
        
        setLoading(false);
      } catch (error) {
        console.error('Failed to load game:', error);
        toast.error('Failed to load the game. Please try again.');
        navigate('/play');
      }
    };

    fetchGameState();
  }, [gameId, navigate, setGameState, setPlayerColor]);

  const handleMove = (from: string, to: string) => {
    const move = `${from}${to}`;
    console.log('Making move:', move);
    
    // Send move to server via WebSocket
    send({
      type: 'make_move',
      payload: {
        gameId,
        move
      }
    });
    
    // Update last move (will be confirmed by server response)
    setLastMove({ from, to });
    
    // Clear selection
    setSelectedSquare(null);
    setLegalMoves([]);
  };

  const handleSquareSelect = (square: string) => {
    // If a piece is already selected and the clicked square is a valid move
    if (selectedSquare && legalMoves.includes(square)) {
      handleMove(selectedSquare, square);
      return;
    }

    // Select the square if it has a piece of the player's color
    const piece = getPieceAt(square);
    if (piece && piece.color === playerColor) {
      setSelectedSquare(square);
      
      // Calculate legal moves for this piece
      // In a real app, this would come from a chess engine or the server
      // For now, we'll use a placeholder
      const mockLegalMoves = getMockLegalMoves(square);
      setLegalMoves(mockLegalMoves);
    } else {
      // Clear selection if clicking elsewhere
      setSelectedSquare(null);
      setLegalMoves([]);
    }
  };

  // Helper function to get piece at a square (placeholder implementation)
  const getPieceAt = (square: string): { type: string, color: string } | null => {
    // This would use the FEN from gameState to determine the piece
    // For now, return mock data based on starting position
    const ranks = gameState?.fen?.split(' ')[0].split('/') || [];
    if (!ranks.length) return null;
    
    const file = square.charCodeAt(0) - 97; // 'a' is 97 in ASCII
    const rank = 8 - parseInt(square[1]);
    
    if (rank < 0 || rank >= ranks.length) return null;
    
    let fileIndex = 0;
    for (let i = 0; i < ranks[rank].length; i++) {
      const char = ranks[rank][i];
      if (isNaN(parseInt(char))) {
        // It's a piece
        if (fileIndex === file) {
          const color = char === char.toUpperCase() ? 'w' : 'b';
          const type = char.toLowerCase();
          return { type, color };
        }
        fileIndex++;
      } else {
        // It's a number (empty squares)
        fileIndex += parseInt(char);
      }
    }
    
    return null;
  };

  // Mock function to generate legal moves (placeholder)
  const getMockLegalMoves = (square: string): string[] => {
    // In a real app, this would come from the chess engine or server
    // For demonstration, return some mock legal moves
    const file = square.charCodeAt(0) - 97; // 'a' is 97 in ASCII
    const rank = parseInt(square[1]);
    
    const piece = getPieceAt(square);
    if (!piece) return [];
    
    const moves: string[] = [];
    
    // Very basic pawn moves (just for demonstration)
    if (piece.type === 'p') {
      if (piece.color === 'w' && rank < 8) {
        moves.push(`${String.fromCharCode(97 + file)}${rank + 1}`);
        if (rank === 2) {
          moves.push(`${String.fromCharCode(97 + file)}${rank + 2}`);
        }
      } else if (piece.color === 'b' && rank > 1) {
        moves.push(`${String.fromCharCode(97 + file)}${rank - 1}`);
        if (rank === 7) {
          moves.push(`${String.fromCharCode(97 + file)}${rank - 2}`);
        }
      }
    }
    
    return moves;
  };

  const handleResign = () => {
    send({
      type: 'resign',
      payload: {
        gameId
      }
    });
  };

  const handleOfferDraw = () => {
    send({
      type: 'offer_draw',
      payload: {
        gameId
      }
    });
    toast.info('Draw offer sent to your opponent');
  };

  const handleCloseResultModal = () => {
    setShowResultModal(false);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-chess-accent" />
            <p className="text-chess-text-light text-xl">Loading game...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left side - Chess board */}
          <div className="w-full lg:w-2/3">
            <ChessboardComponent 
              fen={gameState?.fen || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'} 
              playerColor={playerColor}
              lastMove={lastMove}
              selectedSquare={selectedSquare}
              legalMoves={legalMoves}
              onSquareClick={handleSquareSelect}
            />
            <GameControls 
              onResign={handleResign} 
              onOfferDraw={handleOfferDraw} 
            />
          </div>

          {/* Right side - Game info, move list, chat */}
          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            <GameInfo gameState={gameState} />
            <MoveList moves={gameState?.moves || []} />
            <GameChat gameId={gameId || ''} />
          </div>
        </div>
      </div>
      
      {/* Result modal */}
      {showResultModal && gameState?.result && (
        <ResultModal 
          result={gameState.result} 
          whitePlayer={gameState.whitePlayer?.name || 'White'} 
          blackPlayer={gameState.blackPlayer?.name || 'Black'} 
          onClose={handleCloseResultModal} 
        />
      )}
    </Layout>
  );
};

export default Game;
