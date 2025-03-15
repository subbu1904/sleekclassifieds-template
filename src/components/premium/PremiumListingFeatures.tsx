
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useLanguage } from "@/providers/LanguageProvider";
import { PlansGrid } from "./PlansGrid";
import { PlanComparisonTable } from "./PlanComparisonTable";
import { PaymentSection } from "./PaymentSection";
import { PlanFeature, Plan } from "./types";

interface PremiumListingFeaturesProps {
  onPremiumStatusChange: (isPremium: boolean, plan?: string) => void;
}

export const PremiumListingFeatures = ({ onPremiumStatusChange }: PremiumListingFeaturesProps) => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const { t } = useLanguage();

  const plans: Plan[] = [
    { id: "basic", name: t('premiumListing', 'basicPlan'), price: 0 },
    { id: "premium", name: t('premiumListing', 'premiumPlan'), price: 9.99 },
    { id: "ultra", name: t('premiumListing', 'ultraPlan'), price: 19.99 },
  ];

  const features: PlanFeature[] = [
    { 
      title: t('premiumListing', 'listingDuration'), 
      basic: "30 days", 
      premium: "60 days", 
      ultra: "90 days" 
    },
    { 
      title: t('premiumListing', 'featured'), 
      basic: false, 
      premium: true, 
      ultra: true,
      tooltip: t('premiumListing', 'featuredTooltip')
    },
    { 
      title: t('premiumListing', 'priority'), 
      basic: false, 
      premium: true, 
      ultra: true,
      tooltip: t('premiumListing', 'priorityTooltip')
    },
    { 
      title: t('premiumListing', 'statistics'), 
      basic: false, 
      premium: true, 
      ultra: true,
      tooltip: t('premiumListing', 'statisticsTooltip')
    },
    { 
      title: t('premiumListing', 'highlightedBadge'), 
      basic: false, 
      premium: false, 
      ultra: true,
      tooltip: t('premiumListing', 'highlightedBadgeTooltip')
    },
    { 
      title: t('premiumListing', 'autoRenew'), 
      basic: false, 
      premium: false, 
      ultra: true 
    },
  ];

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    
    // If it's the basic plan, update status immediately with no payment required
    if (planId === "basic") {
      onPremiumStatusChange(false, "basic");
      toast.success(t('premiumListing', 'basicPlanSelected'));
    } else {
      // Premium plans require payment
      onPremiumStatusChange(false);
    }
  };

  const handlePaymentSuccess = (details: any) => {
    setPaymentComplete(true);
    onPremiumStatusChange(true, selectedPlan || "premium");
    toast.success(t('premiumListing', 'paymentSuccess'));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('premiumListing', 'enhanceListing')}</CardTitle>
        <CardDescription>
          {t('premiumListing', 'enhanceListingDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="plans" className="space-y-4">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="plans">{t('premiumListing', 'choosePlan')}</TabsTrigger>
            <TabsTrigger value="features">{t('premiumListing', 'comparePlans')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="plans" className="space-y-4">
            <PlansGrid
              plans={plans}
              features={features}
              selectedPlan={selectedPlan}
              paymentComplete={paymentComplete}
              onSelectPlan={handleSelectPlan}
            />
            
            {selectedPlan && selectedPlan !== "basic" && !paymentComplete && (
              <PaymentSection 
                selectedPlan={selectedPlan}
                onPaymentSuccess={handlePaymentSuccess}
              />
            )}
          </TabsContent>
          
          <TabsContent value="features">
            <PlanComparisonTable features={features} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
