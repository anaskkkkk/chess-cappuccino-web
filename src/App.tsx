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
import PuzzlesCMS from "./pages/admin/PuzzlesCMS";
import PuzzleManagement from "./pages/admin/PuzzleManagement";
import ContentPages from "./pages/admin/ContentPages";
import OrdersPayments from "./pages/admin/OrdersPayments";
import SmartBoardFleet from "./pages/admin/SmartBoardFleet";
import LocalizationManagement from "./pages/admin/LocalizationManagement";
import IntegrationsManagement from "./pages/admin/IntegrationsManagement";
import RealTimeLogs from "./pages/admin/RealTimeLogs";
import Notifications from "./pages/admin/Notifications";
import Analytics from "./pages/admin/Analytics";

// Create a new QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Enhanced AppRoutes component with page transitions
const AppRoutes = () => {
  const location = useLocation();

  return (
    <LanguageProvider>
      <Routes location={location}>
        <Route path="/" element={<PageTransition><Index /></PageTransition>} />
        <Route path="/store" element={<PageTransition><Store /></PageTransition>} />
        <Route path="/play" element={<PageTransition><Play /></PageTransition>} />
        <Route path="/game/:gameId" element={<PageTransition><Game /></PageTransition>} />
        <Route path="/learn" element={<PageTransition><Learn /></PageTransition>} />
        <Route path="/community" element={<PageTransition><Community /></PageTransition>} />
        <Route path="/smart-board" element={<PageTransition><SmartBoard /></PageTransition>} />
        <Route path="/accessories" element={<PageTransition><Accessories /></PageTransition>} />
        <Route path="/gift-cards" element={<PageTransition><GiftCards /></PageTransition>} />
        <Route path="/courses" element={<PageTransition><Courses /></PageTransition>} />
        <Route path="/puzzles" element={<PageTransition><Puzzles /></PageTransition>} />
        <Route path="/faq" element={<PageTransition><FAQ /></PageTransition>} />
        <Route path="/privacy" element={<PageTransition><PrivacyPolicy /></PageTransition>} />
        <Route path="/terms" element={<PageTransition><TermsOfService /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />
        <Route path="/onboarding" element={<PageTransition><Onboarding /></PageTransition>} />
        <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
        <Route path="/tournaments" element={<PageTransition><Tournaments /></PageTransition>} />
        <Route path="/tournaments/:tournamentId" element={<PageTransition><Tournaments /></PageTransition>} />
        <Route path="/analysis" element={<PageTransition><Analysis /></PageTransition>} />
        <Route path="/spectate" element={<PageTransition><Spectate /></PageTransition>} />
        <Route path="/spectate/game/:gameId" element={<PageTransition><Game /></PageTransition>} />
        
        {/* Admin Routes - no need to wrap content in PageTransition since AdminLayout already includes it */}
        <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
        <Route path="/admin/users" element={<AdminLayout><UserManagement /></AdminLayout>} />
        <Route path="/admin/games" element={<AdminLayout><GameManagement /></AdminLayout>} />
        <Route path="/admin/tournaments" element={<AdminLayout><TournamentManager /></AdminLayout>} />
        <Route path="/admin/courses" element={<AdminLayout><CoursesCMS /></AdminLayout>} />
        <Route path="/admin/puzzles" element={<AdminLayout><PuzzleManagement /></AdminLayout>} />
        <Route path="/admin/content" element={<AdminLayout><ContentPages /></AdminLayout>} />
        <Route path="/admin/orders" element={<AdminLayout><OrdersPayments /></AdminLayout>} />
        <Route path="/admin/smartboards" element={<AdminLayout><SmartBoardFleet /></AdminLayout>} />
        <Route path="/admin/localization" element={<AdminLayout><LocalizationManagement /></AdminLayout>} />
        <Route path="/admin/integrations" element={<AdminLayout><IntegrationsManagement /></AdminLayout>} />
        <Route path="/admin/logs" element={<AdminLayout><RealTimeLogs /></AdminLayout>} />
        <Route path="/admin/notifications" element={<AdminLayout><Notifications /></AdminLayout>} />
        <Route path="/admin/analytics" element={<AdminLayout><Analytics /></AdminLayout>} />
        
        {/* Other admin routes */}
        <Route path="/admin/assets" element={<AdminLayout><div className="p-6 text-chess-text-light">Sound & Asset Library</div></AdminLayout>} />
        <Route path="/admin/roles" element={<AdminLayout><div className="p-6 text-chess-text-light">Roles & Permissions Control</div></AdminLayout>} />
        <Route path="/admin/security" element={<AdminLayout><div className="p-6 text-chess-text-light">Security & Audit Logs</div></AdminLayout>} />
        <Route path="/admin/health" element={<AdminLayout><div className="p-6 text-chess-text-light">System Health Monitor</div></AdminLayout>} />
        <Route path="/admin/backup" element={<AdminLayout><div className="p-6 text-chess-text-light">Backup & Restore</div></AdminLayout>} />
        <Route path="/admin/features" element={<AdminLayout><div className="p-6 text-chess-text-light">Feature Flags Management</div></AdminLayout>} />
        <Route path="/admin/help" element={<AdminLayout><div className="p-6 text-chess-text-light">Help & Support Center</div></AdminLayout>} />
        <Route path="/admin/profile" element={<AdminLayout><div className="p-6 text-chess-text-light">Admin Profile</div></AdminLayout>} />
        
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
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
