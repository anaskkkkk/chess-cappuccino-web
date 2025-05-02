
import React, { useState } from "react";
import { useLanguageContext } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { BookCopy, Filter, Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import adminService from "@/services/adminService";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Define puzzle difficulty levels
const difficultyLevels = ["beginner", "intermediate", "advanced", "expert", "master"];

// Define puzzle types
const puzzleTypes = ["mate-in-one", "mate-in-two", "mate-in-three", "tactics", "endgame", "opening"];

// Form schema for puzzle creation/editing
const puzzleFormSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  difficulty: z.string().min(1, { message: "Please select a difficulty level." }),
  type: z.string().min(1, { message: "Please select a puzzle type." }),
  initialPosition: z.string().min(1, { message: "Initial FEN position is required." }),
  solution: z.string().min(1, { message: "Solution moves are required." }),
  description: z.string().optional(),
  tags: z.string().optional(),
  isPublished: z.boolean().default(false),
});

type PuzzleFormValues = z.infer<typeof puzzleFormSchema>;

interface Puzzle {
  id: string;
  title: string;
  difficulty: string;
  type: string;
  initialPosition: string;
  solution: string;
  description?: string;
  tags?: string[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  solveCount: number;
  successRate: number;
}

const PuzzlesCMS: React.FC = () => {
  const { t } = useLanguageContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("");
  const [filterType, setFilterType] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedPuzzle, setSelectedPuzzle] = useState<Puzzle | null>(null);
  
  // Mock data for now - would be replaced with API call
  const mockPuzzles: Puzzle[] = [
    {
      id: "puz-1",
      title: "Knight Fork Tactic",
      difficulty: "intermediate",
      type: "tactics",
      initialPosition: "rnbqkbnr/ppp2ppp/8/3pp3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 1",
      solution: "Nf3-g5, Qd8-g5, d2-d4",
      description: "Find the knight fork to gain material advantage",
      tags: ["knight", "fork", "tactics"],
      isPublished: true,
      createdAt: "2023-01-15T10:30:00Z",
      updatedAt: "2023-01-15T10:30:00Z",
      solveCount: 1250,
      successRate: 68
    },
    {
      id: "puz-2",
      title: "Simple Checkmate Pattern",
      difficulty: "beginner",
      type: "mate-in-one",
      initialPosition: "r1bqkb1r/pppp1Qpp/2n2n2/4p3/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 0 1",
      solution: "Qf7-f8",
      description: "Find the checkmate in one move",
      tags: ["checkmate", "queen", "beginner"],
      isPublished: true,
      createdAt: "2023-02-20T14:15:00Z",
      updatedAt: "2023-02-21T09:30:00Z",
      solveCount: 3420,
      successRate: 92
    },
    {
      id: "puz-3",
      title: "Advanced Endgame Challenge",
      difficulty: "expert",
      type: "endgame",
      initialPosition: "8/8/8/3k4/8/3K4/3P4/8 w - - 0 1",
      solution: "Kd3-c3, Kd5-d4, d2-d3, Kd4-d5, Kc3-d3",
      description: "Complex king and pawn endgame requiring precise calculation",
      tags: ["endgame", "king", "pawn", "opposition"],
      isPublished: false,
      createdAt: "2023-03-05T16:45:00Z",
      updatedAt: "2023-03-07T11:20:00Z",
      solveCount: 560,
      successRate: 31
    }
  ];

  // Form for adding/editing puzzles
  const form = useForm<PuzzleFormValues>({
    resolver: zodResolver(puzzleFormSchema),
    defaultValues: {
      title: "",
      difficulty: "",
      type: "",
      initialPosition: "",
      solution: "",
      description: "",
      tags: "",
      isPublished: false
    }
  });

  // Query for fetching puzzles
  const { data: puzzles = mockPuzzles, isLoading, isError } = useQuery({
    queryKey: ['puzzles', searchTerm, filterDifficulty, filterType],
    queryFn: async () => {
      // TODO API: Replace with actual API call
      console.log("Fetching puzzles with filters:", {
        search: searchTerm,
        difficulty: filterDifficulty,
        type: filterType
      });
      
      // This would be replaced with API call:
      // return adminService.getPuzzles(1, 10, `search=${searchTerm}&difficulty=${filterDifficulty}&type=${filterType}`);
      
      // Mock filtering
      let filtered = [...mockPuzzles];
      if (searchTerm) {
        filtered = filtered.filter(p => 
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }
      if (filterDifficulty) {
        filtered = filtered.filter(p => p.difficulty === filterDifficulty);
      }
      if (filterType) {
        filtered = filtered.filter(p => p.type === filterType);
      }
      return filtered;
    },
    enabled: true,
  });

  // Handlers
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The query will automatically refetch with the updated searchTerm
  };

