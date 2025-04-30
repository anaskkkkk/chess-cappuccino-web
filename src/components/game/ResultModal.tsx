
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Award, ArrowRight, RotateCcw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ResultModalProps {
  result: '1-0' | '0-1' | '½-½';
  whitePlayer: string;
  blackPlayer: string;
  onClose: () => void;
}

const ResultModal: React.FC<ResultModalProps> = ({
  result,
  whitePlayer,
  blackPlayer,
  onClose
}) => {
  const getResultText = () => {
    switch (result) {
      case '1-0':
        return `${whitePlayer} wins`;
      case '0-1':
        return `${blackPlayer} wins`;
      case '½-½':
        return 'Game drawn';
      default:
        return 'Game over';
    }
  };

  const getResultDescription = () => {
    switch (result) {
      case '1-0':
        return 'White won by checkmate';
      case '0-1':
        return 'Black won by checkmate';
      case '½-½':
        return 'Game drawn by agreement';
      default:
        return '';
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-chess-dark text-chess-text-light border border-[rgba(255,255,255,0.12)] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold mb-2">
            {getResultText()}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-6">
          <div className="flex justify-center mb-6">
            <Award className="h-16 w-16 text-chess-accent" />
          </div>
          
          <div className="flex justify-between items-center bg-chess-dark/50 p-4 rounded-lg border border-[rgba(255,255,255,0.08)] mb-4">
            <div className="text-left">
              <p className="font-semibold">{whitePlayer}</p>
              <p className="text-sm text-gray-400">1200</p>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold">
                {result === '1-0' ? '1' : result === '½-½' ? '½' : '0'}
              </span>
              <ArrowRight className="h-4 w-4 text-gray-400" />
              <span className="text-lg font-bold">
                {result === '0-1' ? '1' : result === '½-½' ? '½' : '0'}
              </span>
            </div>
            
            <div className="text-right">
              <p className="font-semibold">{blackPlayer}</p>
              <p className="text-sm text-gray-400">1200</p>
            </div>
          </div>
          
          <p className="text-center text-gray-400 mb-6">
            {getResultDescription()}
          </p>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            className="flex-1 border-chess-accent text-chess-accent hover:bg-chess-accent/10"
            onClick={onClose}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Review Game
          </Button>
          
          <Button 
            className="flex-1 bg-chess-accent text-chess-text-light hover:bg-opacity-90"
            asChild
          >
            <Link to="/play">
              <Home className="h-4 w-4 mr-2" />
              Return to Lobby
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResultModal;
