
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Layout from "@/components/layout/Layout";
import { 
  Gamepad, 
  BookOpen, 
  Users, 
  TrendingUp, 
  Clock, 
  Award,
  RefreshCw
} from "lucide-react";

const Dashboard = () => {
  const [loading, setLoading] = React.useState(true);
  const [stats, setStats] = React.useState({
    gamesPlayed: 0,
    winRate: 0,
    puzzlesSolved: 0,
    currentStreak: 0,
    rating: 0,
    bestWin: ''
  });

  React.useEffect(() => {
    // Simulate API call to fetch user stats
    const fetchStats = async () => {
      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Simulate stats data
        setStats({
          gamesPlayed: 42,
          winRate: 65,
          puzzlesSolved: 128,
          currentStreak: 5,
          rating: 1250,
          bestWin: 'Magnus Carlsen'
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Failed to load stats:', error);
        toast.error('Failed to load your stats. Please try again.');
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  const handleRefreshStats = () => {
    setLoading(true);
    // Simulate refreshing stats
    setTimeout(() => {
      toast.success('Stats refreshed!');
      setLoading(false);
    }, 1000);
  };

  const handlePairBoard = () => {
    toast.info('Board pairing feature coming soon');
    // TODO: Implement board pairing modal/flow
  };

  const StatCard = ({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) => (
    <div className="bg-chess-dark border border-[rgba(255,255,255,0.12)] rounded-lg p-6 flex flex-col">
      <div className="flex items-center mb-4">
        <div className="p-2 bg-chess-accent bg-opacity-20 rounded-full mr-3">
          {icon}
        </div>
        <h3 className="text-chess-text-light font-medium">{title}</h3>
      </div>
      <div className="mt-auto">
        {loading ? (
          <div className="h-7 w-24 bg-gray-700 animate-pulse rounded"></div>
        ) : (
          <span className="text-2xl font-bold text-chess-text-light">{value}</span>
        )}
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-chess-text-light">Dashboard</h1>
            <p className="text-gray-400">Welcome back, Player!</p>
          </div>
          <div className="flex gap-4">
            <Button 
              variant="outline" 
              className="border-chess-accent text-chess-accent hover:bg-chess-accent hover:bg-opacity-10"
              onClick={handlePairBoard}
            >
              Pair SmartBoard
            </Button>
            <Button 
              className="bg-chess-accent text-chess-text-light hover:bg-opacity-90"
              onClick={handleRefreshStats}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </span>
              ) : (
                <span className="flex items-center">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Stats
                </span>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <StatCard 
            title="Games Played" 
            value={stats.gamesPlayed}
            icon={<Gamepad className="h-5 w-5 text-chess-accent" />}
          />
          <StatCard 
            title="Win Rate" 
            value={`${stats.winRate}%`}
            icon={<TrendingUp className="h-5 w-5 text-chess-accent" />}
          />
          <StatCard 
            title="Puzzles Solved" 
            value={stats.puzzlesSolved}
            icon={<BookOpen className="h-5 w-5 text-chess-accent" />}
          />
          <StatCard 
            title="Current Streak" 
            value={`${stats.currentStreak} days`}
            icon={<Clock className="h-5 w-5 text-chess-accent" />}
          />
          <StatCard 
            title="Rating" 
            value={stats.rating}
            icon={<Award className="h-5 w-5 text-chess-accent" />}
          />
          <StatCard 
            title="Community" 
            value={`2,541 online`}
            icon={<Users className="h-5 w-5 text-chess-accent" />}
          />
        </div>

        <div className="mb-12">
          <h2 className="text-xl font-bold text-chess-text-light mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <Link to="/play">
              <Button variant="outline" className="w-full h-16 border-[rgba(255,255,255,0.12)] hover:border-chess-accent hover:text-chess-accent text-chess-text-light">
                <Gamepad className="h-5 w-5 mr-2" />
                Play Now
              </Button>
            </Link>
            <Link to="/puzzles">
              <Button variant="outline" className="w-full h-16 border-[rgba(255,255,255,0.12)] hover:border-chess-accent hover:text-chess-accent text-chess-text-light">
                <BookOpen className="h-5 w-5 mr-2" />
                Daily Puzzles
              </Button>
            </Link>
            <Link to="/learn">
              <Button variant="outline" className="w-full h-16 border-[rgba(255,255,255,0.12)] hover:border-chess-accent hover:text-chess-accent text-chess-text-light">
                <TrendingUp className="h-5 w-5 mr-2" />
                Improve Skills
              </Button>
            </Link>
            <Link to="/community">
              <Button variant="outline" className="w-full h-16 border-[rgba(255,255,255,0.12)] hover:border-chess-accent hover:text-chess-accent text-chess-text-light">
                <Users className="h-5 w-5 mr-2" />
                Find Players
              </Button>
            </Link>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-chess-text-light mb-6">Recent Games</h2>
          <div className="bg-chess-dark border border-[rgba(255,255,255,0.12)] rounded-lg p-6">
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="flex justify-between items-center py-4 border-b border-[rgba(255,255,255,0.06)]">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-gray-700 animate-pulse rounded-full"></div>
                      <div className="ml-4">
                        <div className="h-4 w-24 bg-gray-700 animate-pulse rounded mb-2"></div>
                        <div className="h-3 w-16 bg-gray-700 animate-pulse rounded"></div>
                      </div>
                    </div>
                    <div className="h-6 w-16 bg-gray-700 animate-pulse rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {/* Would normally map over actual game data */}
                <div className="flex justify-between items-center py-4 border-b border-[rgba(255,255,255,0.06)]">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center text-green-500 font-bold">W</div>
                    <div className="ml-4">
                      <div className="text-chess-text-light">vs. GrandMaster42</div>
                      <div className="text-sm text-gray-400">Today, 14:32</div>
                    </div>
                  </div>
                  <div className="text-green-500 font-medium">Win</div>
                </div>
                
                <div className="flex justify-between items-center py-4 border-b border-[rgba(255,255,255,0.06)]">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-red-500 bg-opacity-20 rounded-full flex items-center justify-center text-red-500 font-bold">L</div>
                    <div className="ml-4">
                      <div className="text-chess-text-light">vs. ChessWizard</div>
                      <div className="text-sm text-gray-400">Yesterday, 19:15</div>
                    </div>
                  </div>
                  <div className="text-red-500 font-medium">Loss</div>
                </div>
                
                <div className="flex justify-between items-center py-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-blue-500 bg-opacity-20 rounded-full flex items-center justify-center text-blue-500 font-bold">D</div>
                    <div className="ml-4">
                      <div className="text-chess-text-light">vs. KnightRider</div>
                      <div className="text-sm text-gray-400">Feb 28, 2025</div>
                    </div>
                  </div>
                  <div className="text-blue-500 font-medium">Draw</div>
                </div>
              </div>
            )}
            
            <div className="mt-6 text-center">
              <Link to="/play">
                <Button variant="outline" className="border-chess-accent text-chess-accent hover:bg-chess-accent hover:bg-opacity-10">
                  View All Games
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
