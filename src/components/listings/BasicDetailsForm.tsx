
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/providers/LanguageProvider";

interface BasicDetailsFormProps {
  categories: string[];
}

export const BasicDetailsForm = ({ categories }: BasicDetailsFormProps) => {
  const { t } = useLanguage();
  
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
          <Select name="category" required>
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
