
import { Button } from "@/components/ui/button";
import { PlusCircle, User, Shield, Loader2, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAdmin } from "@/providers/AdminProvider";
import { useLanguage } from "@/providers/LanguageProvider";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/providers/AuthProvider";
import { useFeatures } from "@/providers/FeaturesProvider";
import { FeatureToggle } from "@/components/FeatureToggle";

export const Navigation = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAdmin();
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const { user, signOut, isLoading } = useAuth();
  const { features } = useFeatures();
  
  return (
    <nav className="w-full px-6 py-4 glass fixed top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className={`font-semibold text-primary ${isMobile ? "text-lg" : "text-2xl"}`}>
          Classifieds
        </Link>
        
        <div className="flex items-center space-x-2">
          <LanguageSelector />
          
          {isAdmin && (
            <Button 
              variant="outline"
              onClick={() => navigate("/admin")}
              className="flex items-center gap-2 bg-primary/10"
            >
              <Shield size={18} />
              <span className="hidden sm:inline">{t('common', 'admin')}</span>
            </Button>
          )}
          
          <Button 
            variant="outline"
            onClick={() => navigate("/create-listing")}
            className="flex items-center gap-2"
          >
            <PlusCircle size={18} />
            <span className="inline">{t('common', 'postAd')}</span>
          </Button>
          
          <FeatureToggle feature="chat">
            {user && (
              <Button 
                variant="outline"
                onClick={() => navigate("/messages")}
                className="flex items-center gap-2"
              >
                <MessageSquare size={18} />
                <span className="hidden sm:inline">{t('common', 'messages')}</span>
              </Button>
            )}
          </FeatureToggle>
          
          {isLoading ? (
            <Button variant="ghost" size="icon" disabled className="rounded-full">
              <Loader2 size={20} className="animate-spin" />
            </Button>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User size={20} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{t('common', 'profile')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  {t('common', 'profile')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/my-listings")}>
                  {t('common', 'myListings')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/wishlist")}>
                  {t('common', 'wishlist')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/messages")}>
                  {t('common', 'messages')}
                </DropdownMenuItem>
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/admin")}>
                      {t('common', 'admin')}
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  {t('common', 'logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => navigate("/login")}>
              {t('common', 'login')}
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};
