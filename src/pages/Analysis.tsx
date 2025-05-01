
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import ChessboardComponent from '@/components/game/Chessboard';
import { Button } from '@/components/ui/button';
import {
  RotateCcw,
  RotateCw,
  Copy,
  Share2,
  Save,
  Upload,
  Download,
  Maximize,
  ArrowLeft,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import audioService from '@/services/audioService';

const Analysis = () => {
  const [fen, setFen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  const [boardFlipped, setBoardFlipped] = useState(false);
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [legalMoves, setLegalMoves] = useState<string[]>([]);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  const [pgn, setPgn] = useState('');
  const [moveIndex, setMoveIndex] = useState(0);
  const [moveHistory, setMoveHistory] = useState<string[]>([
    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
  ]);
  const [activeTab, setActiveTab] = useState('analysis');
  const [inCheck, setInCheck] = useState(false);
  const [checkSquare, setCheckSquare] = useState<string | null>(null);
  const [engineDepth, setEngineDepth] = useState(20);
  const [activeVariation, setActiveVariation] = useState(0);
  
  // Mock engine analysis
  const engineAnalysis = [
    { move: 'e4', evaluation: 0.3, depth: engineDepth, line: 'e4 e5 Nf3 Nc6 Bb5' },
    { move: 'd4', evaluation: 0.2, depth: engineDepth, line: 'd4 Nf6 c4 e6 Nc3' },
    { move: 'c4', evaluation: 0.1, depth: engineDepth, line: 'c4 e5 Nc3 Nf6 g3' },
  ];

  // Parse FEN to determine legal moves (simplified mock implementation)
  const calculateLegalMoves = (square: string, fen: string) => {
    // This would connect to a real chess engine in production
    // For now, return mock legal moves based on piece type

    // Extract piece at the selected square
    const file = square.charCodeAt(0) - 97; // 'a' is 97 in ASCII
    const rank = 8 - parseInt(square[1]);
    
    const fenParts = fen.split(' ');
    const board = fenParts[0];
    const activeColor = fenParts[1];
    
    const boardRows = board.split('/');
    
    // Find the piece at the selected square
    let currentRow = boardRows[rank];
    let currentFile = 0;
    let piece = null;
    
    for (const char of currentRow) {
      if (/\d/.test(char)) {
        currentFile += parseInt(char);
      } else {
        if (currentFile === file) {
          piece = char;
          break;
        }
        currentFile++;
      }
    }

    if (!piece) return [];

    const pieceColor = piece === piece.toUpperCase() ? 'w' : 'b';
    const pieceType = piece.toLowerCase();
    
    // Only allow moving pieces of the active color
    if (pieceColor !== activeColor) return [];

    // Sample mock legal moves based on piece type
    const moves: string[] = [];
    
    if (pieceType === 'p') {
      // Pawn moves
      if (pieceColor === 'w') {
        // White pawns move up the board (decreasing rank)
        const newRank = parseInt(square[1]) + 1;
        if (newRank <= 8) moves.push(`${square[0]}${newRank}`);
        if (square[1] === '2') moves.push(`${square[0]}4`); // Double move from starting position
        
        // Captures
        const fileChar = square.charCodeAt(0);
        if (fileChar > 97) moves.push(`${String.fromCharCode(fileChar - 1)}${newRank}`); // Capture left
        if (fileChar < 104) moves.push(`${String.fromCharCode(fileChar + 1)}${newRank}`); // Capture right
      } else {
        // Black pawns move down the board (increasing rank)
        const newRank = parseInt(square[1]) - 1;
        if (newRank >= 1) moves.push(`${square[0]}${newRank}`);
        if (square[1] === '7') moves.push(`${square[0]}5`); // Double move from starting position
        
        // Captures
        const fileChar = square.charCodeAt(0);
        if (fileChar > 97) moves.push(`${String.fromCharCode(fileChar - 1)}${newRank}`); // Capture left
        if (fileChar < 104) moves.push(`${String.fromCharCode(fileChar + 1)}${newRank}`); // Capture right
      }
    } else if (pieceType === 'n') {
      // Knight moves
      const fileChar = square.charCodeAt(0);
      const rank = parseInt(square[1]);
      
      const knightOffsets = [
        { file: 1, rank: 2 },
        { file: 2, rank: 1 },
        { file: 2, rank: -1 },
        { file: 1, rank: -2 },
        { file: -1, rank: -2 },
        { file: -2, rank: -1 },
        { file: -2, rank: 1 },
        { file: -1, rank: 2 }
      ];
      
      for (const offset of knightOffsets) {
        const newFile = fileChar + offset.file;
        const newRank = rank + offset.rank;
        
        if (newFile >= 97 && newFile <= 104 && newRank >= 1 && newRank <= 8) {
          moves.push(`${String.fromCharCode(newFile)}${newRank}`);
        }
      }
    } else if (pieceType === 'k') {
      // King moves (simplified)
      const fileChar = square.charCodeAt(0);
      const rank = parseInt(square[1]);
      
      const kingOffsets = [
        { file: 0, rank: 1 },
        { file: 1, rank: 1 },
        { file: 1, rank: 0 },
        { file: 1, rank: -1 },
        { file: 0, rank: -1 },
        { file: -1, rank: -1 },
        { file: -1, rank: 0 },
        { file: -1, rank: 1 }
      ];
      
      for (const offset of kingOffsets) {
        const newFile = fileChar + offset.file;
        const newRank = rank + offset.rank;
        
        if (newFile >= 97 && newFile <= 104 && newRank >= 1 && newRank <= 8) {
          moves.push(`${String.fromCharCode(newFile)}${newRank}`);
        }
      }
      
      // Castling (simplified check, would be more complex in real implementation)
      const castlingRights = fenParts[2];
      if (pieceColor === 'w' && rank === 1 && square === 'e1') {
        if (castlingRights.includes('K')) moves.push('g1'); // Kingside castle
        if (castlingRights.includes('Q')) moves.push('c1'); // Queenside castle
      } else if (pieceColor === 'b' && rank === 8 && square === 'e8') {
        if (castlingRights.includes('k')) moves.push('g8'); // Kingside castle
        if (castlingRights.includes('q')) moves.push('c8'); // Queenside castle
      }
    }
    
    // For other pieces, just return some plausible moves for UI demonstration
    // In a real implementation, this would calculate actual legal moves
    
    return moves;
  };

  const handleSquareClick = (square: string) => {
    audioService.playMoveSound();
    
    // If a square is already selected and the clicked square is a legal move
    if (selectedSquare && legalMoves.includes(square)) {
      // Make the move
      const newFen = makeMove(selectedSquare, square, fen);
      setFen(newFen);
      setLastMove({ from: selectedSquare, to: square });
      
      // Update move history
      const newMoveHistory = [...moveHistory.slice(0, moveIndex + 1), newFen];
      setMoveHistory(newMoveHistory);
      setMoveIndex(moveIndex + 1);
      
      // Update PGN (simplified)
      const move = `${selectedSquare}-${square}`;
      setPgn(pgn ? `${pgn} ${move}` : move);
      
      // Clear selection
      setSelectedSquare(null);
      setLegalMoves([]);
      
      // Check if the king is in check after the move (simplified)
      const inCheck = isKingInCheck(newFen);
      setInCheck(inCheck);
      if (inCheck) {
        const activeColor = newFen.split(' ')[1];
        setCheckSquare(findKingPosition(newFen, activeColor));
      } else {
        setCheckSquare(null);
      }
    } else {
      // Select the square
      setSelectedSquare(square);
      const moves = calculateLegalMoves(square, fen);
      setLegalMoves(moves);
    }
  };

  // Mock function to make a move (would use a chess engine in production)
  const makeMove = (from: string, to: string, currentFen: string) => {
    // This is a simplified implementation just for UI demonstration
    // In a real implementation, this would use a chess engine to validate and make the move
    
    // For now, just return the current FEN with alternating turn
    const fenParts = currentFen.split(' ');
    fenParts[1] = fenParts[1] === 'w' ? 'b' : 'w'; // Switch active color
    fenParts[3] = '-'; // Reset en passant target
    fenParts[5] = (parseInt(fenParts[5]) + (fenParts[1] === 'w' ? 0 : 1)).toString(); // Increment fullmove counter
    
    return fenParts.join(' ');
  };

  // Mock function to check if king is in check
  const isKingInCheck = (fen: string) => {
    // This would be implemented with a chess engine in production
    // For demonstration, randomly return true or false occasionally
    return Math.random() < 0.2; // 20% chance of being in check
  };

  // Mock function to find king's position
  const findKingPosition = (fen: string, activeColor: string) => {
    // This would be implemented with a chess engine in production
    // For now, return fixed positions
    return activeColor === 'w' ? 'e1' : 'e8';
  };

  // Handle navigation through move history
  const goToMove = (index: number) => {
    if (index >= 0 && index < moveHistory.length) {
      setFen(moveHistory[index]);
      setMoveIndex(index);
      
      // If we're not at the last move, clear the last move highlight
      if (index < moveHistory.length - 1) {
        setLastMove(null);
      }
      
      // Clear selection
      setSelectedSquare(null);
      setLegalMoves([]);
      
      audioService.playMoveSound();
    }
  };

  // Handle board flipping
  const handleFlipBoard = () => {
    setBoardFlipped(!boardFlipped);
    audioService.playNotificationSound();
  };

  // Handle resetting the board
  const handleResetBoard = () => {
    const startingFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    setFen(startingFen);
    setMoveHistory([startingFen]);
    setMoveIndex(0);
    setPgn('');
    setLastMove(null);
    setSelectedSquare(null);
    setLegalMoves([]);
    setInCheck(false);
    setCheckSquare(null);
    
    audioService.playGameStartSound();
    toast.info('Board reset to starting position');
  };

  // Handle copying FEN to clipboard
  const handleCopyFen = () => {
    navigator.clipboard.writeText(fen);
    toast.success('FEN copied to clipboard');
  };

  // Handle sharing analysis
  const handleShareAnalysis = () => {
    // Generate a shareable link (would integrate with actual sharing functionality in production)
    const shareableLink = `${window.location.origin}/analysis?fen=${encodeURIComponent(fen)}`;
    navigator.clipboard.writeText(shareableLink);
    toast.success('Analysis link copied to clipboard');
  };

  // Handle saving analysis
  const handleSaveAnalysis = () => {
    // This would save to user's account in production
    toast.success('Analysis saved');
  };

  // Handle importing game PGN
  const handleImportPgn = () => {
    // This would open a modal to paste PGN in production
    toast.info('PGN import coming soon');
  };

  // Handle exporting game PGN
  const handleExportPgn = () => {
    // This would generate proper PGN in production
    navigator.clipboard.writeText(pgn);
    toast.success('PGN copied to clipboard');
  };
  
  // Load initial position from URL if provided
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const fenParam = urlParams.get('fen');
    if (fenParam) {
      setFen(fenParam);
      setMoveHistory([fenParam]);
    }
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-bold text-chess-text-light mb-6 flex items-center">
          <BookOpen className="h-8 w-8 mr-3 text-chess-accent" />
          Analysis Board
        </h1>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left side - Chess board */}
          <div className="w-full lg:w-2/3">
            <ChessboardComponent
              fen={fen}
              playerColor={boardFlipped ? 'b' : 'w'}
              lastMove={lastMove}
              selectedSquare={selectedSquare}
              legalMoves={legalMoves}
              onSquareClick={handleSquareClick}
              inCheck={inCheck}
              checkSquare={checkSquare}
            />
            
            {/* Board controls */}
            <div className="mt-4 grid grid-cols-3 sm:grid-cols-6 gap-2 md:gap-3">
              <Button 
                variant="outline"
                className="border-[rgba(255,255,255,0.2)] text-chess-text-light hover:bg-white/5"
                onClick={handleFlipBoard}
              >
                <RotateCw className="h-4 w-4 mr-2" />
                Flip
              </Button>
              <Button 
                variant="outline"
                className="border-[rgba(255,255,255,0.2)] text-chess-text-light hover:bg-white/5"
                onClick={handleResetBoard}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button 
                variant="outline"
                className="border-[rgba(255,255,255,0.2)] text-chess-text-light hover:bg-white/5"
                onClick={handleCopyFen}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy FEN
              </Button>
              <Button 
                variant="outline"
                className="border-[rgba(255,255,255,0.2)] text-chess-text-light hover:bg-white/5"
                onClick={handleShareAnalysis}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button 
                variant="outline"
                className="border-[rgba(255,255,255,0.2)] text-chess-text-light hover:bg-white/5"
                onClick={handleSaveAnalysis}
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button 
                variant="outline"
                className="border-[rgba(255,255,255,0.2)] text-chess-text-light hover:bg-white/5 col-span-1 sm:col-span-2 md:col-span-1"
                onClick={() => toast.info('Full screen mode coming soon')}
              >
                <Maximize className="h-4 w-4 mr-2" />
                Fullscreen
              </Button>
            </div>
            
            {/* Move navigation */}
            <div className="mt-4 grid grid-cols-4 gap-2">
              <Button 
                variant="outline"
                className="border-[rgba(255,255,255,0.2)] text-chess-text-light hover:bg-white/5"
                onClick={() => goToMove(0)}
                disabled={moveIndex === 0}
              >
                First
              </Button>
              <Button 
                variant="outline"
                className="border-[rgba(255,255,255,0.2)] text-chess-text-light hover:bg-white/5"
                onClick={() => goToMove(moveIndex - 1)}
                disabled={moveIndex === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <Button 
                variant="outline"
                className="border-[rgba(255,255,255,0.2)] text-chess-text-light hover:bg-white/5"
                onClick={() => goToMove(moveIndex + 1)}
                disabled={moveIndex === moveHistory.length - 1}
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button 
                variant="outline"
                className="border-[rgba(255,255,255,0.2)] text-chess-text-light hover:bg-white/5"
                onClick={() => goToMove(moveHistory.length - 1)}
                disabled={moveIndex === moveHistory.length - 1}
              >
                Last
              </Button>
            </div>
            
            {/* Import/Export buttons */}
            <div className="mt-4 flex gap-2">
              <Button 
                variant="outline"
                className="flex-1 border-[rgba(255,255,255,0.2)] text-chess-text-light hover:bg-white/5"
                onClick={handleImportPgn}
              >
                <Upload className="h-4 w-4 mr-2" />
                Import PGN
              </Button>
              <Button 
                variant="outline"
                className="flex-1 border-[rgba(255,255,255,0.2)] text-chess-text-light hover:bg-white/5"
                onClick={handleExportPgn}
              >
                <Download className="h-4 w-4 mr-2" />
                Export PGN
              </Button>
            </div>
          </div>
          
          {/* Right side - Analysis tools */}
          <div className="w-full lg:w-1/3">
            <Tabs defaultValue="analysis" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full bg-chess-dark border border-[rgba(255,255,255,0.1)]">
                <TabsTrigger value="analysis" className="flex-1">Engine Analysis</TabsTrigger>
                <TabsTrigger value="moves" className="flex-1">Move List</TabsTrigger>
                <TabsTrigger value="notes" className="flex-1">Notes</TabsTrigger>
              </TabsList>
              
              <TabsContent value="analysis" className="border border-[rgba(255,255,255,0.1)] rounded-md mt-2 p-4 bg-chess-dark min-h-[24rem]">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-chess-text-light">Stockfish {engineDepth}</h3>
                  <div className="flex items-center">
                    <span className="text-gray-400 mr-2">Depth:</span>
                    <select
                      value={engineDepth}
                      onChange={(e) => setEngineDepth(parseInt(e.target.value))}
                      className="bg-chess-dark border border-[rgba(255,255,255,0.2)] rounded px-2 py-1 text-chess-text-light"
                    >
                      <option value={10}>10</option>
                      <option value={15}>15</option>
                      <option value={20}>20</option>
                      <option value={25}>25</option>
                      <option value={30}>30</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {engineAnalysis.map((analysis, index) => (
                    <div 
                      key={index}
                      className={`p-3 rounded-md ${
                        activeVariation === index 
                          ? 'bg-chess-accent/20 border border-chess-accent' 
                          : 'bg-chess-dark/30 hover:bg-white/5 border border-[rgba(255,255,255,0.1)]'
                      } cursor-pointer transition-all`}
                      onClick={() => setActiveVariation(index)}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center">
                          <span className="font-bold text-chess-accent text-lg mr-2">{analysis.move}</span>
                          <span className="text-gray-400 text-sm">Depth {analysis.depth}</span>
                        </div>
                        <div className={`font-mono ${
                          analysis.evaluation > 0 ? 'text-green-500' : 
                          analysis.evaluation < 0 ? 'text-red-500' : 'text-gray-400'
                        }`}>
                          {analysis.evaluation > 0 ? '+' : ''}{analysis.evaluation.toFixed(2)}
                        </div>
                      </div>
                      <div className="text-sm text-gray-300 font-mono">
                        {analysis.line.split(' ').map((move, i) => (
                          <span key={i} className="mr-1">
                            {i % 2 === 0 && i > 0 && <span className="text-gray-500 mr-1">{Math.ceil(i/2)}.</span>}
                            {move}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="moves" className="border border-[rgba(255,255,255,0.1)] rounded-md mt-2 p-4 bg-chess-dark min-h-[24rem]">
                <h3 className="text-lg font-medium text-chess-text-light mb-4">Move List</h3>
                
                {moveHistory.length > 1 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {Array.from({ length: Math.ceil((moveHistory.length - 1) / 2) }, (_, i) => i).map((moveNum) => (
                      <React.Fragment key={moveNum}>
                        <div 
                          className={`flex items-center p-2 rounded ${
                            moveIndex === moveNum * 2 + 1 ? 'bg-chess-accent/30' : 'hover:bg-white/5'
                          } cursor-pointer`}
                          onClick={() => goToMove(moveNum * 2 + 1)}
                        >
                          <span className="text-gray-400 mr-2">{moveNum + 1}.</span>
                          <span className="text-chess-text-light">e4</span>
                        </div>
                        
                        {moveNum * 2 + 2 < moveHistory.length && (
                          <div 
                            className={`flex items-center p-2 rounded ${
                              moveIndex === moveNum * 2 + 2 ? 'bg-chess-accent/30' : 'hover:bg-white/5'
                            } cursor-pointer`}
                            onClick={() => goToMove(moveNum * 2 + 2)}
                          >
                            <span className="text-chess-text-light">e5</span>
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-400 text-center py-8">
                    No moves yet. Start playing!
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="notes" className="border border-[rgba(255,255,255,0.1)] rounded-md mt-2 p-4 bg-chess-dark min-h-[24rem]">
                <h3 className="text-lg font-medium text-chess-text-light mb-4">Analysis Notes</h3>
                <textarea 
                  className="w-full h-64 p-3 bg-chess-dark border border-[rgba(255,255,255,0.2)] rounded-md text-chess-text-light focus:outline-none focus:border-chess-accent"
                  placeholder="Add your analysis notes here..."
                ></textarea>
                <Button className="mt-4 bg-chess-accent text-chess-text-light hover:bg-opacity-90">
                  Save Notes
                </Button>
              </TabsContent>
            </Tabs>
            
            <div className="mt-4 p-4 border border-[rgba(255,255,255,0.1)] rounded-md bg-chess-dark">
              <h3 className="text-lg font-medium text-chess-text-light mb-2">Current Position</h3>
              <div className="text-sm text-gray-300 font-mono break-all">
                {fen}
              </div>
              <div className="flex justify-between mt-4">
                <div className="text-sm text-gray-400">
                  <span className="font-medium text-chess-text-light">Turn:</span> {fen.split(' ')[1] === 'w' ? 'White' : 'Black'}
                </div>
                <div className="text-sm text-gray-400">
                  <span className="font-medium text-chess-text-light">Move:</span> {Math.floor(parseInt(fen.split(' ')[5]) / 2) + 1}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Analysis;
