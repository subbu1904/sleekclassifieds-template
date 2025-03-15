
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, AlertCircle, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PlanFeature } from "./types";
import { useLanguage } from "@/providers/LanguageProvider";

interface PlanCardProps {
  plan: {
    id: string;
    name: string;
    price: number;
  };
  features: PlanFeature[];
  selectedPlan: string | null;
  paymentComplete: boolean;
  onSelectPlan: (planId: string) => void;
}

export const PlanCard = ({ 
  plan, 
  features, 
  selectedPlan, 
  paymentComplete, 
  onSelectPlan 
}: PlanCardProps) => {
  const { t } = useLanguage();

  return (
    <Card className={`overflow-hidden ${selectedPlan === plan.id ? 'ring-2 ring-primary' : ''}`}>
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
            onClick={() => onSelectPlan(plan.id)}
          >
            {plan.id === "basic" 
              ? t('premiumListing', 'selectBasic')
              : t('premiumListing', 'selectPlan')
            }
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
