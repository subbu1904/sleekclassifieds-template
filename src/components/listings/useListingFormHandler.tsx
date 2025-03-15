
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { detectLanguage } from "@/utils/translateContent";

interface Location {
  address: string;
  lat?: number;
  lng?: number;
}

interface FormHandlerReturn {
  isLoading: boolean;
  images: string[];
  videos: string[];
  location: Location;
  isPremium: boolean;
  premiumPlan: string | undefined;
  expiryDate: Date | null;
  autoRenew: boolean;
  setImages: (images: string[]) => void;
  setVideos: (videos: string[]) => void;
  setLocation: (location: Location) => void;
  setExpiryDate: (date: Date | null) => void;
  setAutoRenew: (autoRenew: boolean) => void;
  handlePremiumStatusChange: (isPremium: boolean, plan?: string) => void;
  handleLocationSelect: (locationData: Location) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const useListingFormHandler = (): FormHandlerReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [location, setLocation] = useState<Location>({ address: "" });
  const [isPremium, setIsPremium] = useState(false);
  const [premiumPlan, setPremiumPlan] = useState<string | undefined>();
  const [expiryDate, setExpiryDate] = useState<Date | null>(
    // Default to 30 days from now
    new Date(new Date().setDate(new Date().getDate() + 30))
  );
  const [autoRenew, setAutoRenew] = useState(false);
  const navigate = useNavigate();
  
  // Check if user is logged in
  const user = localStorage.getItem("user");
  if (!user) {
    navigate("/login");
    toast.error("Please login to create a listing");
  }
  
  const handleLocationSelect = (locationData: Location) => {
    setLocation(locationData);
  };
  
  const handlePremiumStatusChange = (isPremium: boolean, plan?: string) => {
    setIsPremium(isPremium);
    setPremiumPlan(plan);
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    
    // Detect the original language of the content
    const contentLanguage = detectLanguage(title);
    
    const listingData = {
      id: Date.now(), // Generate a unique ID
      title: title,
      category: formData.get("category") as string,
      price: formData.get("price") as string,
      condition: formData.get("condition") as string,
      description: description,
      location: location.address,
      coordinates: { 
        lat: location.lat,
        lng: location.lng
      },
      images: images,
      videos: videos,
      createdBy: JSON.parse(user!).email,
      createdAt: new Date().toISOString(),
      originalLanguage: contentLanguage, // Store the original language
      isPremium: isPremium,
      premiumPlan: premiumPlan,
      expiryDate: expiryDate ? expiryDate.toISOString() : null,
      autoRenew: autoRenew,
      // Track offline editing
      offlineCreated: !navigator.onLine,
      // Store translations in a nested object for future use
      translations: {
        // We'll populate this when translations are requested
      }
    };
    
    // Handle offline creation
    if (!navigator.onLine) {
      // Store in localStorage until back online
      const offlineListings = JSON.parse(localStorage.getItem("offlineListings") || "[]");
      offlineListings.push(listingData);
      localStorage.setItem("offlineListings", JSON.stringify(offlineListings));
      
      setIsLoading(false);
      toast.success("Create Listing (Saved offline)");
      navigate("/my-listings");
      return;
    }
    
    // Simulating saving to backend
    setTimeout(() => {
      // Save to localStorage as a simple demo
      const listings = JSON.parse(localStorage.getItem("listings") || "[]");
      listings.push(listingData);
      localStorage.setItem("listings", JSON.stringify(listings));
      
      setIsLoading(false);
      toast.success("Create Listing");
      navigate("/my-listings");
    }, 1000);
  };
  
  return {
    isLoading,
    images,
    videos,
    location,
    isPremium,
    premiumPlan,
    expiryDate,
    autoRenew,
    setImages,
    setVideos,
    setLocation,
    setExpiryDate,
    setAutoRenew,
    handlePremiumStatusChange,
    handleLocationSelect,
    handleSubmit
  };
};
