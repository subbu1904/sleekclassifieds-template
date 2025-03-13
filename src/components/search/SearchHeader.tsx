
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GridIcon, List } from "lucide-react";

interface SearchHeaderProps {
  resultCount: number;
  keyword: string;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
}

export const SearchHeader = ({ 
  resultCount,
  keyword,
  viewMode,
  setViewMode,
  sortBy,
  setSortBy
}: SearchHeaderProps) => {
  
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-xl font-semibold">
        {resultCount} {resultCount === 1 ? 'Result' : 'Results'}
        {keyword && <span> for "{keyword}"</span>}
      </h1>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Button 
            variant={viewMode === "grid" ? "default" : "outline"} 
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <GridIcon className="h-4 w-4" />
          </Button>
          <Button 
            variant={viewMode === "list" ? "default" : "outline"} 
            size="icon"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="w-40">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
              <SelectItem value="priceAsc">Price: Low to High</SelectItem>
              <SelectItem value="priceDesc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
