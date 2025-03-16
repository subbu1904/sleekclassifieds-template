
import { useState, useEffect } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/providers/LanguageProvider";

interface LocationSubcategory {
  id: string;
  name: string;
  parent_id: string;
}

interface Location {
  address: string;
  subLocation?: string;
  lat?: number;
  lng?: number;
}

interface GeoLocationPickerProps {
  onLocationSelect: (location: Location) => void;
  initialAddress?: string;
}

export const GeoLocationPicker = ({ onLocationSelect, initialAddress = "" }: GeoLocationPickerProps) => {
  const { t } = useLanguage();
  const [address, setAddress] = useState(initialAddress);
  const [coordinates, setCoordinates] = useState<{ lat?: number; lng?: number }>({});
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [locations, setLocations] = useState<string[]>([]);
  const [locationSubcategories, setLocationSubcategories] = useState<LocationSubcategory[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [filteredSublocations, setFilteredSublocations] = useState<LocationSubcategory[]>([]);
  const [selectedSublocation, setSelectedSublocation] = useState<string>("");

  useEffect(() => {
    // Load locations from localStorage or use default Indian cities
    const storedLocations = localStorage.getItem("locations");
    if (storedLocations) {
      setLocations(JSON.parse(storedLocations));
    } else {
      const defaultLocations = [
        "Mumbai",
        "Delhi",
        "Bengaluru",
        "Chennai",
        "Kolkata",
        "Hyderabad",
        "Pune",
        "Ahmedabad",
        "Jaipur"
      ];
      setLocations(defaultLocations);
      localStorage.setItem("locations", JSON.stringify(defaultLocations));
    }
    
    // Load location subcategories from localStorage
    const storedLocationSubcategories = localStorage.getItem("locationSubcategories");
    if (storedLocationSubcategories) {
      setLocationSubcategories(JSON.parse(storedLocationSubcategories));
    } else {
      localStorage.setItem("locationSubcategories", JSON.stringify([]));
    }
  }, []);

  useEffect(() => {
    // Filter sublocations based on selected location
    if (selectedLocation) {
      const filtered = locationSubcategories.filter(sub => sub.parent_id === selectedLocation);
      setFilteredSublocations(filtered);
    } else {
      setFilteredSublocations([]);
    }
  }, [selectedLocation, locationSubcategories]);

  const detectCurrentLocation = () => {
    setIsLocating(true);
    setLocationError("");
    
    if (!navigator.geolocation) {
      setLocationError(t('listings', 'geolocationNotSupported'));
      setIsLocating(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCoordinates({ lat, lng });
        
        try {
          // Get a random city from our locations list
          const randomLocation = locations[Math.floor(Math.random() * locations.length)];
          
          setTimeout(() => {
            setAddress(randomLocation);
            setSelectedLocation(randomLocation);
            onLocationSelect({ 
              address: randomLocation, 
              lat, 
              lng 
            });
            setIsLocating(false);
          }, 1000);
        } catch (error) {
          setLocationError(t('listings', 'failedToGetAddress'));
          setIsLocating(false);
        }
      },
      (error) => {
        setLocationError(`${t('listings', 'errorGettingLocation')}: ${error.message}`);
        setIsLocating(false);
      }
    );
  };

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
    setAddress(location);
    
    const locationData: Location = {
      address: location
    };
    
    if (selectedSublocation) {
      const sublocation = locationSubcategories.find(sub => sub.id === selectedSublocation);
      if (sublocation) {
        locationData.subLocation = sublocation.name;
      }
    }
    
    onLocationSelect(locationData);
  };

  const handleSublocationSelect = (sublocationId: string) => {
    setSelectedSublocation(sublocationId);
    
    const sublocation = locationSubcategories.find(sub => sub.id === sublocationId);
    if (sublocation && selectedLocation) {
      onLocationSelect({
        address: selectedLocation,
        subLocation: sublocation.name,
        ...coordinates
      });
    }
  };

  const handleManualAddress = () => {
    if (address.trim()) {
      const locationData: Location = {
        address,
        ...coordinates
      };
      
      if (selectedSublocation) {
        const sublocation = locationSubcategories.find(sub => sub.id === selectedSublocation);
        if (sublocation) {
          locationData.subLocation = sublocation.name;
        }
      }
      
      onLocationSelect(locationData);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <Label htmlFor="location">{t('listings', 'location')}</Label>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
          <div className="md:col-span-2">
            <Select 
              value={selectedLocation} 
              onValueChange={handleLocationSelect}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('listings', 'selectLocation')} />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedLocation && filteredSublocations.length > 0 && (
            <div className="md:col-span-2">
              <Select
                value={selectedSublocation}
                onValueChange={handleSublocationSelect}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('listings', 'selectSublocation')} />
                </SelectTrigger>
                <SelectContent>
                  {filteredSublocations.map((sublocation) => (
                    <SelectItem key={sublocation.id} value={sublocation.id}>
                      {sublocation.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <Button 
            type="button" 
            variant="outline" 
            onClick={detectCurrentLocation}
            disabled={isLocating}
            className="md:col-span-1"
          >
            {isLocating ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <MapPin className="h-4 w-4 mr-2" />
            )}
            {t('createListing', 'detectLocation')}
          </Button>
        </div>
        {locationError && <p className="text-sm text-destructive">{locationError}</p>}
        {address && !locationError && (
          <Button 
            type="button" 
            variant="ghost" 
            size="sm" 
            className="w-fit" 
            onClick={handleManualAddress}
          >
            {t('createListing', 'useAddress')}
          </Button>
        )}
      </div>
    </div>
  );
};
