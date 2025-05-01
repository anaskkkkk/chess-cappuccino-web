
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useLanguageContext } from "@/contexts/LanguageContext";
import BoardStatus from "@/components/common/BoardStatus";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  LayoutDashboard,
  Users,
  Gamepad,
  Trophy,
  BookOpen,
  PuzzlePiece,
  FileText,
  ShoppingCart,
  HardDrive,
  FileTerminal,
  Bell,
  BarChart,
  Languages,
  Music,
  ShieldCheck,
  Lock,
  Activity,
  Save,
  Plug,
  Flag,
  HelpCircle,
  LogOut,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import PageTransition from "@/components/common/PageTransition";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { t, isRTL } = useLanguageContext();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const adminMenuItems = [
    {
      label: "Core",
      items: [
        { title: "Dashboard", path: "/admin", icon: LayoutDashboard },
        { title: "User Management", path: "/admin/users", icon: Users },
        { title: "Game Management", path: "/admin/games", icon: Gamepad },
        { title: "Tournament Manager", path: "/admin/tournaments", icon: Trophy },
      ]
    },
    {
      label: "Content",
      items: [
        { title: "Courses", path: "/admin/courses", icon: BookOpen },
        { title: "Puzzles", path: "/admin/puzzles", icon: PuzzlePiece },
        { title: "Content Pages", path: "/admin/content", icon: FileText },
      ]
    },
    {
      label: "Business",
      items: [
        { title: "Orders & Payments", path: "/admin/orders", icon: ShoppingCart },
      ]
    },
    {
      label: "Hardware",
      items: [
        { title: "SmartBoard Fleet", path: "/admin/smartboards", icon: HardDrive },
      ]
    },
    {
      label: "Monitoring",
      items: [
        { title: "Real-Time Logs", path: "/admin/logs", icon: FileTerminal },
        { title: "Notifications", path: "/admin/notifications", icon: Bell },
        { title: "Analytics", path: "/admin/analytics", icon: BarChart },
      ]
    },
    {
      label: "Settings",
      items: [
        { title: "Localization", path: "/admin/localization", icon: Languages },
        { title: "Sound & Assets", path: "/admin/assets", icon: Music },
        { title: "Roles & Permissions", path: "/admin/roles", icon: ShieldCheck },
        { title: "Security & Audit", path: "/admin/security", icon: Lock },
        { title: "System Health", path: "/admin/health", icon: Activity },
        { title: "Backup & Restore", path: "/admin/backup", icon: Save },
        { title: "Integrations", path: "/admin/integrations", icon: Plug },
        { title: "Feature Flags", path: "/admin/features", icon: Flag },
        { title: "Help & Support", path: "/admin/help", icon: HelpCircle },
      ]
    }
  ];

  return (
    <div className={`min-h-screen bg-chess-dark ${isRTL ? 'rtl' : 'ltr'}`}>
      <SidebarProvider>
        <div className="group/sidebar-wrapper flex min-h-screen w-full">
          <Sidebar>
            <SidebarHeader className="pb-2">
              <div className="flex items-center space-x-2 px-4 py-2">
                <div className="bg-chess-accent text-chess-text-light px-2 py-1 rounded text-lg font-bold">
                  S
                </div>
                <span className="font-bold text-lg text-chess-text-light">
                  {t("appName")} Admin
                </span>
              </div>
            </SidebarHeader>

            <SidebarContent>
              {adminMenuItems.map((group, index) => (
                <SidebarGroup key={index}>
                  <SidebarGroupLabel>{t(group.label)}</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {group.items.map((item) => (
                        <SidebarMenuItem key={item.path}>
                          <SidebarMenuButton
                            isActive={location.pathname === item.path}
                            tooltip={item.title}
                            onClick={() => navigate(item.path)}
                          >
                            <item.icon className="size-4" />
                            <span>{t(item.title)}</span>
                            {item.path === "/admin/notifications" && (
                              <Badge variant="destructive" className="ml-auto h-5 w-5 p-0 flex items-center justify-center">3</Badge>
                            )}
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              ))}
            </SidebarContent>

            <SidebarFooter className="border-t border-white/10 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8 border border-white/20">
                    <AvatarFallback className="bg-chess-accent/30 text-chess-text-light">
                      A
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-chess-text-light">Admin User</p>
                    <p className="text-xs text-chess-text-light/60">Super Admin</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-chess-text-light hover:bg-white/10"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </SidebarFooter>
          </Sidebar>

          <SidebarInset className="bg-chess-dark text-chess-text-light">
            <header className="h-16 border-b border-white/10 px-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <h1 className="text-lg font-medium">{getCurrentPageTitle(location.pathname)}</h1>
              </div>

              <div className="flex items-center gap-4">
                <BoardStatus compact />
                <LanguageSwitcher />
              </div>
            </header>

            <main className="container mx-auto max-w-7xl p-6">
              <PageTransition>
                {children}
              </PageTransition>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

// Helper function to get the current page title
function getCurrentPageTitle(pathname: string): string {
  const path = pathname.split("/").pop();
  
  switch (path) {
    case "admin": return "Dashboard";
    case "users": return "User Management";
    case "games": return "Game Management";
    case "tournaments": return "Tournament Manager";
    case "courses": return "Courses";
    case "puzzles": return "Puzzles";
    case "content": return "Content Pages";
    case "orders": return "Orders & Payments";
    case "smartboards": return "SmartBoard Fleet";
    case "logs": return "Real-Time Logs";
    case "notifications": return "Notification Center";
    case "analytics": return "Analytics & Reports";
    case "localization": return "Localization";
    case "assets": return "Sound & Asset Library";
    case "roles": return "Roles & Permissions";
    case "security": return "Security & Audit";
    case "health": return "System Health";
    case "backup": return "Backup & Restore";
    case "integrations": return "Integrations";
    case "features": return "Feature Flags";
    case "help": return "Help & Support";
    default: return "Admin Console";
  }
}

export default AdminLayout;
