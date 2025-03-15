
import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Profile from "@/pages/Profile";
import CreateListing from "@/pages/CreateListing";
import NotFound from "@/pages/NotFound";
import Wishlist from "@/pages/Wishlist";
import MyListings from "@/pages/MyListings";
import SearchPage from "@/pages/SearchPage";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminLogin from "@/pages/AdminLogin";
import Messages from "@/pages/Messages";
import { PwaInstall } from "@/components/PwaInstall";
import { OfflineManager } from "@/components/OfflineManager";
import { useState, useEffect } from "react";

function App() {
  const [isAppReady, setIsAppReady] = useState(false);

  // Simulate app initialization and offline data loading
  useEffect(() => {
    // Initialize cache for offline use
    const initAppCache = () => {
      // In a real app, we would preload important assets and data here
      // For now, we'll just simulate with a timeout
      const timeout = setTimeout(() => {
        setIsAppReady(true);
      }, 500);

      return () => clearTimeout(timeout);
    };

    initAppCache();
  }, []);

  // Display loading screen during initialization
  if (!isAppReady) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-medium">Loading application...</h2>
          <p className="text-muted-foreground">Preparing your experience</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/create-listing" element={<CreateListing />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/my-listings" element={<MyListings />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster position="top-right" />
      <PwaInstall />
      <OfflineManager />
    </>
  );
}

export default App;
