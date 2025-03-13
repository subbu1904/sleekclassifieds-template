
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
import { Slider } from "@/components/ui/slider";
import { useLanguage } from "@/providers/LanguageProvider";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SearchFiltersProps {
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export const SearchFilters = ({ isExpanded, onToggleExpand }: SearchFiltersProps) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [location, setLocation] = useState("");
  const [condition, setCondition] = useState("any");
  const [withImages, setWithImages] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    if (searchQuery) params.append("q", searchQuery);
    if (category !== "all") params.append("category", category);
    if (priceRange[0] > 0 || priceRange[1] < 1000) {
      params.append("minPrice", priceRange[0].toString());
      params.append("maxPrice", priceRange[1].toString());
    }
    if (location) params.append("location", location);
    if (condition !== "any") params.append("condition", condition);
    if (withImages) params.append("withImages", "true");
    
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
            
            <Button type="submit" className="w-full md:w-auto">
              {t('search', 'search')}
            </Button>
            
            <Button 
              type="button" 
              variant="ghost" 
              className="md:hidden flex items-center justify-center"
              onClick={onToggleExpand}
            >
              {isExpanded ? <ChevronUp /> : <ChevronDown />}
            </Button>
          </div>
          
          {isExpanded && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t('search.filters', 'priceRange')}
                </label>
                <Slider
                  defaultValue={[0, 1000]}
                  max={1000}
                  step={10}
                  value={priceRange}
                  onValueChange={setPriceRange}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t('search.filters', 'location')}
                </label>
                <Input
                  placeholder={t('search.filters', 'locationPlaceholder')}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t('search.filters', 'condition')}
                </label>
                <Select value={condition} onValueChange={setCondition}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('search.filters', 'anyCondition')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">{t('search.filters', 'anyCondition')}</SelectItem>
                    <SelectItem value="new">{t('search', 'new')}</SelectItem>
                    <SelectItem value="likeNew">{t('search', 'likeNew')}</SelectItem>
                    <SelectItem value="used">{t('search', 'used')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={withImages}
                    onChange={(e) => setWithImages(e.target.checked)}
                  />
                  <span>{t('search.filters', 'withImages')}</span>
                </label>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
