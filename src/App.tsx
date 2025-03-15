
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import { AdminProvider } from "@/providers/AdminProvider";
import { WishlistProvider } from "@/providers/WishlistProvider";
import { FeaturesProvider } from "@/providers/FeaturesProvider";
import { LanguageProvider } from "@/providers/LanguageProvider";
import { PwaInstall } from "@/components/PwaInstall";
import { AuthProvider } from "@/providers/AuthProvider";

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <AuthProvider>
          <AdminProvider>
            <FeaturesProvider>
              <WishlistProvider>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/create-listing" element={<CreateListing />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/my-listings" element={<MyListings />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin-login" element={<AdminLogin />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Toaster position="top-right" />
                <PwaInstall />
              </WishlistProvider>
            </FeaturesProvider>
          </AdminProvider>
        </AuthProvider>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
