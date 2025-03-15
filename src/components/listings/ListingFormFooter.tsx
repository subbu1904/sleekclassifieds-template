
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/providers/LanguageProvider";

interface ListingFormFooterProps {
  isLoading: boolean;
}

export const ListingFormFooter = ({ isLoading }: ListingFormFooterProps) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  return (
    <CardFooter className="flex justify-end space-x-2">
      <Button type="button" variant="outline" onClick={() => navigate("/")}>
        {t('common', 'cancel')}
      </Button>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? t('createListing', 'creating') : t('createListing', 'createListing')}
      </Button>
    </CardFooter>
  );
};
