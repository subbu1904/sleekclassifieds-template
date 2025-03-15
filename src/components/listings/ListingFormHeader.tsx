
import { CardTitle, CardDescription, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { useLanguage } from "@/providers/LanguageProvider";

interface ListingFormHeaderProps {
  isPremium: boolean;
}

export const ListingFormHeader = ({ isPremium }: ListingFormHeaderProps) => {
  const { t } = useLanguage();
  
  return (
    <CardHeader>
      <div className="flex items-center justify-between">
        <div>
          <CardTitle>{t('createListing', 'createNewListing')}</CardTitle>
          <CardDescription>
            {t('createListing', 'formDescription')}
          </CardDescription>
        </div>
        {isPremium && (
          <Badge className="bg-amber-500 flex items-center gap-1 px-2 py-1">
            <Sparkles className="h-3 w-3" />
            Premium
          </Badge>
        )}
      </div>
    </CardHeader>
  );
};
