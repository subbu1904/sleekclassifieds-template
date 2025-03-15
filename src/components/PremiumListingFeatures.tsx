
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, AlertCircle, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PayPalButton } from "@/components/payment/PayPalButton";
import { toast } from "sonner";
import { useLanguage } from "@/providers/LanguageProvider";

interface PremiumListingFeaturesProps {
  onPremiumStatusChange: (isPremium: boolean, plan?: string) => void;
}

interface PlanFeature {
  title: string;
  basic: boolean | string;
  premium: boolean | string;
  ultra: boolean | string;
  tooltip?: string;
}

export const PremiumListingFeatures = ({ onPremiumStatusChange }: PremiumListingFeaturesProps) => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const { t } = useLanguage();

  const plans = [
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {plans.map((plan) => (
                <Card key={plan.id} className={`overflow-hidden ${selectedPlan === plan.id ? 'ring-2 ring-primary' : ''}`}>
                  <CardHeader className={`pb-2 ${plan.id !== 'basic' ? 'bg-primary/5' : ''}`}>
                    <CardTitle className="text-lg">
                      {plan.name}
                      {plan.id === "ultra" && (
                        <Badge className="ml-2 bg-amber-500">
                          {t('premiumListing', 'bestValue')}
                        </Badge>
                      )}
                    </CardTitle>
                    <div className="flex items-baseline mt-2">
                      <span className="text-3xl font-bold">${plan.price}</span>
                      {plan.id !== "basic" && (
                        <span className="text-sm text-muted-foreground ml-1">
                          / {t('premiumListing', 'listing')}
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <ul className="space-y-2 mb-4">
                      {features.map((feature, index) => {
                        const value = plan.id === "basic" ? feature.basic : 
                                    plan.id === "premium" ? feature.premium : feature.ultra;
                        
                        return (
                          <li key={index} className="flex items-center gap-2">
                            {value === true ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : value === false ? (
                              <AlertCircle className="h-4 w-4 text-gray-300" />
                            ) : (
                              <Check className="h-4 w-4 text-green-500" />
                            )}
                            <span className="flex items-center gap-1">
                              {feature.title}
                              {feature.tooltip && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="max-w-xs">{feature.tooltip}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                            </span>
                            {typeof value === "string" && (
                              <span className="ml-auto text-sm">{value}</span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                    
                    {paymentComplete && selectedPlan === plan.id ? (
                      <Button className="w-full" variant="outline" disabled>
                        {t('premiumListing', 'selected')}
                      </Button>
                    ) : (
                      <Button 
                        className="w-full" 
                        variant={plan.id === "basic" ? "outline" : "default"}
                        onClick={() => handleSelectPlan(plan.id)}
                      >
                        {plan.id === "basic" 
                          ? t('premiumListing', 'selectBasic')
                          : t('premiumListing', 'selectPlan')
                        }
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {selectedPlan && selectedPlan !== "basic" && !paymentComplete && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">{t('premiumListing', 'completePayment')}</h3>
                <PayPalButton 
                  amount={selectedPlan === "premium" ? 9.99 : 19.99}
                  onSuccess={handlePaymentSuccess}
                />
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="features">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="py-3 px-4 text-left">{t('premiumListing', 'feature')}</th>
                    <th className="py-3 px-4 text-center">{t('premiumListing', 'basicPlan')}</th>
                    <th className="py-3 px-4 text-center">{t('premiumListing', 'premiumPlan')}</th>
                    <th className="py-3 px-4 text-center">{t('premiumListing', 'ultraPlan')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {features.map((feature, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                      <td className="py-3 px-4 flex items-center gap-1">
                        {feature.title}
                        {feature.tooltip && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="h-3 w-3 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">{feature.tooltip}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {feature.basic === true ? (
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        ) : feature.basic === false ? (
                          <AlertCircle className="h-5 w-5 text-gray-300 mx-auto" />
                        ) : (
                          feature.basic
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {feature.premium === true ? (
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        ) : feature.premium === false ? (
                          <AlertCircle className="h-5 w-5 text-gray-300 mx-auto" />
                        ) : (
                          feature.premium
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {feature.ultra === true ? (
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        ) : feature.ultra === false ? (
                          <AlertCircle className="h-5 w-5 text-gray-300 mx-auto" />
                        ) : (
                          feature.ultra
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
