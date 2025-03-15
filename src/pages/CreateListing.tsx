
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
import { useListingFormHandler } from "@/components/listings/useListingFormHandler";

const CreateListing = () => {
  const { t, language } = useLanguage();
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
    handleSubmit
  } = useListingFormHandler();
  
  const categories = [
    t('categories', 'vehicles'),
    t('categories', 'realEstate'),
    t('categories', 'electronics'),
    t('categories', 'fashion'),
    t('categories', 'art'),
    t('categories', 'books'),
    t('categories', 'music'),
    t('categories', 'photography'),
  ];
  
  return (
    <div className="min-h-screen pb-12">
      <Navigation />
      <main className="pt-24 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <ListingFormHeader isPremium={isPremium} />
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <BasicDetailsForm categories={categories} />
              
              <GeoLocationPicker 
                onLocationSelect={handleLocationSelect}
                initialAddress={location.address}
              />
              
              <MediaUploader 
                images={images}
                videos={videos}
                onImagesChange={setImages}
                onVideosChange={setVideos}
              />
              
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
