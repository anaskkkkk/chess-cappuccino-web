
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { GraduationCap, Puzzle } from 'lucide-react';

const Learn = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-chess-text-light mb-8">Learn Chess</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-chess-beige-100 rounded-lg overflow-hidden shadow-lg">
            <div className="p-8 flex flex-col items-center">
              <GraduationCap className="h-16 w-16 text-chess-accent mb-4" />
              <h2 className="text-2xl font-bold text-chess-text-dark mb-4">Courses</h2>
              <p className="text-gray-700 mb-6 text-center">
                Structured lessons designed to improve your chess skills from beginner to advanced levels.
              </p>
              <Button className="bg-chess-accent text-chess-text-light hover:bg-opacity-90">
                Browse Courses
              </Button>
            </div>
            <div className="bg-chess-beige-300 p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-chess-text-dark">Beginner's Course</span>
                <span className="text-sm text-gray-700">12 lessons</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-chess-text-dark">Opening Mastery</span>
                <span className="text-sm text-gray-700">8 lessons</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-chess-text-dark">Endgame Techniques</span>
                <span className="text-sm text-gray-700">10 lessons</span>
              </div>
            </div>
          </div>
          
          <div className="bg-chess-beige-100 rounded-lg overflow-hidden shadow-lg">
            <div className="p-8 flex flex-col items-center">
              <Puzzle className="h-16 w-16 text-chess-accent mb-4" />
              <h2 className="text-2xl font-bold text-chess-text-dark mb-4">Puzzles</h2>
              <p className="text-gray-700 mb-6 text-center">
                Challenge yourself with tactical puzzles to sharpen your calculation and pattern recognition.
              </p>
              <Button className="bg-chess-accent text-chess-text-light hover:bg-opacity-90">
                Solve Puzzles
              </Button>
            </div>
            <div className="bg-chess-beige-300 p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-chess-text-dark">Daily Puzzle</span>
                <span className="text-sm text-gray-700">Refresh daily</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-chess-text-dark">Puzzle Rush</span>
                <span className="text-sm text-gray-700">Timed challenge</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-chess-text-dark">Puzzle Themes</span>
                <span className="text-sm text-gray-700">By category</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Learn;
