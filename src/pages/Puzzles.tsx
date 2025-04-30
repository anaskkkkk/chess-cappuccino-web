
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Puzzle } from 'lucide-react';
import ChessBoardPreview from '@/components/board/ChessBoardPreview';

const Puzzles = () => {
  const [difficulty, setDifficulty] = useState('medium');
  
  const puzzleCategories = [
    { name: "Tactics", count: 1200, icon: "⚔️" },
    { name: "Endgames", count: 850, icon: "🏁" },
    { name: "Strategy", count: 760, icon: "🧩" },
    { name: "Openings", count: 640, icon: "🚪" },
    { name: "Checkmates", count: 520, icon: "👑" },
    { name: "Pin & Fork", count: 480, icon: "📌" }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-chess-dark">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center mb-8">
            <Puzzle className="h-8 w-8 text-chess-accent mr-4" />
            <h1 className="text-4xl font-bold text-chess-text-light">Chess Puzzles</h1>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-12 mb-16">
            <div className="lg:w-1/2">
              <div className="bg-chess-beige-300 p-6 rounded-lg shadow-lg mb-6">
                <h2 className="text-2xl font-bold text-chess-text-dark mb-4">Daily Puzzle Challenge</h2>
                <p className="text-gray-700 mb-6">
                  Test your skills with our daily puzzle. Can you find the best move in this position?
                </p>
                <ChessBoardPreview />
                <div className="mt-6 flex justify-between items-center">
                  <div>
                    <div className="text-sm text-gray-700">Difficulty</div>
                    <div className="text-chess-text-dark font-medium">Intermediate</div>
                  </div>
                  <Button className="bg-chess-accent text-chess-text-light hover:bg-opacity-90">
                    Solve Puzzle
                  </Button>
                </div>
              </div>
              
              <div className="bg-chess-beige-100 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-chess-text-dark mb-4">Puzzle Rush</h2>
                <p className="text-gray-700 mb-6">
                  Solve as many puzzles as you can within 5 minutes. Challenge yourself and beat your high score!
                </p>
                <div className="flex justify-between items-center mb-6">
                  <div className="text-chess-text-dark">
                    <div className="text-sm">Current High Score</div>
                    <div className="text-2xl font-bold">26 puzzles</div>
                  </div>
                  <div className="text-chess-text-dark">
                    <div className="text-sm">Global Rank</div>
                    <div className="text-2xl font-bold">#1,245</div>
                  </div>
                </div>
                <Button className="w-full bg-chess-accent text-chess-text-light hover:bg-opacity-90">
                  Start Puzzle Rush
                </Button>
              </div>
            </div>
            
            <div className="lg:w-1/2">
              <div className="bg-chess-beige-100 p-6 rounded-lg shadow-lg mb-6">
                <h2 className="text-2xl font-bold text-chess-text-dark mb-4">Practice Puzzles</h2>
                
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">Select Difficulty</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['easy', 'medium', 'hard'].map(level => (
                      <button
                        key={level}
                        className={`py-2 px-4 rounded-md transition-colors ${
                          difficulty === level
                            ? 'bg-chess-accent text-chess-text-light'
                            : 'bg-chess-beige-300 text-chess-text-dark hover:bg-chess-accent/30'
                        }`}
                        onClick={() => setDifficulty(level)}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {puzzleCategories.map((category, index) => (
                    <div key={index} className="bg-chess-beige-300 p-4 rounded-lg flex items-center">
                      <div className="w-10 h-10 rounded-full bg-chess-accent/20 flex items-center justify-center text-xl mr-3">
                        {category.icon}
                      </div>
                      <div>
                        <div className="font-medium text-chess-text-dark">{category.name}</div>
                        <div className="text-sm text-gray-700">{category.count} puzzles</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button className="w-full bg-chess-accent text-chess-text-light hover:bg-opacity-90">
                  Practice Now
                </Button>
              </div>
              
              <div className="bg-chess-beige-300 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-chess-text-dark mb-4">Your Puzzle Stats</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-chess-beige-100 p-4 rounded-lg">
                    <div className="text-sm text-gray-700">Rating</div>
                    <div className="text-2xl font-bold text-chess-text-dark">1650</div>
                  </div>
                  <div className="bg-chess-beige-100 p-4 rounded-lg">
                    <div className="text-sm text-gray-700">Solved</div>
                    <div className="text-2xl font-bold text-chess-text-dark">238</div>
                  </div>
                  <div className="bg-chess-beige-100 p-4 rounded-lg">
                    <div className="text-sm text-gray-700">Accuracy</div>
                    <div className="text-2xl font-bold text-chess-text-dark">76%</div>
                  </div>
                  <div className="bg-chess-beige-100 p-4 rounded-lg">
                    <div className="text-sm text-gray-700">Streak</div>
                    <div className="text-2xl font-bold text-chess-text-dark">5 days</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Puzzles;
