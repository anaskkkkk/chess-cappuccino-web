
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-chess-dark border-t border-[rgba(255,255,255,0.12)] py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="font-bold text-xl text-chess-text-light">Smart<span className="text-chess-accent">Chess</span></div>
            <p className="text-gray-400 text-sm">
              Experience chess like never before with our innovative smart board and digital platform.
            </p>
          </div>

          <div>
            <h4 className="font-medium text-chess-text-light mb-4">Products</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/store" className="hover:text-chess-accent transition-colors">Smart Board</Link></li>
              <li><Link to="/store" className="hover:text-chess-accent transition-colors">Accessories</Link></li>
              <li><Link to="/store" className="hover:text-chess-accent transition-colors">Gift Cards</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-chess-text-light mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/learn" className="hover:text-chess-accent transition-colors">Courses</Link></li>
              <li><Link to="/learn" className="hover:text-chess-accent transition-colors">Puzzles</Link></li>
              <li><Link to="/help" className="hover:text-chess-accent transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-chess-text-light mb-4">Connect</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-chess-accent transition-colors">Discord</a></li>
              <li><a href="#" className="hover:text-chess-accent transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-chess-accent transition-colors">Instagram</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[rgba(255,255,255,0.12)] mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© {new Date().getFullYear()} SmartChess. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/privacy" className="text-gray-400 text-sm hover:text-chess-accent transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-gray-400 text-sm hover:text-chess-accent transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
