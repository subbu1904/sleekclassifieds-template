
import { HelpCircle, Check, AlertCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PlanFeature } from "./types";
import { useLanguage } from "@/providers/LanguageProvider";

interface PlanComparisonTableProps {
  features: PlanFeature[];
}

export const PlanComparisonTable = ({ features }: PlanComparisonTableProps) => {
  const { t } = useLanguage();

  return (
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
  );
};
