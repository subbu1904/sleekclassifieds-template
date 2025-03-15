
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useLanguage } from "@/providers/LanguageProvider";
import { Search, Mic } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { VoiceSearch } from "@/components/search/VoiceSearch";
import { useFeatures } from "@/providers/FeaturesProvider";
import { FeatureToggle } from "@/components/FeatureToggle";

interface SearchFiltersProps {
  isExpanded: boolean;
  onToggleExpand: () => void;
  onSearch?: (filters: any) => void;
}

// Location options for the dropdown - Updated to Indian cities
const LOCATIONS = [
  "All Locations",
  "Mumbai, Maharashtra",
  "Delhi, NCR",
  "Bengaluru, Karnataka",
  "Chennai, Tamil Nadu",
  "Kolkata, West Bengal",
  "Hyderabad, Telangana",
  "Pune, Maharashtra",
  "Ahmedabad, Gujarat",
  "Jaipur, Rajasthan",
];

export const SearchFilters = ({ isExpanded, onToggleExpand, onSearch }: SearchFiltersProps) => {
  const { t } = useLanguage();
  const { features } = useFeatures();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [location, setLocation] = useState("All Locations");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const filters = {
      searchQuery,
      category,
      location: location === "All Locations" ? "" : location
    };
    
    if (onSearch) {
      onSearch(filters);
      return;
    }
    
    const params = new URLSearchParams();
    if (searchQuery) params.append("q", searchQuery);
    if (category !== "all") params.append("category", category);
    if (location !== "All Locations") params.append("location", location);
    
    navigate(`/search?${params.toString()}`);
  };

  const handleVoiceSearchQuery = (query: string) => {
    setSearchQuery(query);
    
    // Automatically submit the search form after voice input
    const filters = {
      searchQuery: query,
      category,
      location: location === "All Locations" ? "" : location
    };
    
    if (onSearch) {
      onSearch(filters);
      return;
    }
    
    const params = new URLSearchParams();
    if (query) params.append("q", query);
    if (category !== "all") params.append("category", category);
    if (location !== "All Locations") params.append("location", location);
    
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-lg shadow-md p-4">
        <form onSubmit={handleSearch}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  className="pl-10 w-full"
                  placeholder={t('search', 'searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="w-full md:w-auto">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder={t('search', 'category')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('search', 'allCategories')}</SelectItem>
                  <SelectItem value="vehicles">{t('categories', 'vehicles')}</SelectItem>
                  <SelectItem value="realEstate">{t('categories', 'realEstate')}</SelectItem>
                  <SelectItem value="electronics">{t('categories', 'electronics')}</SelectItem>
                  <SelectItem value="fashion">{t('categories', 'fashion')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full md:w-auto">
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  {LOCATIONS.map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2">
              <Button type="submit" className="w-full md:w-auto">
                {t('search', 'search')}
              </Button>
              
              <FeatureToggle feature="voiceSearch">
                <VoiceSearch onSearchQuery={handleVoiceSearchQuery} />
              </FeatureToggle>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
