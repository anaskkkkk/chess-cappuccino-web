
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X, Settings } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import BoardStatus from "@/components/common/BoardStatus";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import { useLanguageContext } from "@/contexts/LanguageContext";
import ProfileDropdown from "@/components/common/ProfileDropdown";
import SmartBoardPairingModal from "@/components/common/SmartBoardPairingModal";

const Navbar = () => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const { t, isRTL } = useLanguageContext();

  const navItems = [
    { name: t("play"), href: "/play" },
    { name: t("learn"), href: "/learn" },
    { name: t("community"), href: "/community" },
    { name: t("smartBoard"), href: "/smart-board" },
    { name: t("store"), href: "/store" },
  ];

  const toggleMenu = () => setIsOpen((prev) => !prev);

  return (
    <nav className="bg-chess-dark border-b border-[rgba(255,255,255,0.1)] sticky top-0 z-50 animate-fade-in">
      <div className="container mx-auto px-4 md:px-6 py-3">
        <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
          {/* Logo and site name */}
          <div className="flex items-center">
            <Link
              to="/"
              className={cn(
                "flex items-center space-x-2 text-2xl font-bold text-white transition-all hover:opacity-90", 
                isRTL && "flex-row-reverse space-x-reverse"
              )}
            >
              <span className="bg-chess-accent text-chess-text-light px-2 py-1 rounded">
                S
              </span>
              <span className="hidden sm:inline text-chess-text-light">{t("appName")}</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className={cn(
            "hidden md:flex items-center space-x-1",
            isRTL && "flex-row-reverse space-x-reverse"
          )}>
            {navItems.map((item) => (
              <Link key={item.name} to={item.href}>
                <Button
                  variant="ghost"
                  className="text-chess-text-light hover:bg-white/10 transition-colors"
                >
                  {item.name}
                </Button>
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              className="text-chess-text-light hover:bg-white/10"
              onClick={toggleMenu}
            >
              {isOpen ? <X /> : <Menu />}
            </Button>
          </div>

          {/* Right side items */}
          <div className={cn(
            "hidden md:flex items-center space-x-2",
            isRTL && "flex-row-reverse space-x-reverse"
          )}>
            <BoardStatus />
            <LanguageSwitcher />
            
            {/* SmartBoard Pairing Button */}
            <SmartBoardPairingModal />
            
            {/* Admin link for easy access */}
            <Link to="/admin">
              <Button
                variant="ghost"
                size="icon"
                className="text-chess-text-light hover:bg-white/10"
                title="Admin Console"
              >
                <Settings size={20} />
              </Button>
            </Link>
            
            {/* Profile Dropdown */}
            <ProfileDropdown />
          </div>
        </div>

        {/* Mobile navigation menu - improved for better height handling */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
            isOpen ? "max-h-[600px] opacity-100 mt-2" : "max-h-0 opacity-0"
          )}
        >
          <div className="flex flex-col space-y-1 pt-2 pb-3 border-t border-[rgba(255,255,255,0.1)] animate-fade-in">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-chess-text-light hover:bg-white/10 px-4 py-2 rounded transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            <Link
              to="/admin"
              className="text-chess-text-light hover:bg-white/10 px-4 py-2 rounded transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center gap-2">
                <Settings size={16} />
                {t("adminConsole")}
              </div>
            </Link>
            
            <Link
              to="/profile"
              className="text-chess-text-light hover:bg-white/10 px-4 py-2 rounded transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center gap-2">
                <span className="bg-chess-accent text-chess-text-light px-2 py-1 rounded-full text-xs">
                  {t("profile").charAt(0).toUpperCase()}
                </span>
                {t("profile")}
              </div>
            </Link>
            
            <div className={cn(
              "flex items-center justify-between px-4 py-2",
              isRTL && "flex-row-reverse"
            )}>
              <BoardStatus />
              <div className="flex items-center gap-2">
                <LanguageSwitcher />
                <SmartBoardPairingModal />
              </div>
            </div>
            
            <div className={cn(
              "flex items-center justify-between space-x-2 px-4 py-2",
              isRTL && "flex-row-reverse space-x-reverse"
            )}>
              <Link to="/login" className="flex-1">
                <Button
                  variant="outline"
                  className="w-full border-chess-accent text-chess-accent hover:bg-chess-accent/10"
                >
                  {t("signIn")}
                </Button>
              </Link>
              
              <Link to="/signup" className="flex-1">
                <Button className="w-full bg-chess-accent text-chess-text-light hover:bg-opacity-90">
                  {t("signUp")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
