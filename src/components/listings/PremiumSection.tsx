
import { Sparkles } from "lucide-react";
import { PremiumListingFeatures } from "@/components/PremiumListingFeatures";
import { useLanguage } from "@/providers/LanguageProvider";

interface PremiumSectionProps {
  onPremiumStatusChange: (isPremium: boolean, plan?: string) => void;
}

export const PremiumSection = ({ onPremiumStatusChange }: PremiumSectionProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="pt-4 mt-4 border-t">
      <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-amber-500" />
        {t('premiumListing', 'upgradeToFeatured')}
      </h3>
      <PremiumListingFeatures onPremiumStatusChange={onPremiumStatusChange} />
    </div>
  );
};
