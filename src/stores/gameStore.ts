
import { create } from 'zustand';
import { GameState } from '@/services/gameService';

interface GameSquare {
  from: string;
  to: string;
}

interface GameStore {
  gameState: GameState | null;
  setGameState: (state: GameState) => void;
  playerColor: string;
  setPlayerColor: (color: string) => void;
  selectedSquare: string | null;
  setSelectedSquare: (square: string | null) => void;
  legalMoves: string[];
  setLegalMoves: (moves: string[]) => void;
  lastMove: GameSquare | null;
  setLastMove: (move: GameSquare | null) => void;
  inCheck: boolean;
  setInCheck: (inCheck: boolean) => void;
  checkSquare: string | null;
  setCheckSquare: (square: string | null) => void;
  boardOrientation: 'white' | 'black';
  flipBoard: () => void;
}

const useGameStore = create<GameStore>((set) => ({
  gameState: null,
  setGameState: (state) => set({ gameState: state }),
  playerColor: 'w',
  setPlayerColor: (color) => set({ playerColor: color }),
  selectedSquare: null,
  setSelectedSquare: (square) => set({ selectedSquare: square }),
  legalMoves: [],
  setLegalMoves: (moves) => set({ legalMoves: moves }),
  lastMove: null,
  setLastMove: (move) => set({ lastMove: move }),
  inCheck: false,
  setInCheck: (inCheck) => set({ inCheck }),
  checkSquare: null,
  setCheckSquare: (square) => set({ checkSquare: square }),
  boardOrientation: 'white',
  flipBoard: () => set((state) => ({ 
    boardOrientation: state.boardOrientation === 'white' ? 'black' : 'white' 
  })),
}));

export default useGameStore;
