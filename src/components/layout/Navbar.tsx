
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="w-full bg-chess-dark border-b border-[rgba(255,255,255,0.12)] py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="font-bold text-2xl text-chess-text-light">Smart<span className="text-chess-accent">Chess</span></div>
        </Link>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-chess-text-light hover:text-chess-accent transition-colors">
            Home
          </Link>
          <Link to="/store" className="text-chess-text-light hover:text-chess-accent transition-colors">
            Store
          </Link>
          <Link to="/play" className="text-chess-text-light hover:text-chess-accent transition-colors">
            Play
          </Link>
          <Link to="/learn" className="text-chess-text-light hover:text-chess-accent transition-colors">
            Learn
          </Link>
          <Link to="/community" className="text-chess-text-light hover:text-chess-accent transition-colors">
            Community
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="outline" className="hidden md:flex border-chess-accent text-chess-accent hover:bg-chess-accent hover:text-chess-text-light">
            Log In
          </Button>
          <Button className="bg-chess-accent text-chess-text-light hover:bg-opacity-90">
            Sign Up
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
