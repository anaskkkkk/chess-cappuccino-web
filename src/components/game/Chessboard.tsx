import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface ChessboardProps {
  fen: string;
  playerColor: string;
  lastMove?: { from: string; to: string } | null;
  selectedSquare?: string | null;
  legalMoves?: string[];
  onSquareClick?: (square: string) => void;
  inCheck?: boolean;
  checkSquare?: string;
}

const ChessboardComponent: React.FC<ChessboardProps> = ({
  fen,
  playerColor,
  lastMove,
  selectedSquare,
  legalMoves = [],
  onSquareClick,
  inCheck = false,
  checkSquare = null
}) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  // Parse FEN string to get board position
  const parseFen = (fen: string) => {
    const [position] = fen.split(' ');
    const ranks = position.split('/');
    const board: (string | null)[][] = [];

    ranks.forEach(rank => {
      const row: (string | null)[] = [];
      for (let i = 0; i < rank.length; i++) {
        const char = rank[i];
        if (isNaN(parseInt(char))) {
          // It's a piece
          row.push(char);
        } else {
          // It's a number, representing empty squares
          for (let j = 0; j < parseInt(char); j++) {
            row.push(null);
          }
        }
      }
      board.push(row);
    });

    return board;
  };

  // Determine if the current position is in check
  const determineCheckSquare = (fen: string) => {
    // In a real app, this would be determined by chess logic
    // For now, we'll use the passed checkSquare prop
    return checkSquare;
  };

  const board = parseFen(fen);

  // Determine if board should be flipped (black's perspective)
  const isFlipped = playerColor === 'b';
  const displayRanks = isFlipped ? ranks.slice().reverse() : ranks;
  const displayFiles = isFlipped ? files.slice().reverse() : files;

  // Handle window resize to keep the board square
  useEffect(() => {
    const resizeBoard = () => {
      if (boardRef.current) {
        const width = boardRef.current.clientWidth;
        boardRef.current.style.height = `${width}px`;
      }
    };

    resizeBoard();
    window.addEventListener('resize', resizeBoard);
    
    return () => {
      window.removeEventListener('resize', resizeBoard);
    };
  }, []);

  // Get piece component based on piece type
  const getPieceComponent = (piece: string | null) => {
    if (!piece) return null;

    const isWhite = piece === piece.toUpperCase();
    const pieceType = piece.toLowerCase();

    // Map of piece types to their Unicode characters
    const pieceMap: Record<string, string> = {
      'k': isWhite ? '♔' : '♚', // King
      'q': isWhite ? '♕' : '♛', // Queen
      'r': isWhite ? '♖' : '♜', // Rook
      'b': isWhite ? '♗' : '♝', // Bishop
      'n': isWhite ? '♘' : '♞', // Knight
      'p': isWhite ? '♙' : '♟', // Pawn
    };

    return (
      <div className={`piece ${isWhite ? 'text-white' : 'text-black'}`}>
        {pieceMap[pieceType]}
      </div>
    );
  };

  // Handle square click
  const handleSquareClick = (square: string) => {
    if (onSquareClick) {
      onSquareClick(square);
    }
  };

  // Determine if a square is selected, a legal move, part of the last move, or in check
  const getSquareHighlight = (file: string, rank: string) => {
    const square = `${file}${rank}`;
    
    if (inCheck && square === checkSquare) {
      return 'check';
    } else if (selectedSquare === square) {
      return 'selected';
    } else if (legalMoves?.includes(square)) {
      return 'legal-move';
    } else if (lastMove?.from === square || lastMove?.to === square) {
      return 'last-move';
    }
    
    return '';
  };

  return (
    <div className="w-full mb-6">
      <div 
        ref={boardRef} 
        className="w-full aspect-square grid grid-cols-8 border border-chess-accent/50 rounded-md overflow-hidden shadow-lg"
      >
        {displayRanks.map((rank, rankIndex) => (
          displayFiles.map((file, fileIndex) => {
            const isDark = (rankIndex + fileIndex) % 2 === 1;
            const squareName = `${file}${rank}`;
            const highlight = getSquareHighlight(file, rank);
            
            // Map to the correct piece in the board array
            const rowIndex = 7 - parseInt(rank) + 1;
            const colIndex = file.charCodeAt(0) - 97; // 'a' is 97 in ASCII
            
            const piece = board[rowIndex]?.[colIndex] ?? null;

            return (
              <div
                key={squareName}
                className={cn(
                  "square relative flex items-center justify-center text-4xl cursor-pointer transition-all",
                  isDark ? "bg-chess-beige-300" : "bg-chess-beige-100",
                  highlight === 'selected' && "bg-chess-accent/50",
                  highlight === 'legal-move' && "after:absolute after:w-1/3 after:h-1/3 after:rounded-full after:bg-chess-accent/40",
                  highlight === 'last-move' && "bg-chess-accent/20",
                  highlight === 'check' && "bg-red-500/30",
                  "hover:brightness-90 transition-all"
                )}
                onClick={() => handleSquareClick(squareName)}
              >
                {getPieceComponent(piece)}
                
                {/* Coordinates on the edge squares */}
                {fileIndex === 0 && (
                  <span className="absolute top-1 left-1 text-xs font-bold text-chess-text-dark/80">
                    {rank}
                  </span>
                )}
                {rankIndex === 7 && (
                  <span className="absolute bottom-1 right-1 text-xs font-bold text-chess-text-dark/80">
                    {file}
                  </span>
                )}
              </div>
            );
          })
        ))}
      </div>
    </div>
  );
};

export default ChessboardComponent;
