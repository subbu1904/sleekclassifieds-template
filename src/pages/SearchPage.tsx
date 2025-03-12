
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { SearchFilters } from "@/components/SearchFilters";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, GridIcon, List } from "lucide-react";
import { FavoriteButton } from "@/components/FavoriteButton";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
    if (filters.keyword) params.append("q", filters.keyword);
    if (filters.category) params.append("category", filters.category);
    if (filters.minPrice > 0) params.append("minPrice", filters.minPrice.toString());
    if (filters.maxPrice < 10000) params.append("maxPrice", filters.maxPrice.toString());
    if (filters.location) params.append("location", filters.location);
    if (filters.condition) params.append("condition", filters.condition);
    if (filters.withImages) params.append("withImages", "true");
    
    navigate(`/search?${params.toString()}`);
  };
  
  return (
    <div className="min-h-screen pb-12">
      <Navigation />
      <main className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SearchFilters 
          onSearch={handleSearch}
          isExpanded={isFilterExpanded}
          onToggleExpand={() => setIsFilterExpanded(!isFilterExpanded)}
        />
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold">
            {filteredListings.length} {filteredListings.length === 1 ? 'Result' : 'Results'}
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
        
        {sortedListings.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">No results found</h2>
            <p className="text-gray-500 mb-6">
              Try adjusting your search filters
            </p>
            <Button onClick={() => navigate("/")}>
              Back to Home
            </Button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedListings.map((listing: any) => (
              <Card key={listing.id} className="overflow-hidden card-hover cursor-pointer" 
                    onClick={() => navigate(`/listing/${listing.id}`)}>
                <CardContent className="p-0 relative">
                  {listing.images && listing.images[0] ? (
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      <p className="text-gray-500">No image</p>
                    </div>
                  )}
                  <FavoriteButton listingId={listing.id} />
                  <div className="p-4">
                    <Badge className="mb-2">{listing.category}</Badge>
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                      {listing.title}
                    </h3>
                    <p className="text-2xl font-bold text-primary">${listing.price}</p>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <div className="flex items-center text-gray-500 text-sm">
                    <MapPin className="h-4 w-4 mr-1" />
                    {listing.location}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {sortedListings.map((listing: any) => (
              <Card key={listing.id} className="cursor-pointer overflow-hidden" 
                    onClick={() => navigate(`/listing/${listing.id}`)}>
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-1/4 h-48 md:h-auto relative">
                    {listing.images && listing.images[0] ? (
                      <img
                        src={listing.images[0]}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <p className="text-gray-500">No image</p>
                      </div>
                    )}
                    <FavoriteButton listingId={listing.id} className="absolute top-2 right-2" />
                  </div>
                  <div className="p-4 flex-1">
                    <div className="flex justify-between">
                      <Badge className="mb-2">{listing.category}</Badge>
                      <span className="text-gray-500 text-sm">
                        {new Date(listing.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="font-semibold text-xl mb-2">{listing.title}</h3>
                    <p className="text-gray-600 mb-2 line-clamp-2">{listing.description}</p>
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center text-gray-500 text-sm">
                        <MapPin className="h-4 w-4 mr-1" />
                        {listing.location}
                      </div>
                      <p className="text-2xl font-bold text-primary">${listing.price}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default SearchPage;
