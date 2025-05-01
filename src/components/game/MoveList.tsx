
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MoveListProps {
  moves: string[];
  onMoveSelect?: (moveIndex: number) => void;
  currentMoveIndex?: number;
}

const MoveList: React.FC<MoveListProps> = ({ 
  moves, 
  onMoveSelect,
  currentMoveIndex = moves.length - 1 
}) => {
  // Group moves into pairs for move numbers (1. e4 e5, 2. Nf3 Nc6, etc.)
  const movePairs = [];
  for (let i = 0; i < moves.length; i += 2) {
    const whiteMove = moves[i];
    const blackMove = i + 1 < moves.length ? moves[i + 1] : null;
    movePairs.push({ whiteMove, blackMove, moveNumber: Math.floor(i / 2) + 1 });
  }

  const handleMoveClick = (moveIndex: number) => {
    if (onMoveSelect) {
      onMoveSelect(moveIndex);
    }
  };

  return (
    <div className="bg-chess-dark border border-[rgba(255,255,255,0.12)] rounded-lg p-4 shadow-md">
      <h2 className="text-xl font-bold text-chess-text-light mb-4">Move List</h2>
      
      <div className="h-40 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-chess-accent scrollbar-track-transparent">
        {movePairs.length > 0 ? (
          <table className="w-full text-chess-text-light">
            <tbody>
              {movePairs.map(({ whiteMove, blackMove, moveNumber }) => (
                <tr key={moveNumber} className="hover:bg-white/5">
                  <td className="py-1 px-2 w-8 text-gray-400">{moveNumber}.</td>
                  <td className={`py-1 px-2 font-mono cursor-pointer ${currentMoveIndex === (moveNumber - 1) * 2 ? 'bg-chess-accent/20 rounded' : ''}`}
                      onClick={() => handleMoveClick((moveNumber - 1) * 2)}>
                    {whiteMove}
                  </td>
                  <td className={`py-1 px-2 font-mono cursor-pointer ${blackMove && currentMoveIndex === (moveNumber - 1) * 2 + 1 ? 'bg-chess-accent/20 rounded' : ''}`}
                      onClick={() => blackMove && handleMoveClick((moveNumber - 1) * 2 + 1)}>
                    {blackMove || ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-400 text-center py-4">No moves yet</p>
        )}
      </div>
      
      {/* Navigation buttons */}
      {moves.length > 0 && (
        <div className="flex justify-between mt-3 border-t border-[rgba(255,255,255,0.08)] pt-3">
          <Button 
            variant="ghost" 
            size="sm"
            disabled={currentMoveIndex <= 0}
            onClick={() => onMoveSelect && onMoveSelect(Math.max(0, currentMoveIndex - 1))}
            className="text-chess-text-light hover:bg-white/5"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            disabled={currentMoveIndex >= moves.length - 1}
            onClick={() => onMoveSelect && onMoveSelect(Math.min(moves.length - 1, currentMoveIndex + 1))}
            className="text-chess-text-light hover:bg-white/5"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default MoveList;
