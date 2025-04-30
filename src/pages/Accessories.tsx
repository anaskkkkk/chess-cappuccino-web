
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';

const Accessories = () => {
  const accessories = [
    {
      id: 1,
      name: "Premium Chess Pieces",
      description: "Handcrafted wooden pieces compatible with our Smart Board.",
      price: "$69.99",
      image: "chess-pieces"
    },
    {
      id: 2,
      name: "Travel Case",
      description: "Durable carrying case for your Smart Board and accessories.",
      price: "$49.99",
      image: "travel-case"
    },
    {
      id: 3,
      name: "Charging Dock",
      description: "Elegant charging solution for your Smart Board.",
      price: "$29.99",
      image: "charging-dock"
    },
    {
      id: 4,
      name: "Board Cover",
      description: "Protective cover to keep your Smart Board safe when not in use.",
      price: "$24.99",
      image: "board-cover"
    },
    {
      id: 5,
      name: "Smart Chess Clock",
      description: "Digital chess clock that syncs with your Smart Board.",
      price: "$39.99",
      image: "chess-clock"
    },
    {
      id: 6,
      name: "Analysis Module",
      description: "Advanced AI analysis module for deeper insights.",
      price: "$89.99",
      image: "analysis-module"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-chess-dark">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-chess-text-light mb-4">Chess Accessories</h1>
          <p className="text-xl text-gray-300 mb-8">
            Enhance your chess experience with our premium accessories designed specifically for your Smart Chess Board.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {accessories.map(item => (
              <div key={item.id} className="bg-chess-beige-100 rounded-lg overflow-hidden shadow-lg">
                <div className="h-60 bg-chess-accent/20 flex items-center justify-center">
                  <span className="text-chess-text-dark text-lg">{item.image} Image</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-chess-text-dark mb-2">{item.name}</h3>
                  <p className="text-gray-700 mb-4">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-semibold text-chess-text-dark">{item.price}</span>
                    <Button className="bg-chess-accent text-chess-text-light hover:bg-opacity-90">
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-16 bg-chess-beige-300 rounded-lg p-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-chess-text-dark mb-4">Bundle & Save</h2>
              <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                Get the complete SmartChess experience with our Accessory Bundle. Includes Premium Chess Pieces, Travel Case, and Charging Dock.
              </p>
              <div className="bg-chess-beige-100 inline-block px-6 py-3 rounded-lg mb-6">
                <span className="text-gray-700 line-through mr-2">$149.97</span>
                <span className="text-2xl font-bold text-chess-text-dark">$129.99</span>
              </div>
              <div>
                <Button className="bg-chess-accent text-chess-text-light px-8 py-3 text-lg hover:bg-opacity-90">
                  Add Bundle to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Accessories;
