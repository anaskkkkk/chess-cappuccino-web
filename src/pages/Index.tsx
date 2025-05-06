
import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/home/Hero';
import Features from '../components/home/Features';
import { Button } from '@/components/ui/button';
import { useLanguageContext } from '@/contexts/LanguageContext';
import { LayoutDashboard } from 'lucide-react';

const Index = () => {
  const { t } = useLanguageContext();
  
  return (
    <div className="space-y-12">
      <Hero />
      <Features />
      
      {/* Admin quick access link */}
      <div className="fixed bottom-4 left-4 z-10">
        <Link to="/admin">
          <Button variant="outline" className="border-chess-accent text-chess-accent hover:bg-chess-accent/10 flex items-center gap-2">
            <LayoutDashboard size={18} />
            Admin Console
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;
