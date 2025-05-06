
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import AdminLayout from "./components/admin/AdminLayout";
import { LanguageProvider } from "./contexts/LanguageContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Page imports 
import Index from "./pages/Index";
import Play from "./pages/Play";
import Learn from "./pages/Learn";
import Game from "./pages/Game";
import Store from "./pages/Store";
import SmartBoard from "./pages/SmartBoard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Analysis from "./pages/Analysis";
import Spectate from "./pages/Spectate";
import Community from "./pages/Community";
import Tournaments from "./pages/Tournaments";
import Puzzles from "./pages/Puzzles";
import Courses from "./pages/Courses";
import FAQ from "./pages/FAQ";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Accessories from "./pages/Accessories";
import GiftCards from "./pages/GiftCards";

// Admin page imports
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUserManagement from "./pages/admin/UserManagement";
import AdminGameManagement from "./pages/admin/GameManagement";
import AdminTournamentManager from "./pages/admin/TournamentManager";
import AdminCoursesCMS from "./pages/admin/CoursesCMS";
import AdminPuzzleManagement from "./pages/admin/PuzzleManagement";
import AdminContentPages from "./pages/admin/ContentPages";
import AdminOrdersPayments from "./pages/admin/OrdersPayments";
import AdminSmartBoardFleet from "./pages/admin/SmartBoardFleet";
import AdminNotifications from "./pages/admin/Notifications";
import AdminAnalytics from "./pages/admin/Analytics";
import AdminRealTimeLogs from "./pages/admin/RealTimeLogs";
import AdminLocalizationManagement from "./pages/admin/LocalizationManagement";
import AdminIntegrationsManagement from "./pages/admin/IntegrationsManagement";
import AdminSoundAndAssets from "./pages/admin/SoundAndAssets";
import AdminRolesAndPermissions from "./pages/admin/RolesAndPermissions";
import AdminSecurityAudit from "./pages/admin/SecurityAudit";
import AdminSystemHealth from "./pages/admin/SystemHealth";
import AdminBackupRestore from "./pages/admin/BackupRestore";
import AdminFeatureFlags from "./pages/admin/FeatureFlags";
import AdminHelpAndSupport from "./pages/admin/HelpAndSupport";
import AdminProfile from "./pages/admin/AdminProfile";

import { Toaster } from "./components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <Layout>
                  <Index />
                </Layout>
              }
            />
            
            {/* Main Routes */}
            <Route
              path="/play"
              element={
                <Layout>
                  <Play />
                </Layout>
              }
            />
            <Route
              path="/learn"
              element={
                <Layout>
                  <Learn />
                </Layout>
              }
            />
            <Route
              path="/game/:id"
              element={
                <Layout>
                  <Game />
                </Layout>
              }
            />
            <Route
              path="/store"
              element={
                <Layout>
                  <Store />
                </Layout>
              }
            />
            <Route
              path="/store/accessories"
              element={
                <Layout>
                  <Accessories />
                </Layout>
              }
            />
            <Route
              path="/store/gift-cards"
              element={
                <Layout>
                  <GiftCards />
                </Layout>
              }
            />
            <Route
              path="/smart-board"
              element={
                <Layout>
                  <SmartBoard />
                </Layout>
              }
            />
            <Route
              path="/analysis"
              element={
                <Layout>
                  <Analysis />
                </Layout>
              }
            />
            <Route
              path="/spectate"
              element={
                <Layout>
                  <Spectate />
                </Layout>
              }
            />
            <Route
              path="/community"
              element={
                <Layout>
                  <Community />
                </Layout>
              }
            />
            <Route
              path="/tournaments"
              element={
                <Layout>
                  <Tournaments />
                </Layout>
              }
            />
            <Route
              path="/puzzles"
              element={
                <Layout>
                  <Puzzles />
                </Layout>
              }
            />
            <Route
              path="/courses"
              element={
                <Layout>
                  <Courses />
                </Layout>
              }
            />
            <Route
              path="/login"
              element={
                <Layout>
                  <Login />
                </Layout>
              }
            />
            <Route
              path="/signup"
              element={
                <Layout>
                  <Signup />
                </Layout>
              }
            />
            <Route
              path="/onboarding"
              element={
                <Layout>
                  <Onboarding />
                </Layout>
              }
            />
            <Route
              path="/dashboard"
              element={
                <Layout>
                  <Dashboard />
                </Layout>
              }
            />
            <Route
              path="/faq"
              element={
                <Layout>
                  <FAQ />
                </Layout>
              }
            />
            <Route
              path="/privacy-policy"
              element={
                <Layout>
                  <PrivacyPolicy />
                </Layout>
              }
            />
            <Route
              path="/terms-of-service"
              element={
                <Layout>
                  <TermsOfService />
                </Layout>
              }
            />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
            <Route path="/admin/profile" element={<AdminLayout><AdminProfile /></AdminLayout>} />
            <Route path="/admin/users" element={<AdminLayout><AdminUserManagement /></AdminLayout>} />
            <Route path="/admin/games" element={<AdminLayout><AdminGameManagement /></AdminLayout>} />
            <Route path="/admin/tournaments" element={<AdminLayout><AdminTournamentManager /></AdminLayout>} />
            <Route path="/admin/courses" element={<AdminLayout><AdminCoursesCMS /></AdminLayout>} />
            <Route path="/admin/puzzles" element={<AdminLayout><AdminPuzzleManagement /></AdminLayout>} />
            <Route path="/admin/content" element={<AdminLayout><AdminContentPages /></AdminLayout>} />
            <Route path="/admin/orders" element={<AdminLayout><AdminOrdersPayments /></AdminLayout>} />
            <Route path="/admin/smartboards" element={<AdminLayout><AdminSmartBoardFleet /></AdminLayout>} />
            <Route path="/admin/logs" element={<AdminLayout><AdminRealTimeLogs /></AdminLayout>} />
            <Route path="/admin/notifications" element={<AdminLayout><AdminNotifications /></AdminLayout>} />
            <Route path="/admin/analytics" element={<AdminLayout><AdminAnalytics /></AdminLayout>} />
            <Route path="/admin/localization" element={<AdminLayout><AdminLocalizationManagement /></AdminLayout>} />
            <Route path="/admin/integrations" element={<AdminLayout><AdminIntegrationsManagement /></AdminLayout>} />
            <Route path="/admin/assets" element={<AdminLayout><AdminSoundAndAssets /></AdminLayout>} />
            <Route path="/admin/roles" element={<AdminLayout><AdminRolesAndPermissions /></AdminLayout>} />
            <Route path="/admin/security" element={<AdminLayout><AdminSecurityAudit /></AdminLayout>} />
            <Route path="/admin/health" element={<AdminLayout><AdminSystemHealth /></AdminLayout>} />
            <Route path="/admin/backup" element={<AdminLayout><AdminBackupRestore /></AdminLayout>} />
            <Route path="/admin/features" element={<AdminLayout><AdminFeatureFlags /></AdminLayout>} />
            <Route path="/admin/help" element={<AdminLayout><AdminHelpAndSupport /></AdminLayout>} />
            
            {/* 404 Route */}
            <Route
              path="*"
              element={
                <Layout>
                  <NotFound />
                </Layout>
              }
            />
          </Routes>
        </Router>
        <Toaster />
        <SonnerToaster position="top-right" />
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;
