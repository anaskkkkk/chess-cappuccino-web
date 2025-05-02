
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { BookCopy, Filter, Plus, Search, Trash, PenLine } from "lucide-react";
import { useLanguageContext } from "@/contexts/LanguageContext";
import { learningApi } from "@/services/api/apiEndpoints";

// Form validation schema for puzzle
const puzzleFormSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters."),
  description: z.string().min(5, "Description must be at least 5 characters."),
  difficulty: z.string(),
  category: z.string(),
  fen: z.string().min(10, "FEN notation must be valid"),
  solution: z.string().min(2, "Solution must be at least 2 characters"),
  rating: z.string().transform(val => Number(val)),
});

type PuzzleFormValues = z.infer<typeof puzzleFormSchema>;

// Mock puzzle data for UI development
const mockPuzzles = [
  { id: "p1", title: "Knight Fork", description: "Find the knight fork", difficulty: "easy", category: "tactics", fen: "r1bqkbnr/ppp2ppp/2np4/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1", solution: "Nxe5", rating: 1200 },
  { id: "p2", title: "Queen Sacrifice", description: "Sacrifice the queen for checkmate", difficulty: "hard", category: "checkmate", fen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1", solution: "Qxf7+", rating: 1800 },
  { id: "p3", title: "Double Check", description: "Deliver a double check", difficulty: "medium", category: "tactics", fen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1", solution: "Ng5+", rating: 1500 }
];

const PuzzleManagement = () => {
  const { t } = useLanguageContext();
  const [puzzles, setPuzzles] = useState(mockPuzzles);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentPuzzle, setCurrentPuzzle] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("");
  
  // Form for adding/editing puzzles
  const form = useForm<PuzzleFormValues>({
    resolver: zodResolver(puzzleFormSchema),
    defaultValues: {
      title: "",
      description: "",
      difficulty: "medium",
      category: "tactics",
      fen: "",
      solution: "",
      rating: "1500",
    }
  });

  // TODO: API - Fetch puzzles
  const fetchPuzzles = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await learningApi.getPuzzles();
      // return response;
      return mockPuzzles;
    } catch (error) {
      console.error("Error fetching puzzles:", error);
      toast({
        title: "Error",
        description: "Failed to fetch puzzles",
        variant: "destructive",
      });
      return [];
    }
  };
  
  // Query for fetching puzzles
  const { data: puzzlesData, isLoading, error } = useQuery({
    queryKey: ['admin-puzzles'],
    queryFn: fetchPuzzles,
    // Disabled for now to use mock data
    enabled: false,
  });

  // Watch for API data
  useEffect(() => {
    if (puzzlesData) {
      setPuzzles(puzzlesData);
    }
  }, [puzzlesData]);

  // Edit puzzle
  const handleEditPuzzle = (puzzle: any) => {
    setCurrentPuzzle(puzzle);
    form.reset({
      title: puzzle.title,
      description: puzzle.description,
      difficulty: puzzle.difficulty,
      category: puzzle.category,
      fen: puzzle.fen,
      solution: puzzle.solution,
      rating: String(puzzle.rating),
    });
    setIsEditDialogOpen(true);
  };

  // Delete puzzle
  const handleDeletePuzzle = async (id: string) => {
    try {
      // TODO: API - Delete puzzle
      // await learningApi.deletePuzzle(id);
      
      // Update local state
      setPuzzles(puzzles.filter(puzzle => puzzle.id !== id));
      toast({
        title: "Success",
        description: "Puzzle deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting puzzle:", error);
      toast({
        title: "Error",
        description: "Failed to delete puzzle",
        variant: "destructive",
      });
    }
  };

  // Submit handler for add/edit form
  const onSubmit = async (data: PuzzleFormValues) => {
    try {
      if (currentPuzzle) {
        // TODO: API - Update puzzle
        // await learningApi.updatePuzzle(currentPuzzle.id, data);
        
        // Update local state
        setPuzzles(puzzles.map(puzzle => 
          puzzle.id === currentPuzzle.id 
            ? { ...puzzle, ...data, rating: Number(data.rating) } 
            : puzzle
        ));
        
        setIsEditDialogOpen(false);
        toast({
          title: "Success",
          description: "Puzzle updated successfully",
        });
      } else {
        // TODO: API - Create puzzle
        // const newPuzzle = await learningApi.createPuzzle(data);
        
        // Mock a new puzzle for UI
        const newPuzzle = {
          id: `p${puzzles.length + 1}`,
          ...data,
          rating: Number(data.rating)
        };
        
        // Update local state
        setPuzzles([...puzzles, newPuzzle]);
        
        setIsAddDialogOpen(false);
        toast({
          title: "Success",
          description: "Puzzle created successfully",
        });
      }
      
      // Reset form
      form.reset();
      setCurrentPuzzle(null);
    } catch (error) {
      console.error("Error saving puzzle:", error);
      toast({
        title: "Error",
        description: "Failed to save puzzle",
        variant: "destructive",
      });
    }
  };

  // Filter puzzles based on search and filter
  const filteredPuzzles = puzzles.filter(puzzle => {
    const matchesSearch = puzzle.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          puzzle.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterDifficulty === "" || puzzle.difficulty === filterDifficulty;
    
    return matchesSearch && matchesFilter;
  });
  
  // Open add dialog and reset form
  const openAddDialog = () => {
    form.reset({
      title: "",
      description: "",
      difficulty: "medium",
      category: "tactics",
      fen: "",
      solution: "",
      rating: "1500",
    });
    setCurrentPuzzle(null);
    setIsAddDialogOpen(true);
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 p-4 rounded-md border border-red-200 text-red-700">
          <h3 className="text-lg font-medium">{t("Error Loading Puzzles")}</h3>
          <p className="mt-1">{t("There was an error loading puzzles. Please try again later.")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BookCopy className="h-6 w-6 text-chess-accent" />
          <h2 className="text-2xl font-bold">{t("Puzzles")}</h2>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog} className="bg-chess-accent hover:bg-chess-accent/90">
              <Plus className="h-4 w-4 mr-2" /> {t("Add Puzzle")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{t("Add New Puzzle")}</DialogTitle>
              <DialogDescription>
                {t("Create a new chess puzzle for users to solve.")}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Title")}</FormLabel>
                        <FormControl>
                          <Input placeholder={t("Knight Fork")} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="difficulty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Difficulty")}</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t("Select difficulty")} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="easy">{t("Easy")}</SelectItem>
                            <SelectItem value="medium">{t("Medium")}</SelectItem>
                            <SelectItem value="hard">{t("Hard")}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Category")}</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t("Select category")} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="tactics">{t("Tactics")}</SelectItem>
                            <SelectItem value="endgame">{t("Endgame")}</SelectItem>
                            <SelectItem value="opening">{t("Opening")}</SelectItem>
                            <SelectItem value="middlegame">{t("Middlegame")}</SelectItem>
                            <SelectItem value="checkmate">{t("Checkmate")}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Rating")}</FormLabel>
                        <FormControl>
                          <Input type="number" min="500" max="3000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Description")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("Find the best move in this position")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="fen"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("FEN Position")}</FormLabel>
                      <FormControl>
                        <Input placeholder="r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="solution"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Solution")}</FormLabel>
                      <FormControl>
                        <Input placeholder="Nxe5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    {t("Cancel")}
                  </Button>
                  <Button type="submit" className="bg-chess-accent hover:bg-chess-accent/90">
                    {t("Save")}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{t("Edit Puzzle")}</DialogTitle>
            <DialogDescription>
              {t("Update the puzzle details.")}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Same form fields as add dialog */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Title")}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Difficulty")}</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="easy">{t("Easy")}</SelectItem>
                          <SelectItem value="medium">{t("Medium")}</SelectItem>
                          <SelectItem value="hard">{t("Hard")}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Category")}</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="tactics">{t("Tactics")}</SelectItem>
                          <SelectItem value="endgame">{t("Endgame")}</SelectItem>
                          <SelectItem value="opening">{t("Opening")}</SelectItem>
                          <SelectItem value="middlegame">{t("Middlegame")}</SelectItem>
                          <SelectItem value="checkmate">{t("Checkmate")}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Rating")}</FormLabel>
                      <FormControl>
                        <Input type="number" min="500" max="3000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Description")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="fen"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("FEN Position")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="solution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Solution")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  {t("Cancel")}
                </Button>
                <Button type="submit" className="bg-chess-accent hover:bg-chess-accent/90">
                  {t("Update")}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <div className="bg-chess-beige-100 rounded-md p-4">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <Input 
              placeholder={t("Search puzzles...")} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select 
              value={filterDifficulty} 
              onValueChange={setFilterDifficulty}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder={t("All difficulties")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t("All difficulties")}</SelectItem>
                <SelectItem value="easy">{t("Easy")}</SelectItem>
                <SelectItem value="medium">{t("Medium")}</SelectItem>
                <SelectItem value="hard">{t("Hard")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableCaption>{t("A list of all puzzles")}</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>{t("Title")}</TableHead>
                <TableHead className="hidden md:table-cell">{t("Description")}</TableHead>
                <TableHead>{t("Difficulty")}</TableHead>
                <TableHead className="hidden sm:table-cell">{t("Category")}</TableHead>
                <TableHead className="hidden lg:table-cell">{t("Rating")}</TableHead>
                <TableHead className="text-right">{t("Actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <div className="flex justify-center">
                      <div className="w-6 h-6 border-2 border-t-chess-accent rounded-full animate-spin"></div>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">{t("Loading puzzles...")}</p>
                  </TableCell>
                </TableRow>
              ) : filteredPuzzles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <p className="text-gray-500">{t("No puzzles found")}</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredPuzzles.map((puzzle) => (
                  <TableRow key={puzzle.id}>
                    <TableCell className="font-medium">{puzzle.title}</TableCell>
                    <TableCell className="hidden md:table-cell max-w-xs truncate">{puzzle.description}</TableCell>
                    <TableCell>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        puzzle.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                        puzzle.difficulty === 'medium' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {t(puzzle.difficulty.charAt(0).toUpperCase() + puzzle.difficulty.slice(1))}
                      </span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{t(puzzle.category.charAt(0).toUpperCase() + puzzle.category.slice(1))}</TableCell>
                    <TableCell className="hidden lg:table-cell">{puzzle.rating}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditPuzzle(puzzle)}
                        >
                          <PenLine className="h-4 w-4" />
                          <span className="sr-only">{t("Edit")}</span>
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeletePuzzle(puzzle.id)}
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">{t("Delete")}</span>
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
    </div>
  );
};

export default PuzzleManagement;
