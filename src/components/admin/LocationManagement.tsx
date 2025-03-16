
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { useLanguage } from "@/providers/LanguageProvider";
import { LocationsList } from "./location/LocationsList";
import { SublocationsList } from "./location/SublocationsList";
import { LocationSubcategory } from "./location/types";
import { loadLocationsFromStorage, loadSublocationsFromStorage } from "./location/locationUtils";

export const LocationManagement = () => {
  const { t } = useLanguage();
  const [locations, setLocations] = useState<string[]>([]);
  const [locationSubcategories, setLocationSubcategories] = useState<LocationSubcategory[]>([]);

  useEffect(() => {
    // Load data from localStorage
    setLocations(loadLocationsFromStorage());
    setLocationSubcategories(loadSublocationsFromStorage());
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('admin', 'locationManagement')}</CardTitle>
        <CardDescription>{t('admin', 'locationManagementDescription')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <LocationsList 
          locations={locations} 
          setLocations={setLocations}
          locationSubcategories={locationSubcategories}
          setLocationSubcategories={setLocationSubcategories}
        />
        
        <SublocationsList 
          locations={locations}
          locationSubcategories={locationSubcategories}
          setLocationSubcategories={setLocationSubcategories}
        />
      </CardContent>
    </Card>
  );
};
