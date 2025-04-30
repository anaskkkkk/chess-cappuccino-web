
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const Store = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-chess-dark">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-chess-text-light mb-8">Store</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-chess-beige-100 rounded-lg overflow-hidden shadow-lg">
              <div className="h-60 bg-chess-accent/20 flex items-center justify-center">
                <span className="text-chess-text-dark text-lg">Smart Board Image</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-chess-text-dark mb-2">Smart Chess Board</h3>
                <p className="text-gray-700 mb-4">Experience chess like never before with our innovative smart board.</p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-semibold text-chess-text-dark">$299.99</span>
                  <button className="bg-chess-accent text-chess-text-light px-4 py-2 rounded hover:bg-opacity-90 transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-chess-beige-100 rounded-lg overflow-hidden shadow-lg">
              <div className="h-60 bg-chess-accent/20 flex items-center justify-center">
                <span className="text-chess-text-dark text-lg">Accessories Image</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-chess-text-dark mb-2">Chess Accessories</h3>
                <p className="text-gray-700 mb-4">Enhance your chess experience with our premium accessories.</p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-semibold text-chess-text-dark">$49.99</span>
                  <button className="bg-chess-accent text-chess-text-light px-4 py-2 rounded hover:bg-opacity-90 transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-chess-beige-100 rounded-lg overflow-hidden shadow-lg">
              <div className="h-60 bg-chess-accent/20 flex items-center justify-center">
                <span className="text-chess-text-dark text-lg">Gift Card Image</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-chess-text-dark mb-2">Gift Cards</h3>
                <p className="text-gray-700 mb-4">The perfect gift for the chess enthusiast in your life.</p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-semibold text-chess-text-dark">$25 - $200</span>
                  <button className="bg-chess-accent text-chess-text-light px-4 py-2 rounded hover:bg-opacity-90 transition-colors">
                    Add to Cart
                  </button>
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

export default Store;
