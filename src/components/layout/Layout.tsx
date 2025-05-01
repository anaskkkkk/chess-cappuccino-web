
import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import BoardStatus from "../common/BoardStatus";
import { useLocation } from "react-router-dom";
import { useLanguageContext } from "@/contexts/LanguageContext";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { t, isRTL } = useLanguageContext();
  
  // Add board status to every page
  return (
    <div className={`min-h-screen flex flex-col bg-chess-dark ${isRTL ? 'rtl' : 'ltr'}`}>
      <Navbar />
      <main className="flex-grow relative">
        {/* Board status indicator, fixed in the bottom right corner */}
        <div className={`fixed bottom-4 ${isRTL ? 'left-4' : 'right-4'} z-10 bg-chess-dark/80 backdrop-blur-sm px-3 py-2 rounded-full border border-[rgba(255,255,255,0.15)] shadow-lg`}>
          <BoardStatus />
        </div>
        
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
