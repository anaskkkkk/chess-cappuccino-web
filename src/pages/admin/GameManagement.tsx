
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Search, Filter, MoreVertical, Eye, Play, StopCircle, Download, Flag, Trash2, RefreshCw } from "lucide-react";
import { useLanguageContext } from "@/contexts/LanguageContext";

// Sample game data
const GAMES = [
  {
    id: "g1",
    white: "Sofia Rodriguez",
    black: "Ahmed Hassan",
    status: "ongoing",
    mode: "rated",
    timeControl: "10+5",
    startedAt: "2025-05-01 09:15:22",
    movesCount: 24,
  },
  {
    id: "g2",
    white: "Michael Chen",
    black: "Emma Wilson",
    status: "completed",
    result: "1-0",
    mode: "rated",
    timeControl: "5+3",
    startedAt: "2025-05-01 08:30:45",
    movesCount: 42,
  },
  {
    id: "g3",
    white: "Liam Johnson",
    black: "Zara Khan",
    status: "aborted",
    mode: "casual",
    timeControl: "3+2",
    startedAt: "2025-05-01 07:55:10",
    movesCount: 8,
  },
  {
    id: "g4",
    white: "Carlos Mendoza",
    black: "Anna Petrova",
    status: "completed",
    result: "0-1",
    mode: "tournament",
    timeControl: "15+10",
    startedAt: "2025-04-30 22:15:33",
    movesCount: 38,
  },
  {
    id: "g5",
    white: "David Kim",
    black: "Olivia Taylor",
    status: "ongoing",
    mode: "rated",
    timeControl: "30+0",
    startedAt: "2025-05-01 10:05:17",
    movesCount: 12,
  },
  {
    id: "g6",
    white: "AI Level 8",
    black: "James Wilson",
    status: "ongoing",
    mode: "ai",
    timeControl: "10+0",
    startedAt: "2025-05-01 09:55:40",
    movesCount: 18,
  },
  {
    id: "g7",
    white: "Mia Johnson",
    black: "Lucas Garcia",
    status: "completed",
    result: "½-½",
    mode: "rated",
    timeControl: "5+0",
    startedAt: "2025-04-30 21:30:22",
    movesCount: 67,
  },
  {
    id: "g8",
    white: "Sophia Brown",
    black: "Noah Martinez",
    status: "completed",
    result: "1-0",
    mode: "rated",
    timeControl: "3+2",
    startedAt: "2025-04-30 20:45:15",
    movesCount: 35,
  },
];

const GameManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedGame, setSelectedGame] = useState<typeof GAMES[0] | null>(null);
  const { toast } = useToast();
  const { t } = useLanguageContext();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredGames = GAMES.filter((game) => {
    return (
      game.white.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.black.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.mode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.timeControl.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleViewDetails = (game: typeof GAMES[0]) => {
    setSelectedGame(game);
    setShowDetailsDialog(true);
  };

  const handleForceEnd = (gameId: string) => {
    toast({
      title: "Game ended",
      description: `Game ID: ${gameId} has been forcefully ended.`,
    });
  };

  const handleDelete = (gameId: string) => {
    toast({
      title: "Game deleted",
      description: `Game ID: ${gameId} has been deleted from records.`,
    });
  };

  const handleSpectate = (gameId: string) => {
    // In a real app, this would navigate to a spectator view
    window.open(`/spectate/game/${gameId}`, '_blank');
  };

  const handleStatusBadge = (status: string, result?: string) => {
    switch (status) {
      case "ongoing":
        return <Badge className="bg-green-500 hover:bg-green-600">Ongoing</Badge>;
      case "completed":
        return (
          <Badge className="bg-blue-600 hover:bg-blue-700">
            Completed {result && `(${result})`}
          </Badge>
        );
      case "aborted":
        return <Badge variant="destructive">Aborted</Badge>;
      default:
        return null;
    }
  };

  const handleModeBadge = (mode: string) => {
    switch (mode) {
      case "rated":
        return <Badge className="bg-chess-accent hover:bg-chess-accent/90">Rated</Badge>;
      case "casual":
        return <Badge variant="outline" className="text-gray-300 border-gray-400">Casual</Badge>;
      case "tournament":
        return <Badge className="bg-purple-600 hover:bg-purple-700">Tournament</Badge>;
      case "ai":
        return <Badge className="bg-amber-500 hover:bg-amber-600">AI</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-chess-text-light">Game Management</h2>
          <p className="text-gray-400">Monitor and manage all chess games</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="text-chess-text-light border-white/10">
            <Download className="h-4 w-4 mr-2" />
            Export Games
          </Button>
          <Button>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="border-white/10 text-chess-text-light">All Games</Button>
          <Button variant="ghost" className="text-chess-text-light">Ongoing</Button>
          <Button variant="ghost" className="text-chess-text-light">Completed</Button>
          <Button variant="ghost" className="text-chess-text-light">Aborted</Button>
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search games..."
              className="pl-9 bg-chess-dark border-white/10 text-chess-text-light"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <Button variant="outline" size="icon" className="border-white/10">
            <Filter className="h-4 w-4 text-gray-400" />
          </Button>
        </div>
      </div>

      <Card className="bg-chess-dark border-white/10">
        <CardHeader className="pb-0">
          <CardTitle className="text-chess-text-light">Active and Recent Games</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-white/5 border-white/10">
                <TableHead className="text-gray-400">Game ID</TableHead>
                <TableHead className="text-gray-400">Players</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
                <TableHead className="text-gray-400">Mode</TableHead>
                <TableHead className="text-gray-400">Time Control</TableHead>
                <TableHead className="text-gray-400">Started</TableHead>
                <TableHead className="text-gray-400">Moves</TableHead>
                <TableHead className="text-gray-400 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGames.length > 0 ? (
                filteredGames.map((game) => (
                  <TableRow key={game.id} className="hover:bg-white/5 border-white/10">
                    <TableCell className="font-medium text-chess-text-light">{game.id}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="text-chess-text-light">{game.white}</div>
                        <div className="text-gray-400">vs {game.black}</div>
                      </div>
                    </TableCell>
                    <TableCell>{handleStatusBadge(game.status, game.result)}</TableCell>
                    <TableCell>{handleModeBadge(game.mode)}</TableCell>
                    <TableCell className="text-gray-400">{game.timeControl}</TableCell>
                    <TableCell className="text-gray-400">{game.startedAt}</TableCell>
                    <TableCell className="text-gray-400">{game.movesCount}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-gray-400">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-chess-dark border-white/10 text-chess-text-light">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-white/10" />
                          <DropdownMenuItem className="cursor-pointer hover:bg-white/10" onClick={() => handleViewDetails(game)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          {game.status === "ongoing" && (
                            <>
                              <DropdownMenuItem className="cursor-pointer hover:bg-white/10" onClick={() => handleSpectate(game.id)}>
                                <Play className="h-4 w-4 mr-2" />
                                Spectate
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer text-amber-500 hover:bg-white/10" onClick={() => handleForceEnd(game.id)}>
                                <StopCircle className="h-4 w-4 mr-2" />
                                Force End
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuItem className="cursor-pointer hover:bg-white/10" onClick={() => {}}>
                            <Flag className="h-4 w-4 mr-2" />
                            Mark for Review
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-white/10" />
                          <DropdownMenuItem className="cursor-pointer text-red-500 hover:bg-white/10" onClick={() => handleDelete(game.id)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow className="hover:bg-white/5 border-white/10">
                  <TableCell colSpan={8} className="h-24 text-center text-gray-400">
                    No games found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Game Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-[600px] bg-chess-dark border-white/10 text-chess-text-light">
          <DialogHeader>
            <DialogTitle className="text-chess-text-light">Game Details</DialogTitle>
            <DialogDescription className="text-gray-400">
              Detailed information about the selected game
            </DialogDescription>
          </DialogHeader>
          {selectedGame && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Game ID</p>
                  <p className="text-chess-text-light font-medium">{selectedGame.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Status</p>
                  <div className="mt-1">{handleStatusBadge(selectedGame.status, selectedGame.result)}</div>
                </div>
                <div>
                  <p className="text-sm text-gray-400">White Player</p>
                  <p className="text-chess-text-light">{selectedGame.white}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Black Player</p>
                  <p className="text-chess-text-light">{selectedGame.black}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Mode</p>
                  <div className="mt-1">{handleModeBadge(selectedGame.mode)}</div>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Time Control</p>
                  <p className="text-chess-text-light">{selectedGame.timeControl}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Started At</p>
                  <p className="text-chess-text-light">{selectedGame.startedAt}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Moves Count</p>
                  <p className="text-chess-text-light">{selectedGame.movesCount}</p>
                </div>
              </div>
              
              <div className="pt-4">
                <h4 className="text-chess-text-light font-medium mb-2">Game Actions</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedGame.status === "ongoing" && (
                    <>
                      <Button onClick={() => handleSpectate(selectedGame.id)}>
                        <Play className="h-4 w-4 mr-2" />
                        Spectate
                      </Button>
                      <Button variant="destructive" onClick={() => {
                        handleForceEnd(selectedGame.id);
                        setShowDetailsDialog(false);
                      }}>
                        <StopCircle className="h-4 w-4 mr-2" />
                        Force End Game
                      </Button>
                    </>
                  )}
                  <Button variant="outline" className="border-white/20">
                    <Download className="h-4 w-4 mr-2" />
                    Export PGN
                  </Button>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" className="border-white/20" onClick={() => setShowDetailsDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GameManagement;
