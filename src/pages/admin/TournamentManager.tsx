import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { Search, Filter, MoreVertical, Plus, Eye, Edit, Calendar as CalendarIcon, Download, Trash2, Play, Trophy, Users, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useLanguageContext } from "@/contexts/LanguageContext";

// Sample tournament data
const TOURNAMENTS = [
  {
    id: "t1",
    name: "Spring Chess Championship",
    status: "upcoming",
    format: "swiss",
    participants: 32,
    registeredCount: 18,
    startDate: new Date("2025-06-15"),
    endDate: new Date("2025-06-20"),
    prize: "$1000",
    description: "A swiss-format tournament with 7 rounds.",
  },
  {
    id: "t2",
    name: "Weekly Blitz Tournament",
    status: "active",
    format: "round-robin",
    participants: 16,
    registeredCount: 16,
    startDate: new Date("2025-05-01"),
    endDate: new Date("2025-05-01"),
    prize: "$200",
    description: "Fast-paced blitz tournament with 3+2 time control.",
  },
  {
    id: "t3",
    name: "International Masters Invitational",
    status: "upcoming",
    format: "knockout",
    participants: 8,
    registeredCount: 6,
    startDate: new Date("2025-07-10"),
    endDate: new Date("2025-07-15"),
    prize: "$5000",
    description: "Exclusive tournament for master-rated players only.",
  },
  {
    id: "t4",
    name: "Winter Championship 2025",
    status: "completed",
    format: "swiss",
    participants: 64,
    registeredCount: 64,
    startDate: new Date("2025-01-15"),
    endDate: new Date("2025-01-25"),
    prize: "$2500",
    winner: "Michael Chen",
    description: "Annual winter championship with players from 20+ countries.",
  },
  {
    id: "t5",
    name: "Beginners Tournament",
    status: "active",
    format: "swiss",
    participants: 32,
    registeredCount: 26,
    startDate: new Date("2025-04-28"),
    endDate: new Date("2025-05-05"),
    prize: "$100",
    description: "Tournament designed for players rated under 1200.",
  },
  {
    id: "t6",
    name: "Grand Masters Series - Round 3",
    status: "upcoming",
    format: "round-robin",
    participants: 10,
    registeredCount: 7,
    startDate: new Date("2025-06-01"),
    endDate: new Date("2025-06-10"),
    prize: "$10000",
    description: "Third round of the prestigious Grand Masters Series.",
  },
  {
    id: "t7",
    name: "Summer Chess Festival",
    status: "upcoming",
    format: "swiss",
    participants: 128,
    registeredCount: 68,
    startDate: new Date("2025-07-20"),
    endDate: new Date("2025-07-30"),
    prize: "$3000",
    description: "The largest open tournament of the summer season.",
  },
];

