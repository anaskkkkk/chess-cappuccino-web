
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Flag, Handshake, RotateCw, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import audioService from '@/services/audioService';
import { toast } from 'sonner';

interface GameControlsProps {
  onResign: () => void;
  onOfferDraw: () => void;
  onFlipBoard: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({ onResign, onOfferDraw, onFlipBoard }) => {
  const [resignDialogOpen, setResignDialogOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(audioService.isMutedStatus());
  
  const handleResignConfirm = () => {
    audioService.playGameEndSound();
    onResign();
    setResignDialogOpen(false);
  };
  
  const handleToggleSound = () => {
    const newMutedState = audioService.toggleMute();
    setIsMuted(newMutedState);
    toast.info(newMutedState ? 'Sound muted' : 'Sound unmuted');
  };
  
  const handleOfferDraw = () => {
    audioService.playNotificationSound();
    onOfferDraw();
  };
  
  const handleFlipBoard = () => {
    audioService.playMoveSound();
    onFlipBoard();
  };
  
  return (
    <div className="flex justify-between items-center mt-2 bg-chess-dark border border-[rgba(255,255,255,0.12)] rounded-lg p-4 shadow-md animate-fade-in">
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="border-chess-accent text-chess-accent hover:bg-chess-accent/10 hover:border-opacity-100 transition-all"
          onClick={() => {
            audioService.playNotificationSound();
            setResignDialogOpen(true);
          }}
        >
          <Flag className="h-4 w-4 mr-2" />
          Resign
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="border-chess-accent text-chess-accent hover:bg-chess-accent/10 hover:border-opacity-100 transition-all"
          onClick={handleOfferDraw}
        >
          <Handshake className="h-4 w-4 mr-2" />
          Offer Draw
        </Button>
      </div>
      
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="border-[rgba(255,255,255,0.12)] text-chess-text-light hover:bg-white/5 hover:border-opacity-75 transition-all"
          onClick={() => {
            toast.info('Undo requested');
            audioService.playMoveSound();
          }}
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Undo
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="border-[rgba(255,255,255,0.12)] text-chess-text-light hover:bg-white/5 hover:border-opacity-75 transition-all"
          onClick={handleFlipBoard}
        >
          <RotateCw className="h-4 w-4 mr-2" />
          Flip Board
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="border-[rgba(255,255,255,0.12)] text-chess-text-light hover:bg-white/5 hover:border-opacity-75 transition-all"
          onClick={handleToggleSound}
        >
          {isMuted ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      {/* Resign confirmation dialog */}
      <Dialog open={resignDialogOpen} onOpenChange={setResignDialogOpen}>
        <DialogContent className="bg-chess-dark text-chess-text-light border border-[rgba(255,255,255,0.12)] animate-scale-in">
          <DialogHeader>
            <DialogTitle>Confirm Resignation</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to resign this game? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                audioService.playMoveSound();
                setResignDialogOpen(false);
              }}
              className="hover:bg-white/5 transition-all"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleResignConfirm}
              className="hover:bg-opacity-90 active:scale-[0.98] transition-all"
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
