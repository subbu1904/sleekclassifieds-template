
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { SearchFilters } from "@/components/SearchFilters";
import { SearchHeader } from "@/components/search/SearchHeader";
import { SearchResults } from "@/components/search/SearchResults";
import { useListingsFilter } from "@/hooks/useListingsFilter";
import { Footer } from "@/components/Footer";

const SearchPage = () => {
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  
  const {
    filters,
    sortedListings,
    viewMode,
    setViewMode,
    sortBy,
    setSortBy,
    handleSearch
  } = useListingsFilter();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-grow">
        <SearchFilters 
          isExpanded={isFilterExpanded}
          onToggleExpand={() => setIsFilterExpanded(!isFilterExpanded)}
          onSearch={handleSearch}
        />
        
        <SearchHeader 
          resultCount={sortedListings.length}
          keyword={filters.keyword}
          viewMode={viewMode}
          setViewMode={setViewMode}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
        
        <SearchResults 
          listings={sortedListings} 
          viewMode={viewMode} 
        />
      </main>
      <Footer />
    </div>
  );
};

export default SearchPage;
