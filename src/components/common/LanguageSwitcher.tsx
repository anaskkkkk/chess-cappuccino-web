
import React from "react";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguageContext } from "@/contexts/LanguageContext";

// Language Switcher Component
const LanguageSwitcher: React.FC = () => {
  const { language, changeLanguage } = useLanguageContext();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 px-1.5 text-chess-text-light hover:bg-white/10"
        >
          <Globe className="h-4 w-4 mr-1" />
          {language === 'en' ? 'EN' : 'عربي'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-chess-dark border border-[rgba(255,255,255,0.15)] text-chess-text-light">
        <DropdownMenuItem 
          className={`cursor-pointer hover:bg-white/10 ${language === 'en' ? 'bg-chess-accent/20' : ''}`}
          onClick={() => changeLanguage('en')}
        >
          English
        </DropdownMenuItem>
        <DropdownMenuItem 
          className={`cursor-pointer hover:bg-white/10 ${language === 'ar' ? 'bg-chess-accent/20' : ''}`}
          onClick={() => changeLanguage('ar')}
        >
          العربية
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
