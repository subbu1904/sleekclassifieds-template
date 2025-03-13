
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { SearchFilters } from "@/components/SearchFilters";
import { SearchHeader } from "@/components/search/SearchHeader";
import { SearchResults } from "@/components/search/SearchResults";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<string>("newest");
  
  // Get all listings from localStorage
  const allListings = JSON.parse(localStorage.getItem("listings") || "[]");
  
  // Get search parameters
  const keyword = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const minPrice = Number(searchParams.get("minPrice") || 0);
  const maxPrice = Number(searchParams.get("maxPrice") || Infinity);
  const location = searchParams.get("location") || "";
  const condition = searchParams.get("condition") || "";
  const withImages = searchParams.get("withImages") === "true";
  
  // Filter listings based on search criteria
  const filteredListings = allListings.filter((listing: any) => {
    // Keyword search (title and description)
    if (keyword && !listing.title.toLowerCase().includes(keyword.toLowerCase()) && 
        !listing.description?.toLowerCase().includes(keyword.toLowerCase())) {
      return false;
    }
    
    // Category filter
    if (category && listing.category !== category) {
      return false;
    }
    
    // Price range filter
    const price = parseFloat(listing.price);
    if ((minPrice > 0 && price < minPrice) || (maxPrice < Infinity && price > maxPrice)) {
      return false;
    }
    
    // Location filter
    if (location && !listing.location.toLowerCase().includes(location.toLowerCase())) {
      return false;
    }
    
    // Condition filter
    if (condition && listing.condition !== condition) {
      return false;
    }
    
    // With images filter
    if (withImages && (!listing.images || listing.images.length === 0)) {
      return false;
    }
    
    return true;
  });
  
  // Sort listings
  const sortedListings = [...filteredListings].sort((a: any, b: any) => {
    switch(sortBy) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "priceAsc":
        return parseFloat(a.price) - parseFloat(b.price);
      case "priceDesc":
        return parseFloat(b.price) - parseFloat(a.price);
      default:
        return 0;
    }
  });
  
  const handleSearch = (filters: any) => {
    const params = new URLSearchParams();
    if (filters.searchQuery) params.append("q", filters.searchQuery);
    if (filters.category !== "all") params.append("category", filters.category);
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) {
      params.append("minPrice", filters.priceRange[0].toString());
      params.append("maxPrice", filters.priceRange[1].toString());
    }
    if (filters.location) params.append("location", filters.location);
    if (filters.condition !== "any") params.append("condition", filters.condition);
    if (filters.withImages) params.append("withImages", "true");
    
    navigate(`/search?${params.toString()}`);
  };
  
  return (
    <div className="min-h-screen pb-12">
      <Navigation />
      <main className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SearchFilters 
          isExpanded={isFilterExpanded}
          onToggleExpand={() => setIsFilterExpanded(!isFilterExpanded)}
          onSearch={handleSearch}
        />
        
        <SearchHeader 
          resultCount={filteredListings.length}
          keyword={keyword}
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
    </div>
  );
};

export default SearchPage;
