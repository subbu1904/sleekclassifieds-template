
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

// Define proper types for our listings and filters
export interface Listing {
  id: string;
  title: string;
  description?: string;
  price: string;
  category: string;
  location: string;
  condition: string;
  images?: string[];
  createdAt: string;
}

export interface FilterParams {
  keyword: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  location: string;
  condition: string;
  withImages: boolean;
}

export interface SearchFiltersSubmit {
  searchQuery: string;
  category: string;
  priceRange: number[];
  location: string;
  condition: string;
  withImages: boolean;
}

export const useListingsFilter = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<string>("newest");
  
  // Extract search parameters
  const filters: FilterParams = {
    keyword: searchParams.get("q") || "",
    category: searchParams.get("category") || "",
    minPrice: Number(searchParams.get("minPrice") || 0),
    maxPrice: Number(searchParams.get("maxPrice") || Infinity),
    location: searchParams.get("location") || "",
    condition: searchParams.get("condition") || "",
    withImages: searchParams.get("withImages") === "true",
  };
  
  // Get all listings from localStorage
  const allListings: Listing[] = JSON.parse(localStorage.getItem("listings") || "[]");
  
  // Filter listings based on search criteria
  const filteredListings = allListings.filter((listing: Listing) => {
    // Keyword search (title and description)
    if (filters.keyword && !listing.title.toLowerCase().includes(filters.keyword.toLowerCase()) && 
        !listing.description?.toLowerCase().includes(filters.keyword.toLowerCase())) {
      return false;
    }
    
    // Category filter
    if (filters.category && listing.category !== filters.category) {
      return false;
    }
    
    // Price range filter
    const price = parseFloat(listing.price);
    if ((filters.minPrice > 0 && price < filters.minPrice) || 
        (filters.maxPrice < Infinity && price > filters.maxPrice)) {
      return false;
    }
    
    // Location filter
    if (filters.location && !listing.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }
    
    // Condition filter
    if (filters.condition && listing.condition !== filters.condition) {
      return false;
    }
    
    // With images filter
    if (filters.withImages && (!listing.images || listing.images.length === 0)) {
      return false;
    }
    
    return true;
  });
  
  // Sort listings
  const sortedListings = [...filteredListings].sort((a: Listing, b: Listing) => {
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
  
  const handleSearch = (filters: SearchFiltersSubmit) => {
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
  
  return {
    filters,
    sortedListings,
    viewMode,
    setViewMode,
    sortBy,
    setSortBy,
    handleSearch,
  };
};
