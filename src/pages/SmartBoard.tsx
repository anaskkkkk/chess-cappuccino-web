import React from 'react';
import { Button } from '@/components/ui/button';
import ChessBoardPreview from '@/components/board/ChessBoardPreview';

const SmartBoard = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row items-center gap-12">
        <div className="lg:w-1/2">
          <h1 className="text-4xl font-bold text-chess-text-light mb-4">Smart Chess Board</h1>
          <p className="text-xl text-gray-300 mb-6">
            The future of chess is here. Connect the physical and digital worlds with our innovative smart board technology.
          </p>
          
          <div className="bg-chess-beige-100 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-chess-text-dark mb-4">Key Features</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <div className="mr-3 mt-1 w-5 h-5 rounded-full bg-chess-accent flex items-center justify-center text-white text-xs">✓</div>
                <span>Real-time synchronization with our digital platform</span>
              </li>
              <li className="flex items-start">
                <div className="mr-3 mt-1 w-5 h-5 rounded-full bg-chess-accent flex items-center justify-center text-white text-xs">✓</div>
                <span>LED indicators for suggested moves and piece tracking</span>
              </li>
              <li className="flex items-start">
                <div className="mr-3 mt-1 w-5 h-5 rounded-full bg-chess-accent flex items-center justify-center text-white text-xs">✓</div>
                <span>Built-in AI for analysis and training</span>
              </li>
              <li className="flex items-start">
                <div className="mr-3 mt-1 w-5 h-5 rounded-full bg-chess-accent flex items-center justify-center text-white text-xs">✓</div>
                <span>Rechargeable battery with 20+ hours of play time</span>
              </li>
              <li className="flex items-start">
                <div className="mr-3 mt-1 w-5 h-5 rounded-full bg-chess-accent flex items-center justify-center text-white text-xs">✓</div>
                <span>Handcrafted with premium materials</span>
              </li>
            </ul>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="bg-chess-accent text-chess-text-light px-6 py-3 text-lg hover:bg-opacity-90">
              Buy Now - $299.99
            </Button>
            <Button variant="outline" className="border-chess-accent text-chess-accent hover:bg-chess-accent hover:bg-opacity-10">
              Learn More
            </Button>
          </div>
        </div>
        
        <div className="lg:w-1/2">
          <div className="bg-chess-beige-300 p-8 rounded-lg shadow-lg">
            <ChessBoardPreview />
          </div>
        </div>
      </div>
      
      <div className="mt-16">
        <h2 className="text-3xl font-bold text-chess-text-light mb-8 text-center">Smart Board Specifications</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-chess-beige-100 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-chess-text-dark mb-3">Dimensions</h3>
            <p className="text-gray-700">21" x 21" x 1.5" (board)</p>
            <p className="text-gray-700">1.5" king height</p>
          </div>
          
          <div className="bg-chess-beige-100 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-chess-text-dark mb-3">Connectivity</h3>
            <p className="text-gray-700">Bluetooth 5.0</p>
            <p className="text-gray-700">WiFi 6 compatible</p>
          </div>
          
          <div className="bg-chess-beige-100 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-chess-text-dark mb-3">Battery</h3>
            <p className="text-gray-700">5000mAh rechargeable</p>
            <p className="text-gray-700">20+ hours of play time</p>
          </div>
          
          <div className="bg-chess-beige-100 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-chess-text-dark mb-3">Materials</h3>
            <p className="text-gray-700">Walnut and maple board</p>
            <p className="text-gray-700">Weighted wooden pieces</p>
          </div>
          
          <div className="bg-chess-beige-100 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-chess-text-dark mb-3">Sensor Technology</h3>
            <p className="text-gray-700">Magnetic piece detection</p>
            <p className="text-gray-700">64 RGB LEDs for move guidance</p>
          </div>
          
          <div className="bg-chess-beige-100 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-chess-text-dark mb-3">Warranty</h3>
            <p className="text-gray-700">2-year manufacturer warranty</p>
            <p className="text-gray-700">30-day money-back guarantee</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartBoard;
