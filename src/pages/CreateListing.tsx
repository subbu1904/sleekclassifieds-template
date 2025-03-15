
import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { GeoLocationPicker } from "@/components/GeoLocationPicker";
import { useLanguage } from "@/providers/LanguageProvider";
import { FeatureToggle } from "@/components/FeatureToggle";
import { BasicDetailsForm } from "@/components/listings/BasicDetailsForm";
import { MediaUploader } from "@/components/listings/MediaUploader";
import { ListingFormHeader } from "@/components/listings/ListingFormHeader";
import { ListingFormFooter } from "@/components/listings/ListingFormFooter";
import { PremiumSection } from "@/components/listings/PremiumSection";
import { ExpirySettings } from "@/components/listings/ExpirySettings";
import { useListingFormHandler } from "@/components/listings/useListingFormHandler";
import { filterContent, checkRateLimit, getRateLimitInfo } from "@/utils/contentFilter";
import { toast } from "sonner";
import { Shield } from "lucide-react";
import { useFeatures } from "@/providers/FeaturesProvider";
import { Badge } from "@/components/ui/badge";

const CreateListing = () => {
  const { t, language } = useLanguage();
  const { features } = useFeatures();
  const {
    isLoading,
    images,
    videos,
    location,
    isPremium,
    handlePremiumStatusChange,
    handleLocationSelect,
    setImages,
    setVideos,
    handleSubmit: originalHandleSubmit,
    setExpiryDate,
    setAutoRenew
  } = useListingFormHandler();
  
  // Get categories from localStorage or use defaults
  const storedCategories = localStorage.getItem("categories");
  const categories = storedCategories 
    ? JSON.parse(storedCategories) 
    : [
        t('categories', 'vehicles'),
        t('categories', 'realEstate'),
        t('categories', 'electronics'),
        t('categories', 'fashion'),
        t('categories', 'art'),
        t('categories', 'books'),
        t('categories', 'music'),
        t('categories', 'photography'),
      ];
  
  // Wrap the original submit handler to add content filtering and rate limiting
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Get form data for content filtering
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    
    // Check rate limiting if enabled
    if (features.rateLimiting) {
      const user = localStorage.getItem("user");
      if (user) {
        const userId = JSON.parse(user).id || "anonymous";
        const withinLimit = checkRateLimit(userId, "create_listing");
        
        if (!withinLimit) {
          const { remaining, resetInMinutes } = getRateLimitInfo(userId, "create_listing");
          toast.error(
            `${t('listings', 'rateLimitExceeded')} ${t('listings', 'tryAgainIn')} ${resetInMinutes} ${t('listings', 'minutes')}`
          );
          return;
        }
      }
    }
    
    // Check content filtering if enabled
    if (features.contentFiltering) {
      const titleCheck = filterContent(title);
      const descriptionCheck = filterContent(description);
      
      if (!titleCheck.isClean) {
        toast.error(`${t('listings', 'titleFiltered')}: ${titleCheck.reason}`);
        return;
      }
      
      if (!descriptionCheck.isClean) {
        toast.error(`${t('listings', 'descriptionFiltered')}: ${descriptionCheck.reason}`);
        return;
      }
    }
    
    // If all checks pass, proceed with the original submit handler
    originalHandleSubmit(e);
  };
  
  const handleExpiryChange = (date: Date | null) => {
    setExpiryDate(date);
  };
  
  const handleAutoRenewChange = (autoRenew: boolean) => {
    setAutoRenew(autoRenew);
  };
  
  return (
    <div className="min-h-screen pb-12">
      <Navigation />
      <main className="pt-24 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <ListingFormHeader isPremium={isPremium} />
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {features.contentFiltering && (
                <div className="bg-green-50 p-3 rounded-md flex items-center gap-2 text-sm text-green-800">
                  <Shield className="h-4 w-4" />
                  <span>{t('listings', 'contentFilterActive')}</span>
                  <Badge variant="outline" className="ml-auto bg-green-100">
                    {t('listings', 'enabled')}
                  </Badge>
                </div>
              )}
              
              <BasicDetailsForm categories={categories} />
              
              <FeatureToggle feature="geoLocation">
                <GeoLocationPicker 
                  onLocationSelect={handleLocationSelect}
                  initialAddress={location.address}
                />
              </FeatureToggle>
              
              <FeatureToggle feature="multimedia">
                <MediaUploader 
                  images={images}
                  videos={videos}
                  onImagesChange={setImages}
                  onVideosChange={setVideos}
                />
              </FeatureToggle>
              
              <FeatureToggle feature="listingExpiry">
                <ExpirySettings 
                  onExpiryChange={handleExpiryChange}
                  onAutoRenewChange={handleAutoRenewChange}
                />
              </FeatureToggle>
              
              <FeatureToggle feature="premiumListings">
                <PremiumSection onPremiumStatusChange={handlePremiumStatusChange} />
              </FeatureToggle>
            </CardContent>
            <ListingFormFooter isLoading={isLoading} />
          </form>
        </Card>
      </main>
    </div>
  );
};

export default CreateListing;