const TournamentManager = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState<typeof TOURNAMENTS[0] | null>(null);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const { toast } = useToast();
  const { t, isRTL } = useLanguageContext();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredTournaments = TOURNAMENTS.filter((tournament) => {
    return (
      tournament.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tournament.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tournament.format.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleViewDetails = (tournament: typeof TOURNAMENTS[0]) => {
    setSelectedTournament(tournament);
    setShowDetailsDialog(true);
  };

  const handleEdit = (tournament: typeof TOURNAMENTS[0]) => {
    // In a real app, this would open an edit dialog with pre-filled fields
    toast({
      title: "Edit Tournament",
      description: `You are now editing: ${tournament.name}`,
    });
  };

  const handleDelete = (tournamentId: string) => {
    toast({
      title: "Tournament deleted",
      description: `Tournament ID: ${tournamentId} has been deleted.`,
    });
  };

  const handleStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Badge className="bg-blue-600 hover:bg-blue-700">Upcoming</Badge>;
      case "active":
        return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>;
      case "completed":
        return <Badge className="bg-gray-500 hover:bg-gray-600">Completed</Badge>;
      default:
        return null;
    }
  };

  const handleFormatBadge = (format: string) => {
    switch (format) {
      case "swiss":
        return <Badge className="bg-chess-accent hover:bg-chess-accent/90">Swiss</Badge>;
      case "round-robin":
        return <Badge className="bg-purple-600 hover:bg-purple-700">Round Robin</Badge>;
      case "knockout":
        return <Badge className="bg-amber-500 hover:bg-amber-600">Knockout</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-chess-text-light">Tournament Manager</h2>
          <p className="text-gray-400">Create and manage chess tournaments</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="text-chess-text-light border-white/10">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Tournament
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <TabsList className="bg-white/5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          <div className="flex w-full sm:w-auto gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search tournaments..."
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

        <TabsContent value="all" className="mt-0">
          <Card className="bg-chess-dark border-white/10">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-white/5 border-white/10">
                    <TableHead className="text-gray-400">Name</TableHead>
                    <TableHead className="text-gray-400">Status</TableHead>
                    <TableHead className="text-gray-400">Format</TableHead>
                    <TableHead className="text-gray-400">Participants</TableHead>
                    <TableHead className="text-gray-400">Start Date</TableHead>
                    <TableHead className="text-gray-400">End Date</TableHead>
                    <TableHead className="text-gray-400">Prize</TableHead>
                    <TableHead className="text-gray-400 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTournaments.length > 0 ? (
                    filteredTournaments.map((tournament) => (
                      <TableRow key={tournament.id} className="hover:bg-white/5 border-white/10">
                        <TableCell className="font-medium text-chess-text-light">{tournament.name}</TableCell>
                        <TableCell>{handleStatusBadge(tournament.status)}</TableCell>
                        <TableCell>{handleFormatBadge(tournament.format)}</TableCell>
                        <TableCell className="text-gray-400">
                          {tournament.registeredCount}/{tournament.participants}
                        </TableCell>
                        <TableCell className="text-gray-400">{format(tournament.startDate, "MMM d, yyyy")}</TableCell>
                        <TableCell className="text-gray-400">{format(tournament.endDate, "MMM d, yyyy")}</TableCell>
                        <TableCell className="text-gray-400">{tournament.prize}</TableCell>
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
                              <DropdownMenuItem className="cursor-pointer hover:bg-white/10" onClick={() => handleViewDetails(tournament)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer hover:bg-white/10" onClick={() => handleEdit(tournament)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Tournament
                              </DropdownMenuItem>
                              {tournament.status === "active" && (
                                <DropdownMenuItem className="cursor-pointer hover:bg-white/10" onClick={() => {}}>
                                  <Play className="h-4 w-4 mr-2" />
                                  View Matches
                                </DropdownMenuItem>
                              )}
                              {tournament.status === "upcoming" && (
                                <>
                                  <DropdownMenuItem className="cursor-pointer hover:bg-white/10" onClick={() => {}}>
                                    <Users className="h-4 w-4 mr-2" />
                                    Manage Participants
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="cursor-pointer hover:bg-white/10" onClick={() => {}}>
                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                    Start Tournament
                                  </DropdownMenuItem>
                                </>
                              )}
                              {tournament.status === "completed" && (
                                <DropdownMenuItem className="cursor-pointer hover:bg-white/10" onClick={() => {}}>
                                  <Trophy className="h-4 w-4 mr-2" />
                                  View Results
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator className="bg-white/10" />
                              <DropdownMenuItem className="cursor-pointer text-red-500 hover:bg-white/10" onClick={() => handleDelete(tournament.id)}>
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
                        No tournaments found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Other tab contents would be similar with filtered data */}

        {/* Create Tournament Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="sm:max-w-[600px] bg-chess-dark border-white/10 text-chess-text-light">
            <DialogHeader>
              <DialogTitle className="text-chess-text-light">Create New Tournament</DialogTitle>
              <DialogDescription className="text-gray-400">
                Fill in the details to create a new chess tournament
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-chess-text-light">Tournament Name</Label>
                <Input id="name" placeholder="Tournament name" className="bg-chess-dark border-white/20" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="format" className="text-chess-text-light">Format</Label>
                  <Input id="format" placeholder="Swiss, Round Robin, etc." className="bg-chess-dark border-white/20" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="participants" className="text-chess-text-light">Max Participants</Label>
                  <Input id="participants" type="number" className="bg-chess-dark border-white/20" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="text-chess-text-light">Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal bg-chess-dark border-white/20",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-chess-dark border-white/10">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                        className="bg-chess-dark text-chess-text-light"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid gap-2">
                  <Label className="text-chess-text-light">End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal bg-chess-dark border-white/20",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-chess-dark border-white/10">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                        className="bg-chess-dark text-chess-text-light"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="prize" className="text-chess-text-light">Prize</Label>
                <Input id="prize" placeholder="Prize amount or details" className="bg-chess-dark border-white/20" />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description" className="text-chess-text-light">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter tournament details and rules..."
                  className="bg-chess-dark border-white/20"
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" className="border-white/20" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                toast({
                  title: "Tournament created",
                  description: "New tournament has been successfully created.",
                });
                setShowCreateDialog(false);
              }}>
                Create Tournament
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Tournament Details Dialog */}
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="sm:max-w-[600px] bg-chess-dark border-white/10 text-chess-text-light">
            <DialogHeader>
              <DialogTitle className="text-chess-text-light">Tournament Details</DialogTitle>
              <DialogDescription className="text-gray-400">
                View detailed information about this tournament
              </DialogDescription>
            </DialogHeader>
            {selectedTournament && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-chess-text-light">{selectedTournament.name}</h3>
                  {handleStatusBadge(selectedTournament.status)}
                </div>
                
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <p className="text-sm text-gray-400">Format</p>
                    <div className="mt-1">{handleFormatBadge(selectedTournament.format)}</div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Participants</p>
                    <p className="text-chess-text-light">
                      {selectedTournament.registeredCount}/{selectedTournament.participants}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Start Date</p>
                    <p className="text-chess-text-light">
                      {format(selectedTournament.startDate, "MMM d, yyyy")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">End Date</p>
                    <p className="text-chess-text-light">
                      {format(selectedTournament.endDate, "MMM d, yyyy")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Prize</p>
                    <p className="text-chess-text-light">{selectedTournament.prize}</p>
                  </div>
                  {selectedTournament.winner && (
                    <div>
                      <p className="text-sm text-gray-400">Winner</p>
                      <p className="text-chess-text-light">{selectedTournament.winner}</p>
                    </div>
                  )}
                </div>
                
                <div>
                  <p className="text-sm text-gray-400 mb-1">Description</p>
                  <p className="text-chess-text-light bg-white/5 p-3 rounded-md">
                    {selectedTournament.description}
                  </p>
                </div>
                
                {selectedTournament.status === "active" && (
                  <div>
                    <h4 className="text-chess-text-light font-medium mb-2">Current Matches</h4>
                    <div className="bg-white/5 p-3 rounded-md">
                      <p className="text-gray-400 text-sm">
                        View the ongoing matches and standings in the tournament dashboard.
                      </p>
                      <Button className="mt-2">
                        <Play className="h-4 w-4 mr-2" />
                        View Tournament Dashboard
                      </Button>
                    </div>
                  </div>
                )}

                {selectedTournament.status === "completed" && (
                  <div>
                    <h4 className="text-chess-text-light font-medium mb-2">Results</h4>
                    <div className="bg-white/5 p-3 rounded-md">
                      <p className="text-gray-400 text-sm">
                        View the final standings and match results.
                      </p>
                      <Button className="mt-2">
                        <Trophy className="h-4 w-4 mr-2" />
                        View Results
                      </Button>
                    </div>
                  </div>
                )}

                <div className="pt-4 flex flex-wrap gap-2">
                  <Button variant="default" className="flex-1">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Tournament
                  </Button>
                  
                  {selectedTournament.status === "upcoming" && (
                    <Button variant="outline" className="flex-1 border-white/20">
                      <Users className="h-4 w-4 mr-2" />
                      Manage Participants
                    </Button>
                  )}
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
      </Tabs>
    </div>
  );
};

export default TournamentManager;
