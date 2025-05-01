
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Flag, Handshake, RotateCw, RotateCcw } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface GameControlsProps {
  onResign: () => void;
  onOfferDraw: () => void;
  onFlipBoard: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({ onResign, onOfferDraw, onFlipBoard }) => {
  const [resignDialogOpen, setResignDialogOpen] = useState(false);
  
  const handleResignConfirm = () => {
    onResign();
    setResignDialogOpen(false);
  };
  
  return (
    <div className="flex justify-between items-center mt-2 bg-chess-dark border border-[rgba(255,255,255,0.12)] rounded-lg p-4 shadow-md">
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="border-chess-accent text-chess-accent hover:bg-chess-accent/10"
          onClick={() => setResignDialogOpen(true)}
        >
          <Flag className="h-4 w-4 mr-2" />
          Resign
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="border-chess-accent text-chess-accent hover:bg-chess-accent/10"
          onClick={onOfferDraw}
        >
          <Handshake className="h-4 w-4 mr-2" />
          Offer Draw
        </Button>
      </div>
      
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="border-[rgba(255,255,255,0.12)] text-chess-text-light hover:bg-white/5"
          onClick={() => {}}
          disabled
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Undo
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="border-[rgba(255,255,255,0.12)] text-chess-text-light hover:bg-white/5"
          onClick={onFlipBoard}
        >
          <RotateCw className="h-4 w-4 mr-2" />
          Flip Board
        </Button>
      </div>
      
      {/* Resign confirmation dialog */}
      <Dialog open={resignDialogOpen} onOpenChange={setResignDialogOpen}>
        <DialogContent className="bg-chess-dark text-chess-text-light border border-[rgba(255,255,255,0.12)]">
          <DialogHeader>
            <DialogTitle>Confirm Resignation</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to resign this game? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setResignDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleResignConfirm}
            >
              Resign
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GameControls;
