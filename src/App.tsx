import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import PageTransition from "./components/common/PageTransition";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Store from "./pages/Store";
import Play from "./pages/Play";
import Learn from "./pages/Learn";
import Community from "./pages/Community";
import SmartBoard from "./pages/SmartBoard";
import Accessories from "./pages/Accessories";
import GiftCards from "./pages/GiftCards";
import Courses from "./pages/Courses";
import Puzzles from "./pages/Puzzles";
import FAQ from "./pages/FAQ";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Game from "./pages/Game";
import Tournaments from "./pages/Tournaments";
import Analysis from "./pages/Analysis";
import Spectate from "./pages/Spectate";

// Admin Components
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import UserManagement from "./pages/admin/UserManagement";
import GameManagement from "./pages/admin/GameManagement";
import TournamentManager from "./pages/admin/TournamentManager";
import CoursesCMS from "./pages/admin/CoursesCMS";

const queryClient = new QueryClient();

// Wrap routes in PageTransition
const AppRoutes = () => {
  const location = useLocation();

  return (
    <LanguageProvider>
      <PageTransition>
        <Routes location={location}>
          <Route path="/" element={<Index />} />
          <Route path="/store" element={<Store />} />
          <Route path="/play" element={<Play />} />
          <Route path="/game/:gameId" element={<Game />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/community" element={<Community />} />
          <Route path="/smart-board" element={<SmartBoard />} />
          <Route path="/accessories" element={<Accessories />} />
          <Route path="/gift-cards" element={<GiftCards />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/puzzles" element={<Puzzles />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tournaments" element={<Tournaments />} />
          <Route path="/tournaments/:tournamentId" element={<Tournaments />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/spectate" element={<Spectate />} />
          <Route path="/spectate/game/:gameId" element={<Game />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
          <Route path="/admin/users" element={<AdminLayout><UserManagement /></AdminLayout>} />
          <Route path="/admin/games" element={<AdminLayout><GameManagement /></AdminLayout>} />
          <Route path="/admin/tournaments" element={<AdminLayout><TournamentManager /></AdminLayout>} />
          <Route path="/admin/courses" element={<AdminLayout><CoursesCMS /></AdminLayout>} />
          
          {/* Other admin routes - will add placeholder components as they're developed */}
          <Route path="/admin/puzzles" element={<AdminLayout><div className="p-6 text-chess-text-light">Puzzles Content Management System</div></AdminLayout>} />
          <Route path="/admin/content" element={<AdminLayout><div className="p-6 text-chess-text-light">Content Pages Builder</div></AdminLayout>} />
          <Route path="/admin/orders" element={<AdminLayout><div className="p-6 text-chess-text-light">Orders & Payments Management</div></AdminLayout>} />
          <Route path="/admin/smartboards" element={<AdminLayout><div className="p-6 text-chess-text-light">SmartBoard Fleet Management</div></AdminLayout>} />
          <Route path="/admin/logs" element={<AdminLayout><div className="p-6 text-chess-text-light">Real-Time Logs</div></AdminLayout>} />
          <Route path="/admin/notifications" element={<AdminLayout><div className="p-6 text-chess-text-light">Notification Center</div></AdminLayout>} />
          <Route path="/admin/analytics" element={<AdminLayout><div className="p-6 text-chess-text-light">Analytics & Reports</div></AdminLayout>} />
          <Route path="/admin/localization" element={<AdminLayout><div className="p-6 text-chess-text-light">Localization Management</div></AdminLayout>} />
          <Route path="/admin/assets" element={<AdminLayout><div className="p-6 text-chess-text-light">Sound & Asset Library</div></AdminLayout>} />
          <Route path="/admin/roles" element={<AdminLayout><div className="p-6 text-chess-text-light">Roles & Permissions Control</div></AdminLayout>} />
          <Route path="/admin/security" element={<AdminLayout><div className="p-6 text-chess-text-light">Security & Audit Logs</div></AdminLayout>} />
          <Route path="/admin/health" element={<AdminLayout><div className="p-6 text-chess-text-light">System Health Monitor</div></AdminLayout>} />
          <Route path="/admin/backup" element={<AdminLayout><div className="p-6 text-chess-text-light">Backup & Restore</div></AdminLayout>} />
          <Route path="/admin/integrations" element={<AdminLayout><div className="p-6 text-chess-text-light">Integrations Management</div></AdminLayout>} />
          <Route path="/admin/features" element={<AdminLayout><div className="p-6 text-chess-text-light">Feature Flags Management</div></AdminLayout>} />
          <Route path="/admin/help" element={<AdminLayout><div className="p-6 text-chess-text-light">Help & Support Center</div></AdminLayout>} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </PageTransition>
    </LanguageProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
