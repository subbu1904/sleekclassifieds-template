
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Car, Home, Camera, Laptop, ShoppingBag, Brush, Book, Music, Filter, Search as SearchIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/providers/LanguageProvider";
import { useIsMobile } from "@/hooks/use-mobile";

const categories = [
  { name: "Vehicles", icon: Car },
  { name: "Real Estate", icon: Home },
  { name: "Electronics", icon: Laptop },
  { name: "Fashion", icon: ShoppingBag },
  { name: "Art", icon: Brush },
  { name: "Books", icon: Book },
  { name: "Music", icon: Music },
  { name: "Photography", icon: Camera },
];

export interface SearchFiltersProps {
  onSearch?: (filters: any) => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export const SearchFilters = ({ 
  onSearch,
  isExpanded = false,
  onToggleExpand
}: SearchFiltersProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState<string>("");
  const [priceRange, setPriceRange] = useState<number[]>([0, 10000]);
  const [location, setLocation] = useState("");
  const [condition, setCondition] = useState<string>("");
  const [showOnlyWithImages, setShowOnlyWithImages] = useState(true);
  const [localExpanded, setLocalExpanded] = useState(isExpanded);
  
  const effectiveExpanded = typeof onToggleExpand === 'function' ? isExpanded : localExpanded;
  
  const toggleExpand = () => {
    if (typeof onToggleExpand === 'function') {
      onToggleExpand();
    } else {
      setLocalExpanded(!localExpanded);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const filters = {
      keyword,
      category,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      location,
      condition,
      withImages: showOnlyWithImages
    };
    
    if (onSearch) {
      onSearch(filters);
    } else {
      // Build query string for URL
      const params = new URLSearchParams();
      if (keyword) params.append("q", keyword);
      if (category) params.append("category", category);
      if (priceRange[0] > 0) params.append("minPrice", priceRange[0].toString());
      if (priceRange[1] < 10000) params.append("maxPrice", priceRange[1].toString());
      if (location) params.append("location", location);
      if (condition) params.append("condition", condition);
      if (showOnlyWithImages) params.append("withImages", "true");
      
      navigate(`/search?${params.toString()}`);
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm border p-4 mb-6 w-full">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-3 mb-4">
          <div className="relative w-full">
            <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <Input
              placeholder={t('search', 'searchPlaceholder')}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <div className="w-full sm:w-auto flex-1">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder={t('search', 'category')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t('search', 'allCategories')}</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2">
              <Button type="submit" className="flex-1 sm:flex-none">
                {t('search', 'search')}
              </Button>
              
              <Button 
                type="button" 
                variant="outline" 
                size="icon"
                onClick={toggleExpand}
                className="shrink-0"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {effectiveExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 border-t">
            <div className="space-y-2">
              <Label>{t('search', 'priceRange')}</Label>
              <Slider
                value={priceRange}
                min={0}
                max={10000}
                step={100}
                onValueChange={setPriceRange}
                className="my-5"
              />
              <div className="flex items-center justify-between">
                <span className="text-sm">${priceRange[0]}</span>
                <span className="text-sm">${priceRange[1]}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">{t('search', 'location')}</Label>
              <Input
                id="location"
                placeholder={t('search', 'locationPlaceholder')}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>{t('search', 'condition')}</Label>
              <Select value={condition} onValueChange={setCondition}>
                <SelectTrigger>
                  <SelectValue placeholder={t('search', 'anyCondition')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t('search', 'anyCondition')}</SelectItem>
                  <SelectItem value="new">{t('search', 'new')}</SelectItem>
                  <SelectItem value="like-new">{t('search', 'likeNew')}</SelectItem>
                  <SelectItem value="used">{t('search', 'used')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="with-images"
                checked={showOnlyWithImages}
                onCheckedChange={(checked) => 
                  setShowOnlyWithImages(checked as boolean)
                }
              />
              <Label htmlFor="with-images">{t('search', 'showOnlyWithImages')}</Label>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
