
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import ChessBoardPreview from '@/components/board/ChessBoardPreview';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        <Features />
        
        {/* Board Preview Section */}
        <section className="py-20 bg-chess-dark">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2">
                <ChessBoardPreview />
              </div>
              <div className="md:w-1/2 text-chess-text-light">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Experience Chess in a New Dimension</h2>
                <p className="text-gray-300 mb-8">
                  Whether you're playing with our smart physical board or using our digital interface, SmartChess delivers a seamless and engaging experience that combines tradition with innovation.
                </p>
                <Button className="chess-btn-primary">
                  Start Playing Now
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-20 bg-chess-beige-300">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-chess-text-dark">Ready to Elevate Your Chess Game?</h2>
            <p className="text-gray-700 mb-8 max-w-2xl mx-auto">
              Join thousands of players who are already using SmartChess to improve their skills, connect with others, and enjoy the game they love.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button className="bg-chess-dark text-chess-text-light hover:bg-opacity-90">
                Create Account
              </Button>
              <Button variant="outline" className="border-chess-dark text-chess-text-dark hover:bg-chess-dark hover:bg-opacity-10">
                Learn More
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
