
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguageContext } from "@/contexts/LanguageContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserCircle, LogOut } from "lucide-react";

const ProfileDropdown: React.FC = () => {
  const { t } = useLanguageContext();
  const { user, logout } = useAuth();
  
  // Get first letter of name or email for avatar fallback
  const getInitial = () => {
    if (!user) return "G";
    if (user.name) return user.name.charAt(0).toUpperCase();
    if (user.email) return user.email.charAt(0).toUpperCase();
    return "U";
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="focus:outline-none" aria-label={t("profile")}>
          <Avatar className="h-8 w-8 bg-chess-accent text-chess-text-light cursor-pointer hover:opacity-90 transition-opacity">
            <AvatarFallback>{getInitial()}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-chess-beige-100">
        <DropdownMenuItem asChild>
          <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
            <UserCircle size={16} />
            <span>{t("profile")}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 cursor-pointer">
          <LogOut size={16} />
          <span>{t("logout")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;
