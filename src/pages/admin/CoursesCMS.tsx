import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Search, Filter, MoreVertical, Plus, PencilLine, Eye, Edit, Trash2, FileUp, BookOpen, FileEdit } from "lucide-react";
import { useLanguageContext } from "@/contexts/LanguageContext";

// Sample course data
const COURSES = [
  {
    id: "c1",
    title: "Chess Fundamentals",
    level: "beginner",
    lessons: 10,
    duration: "5 hours",
    status: "published",
    students: 1250,
    rating: 4.8,
    image: "/placeholder.svg",
    lastUpdated: "2025-04-15",
  },
  {
    id: "c2",
    title: "Advanced Opening Strategies",
    level: "intermediate",
    lessons: 8,
    duration: "4.5 hours",
    status: "published",
    students: 875,
    rating: 4.6,
    image: "/placeholder.svg",
    lastUpdated: "2025-03-20",
  },
  {
    id: "c3",
    title: "Mastering Endgames",
    level: "advanced",
    lessons: 12,
    duration: "7 hours",
    status: "published",
    students: 620,
    rating: 4.9,
    image: "/placeholder.svg",
    lastUpdated: "2025-04-01",
  },
  {
    id: "c4",
    title: "Tactical Patterns",
    level: "intermediate",
    lessons: 15,
    duration: "8 hours",
    status: "draft",
    students: 0,
    rating: 0,
    image: "/placeholder.svg",
    lastUpdated: "2025-04-28",
  },
  {
    id: "c5",
    title: "Queen's Gambit Masterclass",
    level: "advanced",
    lessons: 6,
    duration: "3.5 hours",
    status: "published",
    students: 430,
    rating: 4.7,
    image: "/placeholder.svg",
    lastUpdated: "2025-02-10",
  },
  {
    id: "c6",
    title: "Chess for Kids",
    level: "beginner",
    lessons: 8,
    duration: "4 hours",
    status: "published",
    students: 1820,
    rating: 4.9,
    image: "/placeholder.svg",
    lastUpdated: "2025-01-15",
  },
  {
    id: "c7",
    title: "Tournament Preparation",
    level: "intermediate",
    lessons: 5,
    duration: "2.5 hours",
    status: "review",
    students: 0,
    rating: 0,
    image: "/placeholder.svg",
    lastUpdated: "2025-04-30",
  },
];

