
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { GraduationCap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const Courses = () => {
  const courses = [
    {
      id: 1,
      title: "Chess Fundamentals",
      description: "Master the basic principles of chess to build a solid foundation for your game.",
      level: "Beginner",
      lessons: 12,
      duration: "5 hours",
      instructor: "GM Sarah Johnson",
      image: "fundamentals"
    },
    {
      id: 2,
      title: "Opening Mastery",
      description: "Learn the theory and practice of the most popular chess openings.",
      level: "Intermediate",
      lessons: 16,
      duration: "8 hours",
      instructor: "IM Michael Chen",
      image: "openings"
    },
    {
      id: 3,
      title: "Endgame Techniques",
      description: "Perfect your endgame with essential techniques and patterns.",
      level: "Intermediate",
      lessons: 10,
      duration: "6 hours",
      instructor: "GM David Martinez",
      image: "endgame"
    },
    {
      id: 4,
      title: "Tactical Patterns",
      description: "Recognize and execute powerful tactical motifs and combinations.",
      level: "Intermediate",
      lessons: 14,
      duration: "7 hours",
      instructor: "FM Lisa Taylor",
      image: "tactics"
    },
    {
      id: 5,
      title: "Strategic Concepts",
      description: "Develop your positional understanding and planning skills.",
      level: "Advanced",
      lessons: 12,
      duration: "9 hours",
      instructor: "GM Robert Anderson",
      image: "strategy"
    },
    {
      id: 6,
      title: "Master's Mindset",
      description: "Think like a chess master and improve your decision-making process.",
      level: "Advanced",
      lessons: 8,
      duration: "6 hours",
      instructor: "GM Elena Petrova",
      image: "mindset"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-chess-dark">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center mb-8">
            <GraduationCap className="h-8 w-8 text-chess-accent mr-4" />
            <h1 className="text-4xl font-bold text-chess-text-light">Chess Courses</h1>
          </div>
          
          <div className="mb-12">
            <div className="bg-chess-beige-300 p-8 rounded-lg">
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-2/3">
                  <h2 className="text-2xl font-bold text-chess-text-dark mb-3">Premium Chess Course Bundle</h2>
                  <p className="text-gray-700 mb-6">
                    Get access to all our premium chess courses at a discounted price. Perfect for players looking to improve across all aspects of the game.
                  </p>
                  <div className="flex items-center mb-6">
                    <div className="text-3xl font-bold text-chess-text-dark mr-4">$199</div>
                    <div className="text-lg text-gray-700 line-through">$299</div>
                    <div className="ml-4 bg-chess-accent text-chess-text-light text-sm py-1 px-3 rounded-full">
                      Save 33%
                    </div>
                  </div>
                  <Button className="bg-chess-accent text-chess-text-light hover:bg-opacity-90">
                    Get All Courses
                  </Button>
                </div>
                <div className="md:w-1/3 mt-6 md:mt-0 flex justify-center">
                  <div className="w-32 h-32 rounded-full bg-chess-accent/20 flex items-center justify-center">
                    <GraduationCap className="h-16 w-16 text-chess-accent" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-chess-text-light mb-6">Browse Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map(course => (
                <Card key={course.id} className="bg-chess-beige-100 border-none">
                  <div className="h-48 bg-chess-accent/20 flex items-center justify-center">
                    <span className="text-chess-text-dark">{course.image} Image</span>
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-center mb-2">
                      <span className="bg-chess-beige-300 text-chess-text-dark text-sm px-3 py-1 rounded-full">
                        {course.level}
                      </span>
                      <span className="text-sm text-gray-700">
                        {course.lessons} lessons
                      </span>
                    </div>
                    <CardTitle className="text-chess-text-dark">{course.title}</CardTitle>
                    <CardDescription className="text-gray-700">
                      By {course.instructor}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">{course.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">{course.duration}</span>
                      <Button className="bg-chess-accent text-chess-text-light hover:bg-opacity-90">
                        Start Course
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Courses;
