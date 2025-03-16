
import { useState, useEffect } from "react";
import { Car, Home, Camera, Laptop, ShoppingBag, Brush, Book, Music, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/providers/LanguageProvider";
import { supabase } from "@/integrations/supabase/client";

// Type definitions for our category structure
interface Subcategory {
  id: string;
  name: string;
  parent_id: string;
}

interface Category {
  name: string;
  icon: React.ElementType;
  subcategories: Subcategory[];
  isExpanded?: boolean;
}

export const Categories = () => {
  const { t } = useLanguage();
  const [categories, setCategories] = useState<Category[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // Map category names to icon components
  const iconMap: Record<string, React.ElementType> = {
    "vehicles": Car,
    "realEstate": Home,
    "electronics": Laptop,
    "fashion": ShoppingBag,
    "art": Brush,
    "books": Book,
    "music": Music,
    "photography": Camera,
  };

  useEffect(() => {
    // Load categories and subcategories from localStorage or default values
    const loadCategories = async () => {
      // First try to load from localStorage
      const storedCategories = localStorage.getItem("categories");
      const storedSubcategories = localStorage.getItem("subcategories");
      
      let categoryList: string[] = [];
      let subcategoryList: Subcategory[] = [];
      
      if (storedCategories) {
        categoryList = JSON.parse(storedCategories);
      } else {
        // Default categories
        categoryList = [
          t('categories', 'vehicles'),
          t('categories', 'realEstate'),
          t('categories', 'electronics'),
          t('categories', 'fashion'),
          t('categories', 'art'),
          t('categories', 'books'),
          t('categories', 'music'),
          t('categories', 'photography'),
        ];
        localStorage.setItem("categories", JSON.stringify(categoryList));
      }
      
      if (storedSubcategories) {
        subcategoryList = JSON.parse(storedSubcategories);
      } else {
        // No subcategories yet
        localStorage.setItem("subcategories", JSON.stringify([]));
      }
      
      // Transform into our category structure with subcategories
      const formattedCategories = categoryList.map(categoryName => {
        const relatedSubcategories = subcategoryList.filter(sub => sub.parent_id === categoryName);
        return {
          name: categoryName,
          icon: iconMap[categoryName.toLowerCase()] || Camera, // Default to Camera if no matching icon
          subcategories: relatedSubcategories
        };
      });
      
      setCategories(formattedCategories);
    };
    
    loadCategories();
  }, [t]);

  const toggleCategory = (categoryName: string) => {
    if (expandedCategory === categoryName) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(categoryName);
    }
  };

  return (
    <div className="w-full py-8">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl font-semibold mb-6">{t('categories', 'browseCategories')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category) => (
            <div key={category.name} className="flex flex-col">
              <a
                href={`/category/${category.name.toLowerCase()}`}
                className={cn(
                  "flex flex-col items-center p-4 rounded-xl card-hover",
                  "bg-white border border-gray-100",
                  "hover:border-primary/20"
                )}
                onClick={(e) => {
                  if (category.subcategories && category.subcategories.length > 0) {
                    e.preventDefault();
                    toggleCategory(category.name);
                  }
                }}
              >
                <category.icon className="h-8 w-8 text-primary mb-2" />
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium">{category.name}</span>
                  {category.subcategories && category.subcategories.length > 0 && (
                    expandedCategory === category.name ? 
                    <ChevronDown className="h-4 w-4" /> : 
                    <ChevronRight className="h-4 w-4" />
                  )}
                </div>
              </a>
              
              {expandedCategory === category.name && category.subcategories && category.subcategories.length > 0 && (
                <div className="mt-2 ml-4 bg-white border border-gray-100 rounded-lg p-2">
                  {category.subcategories.map((subcategory) => (
                    <a 
                      key={subcategory.id}
                      href={`/category/${category.name.toLowerCase()}/${subcategory.name.toLowerCase()}`}
                      className="block py-1 px-2 text-sm hover:bg-gray-50 rounded"
                    >
                      {subcategory.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
