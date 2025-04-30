
import React from 'react';

const ChessBoardPreview = () => {
  // This is a simplified static preview board to show on the landing page
  // The actual interactive board will be more complex
  
  // Create an 8x8 board with alternating colors
  const renderSquare = (i: number, j: number) => {
    const isWhite = (i + j) % 2 === 0;
    const bgColor = isWhite ? 'bg-chess-beige-100' : 'bg-chess-accent';
    
    return (
      <div key={`${i}-${j}`} className={`${bgColor} w-full h-full`}></div>
    );
  };
  
  const renderBoard = () => {
    const board = [];
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        board.push(renderSquare(i, j));
      }
    }
    return board;
  };
  
  return (
    <div className="w-full max-w-md mx-auto aspect-square border border-chess-accent shadow-lg">
      <div className="grid grid-cols-8 grid-rows-8 w-full h-full">
        {renderBoard()}
      </div>
    </div>
  );
};

export default ChessBoardPreview;
