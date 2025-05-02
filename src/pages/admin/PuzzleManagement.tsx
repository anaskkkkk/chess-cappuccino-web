
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguageContext } from "@/contexts/LanguageContext";

// Mock data for UI development
const mockPuzzles = [
  {
    id: 1,
    title: "Knight Fork",
    difficulty: 1200,
    rating: 4.8,
    category: "tactics",
    played: 2345,
    solved: 1890,
    published: true,
    fen: "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3"
  },
  {
    id: 2,
    title: "Queen Sacrifice",
    difficulty: 1800,
    rating: 4.9,
    category: "sacrifice",
    played: 1245,
    solved: 780,
    published: true,
    fen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4"
  },
  {
    id: 3,
    title: "Discovered Attack",
    difficulty: 1500,
    rating: 4.6,
    category: "tactics",
    played: 1845,
    solved: 1240,
    published: true,
    fen: "rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2"
  }
];

const categories = [
  { value: "tactics", label: "Tactics" },
  { value: "endgame", label: "Endgame" },
  { value: "opening", label: "Opening" },
  { value: "middlegame", label: "Middlegame" },
  { value: "mate", label: "Checkmate" },
  { value: "sacrifice", label: "Sacrifice" }
];

const PuzzleManagement = () => {
  const { t } = useLanguageContext();
  const [puzzles, setPuzzles] = useState(mockPuzzles);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPuzzle, setSelectedPuzzle] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Form state for puzzle editing
  const [editTitle, setEditTitle] = useState("");
  const [editDifficulty, setEditDifficulty] = useState<number>(1200);
  const [editCategory, setEditCategory] = useState("");
  const [editFen, setEditFen] = useState("");
  const [editSolution, setEditSolution] = useState("");
  const [editPublished, setEditPublished] = useState(false);
  
  // Open dialog with puzzle data for editing
  const handleEditPuzzle = (puzzle: any) => {
    setSelectedPuzzle(puzzle);
    setEditTitle(puzzle.title);
    setEditDifficulty(puzzle.difficulty);
    setEditCategory(puzzle.category);
    setEditFen(puzzle.fen);
    setEditSolution(puzzle.solution || "");
    setEditPublished(puzzle.published);
    setIsDialogOpen(true);
  };
  
  // Open dialog for new puzzle
  const handleNewPuzzle = () => {
    setSelectedPuzzle(null);
    setEditTitle("");
    setEditDifficulty(1200);
    setEditCategory("");
    setEditFen("");
    setEditSolution("");
    setEditPublished(false);
    setIsDialogOpen(true);
  };
  
  // Save puzzle changes
  const handleSavePuzzle = () => {
    if (!editTitle || !editCategory || !editFen) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    // Validate difficulty as number
    if (isNaN(editDifficulty)) {
      toast({
        title: "Error",
        description: "Difficulty must be a valid number.",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedPuzzle) {
      // Update existing puzzle
      setPuzzles(puzzles.map(p => 
        p.id === selectedPuzzle.id
          ? {
              ...p,
              title: editTitle,
              difficulty: editDifficulty,
              category: editCategory,
              fen: editFen,
              solution: editSolution,
              published: editPublished
            }
          : p
      ));
      
      toast({
        title: "Success",
        description: "Puzzle updated successfully.",
      });
    } else {
      // Create new puzzle
      const newPuzzle = {
        id: Math.max(0, ...puzzles.map(p => p.id)) + 1,
        title: editTitle,
        difficulty: editDifficulty,
        rating: 0,
        category: editCategory,
        played: 0,
        solved: 0,
        fen: editFen,
        solution: editSolution,
        published: editPublished
      };
      
      setPuzzles([...puzzles, newPuzzle]);
      
      toast({
        title: "Success",
        description: "Puzzle created successfully.",
      });
    }
    
    setIsDialogOpen(false);
  };
  
  // Delete puzzle
  const handleDeletePuzzle = () => {
    if (selectedPuzzle) {
      setPuzzles(puzzles.filter(p => p.id !== selectedPuzzle.id));
      
      toast({
        title: "Success",
        description: "Puzzle deleted successfully.",
      });
    }
    
    setIsDeleteDialogOpen(false);
  };
  
  // Toggle publish status
  const handleTogglePublish = (puzzleId: number, currentStatus: boolean) => {
    setPuzzles(puzzles.map(p => 
      p.id === puzzleId
        ? { ...p, published: !currentStatus }
        : p
    ));
    
    toast({
      title: "Success",
      description: `Puzzle ${currentStatus ? "unpublished" : "published"} successfully.`,
    });
  };
  
  // Filter puzzles based on search term
  const filteredPuzzles = puzzles.filter(puzzle =>
    puzzle.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    puzzle.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{t("Puzzle Management")}</h2>
        
        <Button onClick={handleNewPuzzle} className="bg-chess-accent hover:bg-chess-accent/90">
          {t("Add New Puzzle")}
        </Button>
      </div>
      
      <div className="bg-chess-beige-100 rounded-md p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Input 
              placeholder={t("Search puzzles...")} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("Filter by Category")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_categories">{t("All Categories")}</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat.value} value={cat.value}>{t(cat.label)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("Filter by Difficulty")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_difficulties">{t("All Difficulties")}</SelectItem>
              <SelectItem value="beginner">{t("Beginner (< 1200)")}</SelectItem>
              <SelectItem value="intermediate">{t("Intermediate (1200-1800)")}</SelectItem>
              <SelectItem value="advanced">{t("Advanced (> 1800)")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableCaption>{t("A list of all puzzles")}</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>{t("Title")}</TableHead>
                <TableHead className="hidden md:table-cell">{t("Category")}</TableHead>
                <TableHead className="hidden sm:table-cell">{t("Difficulty")}</TableHead>
                <TableHead className="hidden lg:table-cell">{t("Rating")}</TableHead>
                <TableHead className="hidden lg:table-cell">{t("Played")}</TableHead>
                <TableHead className="hidden md:table-cell">{t("Status")}</TableHead>
                <TableHead className="text-right">{t("Actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPuzzles.map((puzzle) => (
                <TableRow key={puzzle.id}>
                  <TableCell className="font-medium">{puzzle.title}</TableCell>
                  <TableCell className="hidden md:table-cell">{t(puzzle.category)}</TableCell>
                  <TableCell className="hidden sm:table-cell">{puzzle.difficulty}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {puzzle.rating.toFixed(1)} ({Math.floor(puzzle.solved / puzzle.played * 100)}%)
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">{puzzle.played}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {puzzle.published ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {t("Published")}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {t("Draft")}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                            />
                          </svg>
                          <span className="sr-only">{t("Actions")}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>{t("Actions")}</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEditPuzzle(puzzle)}>
                          {t("Edit Puzzle")}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => window.open(`/puzzles/${puzzle.id}`, '_blank')}>
                          {t("View Puzzle")}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleTogglePublish(puzzle.id, puzzle.published)}>
                          {puzzle.published ? t("Unpublish") : t("Publish")}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-500"
                          onClick={() => {
                            setSelectedPuzzle(puzzle);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          {t("Delete Puzzle")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {/* Puzzle Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedPuzzle ? t("Edit Puzzle") : t("Add New Puzzle")}
            </DialogTitle>
            <DialogDescription>
              {selectedPuzzle 
                ? t("Update puzzle details and solution.")
                : t("Create a new chess puzzle for the platform.")}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-2">
              <label htmlFor="title" className="text-sm font-medium">
                {t("Puzzle Title")}
              </label>
              <Input
                id="title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder={t("Enter a descriptive title")}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="difficulty" className="text-sm font-medium">
                  {t("Difficulty Rating")}
                </label>
                <Input
                  id="difficulty"
                  type="number"
                  value={editDifficulty}
                  onChange={(e) => setEditDifficulty(parseInt(e.target.value))}
                  placeholder="1200"
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="category" className="text-sm font-medium">
                  {t("Category")}
                </label>
                <Select
                  value={editCategory}
                  onValueChange={setEditCategory}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder={t("Select category")} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>{t(cat.label)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="fen" className="text-sm font-medium">
                {t("Board Position (FEN)")}
              </label>
              <Input
                id="fen"
                value={editFen}
                onChange={(e) => setEditFen(e.target.value)}
                placeholder="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="solution" className="text-sm font-medium">
                {t("Solution (PGN or Move List)")}
              </label>
              <Textarea
                id="solution"
                value={editSolution}
                onChange={(e) => setEditSolution(e.target.value)}
                placeholder={t("Enter the solution moves, e.g., 'e4 e5 Nf3'")}
                rows={3}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="published"
                checked={editPublished}
                onCheckedChange={(checked) => setEditPublished(checked as boolean)}
              />
              <label
                htmlFor="published"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {t("Published")}
              </label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              {t("Cancel")}
            </Button>
            <Button onClick={handleSavePuzzle}>
              {selectedPuzzle ? t("Update Puzzle") : t("Create Puzzle")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("Confirm Delete")}</DialogTitle>
            <DialogDescription>
              {t("Are you sure you want to delete this puzzle? This action cannot be undone.")}
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              {t("Cancel")}
            </Button>
            <Button variant="destructive" onClick={handleDeletePuzzle}>
              {t("Delete Puzzle")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PuzzleManagement;