const CoursesCMS = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<typeof COURSES[0] | null>(null);
  const { toast } = useToast();
  const { t } = useLanguageContext();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredCourses = COURSES.filter((course) => {
    return (
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.level.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.status.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleViewDetails = (course: typeof COURSES[0]) => {
    setSelectedCourse(course);
    setShowDetailsDialog(true);
  };

  const handleEdit = (courseId: string) => {
    toast({
      title: "Edit course",
      description: `You are now editing course: ${courseId}`,
    });
    // In a real app, this would redirect to a course editor
  };

  const handleDelete = (courseId: string) => {
    toast({
      title: "Course deleted",
      description: `Course ID: ${courseId} has been deleted.`,
    });
  };

  const handleStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-500 hover:bg-green-600">Published</Badge>;
      case "draft":
        return <Badge variant="outline" className="text-gray-300 border-gray-400">Draft</Badge>;
      case "review":
        return <Badge className="bg-amber-500 hover:bg-amber-600">In Review</Badge>;
      default:
        return null;
    }
  };

  const handleLevelBadge = (level: string) => {
    switch (level) {
      case "beginner":
        return <Badge className="bg-blue-600 hover:bg-blue-700">Beginner</Badge>;
      case "intermediate":
        return <Badge className="bg-chess-accent hover:bg-chess-accent/90">Intermediate</Badge>;
      case "advanced":
        return <Badge className="bg-purple-600 hover:bg-purple-700">Advanced</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-chess-text-light">Courses CMS</h2>
          <p className="text-gray-400">Manage and edit learning content</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="text-chess-text-light border-white/10">
            <FileUp className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Course
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <TabsList className="bg-white/5">
            <TabsTrigger value="all">All Courses</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
            <TabsTrigger value="draft">Drafts</TabsTrigger>
            <TabsTrigger value="review">In Review</TabsTrigger>
          </TabsList>
          <div className="flex w-full sm:w-auto gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search courses..."
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
                    <TableHead className="text-gray-400">Course</TableHead>
                    <TableHead className="text-gray-400">Level</TableHead>
                    <TableHead className="text-gray-400">Status</TableHead>
                    <TableHead className="text-gray-400">Lessons</TableHead>
                    <TableHead className="text-gray-400">Duration</TableHead>
                    <TableHead className="text-gray-400">Students</TableHead>
                    <TableHead className="text-gray-400">Rating</TableHead>
                    <TableHead className="text-gray-400 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCourses.length > 0 ? (
                    filteredCourses.map((course) => (
                      <TableRow key={course.id} className="hover:bg-white/5 border-white/10">
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 overflow-hidden rounded-md">
                              <AspectRatio ratio={1 / 1}>
                                <img src={course.image} alt={course.title} className="object-cover" />
                              </AspectRatio>
                            </div>
                            <div className="text-chess-text-light">{course.title}</div>
                          </div>
                        </TableCell>
                        <TableCell>{handleLevelBadge(course.level)}</TableCell>
                        <TableCell>{handleStatusBadge(course.status)}</TableCell>
                        <TableCell className="text-gray-400">{course.lessons}</TableCell>
                        <TableCell className="text-gray-400">{course.duration}</TableCell>
                        <TableCell className="text-gray-400">{course.students.toLocaleString()}</TableCell>
                        <TableCell className="text-gray-400">
                          {course.rating ? `${course.rating} / 5` : "-"}
                        </TableCell>
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
                              <DropdownMenuItem className="cursor-pointer hover:bg-white/10" onClick={() => handleViewDetails(course)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer hover:bg-white/10" onClick={() => handleEdit(course.id)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Course
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer hover:bg-white/10" onClick={() => {}}>
                                <FileEdit className="h-4 w-4 mr-2" />
                                Edit Lessons
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer hover:bg-white/10" onClick={() => {}}>
                                <BookOpen className="h-4 w-4 mr-2" />
                                Preview
                              </DropdownMenuItem>
                              {course.status !== "published" && (
                                <DropdownMenuItem className="cursor-pointer text-green-500 hover:bg-white/10" onClick={() => {}}>
                                  <PencilLine className="h-4 w-4 mr-2" />
                                  Publish
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator className="bg-white/10" />
                              <DropdownMenuItem className="cursor-pointer text-red-500 hover:bg-white/10" onClick={() => handleDelete(course.id)}>
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
                        No courses found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Other tab contents would be similar but filtered */}

        {/* Create Course Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="sm:max-w-[600px] bg-chess-dark border-white/10 text-chess-text-light">
            <DialogHeader>
              <DialogTitle className="text-chess-text-light">Create New Course</DialogTitle>
              <DialogDescription className="text-gray-400">
                Add a new course to your learning platform
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title" className="text-chess-text-light">Course Title</Label>
                <Input id="title" placeholder="Enter course title" className="bg-chess-dark border-white/20" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="level" className="text-chess-text-light">Difficulty Level</Label>
                  <Input id="level" placeholder="Beginner, Intermediate, Advanced" className="bg-chess-dark border-white/20" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status" className="text-chess-text-light">Status</Label>
                  <Input id="status" placeholder="Draft, Review, Published" className="bg-chess-dark border-white/20" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="lessons" className="text-chess-text-light">Number of Lessons</Label>
                  <Input id="lessons" type="number" placeholder="0" className="bg-chess-dark border-white/20" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="duration" className="text-chess-text-light">Total Duration</Label>
                  <Input id="duration" placeholder="e.g. 4 hours" className="bg-chess-dark border-white/20" />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="image" className="text-chess-text-light">Course Image</Label>
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 border-2 border-dashed border-white/20 rounded-md flex items-center justify-center">
                    <FileUp className="h-6 w-6 text-gray-400" />
                  </div>
                  <Button variant="outline" className="border-white/20">
                    Upload Image
                  </Button>
                </div>
                <p className="text-xs text-gray-400 mt-1">Recommended size: 1280x720px</p>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description" className="text-chess-text-light">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter course description..."
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
                  title: "Course created",
                  description: "New course has been successfully created.",
                });
                setShowCreateDialog(false);
              }}>
                Create Course
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Course Details Dialog */}
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="sm:max-w-[600px] bg-chess-dark border-white/10 text-chess-text-light">
            <DialogHeader>
              <DialogTitle className="text-chess-text-light">Course Details</DialogTitle>
              <DialogDescription className="text-gray-400">
                View detailed information about this course
              </DialogDescription>
            </DialogHeader>
            {selectedCourse && (
              <ScrollArea className="h-[60vh] pr-4">
                <div className="space-y-6">
                  <div className="aspect-w-16 aspect-h-9 rounded-md overflow-hidden">
                    <AspectRatio ratio={16 / 9}>
                      <img src={selectedCourse.image} alt={selectedCourse.title} className="object-cover" />
                    </AspectRatio>
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-bold text-chess-text-light">{selectedCourse.title}</h2>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {handleLevelBadge(selectedCourse.level)}
                      {handleStatusBadge(selectedCourse.status)}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                      <p className="text-sm text-gray-400">Total Lessons</p>
                      <p className="text-chess-text-light">{selectedCourse.lessons}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Duration</p>
                      <p className="text-chess-text-light">{selectedCourse.duration}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Students Enrolled</p>
                      <p className="text-chess-text-light">{selectedCourse.students.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Rating</p>
                      <p className="text-chess-text-light">
                        {selectedCourse.rating ? `${selectedCourse.rating} / 5` : "Not rated yet"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Last Updated</p>
                      <p className="text-chess-text-light">{selectedCourse.lastUpdated}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-chess-text-light mb-2">Course Description</h3>
                    <p className="text-gray-300 bg-white/5 p-3 rounded-md">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, 
                      nunc nisl aliquam nisl, eget aliquam nisl nunc eget nisl. Nullam auctor, nisl eget ultricies tincidunt, 
                      nunc nisl aliquam nisl, eget aliquam nisl nunc eget nisl.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-chess-text-light mb-2">Lesson Overview</h3>
                    <ul className="divide-y divide-white/10 bg-white/5 rounded-md overflow-hidden">
                      {[...Array(selectedCourse.lessons)].map((_, idx) => (
                        <li key={idx} className="p-3 flex items-center justify-between">
                          <div>
                            <p className="text-chess-text-light">Lesson {idx + 1}</p>
                            <p className="text-sm text-gray-400">Sample lesson title</p>
                          </div>
                          <p className="text-sm text-gray-400">15 min</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="pt-2">
                    <h3 className="text-lg font-medium text-chess-text-light mb-2">Actions</h3>
                    <div className="flex flex-wrap gap-3">
                      <Button className="flex-1 sm:flex-none">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Course
                      </Button>
                      <Button variant="outline" className="flex-1 sm:flex-none border-white/20">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Preview Course
                      </Button>
                      {selectedCourse.status !== "published" && (
                        <Button className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700">
                          <PencilLine className="h-4 w-4 mr-2" />
                          Publish Course
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            )}
            <DialogFooter className="mt-4">
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

export default CoursesCMS;
