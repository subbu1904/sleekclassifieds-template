
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/providers/LanguageProvider";

interface Subcategory {
  id: string;
  name: string;
  parent_id: string;
}

interface BasicDetailsFormProps {
  categories: string[];
}

export const BasicDetailsForm = ({ categories }: BasicDetailsFormProps) => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState<Subcategory[]>([]);
  
  useEffect(() => {
    // Load subcategories from localStorage
    const storedSubcategories = localStorage.getItem("subcategories");
    if (storedSubcategories) {
      setSubcategories(JSON.parse(storedSubcategories));
    }
  }, []);
  
  useEffect(() => {
    // Filter subcategories based on selected category
    if (selectedCategory) {
      const filtered = subcategories.filter(sub => sub.parent_id === selectedCategory);
      setFilteredSubcategories(filtered);
    } else {
      setFilteredSubcategories([]);
    }
  }, [selectedCategory, subcategories]);

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="title">{t('createListing', 'listingTitle')}</Label>
        <Input 
          id="title" 
          name="title" 
          placeholder={t('createListing', 'titlePlaceholder')} 
          required 
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">{t('listings', 'category')}</Label>
          <Select 
            name="category" 
            required 
            value={selectedCategory} 
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('createListing', 'selectCategory')} />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {selectedCategory && filteredSubcategories.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="subcategory">{t('listings', 'subcategory')}</Label>
            <Select name="subcategory">
              <SelectTrigger>
                <SelectValue placeholder={t('listings', 'selectSubcategory')} />
              </SelectTrigger>
              <SelectContent>
                {filteredSubcategories.map((subcategory) => (
                  <SelectItem key={subcategory.id} value={subcategory.id}>
                    {subcategory.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="price">{t('listings', 'price')} ($)</Label>
          <Input 
            id="price" 
            name="price" 
            type="number" 
            min="0" 
            step="0.01" 
            placeholder="0.00" 
            required 
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>{t('createListing', 'itemCondition')}</Label>
        <RadioGroup name="condition" defaultValue="used" className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="new" id="new" />
            <Label htmlFor="new">{t('createListing', 'new')}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="like-new" id="like-new" />
            <Label htmlFor="like-new">{t('createListing', 'likeNew')}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="used" id="used" />
            <Label htmlFor="used">{t('createListing', 'used')}</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">{t('listings', 'description')}</Label>
        <Textarea 
          id="description" 
          name="description" 
          placeholder={t('createListing', 'descriptionPlaceholder')} 
          className="min-h-32" 
          required 
        />
      </div>
    </>
  );
};
