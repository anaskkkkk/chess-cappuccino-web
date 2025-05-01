
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import audioService from '@/services/audioService';

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

    // Map of piece types to their SVG icons - improved visually
    const getPieceIcon = (type: string, isWhite: boolean) => {
      // The SVG paths for each piece
      const pieces: Record<string, React.ReactNode> = {
        'k': (
          <svg viewBox="0 0 45 45" className="w-full h-full">
            <g fill={isWhite ? "#fff" : "#000"} stroke={isWhite ? "#000" : "#000"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              {isWhite ? (
                <>
                  <path d="M 22.5,11.63 L 22.5,6" strokeLinecap="round" />
                  <path d="M 20,8 L 25,8" strokeLinecap="round" />
                  <path d="M 22.5,25 C 22.5,25 27,17.5 25.5,14.5 C 25.5,14.5 24.5,12 22.5,12 C 20.5,12 19.5,14.5 19.5,14.5 C 18,17.5 22.5,25 22.5,25" fill="#fff" strokeLinecap="butt" />
                  <path d="M 12.5,37 C 18,40.5 27,40.5 32.5,37 L 32.5,30 C 32.5,30 41.5,25.5 38.5,19.5 C 34.5,13 25,16 22.5,23.5 L 22.5,27 L 22.5,23.5 C 20,16 10.5,13 6.5,19.5 C 3.5,25.5 12.5,30 12.5,30 L 12.5,37" fill="#fff" />
                  <path d="M 12.5,30 C 18,27 27,27 32.5,30" />
                  <path d="M 12.5,33.5 C 18,30.5 27,30.5 32.5,33.5" />
                  <path d="M 12.5,37 C 18,34 27,34 32.5,37" />
                </>
              ) : (
                <>
                  <path d="M 22.5,11.63 L 22.5,6" strokeLinecap="round" />
                  <path d="M 20,8 L 25,8" strokeLinecap="round" />
                  <path d="M 22.5,25 C 22.5,25 27,17.5 25.5,14.5 C 25.5,14.5 24.5,12 22.5,12 C 20.5,12 19.5,14.5 19.5,14.5 C 18,17.5 22.5,25 22.5,25" fill="#000" strokeLinecap="butt" />
                  <path d="M 12.5,37 C 18,40.5 27,40.5 32.5,37 L 32.5,30 C 32.5,30 41.5,25.5 38.5,19.5 C 34.5,13 25,16 22.5,23.5 L 22.5,27 L 22.5,23.5 C 20,16 10.5,13 6.5,19.5 C 3.5,25.5 12.5,30 12.5,30 L 12.5,37" fill="#000" />
                  <path d="M 12.5,30 C 18,27 27,27 32.5,30" stroke="#fff" />
                  <path d="M 12.5,33.5 C 18,30.5 27,30.5 32.5,33.5" stroke="#fff" />
                  <path d="M 12.5,37 C 18,34 27,34 32.5,37" stroke="#fff" />
                </>
              )}
            </g>
          </svg>
        ),
        'q': (
          <svg viewBox="0 0 45 45" className="w-full h-full">
            <g fill={isWhite ? "#fff" : "#000"} stroke={isWhite ? "#000" : "#000"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              {isWhite ? (
                <>
                  <path d="M 9,26 C 17.5,24.5 30,24.5 36,26 L 38.5,13.5 L 31,25 L 30.7,10.9 L 25.5,24.5 L 22.5,10 L 19.5,24.5 L 14.3,10.9 L 14,25 L 6.5,13.5 L 9,26 z" fill="#fff" />
                  <path d="M 9,26 C 9,28 10.5,28 11.5,30 C 12.5,31.5 12.5,31 12,33.5 C 10.5,34.5 11,36 11,36 C 9.5,37.5 11,38.5 11,38.5 C 17.5,39.5 27.5,39.5 34,38.5 C 34,38.5 35.5,37.5 34,36 C 34,36 34.5,34.5 33,33.5 C 32.5,31 32.5,31.5 33.5,30 C 34.5,28 36,28 36,26 C 27.5,24.5 17.5,24.5 9,26 z" fill="#fff" />
                  <path d="M 11.5,30 C 15,29 30,29 33.5,30" />
                  <path d="M 12,33.5 C 18,32.5 27,32.5 33,33.5" />
                </>
              ) : (
                <>
                  <path d="M 9,26 C 17.5,24.5 30,24.5 36,26 L 38.5,13.5 L 31,25 L 30.7,10.9 L 25.5,24.5 L 22.5,10 L 19.5,24.5 L 14.3,10.9 L 14,25 L 6.5,13.5 L 9,26 z" fill="#000" />
                  <path d="M 9,26 C 9,28 10.5,28 11.5,30 C 12.5,31.5 12.5,31 12,33.5 C 10.5,34.5 11,36 11,36 C 9.5,37.5 11,38.5 11,38.5 C 17.5,39.5 27.5,39.5 34,38.5 C 34,38.5 35.5,37.5 34,36 C 34,36 34.5,34.5 33,33.5 C 32.5,31 32.5,31.5 33.5,30 C 34.5,28 36,28 36,26 C 27.5,24.5 17.5,24.5 9,26 z" fill="#000" />
                  <path d="M 11.5,30 C 15,29 30,29 33.5,30" stroke="#fff" />
                  <path d="M 12,33.5 C 18,32.5 27,32.5 33,33.5" stroke="#fff" />
                </>
              )}
            </g>
          </svg>
        ),
        'r': (
          <svg viewBox="0 0 45 45" className="w-full h-full">
            <g fill={isWhite ? "#fff" : "#000"} stroke={isWhite ? "#000" : "#000"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              {isWhite ? (
                <>
                  <path d="M 9,39 L 36,39 L 36,36 L 9,36 L 9,39 z" />
                  <path d="M 12.5,32 L 14,29.5 L 31,29.5 L 32.5,32 L 12.5,32 z" />
                  <path d="M 12,36 L 12,32 L 33,32 L 33,36 L 12,36 z" />
                  <path d="M 14,29.5 L 14,16.5 L 31,16.5 L 31,29.5 L 14,29.5 z" fill="#fff" />
                  <path d="M 14,16.5 L 11,14 L 34,14 L 31,16.5 L 14,16.5 z" />
                  <path d="M 11,14 L 11,9 L 15,9 L 15,11 L 20,11 L 20,9 L 25,9 L 25,11 L 30,11 L 30,9 L 34,9 L 34,14 L 11,14 z" />
                </>
              ) : (
                <>
                  <path d="M 9,39 L 36,39 L 36,36 L 9,36 L 9,39 z" />
                  <path d="M 12.5,32 L 14,29.5 L 31,29.5 L 32.5,32 L 12.5,32 z" />
                  <path d="M 12,36 L 12,32 L 33,32 L 33,36 L 12,36 z" />
                  <path d="M 14,29.5 L 14,16.5 L 31,16.5 L 31,29.5 L 14,29.5 z" fill="#000" />
                  <path d="M 14,16.5 L 11,14 L 34,14 L 31,16.5 L 14,16.5 z" />
                  <path d="M 11,14 L 11,9 L 15,9 L 15,11 L 20,11 L 20,9 L 25,9 L 25,11 L 30,11 L 30,9 L 34,9 L 34,14 L 11,14 z" />
                </>
              )}
            </g>
          </svg>
        ),
        'b': (
          <svg viewBox="0 0 45 45" className="w-full h-full">
            <g fill={isWhite ? "#fff" : "#000"} stroke={isWhite ? "#000" : "#000"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              {isWhite ? (
                <>
                  <g fill="none" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M 9,36 C 12.39,35.03 19.11,36.43 22.5,34 C 25.89,36.43 32.61,35.03 36,36 C 36,36 37.65,36.54 39,38 C 38.32,38.97 37.35,38.99 36,38.5 C 32.61,37.53 25.89,38.96 22.5,37.5 C 19.11,38.96 12.39,37.53 9,38.5 C 7.65,38.99 6.68,38.97 6,38 C 7.35,36.54 9,36 9,36 z" />
                    <path d="M 15,32 C 17.5,34.5 27.5,34.5 30,32 C 30.5,30.5 30,30 30,30 C 30,27.5 27.5,26 27.5,26 C 33,24.5 33.5,14.5 22.5,10.5 C 11.5,14.5 12,24.5 17.5,26 C 17.5,26 15,27.5 15,30 C 15,30 14.5,30.5 15,32 z" />
                    <path d="M 25 8 A 2.5 2.5 0 1 1  20,8 A 2.5 2.5 0 1 1  25 8 z" />
                  </g>
                  <path d="M 17.5,26 L 27.5,26 M 15,30 L 30,30 M 22.5,15.5 L 22.5,20.5 M 20,18 L 25,18" stroke="#000" strokeLinejoin="miter" />
                </>
              ) : (
                <>
                  <g fill="none" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M 9,36 C 12.39,35.03 19.11,36.43 22.5,34 C 25.89,36.43 32.61,35.03 36,36 C 36,36 37.65,36.54 39,38 C 38.32,38.97 37.35,38.99 36,38.5 C 32.61,37.53 25.89,38.96 22.5,37.5 C 19.11,38.96 12.39,37.53 9,38.5 C 7.65,38.99 6.68,38.97 6,38 C 7.35,36.54 9,36 9,36 z" />
                    <path d="M 15,32 C 17.5,34.5 27.5,34.5 30,32 C 30.5,30.5 30,30 30,30 C 30,27.5 27.5,26 27.5,26 C 33,24.5 33.5,14.5 22.5,10.5 C 11.5,14.5 12,24.5 17.5,26 C 17.5,26 15,27.5 15,30 C 15,30 14.5,30.5 15,32 z" />
                    <path d="M 25 8 A 2.5 2.5 0 1 1  20,8 A 2.5 2.5 0 1 1  25 8 z" />
                  </g>
                  <path d="M 17.5,26 L 27.5,26 M 15,30 L 30,30 M 22.5,15.5 L 22.5,20.5 M 20,18 L 25,18" stroke="#fff" strokeLinejoin="miter" />
                </>
              )}
            </g>
          </svg>
        ),
        'n': (
          <svg viewBox="0 0 45 45" className="w-full h-full">
            <g fill={isWhite ? "#fff" : "#000"} stroke={isWhite ? "#000" : "#000"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              {isWhite ? (
                <>
                  <path d="M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,32.5 23,18" fill="#fff" />
                  <path d="M 24,18 C 24.38,20.91 18.45,25.37 16,27 C 13,29 13.18,31.34 11,31 C 9.958,30.06 12.41,27.96 11,28 C 10,28 11.19,29.23 10,30 C 9,30 5.997,31 6,26 C 6,24 12,14 12,14 C 12,14 13.89,12.1 14,10.5 C 13.27,9.506 13.5,8.5 13.5,7.5 C 14.5,6.5 16.5,10 16.5,10 L 18.5,10 C 18.5,10 19.28,8.008 21,7 C 22,7 22,10 22,10" fill="#fff" />
                  <path d="M 9.5 25.5 A 0.5 0.5 0 1 1 8.5,25.5 A 0.5 0.5 0 1 1 9.5 25.5 z" />
                  <path d="M 15 15.5 A 0.5 1.5 0 1 1  14,15.5 A 0.5 1.5 0 1 1  15 15.5 z" transform="matrix(0.866,0.5,-0.5,0.866,9.693,-5.173)" />
                </>
              ) : (
                <>
                  <path d="M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,32.5 23,18" fill="#000" />
                  <path d="M 24,18 C 24.38,20.91 18.45,25.37 16,27 C 13,29 13.18,31.34 11,31 C 9.958,30.06 12.41,27.96 11,28 C 10,28 11.19,29.23 10,30 C 9,30 5.997,31 6,26 C 6,24 12,14 12,14 C 12,14 13.89,12.1 14,10.5 C 13.27,9.506 13.5,8.5 13.5,7.5 C 14.5,6.5 16.5,10 16.5,10 L 18.5,10 C 18.5,10 19.28,8.008 21,7 C 22,7 22,10 22,10" fill="#000" />
                  <path d="M 9.5 25.5 A 0.5 0.5 0 1 1 8.5,25.5 A 0.5 0.5 0 1 1 9.5 25.5 z" fill="#fff" />
                  <path d="M 15 15.5 A 0.5 1.5 0 1 1  14,15.5 A 0.5 1.5 0 1 1  15 15.5 z" transform="matrix(0.866,0.5,-0.5,0.866,9.693,-5.173)" fill="#fff" />
                </>
              )}
            </g>
          </svg>
        ),
        'p': (
          <svg viewBox="0 0 45 45" className="w-full h-full">
            <g fill={isWhite ? "#fff" : "#000"} stroke={isWhite ? "#000" : "#000"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              {isWhite ? (
                <path d="M 22,9 C 19.79,9 18,10.79 18,13 C 18,13.89 18.29,14.71 18.78,15.38 C 16.83,16.5 15.5,18.59 15.5,21 C 15.5,23.03 16.44,24.84 17.91,26.03 C 14.91,27.09 10.5,31.58 10.5,39.5 L 33.5,39.5 C 33.5,31.58 29.09,27.09 26.09,26.03 C 27.56,24.84 28.5,23.03 28.5,21 C 28.5,18.59 27.17,16.5 25.22,15.38 C 25.71,14.71 26,13.89 26,13 C 26,10.79 24.21,9 22,9 z" />
              ) : (
                <path d="M 22,9 C 19.79,9 18,10.79 18,13 C 18,13.89 18.29,14.71 18.78,15.38 C 16.83,16.5 15.5,18.59 15.5,21 C 15.5,23.03 16.44,24.84 17.91,26.03 C 14.91,27.09 10.5,31.58 10.5,39.5 L 33.5,39.5 C 33.5,31.58 29.09,27.09 26.09,26.03 C 27.56,24.84 28.5,23.03 28.5,21 C 28.5,18.59 27.17,16.5 25.22,15.38 C 25.71,14.71 26,13.89 26,13 C 26,10.79 24.21,9 22,9 z" />
              )}
            </g>
          </svg>
        )
      };

      return pieces[type];
    };

    return (
      <div className={cn(
        "piece-container w-3/5 h-3/5 transition-transform", 
        selectedSquare && `hover:scale-110 cursor-pointer`
      )}>
        {getPieceIcon(pieceType, isWhite)}
      </div>
    );
  };

  // Handle square click
  const handleSquareClick = (square: string) => {
    if (onSquareClick) {
      // Play a subtle sound when clicking
      if (selectedSquare && legalMoves.includes(square)) {
        audioService.playMoveSound();
      } else if (square !== selectedSquare) {
        audioService.playNotificationSound();
      }
      
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

  // Determine if a square has a piece that can be moved (for cursor styling)
  const isMovablePiece = (square: string) => {
    const rowIndex = 7 - parseInt(square[1]) + 1;
    const colIndex = square.charCodeAt(0) - 97; // 'a' is 97 in ASCII
    
    const piece = board[rowIndex]?.[colIndex];
    if (!piece) return false;
    
    const pieceColor = piece === piece.toUpperCase() ? 'w' : 'b';
    return pieceColor === playerColor && onSquareClick !== undefined;
  };

  return (
    <div className="w-full mb-6 select-none animate-fade-in">
      <div 
        ref={boardRef} 
        className="w-full aspect-square grid grid-cols-8 border-4 border-chess-accent/80 rounded-md overflow-hidden shadow-2xl"
      >
        {displayRanks.map((rank, rankIndex) => (
          displayFiles.map((file, fileIndex) => {
            const isDark = (rankIndex + fileIndex) % 2 === 1;
            const squareName = `${file}${rank}`;
            const highlight = getSquareHighlight(file, rank);
            const isMovable = isMovablePiece(squareName);
            
            // Map to the correct piece in the board array
            const rowIndex = 7 - parseInt(rank) + 1;
            const colIndex = file.charCodeAt(0) - 97; // 'a' is 97 in ASCII
            
            const piece = board[rowIndex]?.[colIndex] ?? null;

            return (
              <div
                key={squareName}
                className={cn(
                  "square relative flex items-center justify-center text-4xl transition-all",
                  isDark ? "bg-chess-beige-300" : "bg-chess-beige-100",
                  highlight === 'selected' && "bg-chess-accent/50",
                  highlight === 'legal-move' && "before:absolute before:w-1/3 before:h-1/3 before:rounded-full before:bg-chess-accent/40",
                  highlight === 'last-move' && "bg-chess-accent/20",
                  highlight === 'check' && "bg-red-500/40",
                  isMovable && "cursor-pointer hover:brightness-90",
                  "hover:brightness-95 transition-all duration-200",
                  (lastMove?.to === squareName) && "animate-piece-move"
                )}
                onClick={() => handleSquareClick(squareName)}
              >
                {getPieceComponent(piece)}
                
                {/* Legal move indicators with improved styling */}
                {highlight === 'legal-move' && piece && (
                  <div className="absolute inset-0 border-2 border-chess-accent/50 rounded-full w-full h-full bg-transparent"></div>
                )}
                
                {/* Coordinates on the edge squares with improved styling */}
                {fileIndex === 0 && (
                  <span className="absolute top-1 left-1 text-xs font-bold text-chess-text-dark/80 select-none">
                    {rank}
                  </span>
                )}
                {rankIndex === 7 && (
                  <span className="absolute bottom-1 right-1 text-xs font-bold text-chess-text-dark/80 select-none">
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
