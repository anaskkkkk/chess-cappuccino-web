import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  Users, 
  Trophy, 
  Search, 
  UserPlus, 
  Sparkles, 
  BookOpen, 
  Eye,
  Gamepad,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { createGame } from '@/services/gameService';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useLanguageContext } from '@/contexts/LanguageContext';

const Play = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);
  const [showFriendDialog, setShowFriendDialog] = useState(false);
  const [friendCode, setFriendCode] = useState('');
  const { t } = useLanguageContext();

  const handleQuickPlay = async () => {
    try {
      setLoading('quickplay');
      toast.info('Finding a match...');
      
      // In a real app, this would connect to matchmaking
      // For now, create a game directly
      const gameData = await createGame('quick');
      
      // Navigate to the game
      navigate(`/game/${gameData.id}`);
    } catch (error) {
      console.error('Failed to start game:', error);
      toast.error('Failed to find a match. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const handleCreateFriendGame = async () => {
    if (!friendCode.trim()) {
      toast.error('Please enter your friend\'s code');
      return;
    }
    
    try {
      setLoading('friend');
      toast.info('Creating game...');
      
      // Fixed: Changed friendCode to friendId to match GameOptions interface
      const gameData = await createGame('friend', { friendId: friendCode });
      
      // Close dialog and navigate to the game
      setShowFriendDialog(false);
      navigate(`/game/${gameData.id}`);
    } catch (error) {
      console.error('Failed to create game:', error);
      toast.error('Failed to create game. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const handleAIPlay = async () => {
    try {
      setLoading('ai');
      toast.info('Setting up AI game...');
      
      // In a real app, this would create a game against AI
      const gameData = await createGame('ai');
      
      // Navigate to the game
      navigate(`/game/${gameData.id}`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-chess-text-light mb-8">{t("playChess")}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-chess-dark border-subtle hover-lift card-hover rounded-lg p-6 shadow-lg">
          <h3 className="text-xl font-bold text-chess-text-light mb-2 flex items-center gap-2">
            <Gamepad className="h-5 w-5 text-chess-accent" />
            {t("quickPlay")}
          </h3>
          <p className="text-gray-400 mb-4">{t("quickPlayDescription")}</p>
          <Button 
            className="w-full bg-chess-accent text-chess-text-light hover:bg-opacity-90"
            onClick={handleQuickPlay}
            disabled={loading === 'quickplay'}
          >
            {loading === 'quickplay' ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t("findingMatch")}
              </>
            ) : (
              <>{t("findMatch")}</>
            )}
          </Button>
        </div>

        <div className="bg-chess-dark border-subtle hover-lift card-hover rounded-lg p-6 shadow-lg">
          <h3 className="text-xl font-bold text-chess-text-light mb-2 flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-chess-accent" />
            {t("playWithFriend")}
          </h3>
          <p className="text-gray-400 mb-4">{t("playWithFriendDescription")}</p>
          <Button 
            className="w-full bg-chess-accent text-chess-text-light hover:bg-opacity-90"
            onClick={() => setShowFriendDialog(true)}
            disabled={loading === 'friend'}
          >
            Create Game
          </Button>
        </div>

        <div className="bg-chess-dark border-subtle hover-lift card-hover rounded-lg p-6 shadow-lg">
          <h3 className="text-xl font-bold text-chess-text-light mb-2 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-chess-accent" />
            {t("playWithAI")}
          </h3>
          <p className="text-gray-400 mb-4">{t("playWithAIDescription")}</p>
          <Button 
            className="w-full bg-chess-accent text-chess-text-light hover:bg-opacity-90"
            onClick={handleAIPlay}
            disabled={loading === 'ai'}
          >
            {loading === 'ai' ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t("settingUpAI")}
              </>
            ) : (
              <>Start Game</>
            )}
          </Button>
        </div>

        <div className="bg-chess-dark border-subtle hover-lift card-hover rounded-lg p-6 shadow-lg">
          <h3 className="text-xl font-bold text-chess-text-light mb-2 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-chess-accent" />
            {t("tournaments")}
          </h3>
          <p className="text-gray-400 mb-4">{t("tournamentsDescription")}</p>
          <Button 
            className="w-full bg-chess-accent text-chess-text-light hover:bg-opacity-90"
            onClick={() => navigate('/tournaments')}
          >
            Browse Tournaments
          </Button>
        </div>

        <div className="bg-chess-dark border-subtle hover-lift card-hover rounded-lg p-6 shadow-lg">
          <h3 className="text-xl font-bold text-chess-text-light mb-2 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-chess-accent" />
            {t("analysis")}
          </h3>
          <p className="text-gray-400 mb-4">{t("analysisDescription")}</p>
          <Button 
            className="w-full bg-chess-accent text-chess-text-light hover:bg-opacity-90"
            onClick={() => navigate('/analysis')}
          >
            Open Analysis Board
          </Button>
        </div>

        <div className="bg-chess-dark border-subtle hover-lift card-hover rounded-lg p-6 shadow-lg">
          <h3 className="text-xl font-bold text-chess-text-light mb-2 flex items-center gap-2">
            <Eye className="h-5 w-5 text-chess-accent" />
            {t("spectate")}
          </h3>
          <p className="text-gray-400 mb-4">{t("spectateDescription")}</p>
          <Button 
            className="w-full bg-chess-accent text-chess-text-light hover:bg-opacity-90"
            onClick={() => navigate('/spectate')}
          >
            Browse Live Games
          </Button>
        </div>
      </div>
      
      {/* Game modes section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-chess-text-light mb-6">{t("gameModes")}</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            variant="outline"
            className="h-auto py-4 justify-start border-[rgba(255,255,255,0.12)] hover:border-chess-accent text-chess-text-light hover:bg-chess-accent/5"
            onClick={() => toast.info('Bullet mode selected')}
          >
            <Clock className="h-5 w-5 mr-3" />
            <div className="text-left">
              <p className="font-medium">Bullet</p>
              <p className="text-xs text-gray-400">1 minute per side</p>
            </div>
          </Button>
          
          <Button
            variant="outline"
            className="h-auto py-4 justify-start border-[rgba(255,255,255,0.12)] hover:border-chess-accent text-chess-text-light hover:bg-chess-accent/5"
            onClick={() => toast.info('Blitz mode selected')}
          >
            <Clock className="h-5 w-5 mr-3" />
            <div className="text-left">
              <p className="font-medium">Blitz</p>
              <p className="text-xs text-gray-400">3+2 minutes</p>
            </div>
          </Button>
          
          <Button
            variant="outline"
            className="h-auto py-4 justify-start border-[rgba(255,255,255,0.12)] hover:border-chess-accent text-chess-text-light hover:bg-chess-accent/5"
            onClick={() => toast.info('Rapid mode selected')}
          >
            <Clock className="h-5 w-5 mr-3" />
            <div className="text-left">
              <p className="font-medium">Rapid</p>
              <p className="text-xs text-gray-400">10 minutes per side</p>
            </div>
          </Button>
          
          <Button
            variant="outline"
            className="h-auto py-4 justify-start border-[rgba(255,255,255,0.12)] hover:border-chess-accent text-chess-text-light hover:bg-chess-accent/5"
            onClick={() => toast.info('Classical mode selected')}
          >
            <Clock className="h-5 w-5 mr-3" />
            <div className="text-left">
              <p className="font-medium">Classical</p>
              <p className="text-xs text-gray-400">30 minutes per side</p>
            </div>
          </Button>
        </div>
      </div>
      
      {/* Find players section */}
      <div className="mt-12 bg-chess-dark border border-[rgba(255,255,255,0.12)] rounded-lg p-8">
        <h2 className="text-2xl font-bold text-chess-text-light mb-6 flex items-center gap-2">
          <Users className="h-6 w-6 text-chess-accent" />
          {t("findPlayers")}
        </h2>
        
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="w-full md:w-2/3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by username, rating range, or online status"
                className="w-full pl-10 pr-4 py-3 bg-chess-dark border border-[rgba(255,255,255,0.2)] rounded-md text-chess-text-light focus:outline-none focus:border-chess-accent"
              />
            </div>
          </div>
          <Button 
            className="w-full md:w-auto px-8 bg-chess-accent text-chess-text-light hover:bg-opacity-90"
            onClick={() => toast.info('Search functionality coming soon')}
          >
            Search
          </Button>
        </div>
        
        <div className="mt-6 flex flex-wrap gap-4">
          <Button
            variant="outline"
            size="sm"
            className="border-[rgba(255,255,255,0.12)] text-chess-text-light hover:bg-white/5"
            onClick={() => toast.info('Filter applied: Online players')}
          >
            Online Now
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-[rgba(255,255,255,0.12)] text-chess-text-light hover:bg-white/5"
            onClick={() => toast.info('Filter applied: Similar rating')}
          >
            Similar Rating
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-[rgba(255,255,255,0.12)] text-chess-text-light hover:bg-white/5"
            onClick={() => toast.info('Filter applied: Friends only')}
          >
            Friends Only
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-[rgba(255,255,255,0.12)] text-chess-text-light hover:bg-white/5"
            onClick={() => toast.info('Filter applied: Looking for games')}
          >
            Looking for Games
          </Button>
        </div>
      </div>
    
      {/* Play with Friend Dialog */}
      <Dialog open={showFriendDialog} onOpenChange={setShowFriendDialog}>
        <DialogContent className="bg-chess-dark text-chess-text-light border border-[rgba(255,255,255,0.12)]">
          <DialogHeader>
            <DialogTitle>Play with a Friend</DialogTitle>
            <DialogDescription className="text-gray-400">
              Enter your friend's code or share yours to start a game.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="friend-code" className="text-sm font-medium">
                Friend's Code
              </label>
              <input
                id="friend-code"
                type="text"
                className="w-full px-3 py-2 bg-chess-dark border border-[rgba(255,255,255,0.2)] rounded-md text-chess-text-light focus:outline-none focus:border-chess-accent"
                placeholder="Enter code"
                value={friendCode}
                onChange={(e) => setFriendCode(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Code</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 px-3 py-2 bg-chess-dark/50 border border-[rgba(255,255,255,0.12)] rounded-md text-chess-text-light">
                  F4CV9Z
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-chess-accent text-chess-accent hover:bg-chess-accent/10"
                  onClick={() => {
                    navigator.clipboard.writeText("F4CV9Z");
                    toast.success('Code copied to clipboard!');
                  }}
                >
                  Copy
                </Button>
              </div>
            </div>
            
            <Button 
              className="w-full mt-4 bg-chess-accent text-chess-text-light hover:bg-opacity-90"
              onClick={handleCreateFriendGame}
              disabled={loading === 'friend'}
            >
              {loading === 'friend' ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating Game...
                </>
              ) : (
                <>Start Game</>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Play;
