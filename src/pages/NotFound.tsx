
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-chess-dark">
        <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center">
          <h1 className="text-6xl font-bold text-chess-accent mb-4">404</h1>
          <h2 className="text-2xl md:text-3xl text-chess-text-light mb-8">Page Not Found</h2>
          <p className="text-gray-400 mb-8 text-center max-w-md">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <Link to="/">
            <Button className="chess-btn-primary">
              Return to Homepage
            </Button>
          </Link>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