  const handleAddPuzzle = (data: PuzzleFormValues) => {
    // TODO API: Replace with actual API call
    console.log("Adding puzzle:", data);
    // adminService.createPuzzle(data).then(() => {
    //   queryClient.invalidateQueries(['puzzles']);
    // });
    toast({
      title: "Puzzle Created",
      description: `Successfully created puzzle: ${data.title}`,
    });
    setIsAddDialogOpen(false);
    form.reset();
  };

  const handleEditPuzzle = (data: PuzzleFormValues) => {
    if (!selectedPuzzle) return;
    
    // TODO API: Replace with actual API call
    console.log("Editing puzzle:", selectedPuzzle.id, data);
    // adminService.updatePuzzle(selectedPuzzle.id, data).then(() => {
    //   queryClient.invalidateQueries(['puzzles']);
    // });
    toast({
      title: "Puzzle Updated",
      description: `Successfully updated puzzle: ${data.title}`,
    });
    setIsEditDialogOpen(false);
  };

  const handleDeletePuzzle = () => {
    if (!selectedPuzzle) return;
    
    // TODO API: Replace with actual API call
    console.log("Deleting puzzle:", selectedPuzzle.id);
    // adminService.deletePuzzle(selectedPuzzle.id).then(() => {
    //   queryClient.invalidateQueries(['puzzles']);
    // });
    toast({
      title: "Puzzle Deleted",
      description: `Successfully deleted puzzle: ${selectedPuzzle.title}`,
    });
    setIsDeleteDialogOpen(false);
    setSelectedPuzzle(null);
  };

  const handleViewPuzzle = (puzzle: Puzzle) => {
    setSelectedPuzzle(puzzle);
    setIsViewDialogOpen(true);
  };

