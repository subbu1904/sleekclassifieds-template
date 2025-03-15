
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { SearchHeader } from "@/components/search/SearchHeader";
import { SearchResults } from "@/components/search/SearchResults";
import { SearchFilters } from "@/components/SearchFilters";
import { useSearchParams } from "react-router-dom";
import { useListingsFilter } from "@/hooks/useListingsFilter";
import { FeatureToggle } from "@/components/FeatureToggle";
import { useFeatures } from "@/providers/FeaturesProvider";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { features } = useFeatures();
  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "date-desc";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const condition = searchParams.get("condition") || "";
  
  // Initialize with default view mode
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  const { 
    sortedListings, 
    sortBy,
    setSortBy
  } = useListingsFilter();
  
  // Calculate count from listings array
  const count = sortedListings ? sortedListings.length : 0;
  const isLoading = false; // Set appropriate loading state if needed
  
  const handleSearch = (newQuery: string) => {
    const updatedParams = new URLSearchParams(searchParams);
    updatedParams.set("q", newQuery);
    setSearchParams(updatedParams);
  };
  
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <SearchHeader 
              resultCount={count}
              keyword={query}
              viewMode={viewMode}
              setViewMode={setViewMode}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />
          </div>
          
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <SearchFilters 
                isExpanded={true} 
                onToggleExpand={() => {}} 
              />
            </div>
            
            <div className="lg:col-span-3">
              <SearchResults 
                listings={sortedListings}
                viewMode={viewMode}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SearchPage;
