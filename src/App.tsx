
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