  const handleEditClick = (puzzle: Puzzle) => {
    setSelectedPuzzle(puzzle);
    form.reset({
      title: puzzle.title,
      difficulty: puzzle.difficulty,
      type: puzzle.type,
      initialPosition: puzzle.initialPosition,
      solution: puzzle.solution,
      description: puzzle.description || "",
      tags: puzzle.tags ? puzzle.tags.join(", ") : "",
      isPublished: puzzle.isPublished
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (puzzle: Puzzle) => {
    setSelectedPuzzle(puzzle);
    setIsDeleteDialogOpen(true);
  };

  const handleTogglePublish = (puzzle: Puzzle) => {
    // TODO API: Replace with actual API call
    console.log("Toggling publish status for puzzle:", puzzle.id, !puzzle.isPublished);
    // adminService.togglePuzzlePublishStatus(puzzle.id, !puzzle.isPublished).then(() => {
    //   queryClient.invalidateQueries(['puzzles']);
    // });
    toast({
      title: puzzle.isPublished ? "Puzzle Unpublished" : "Puzzle Published",
      description: `Successfully ${puzzle.isPublished ? "unpublished" : "published"} puzzle: ${puzzle.title}`,
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-500";
      case "intermediate": return "bg-blue-500";
      case "advanced": return "bg-yellow-500";
      case "expert": return "bg-orange-500";
      case "master": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-chess-text-light">{t("Puzzles")}</h2>
          <p className="text-chess-text-light/60">
            {t("Manage chess puzzles and challenges")}
          </p>
        </div>
        <Button onClick={() => {
          form.reset();
          setIsAddDialogOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" /> {t("Add Puzzle")}
        </Button>
      </div>

      <Card className="bg-chess-dark border-white/10">
        <CardHeader>
          <CardTitle className="text-chess-text-light">{t("Puzzles")}</CardTitle>
          <CardDescription className="text-chess-text-light/60">
            {t("Manage your chess puzzles collection")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search and filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <form onSubmit={handleSearch} className="flex gap-2">
                  <div className="relative flex-grow">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-chess-text-light/40" />
                    <Input
                      placeholder={t("search")}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 bg-transparent border-white/10 text-chess-text-light"
                    />
                  </div>
                  <Button type="submit">{t("search")}</Button>
                </form>
              </div>
              <div>
                <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
                  <SelectTrigger className="bg-transparent border-white/10 text-chess-text-light">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <SelectValue placeholder={t("Filter by Difficulty")} />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-chess-dark border-white/10 text-chess-text-light">
                    <SelectItem value="">All Difficulties</SelectItem>
                    {difficultyLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="bg-transparent border-white/10 text-chess-text-light">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <SelectValue placeholder={t("Filter by Type")} />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-chess-dark border-white/10 text-chess-text-light">
                    <SelectItem value="">All Types</SelectItem>
                    {puzzleTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Puzzles Table */}
            <div className="border rounded-md border-white/10 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-white/5">
                    <TableHead className="text-chess-text-light">{t("Title")}</TableHead>
                    <TableHead className="text-chess-text-light">{t("Difficulty")}</TableHead>
                    <TableHead className="text-chess-text-light">{t("Type")}</TableHead>
                    <TableHead className="text-chess-text-light">{t("Solve Count")}</TableHead>
                    <TableHead className="text-chess-text-light">{t("Success Rate")}</TableHead>
                    <TableHead className="text-chess-text-light">{t("Status")}</TableHead>
                    <TableHead className="text-chess-text-light text-right">{t("Actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow className="border-white/10">
                      <TableCell colSpan={7} className="text-center py-10 text-chess-text-light">
                        {t("loading")}...
                      </TableCell>
                    </TableRow>
                  ) : isError ? (
                    <TableRow className="border-white/10">
                      <TableCell colSpan={7} className="text-center py-10 text-red-400">
                        Error loading puzzles
                      </TableCell>
                    </TableRow>
                  ) : puzzles.length === 0 ? (
                    <TableRow className="border-white/10">
                      <TableCell colSpan={7} className="text-center py-10 text-chess-text-light/60">
                        No puzzles found
                      </TableCell>
                    </TableRow>
                  ) : (
                    puzzles.map((puzzle) => (
                      <TableRow key={puzzle.id} className="border-white/10 hover:bg-white/5">
                        <TableCell className="font-medium text-chess-text-light">
                          {puzzle.title}
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getDifficultyColor(puzzle.difficulty)} text-white`}>
                            {puzzle.difficulty.charAt(0).toUpperCase() + puzzle.difficulty.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-chess-text-light">
                          {puzzle.type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </TableCell>
                        <TableCell className="text-chess-text-light">{puzzle.solveCount}</TableCell>
                        <TableCell className="text-chess-text-light">{puzzle.successRate}%</TableCell>
                        <TableCell>
                          <Badge variant={puzzle.isPublished ? "default" : "outline"} className="text-sm">
                            {puzzle.isPublished ? "Published" : "Draft"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewPuzzle(puzzle)}
                              className="h-8 w-8 text-chess-text-light hover:bg-white/10"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditClick(puzzle)}
                              className="h-8 w-8 text-chess-text-light hover:bg-white/10"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteClick(puzzle)}
                              className="h-8 w-8 text-chess-text-light hover:bg-white/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Puzzle Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-chess-dark border-white/10 text-chess-text-light max-w-3xl">
          <DialogHeader>
            <DialogTitle>{t("Add New Puzzle")}</DialogTitle>
            <DialogDescription className="text-chess-text-light/60">
              {t("Create a new chess puzzle for players to solve")}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddPuzzle)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left column */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Title")}</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={t("Enter puzzle title")} 
                            {...field}
                            className="bg-transparent border-white/10 text-chess-text-light" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="difficulty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("Difficulty")}</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-transparent border-white/10 text-chess-text-light">
                                <SelectValue placeholder={t("Select difficulty")} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-chess-dark border-white/10 text-chess-text-light">
                              {difficultyLevels.map((level) => (
                                <SelectItem key={level} value={level}>
                                  {level.charAt(0).toUpperCase() + level.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("Type")}</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-transparent border-white/10 text-chess-text-light">
                                <SelectValue placeholder={t("Select type")} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-chess-dark border-white/10 text-chess-text-light">
                              {puzzleTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Tags")}</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={t("Enter comma-separated tags")} 
                            {...field}
                            className="bg-transparent border-white/10 text-chess-text-light" 
                          />
                        </FormControl>
                        <FormDescription className="text-chess-text-light/60">
                          {t("Comma-separated list of tags (e.g., 'knight, fork, tactics')")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isPublished"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border border-white/10 p-4">
                        <div className="space-y-0.5">
                          <FormLabel>{t("Published")}</FormLabel>
                          <FormDescription className="text-chess-text-light/60">
                            {t("Make this puzzle available to players")}
                          </FormDescription>
                        </div>
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="h-4 w-4 text-chess-accent rounded"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Right column */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="initialPosition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Initial Position (FEN)")}</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={t("Enter FEN notation")} 
                            {...field}
                            className="bg-transparent border-white/10 text-chess-text-light" 
                          />
                        </FormControl>
                        <FormDescription className="text-chess-text-light/60">
                          {t("Forsyth-Edwards Notation (FEN) for the starting position")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="solution"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Solution Moves")}</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={t("Enter solution moves")} 
                            {...field}
                            className="bg-transparent border-white/10 text-chess-text-light" 
                          />
                        </FormControl>
                        <FormDescription className="text-chess-text-light/60">
                          {t("Comma-separated list of moves in algebraic notation")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Description")}</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder={t("Enter puzzle description")} 
                            {...field}
                            className="bg-transparent border-white/10 text-chess-text-light resize-none min-h-[120px]" 
                          />
                        </FormControl>
                        <FormDescription className="text-chess-text-light/60">
                          {t("Brief description of the puzzle and what players should learn")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsAddDialogOpen(false)} className="border-white/10 text-chess-text-light hover:bg-white/5">
                  {t("cancel")}
                </Button>
                <Button type="submit">{t("Create Puzzle")}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Puzzle Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-chess-dark border-white/10 text-chess-text-light max-w-3xl">
          <DialogHeader>
            <DialogTitle>{t("Edit Puzzle")}</DialogTitle>
            <DialogDescription className="text-chess-text-light/60">
              {t("Update details for this chess puzzle")}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEditPuzzle)} className="space-y-6">
              {/* Same form fields as Add Puzzle Dialog */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Content is identical to Add Puzzle Dialog */}
                {/* Left column */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Title")}</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={t("Enter puzzle title")} 
                            {...field}
                            className="bg-transparent border-white/10 text-chess-text-light" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="difficulty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("Difficulty")}</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-transparent border-white/10 text-chess-text-light">
                                <SelectValue placeholder={t("Select difficulty")} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-chess-dark border-white/10 text-chess-text-light">
                              {difficultyLevels.map((level) => (
                                <SelectItem key={level} value={level}>
                                  {level.charAt(0).toUpperCase() + level.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("Type")}</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-transparent border-white/10 text-chess-text-light">
                                <SelectValue placeholder={t("Select type")} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-chess-dark border-white/10 text-chess-text-light">
                              {puzzleTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Tags")}</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={t("Enter comma-separated tags")} 
                            {...field}
                            className="bg-transparent border-white/10 text-chess-text-light" 
                          />
                        </FormControl>
                        <FormDescription className="text-chess-text-light/60">
                          {t("Comma-separated list of tags (e.g., 'knight, fork, tactics')")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isPublished"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border border-white/10 p-4">
                        <div className="space-y-0.5">
                          <FormLabel>{t("Published")}</FormLabel>
                          <FormDescription className="text-chess-text-light/60">
                            {t("Make this puzzle available to players")}
                          </FormDescription>
                        </div>
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="h-4 w-4 text-chess-accent rounded"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Right column */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="initialPosition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Initial Position (FEN)")}</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={t("Enter FEN notation")} 
                            {...field}
                            className="bg-transparent border-white/10 text-chess-text-light" 
                          />
                        </FormControl>
                        <FormDescription className="text-chess-text-light/60">
                          {t("Forsyth-Edwards Notation (FEN) for the starting position")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="solution"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Solution Moves")}</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={t("Enter solution moves")} 
                            {...field}
                            className="bg-transparent border-white/10 text-chess-text-light" 
                          />
                        </FormControl>
                        <FormDescription className="text-chess-text-light/60">
                          {t("Comma-separated list of moves in algebraic notation")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Description")}</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder={t("Enter puzzle description")} 
                            {...field}
                            className="bg-transparent border-white/10 text-chess-text-light resize-none min-h-[120px]" 
                          />
                        </FormControl>
                        <FormDescription className="text-chess-text-light/60">
                          {t("Brief description of the puzzle and what players should learn")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsEditDialogOpen(false)} className="border-white/10 text-chess-text-light hover:bg-white/5">
                  {t("cancel")}
                </Button>
                <Button type="submit">{t("Update Puzzle")}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-chess-dark border-white/10 text-chess-text-light">
          <DialogHeader>
            <DialogTitle>{t("Confirm Deletion")}</DialogTitle>
            <DialogDescription className="text-chess-text-light/60">
              {t("Are you sure you want to delete this puzzle? This action cannot be undone.")}
            </DialogDescription>
          </DialogHeader>
          
          {selectedPuzzle && (
            <div className="py-4">
              <p className="mb-2 text-chess-text-light"><strong>{t("Title")}:</strong> {selectedPuzzle.title}</p>
              <p className="mb-2 text-chess-text-light"><strong>{t("Difficulty")}:</strong> {selectedPuzzle.difficulty}</p>
              <p className="text-chess-text-light"><strong>{t("Type")}:</strong> {selectedPuzzle.type}</p>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="border-white/10 text-chess-text-light hover:bg-white/5">
              {t("cancel")}
            </Button>
            <Button variant="destructive" onClick={handleDeletePuzzle}>
              {t("delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* View Puzzle Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="bg-chess-dark border-white/10 text-chess-text-light max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedPuzzle?.title}</DialogTitle>
            <DialogDescription className="text-chess-text-light/60">
              {t("View puzzle details")}
            </DialogDescription>
          </DialogHeader>
          
          {selectedPuzzle && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-1 text-chess-text-light/60">{t("Difficulty")}</h4>
                  <Badge className={`${getDifficultyColor(selectedPuzzle.difficulty)} text-white`}>
                    {selectedPuzzle.difficulty.charAt(0).toUpperCase() + selectedPuzzle.difficulty.slice(1)}
                  </Badge>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-1 text-chess-text-light/60">{t("Type")}</h4>
                  <p className="text-chess-text-light">
                    {selectedPuzzle.type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-1 text-chess-text-light/60">{t("Status")}</h4>
                  <Badge variant={selectedPuzzle.isPublished ? "default" : "outline"} className="text-sm">
                    {selectedPuzzle.isPublished ? "Published" : "Draft"}
                  </Badge>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-1 text-chess-text-light/60">{t("Creation Date")}</h4>
                  <p className="text-chess-text-light">
                    {new Date(selectedPuzzle.createdAt).toLocaleDateString()}
                  </p>
                </div>
                
                {selectedPuzzle.tags && (
                  <div>
                    <h4 className="text-sm font-medium mb-1 text-chess-text-light/60">{t("Tags")}</h4>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(selectedPuzzle.tags) && selectedPuzzle.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-chess-text-light border-white/20">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                {selectedPuzzle.description && (
                  <div>
                    <h4 className="text-sm font-medium mb-1 text-chess-text-light/60">{t("Description")}</h4>
                    <p className="text-chess-text-light">{selectedPuzzle.description}</p>
                  </div>
                )}
                
                <div>
                  <h4 className="text-sm font-medium mb-1 text-chess-text-light/60">{t("Initial Position (FEN)")}</h4>
                  <p className="text-chess-text-light font-mono bg-chess-dark/50 p-2 rounded border border-white/10 text-sm break-all">
                    {selectedPuzzle.initialPosition}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-1 text-chess-text-light/60">{t("Solution Moves")}</h4>
                  <p className="text-chess-text-light font-mono bg-chess-dark/50 p-2 rounded border border-white/10 text-sm break-all">
                    {selectedPuzzle.solution}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-1 text-chess-text-light/60">{t("Stats")}</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 rounded bg-chess-dark/50 border border-white/10">
                      <p className="text-xs text-chess-text-light/60">{t("Solve Count")}</p>
                      <p className="text-lg font-bold text-chess-text-light">{selectedPuzzle.solveCount}</p>
                    </div>
                    <div className="p-2 rounded bg-chess-dark/50 border border-white/10">
                      <p className="text-xs text-chess-text-light/60">{t("Success Rate")}</p>
                      <p className="text-lg font-bold text-chess-text-light">{selectedPuzzle.successRate}%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)} className="border-white/10 text-chess-text-light hover:bg-white/5">
              {t("Close")}
            </Button>
            {selectedPuzzle && (
              <Button onClick={() => {
                setIsViewDialogOpen(false);
                handleEditClick(selectedPuzzle);
              }}>
                {t("edit")}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PuzzlesCMS;
