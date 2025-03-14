
import { useState, useEffect } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Location {
  address: string;
  lat?: number;
  lng?: number;
}

interface GeoLocationPickerProps {
  onLocationSelect: (location: Location) => void;
  initialAddress?: string;
}

export const GeoLocationPicker = ({ onLocationSelect, initialAddress = "" }: GeoLocationPickerProps) => {
  const [address, setAddress] = useState(initialAddress);
  const [coordinates, setCoordinates] = useState<{ lat?: number; lng?: number }>({});
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState("");

  const detectCurrentLocation = () => {
    setIsLocating(true);
    setLocationError("");
    
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setIsLocating(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCoordinates({ lat, lng });
        
        try {
          // Simulate address lookup - using Indian cities
          setTimeout(() => {
            // Random Indian cities for simulation
            const indianCities = [
              "Mumbai, Maharashtra",
              "Delhi, NCR",
              "Bengaluru, Karnataka",
              "Chennai, Tamil Nadu",
              "Kolkata, West Bengal",
              "Hyderabad, Telangana",
              "Pune, Maharashtra",
              "Ahmedabad, Gujarat",
              "Jaipur, Rajasthan"
            ];
            const randomCity = indianCities[Math.floor(Math.random() * indianCities.length)];
            setAddress(randomCity);
            onLocationSelect({ 
              address: randomCity, 
              lat, 
              lng 
            });
            setIsLocating(false);
          }, 1000);
        } catch (error) {
          setLocationError("Failed to get address from coordinates");
          setIsLocating(false);
        }
      },
      (error) => {
        setLocationError(`Error getting location: ${error.message}`);
        setIsLocating(false);
      }
    );
  };

  const handleManualAddress = () => {
    if (address.trim()) {
      onLocationSelect({ 
        address,
        ...coordinates // Include any coordinates if they exist
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <Label htmlFor="location">Location</Label>
        <div className="flex space-x-2">
          <Input
            id="location"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter location or use current position"
            className="flex-1"
          />
          <Button 
            type="button" 
            variant="outline" 
            onClick={detectCurrentLocation}
            disabled={isLocating}
          >
            {isLocating ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <MapPin className="h-4 w-4 mr-2" />
            )}
            Detect
          </Button>
        </div>
        {locationError && <p className="text-sm text-destructive">{locationError}</p>}
        {address && !locationError && (
          <Button type="button" variant="ghost" size="sm" className="w-fit" onClick={handleManualAddress}>
            Use this address
          </Button>
        )}
      </div>
    </div>
  );
};
