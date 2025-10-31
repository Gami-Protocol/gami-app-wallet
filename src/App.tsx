import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PrivyProvider } from "@/providers/PrivyProvider";
import Index from "./pages/Index";
import Wallet from "./pages/Wallet";
import Auth from "./pages/Auth";
import Pricing from "./pages/Pricing";
import NotFound from "./pages/NotFound";

// User Portal Pages
import { UserLayout } from "./components/layouts/UserLayout";
import UserDashboard from "./pages/user/Dashboard";
import UserQuests from "./pages/user/Quests";
import UserAchievements from "./pages/user/Achievements";
import UserProfile from "./pages/user/Profile";

// Business Portal Pages
import { BusinessLayout } from "./components/layouts/BusinessLayout";
import BusinessDashboard from "./pages/business/Dashboard";
import BusinessQuests from "./pages/business/Quests";
import CreateQuest from "./pages/business/CreateQuest";
import BusinessAnalytics from "./pages/business/Analytics";
import BusinessUsers from "./pages/business/Users";
import BusinessSettings from "./pages/business/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <PrivyProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/pricing" element={<Pricing />} />
            
            {/* User Portal Routes */}
            <Route path="/user/dashboard" element={<UserLayout><UserDashboard /></UserLayout>} />
            <Route path="/user/wallet" element={<UserLayout><Wallet /></UserLayout>} />
            <Route path="/user/quests" element={<UserLayout><UserQuests /></UserLayout>} />
            <Route path="/user/achievements" element={<UserLayout><UserAchievements /></UserLayout>} />
            <Route path="/user/profile" element={<UserLayout><UserProfile /></UserLayout>} />
            
            {/* Business Portal Routes */}
            <Route path="/business/dashboard" element={<BusinessLayout><BusinessDashboard /></BusinessLayout>} />
            <Route path="/business/quests" element={<BusinessLayout><BusinessQuests /></BusinessLayout>} />
            <Route path="/business/quests/create" element={<BusinessLayout><CreateQuest /></BusinessLayout>} />
            <Route path="/business/analytics" element={<BusinessLayout><BusinessAnalytics /></BusinessLayout>} />
            <Route path="/business/users" element={<BusinessLayout><BusinessUsers /></BusinessLayout>} />
            <Route path="/business/settings" element={<BusinessLayout><BusinessSettings /></BusinessLayout>} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </PrivyProvider>
  </QueryClientProvider>
);

export default App;
