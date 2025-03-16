
import { LocationSubcategory } from "./types";
import { toast } from "sonner";

export const loadLocationsFromStorage = (): string[] => {
  const storedLocations = localStorage.getItem("locations");
  
  if (storedLocations) {
    return JSON.parse(storedLocations);
  } else {
    // Default locations (Indian cities)
    const defaultLocations = [
      "Mumbai",
      "Delhi",
      "Bengaluru",
      "Chennai",
      "Kolkata",
      "Hyderabad",
      "Pune",
      "Ahmedabad",
      "Jaipur"
    ];
    localStorage.setItem("locations", JSON.stringify(defaultLocations));
    return defaultLocations;
  }
};

export const loadSublocationsFromStorage = (): LocationSubcategory[] => {
  const storedLocationSubcategories = localStorage.getItem("locationSubcategories");
  
  if (storedLocationSubcategories) {
    return JSON.parse(storedLocationSubcategories);
  } else {
    localStorage.setItem("locationSubcategories", JSON.stringify([]));
    return [];
  }
};

export const saveLocationsToStorage = (locations: string[]): void => {
  localStorage.setItem("locations", JSON.stringify(locations));
};

export const saveSublocationsToStorage = (sublocations: LocationSubcategory[]): void => {
  localStorage.setItem("locationSubcategories", JSON.stringify(sublocations));
};

export const hasSublocations = (locationName: string, sublocations: LocationSubcategory[]): boolean => {
  return sublocations.some(sub => sub.parent_id === locationName);
};

export const updateParentReferences = (
  oldName: string, 
  newName: string, 
  sublocations: LocationSubcategory[]
): LocationSubcategory[] => {
  return sublocations.map(sub => {
    if (sub.parent_id === oldName) {
      return { ...sub, parent_id: newName };
    }
    return sub;
  });
};
