
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
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUserManagement />} />
              <Route path="games" element={<AdminGameManagement />} />
              <Route path="tournaments" element={<AdminTournamentManager />} />
              <Route path="courses" element={<AdminCoursesCMS />} />
              <Route path="puzzles" element={<AdminPuzzleManagement />} />
              <Route path="content" element={<AdminContentPages />} />
              <Route path="orders" element={<AdminOrdersPayments />} />
              <Route path="smartboard" element={<AdminSmartBoardFleet />} />
              <Route path="notifications" element={<AdminNotifications />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="logs" element={<AdminRealTimeLogs />} />
              <Route path="localization" element={<AdminLocalizationManagement />} />
              <Route path="integrations" element={<AdminIntegrationsManagement />} />
              <Route path="sound-assets" element={<AdminSoundAndAssets />} />
              <Route path="roles-permissions" element={<AdminRolesAndPermissions />} />
              <Route path="security" element={<AdminSecurityAudit />} />
            </Route>
            
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
