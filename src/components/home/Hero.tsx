
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative bg-chess-dark min-h-[600px] flex items-center">
      <div className="absolute inset-0 bg-gradient-to-r from-chess-dark to-transparent z-10"></div>
      
      {/* Background image/video would go here */}
      <div className="absolute inset-0 bg-[url('/chess-hero-bg.jpg')] bg-cover bg-center opacity-40"></div>
      
      <div className="container mx-auto px-4 relative z-20">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-chess-text-light leading-tight mb-6 animate-fade-in">
            Where Physical Chess Meets Digital Innovation
          </h1>
          <p className="text-xl text-gray-300 mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Enhance your chess experience with our smart board that seamlessly connects to our digital platform. Play, learn, and improve like never before.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Link to="/store">
              <Button className="chess-btn-primary w-full sm:w-auto">Buy Smart Board</Button>
            </Link>
            <Link to="/play">
              <Button variant="outline" className="chess-btn-secondary w-full sm:w-auto">Play Online</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
