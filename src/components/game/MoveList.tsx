
import React from 'react';

interface MoveListProps {
  moves: string[];
}

const MoveList: React.FC<MoveListProps> = ({ moves }) => {
  // Group moves into pairs for move numbers (1. e4 e5, 2. Nf3 Nc6, etc.)
  const movePairs = [];
  for (let i = 0; i < moves.length; i += 2) {
    const whiteMove = moves[i];
    const blackMove = i + 1 < moves.length ? moves[i + 1] : null;
    movePairs.push({ whiteMove, blackMove, moveNumber: Math.floor(i / 2) + 1 });
  }

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
                  <td className="py-1 px-2 font-mono">{whiteMove}</td>
                  <td className="py-1 px-2 font-mono">{blackMove || ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-400 text-center py-4">No moves yet</p>
        )}
      </div>
    </div>
  );
};

export default MoveList;
