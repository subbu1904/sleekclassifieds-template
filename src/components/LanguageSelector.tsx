
import { useLanguage } from '@/providers/LanguageProvider';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Globe } from 'lucide-react';

const languageNames: Record<string, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français'
};

export const LanguageSelector = () => {
  const { language, setLanguage, availableLanguages } = useLanguage();

  return (
    <div className="flex items-center">
      <Select value={language} onValueChange={(value) => setLanguage(value as any)}>
        <SelectTrigger className="w-[140px]">
          <div className="flex items-center">
            <Globe className="mr-2 h-4 w-4" />
            <SelectValue placeholder={languageNames[language]} />
          </div>
        </SelectTrigger>
        <SelectContent>
          {availableLanguages.map((lang) => (
            <SelectItem key={lang} value={lang}>
              {languageNames[lang]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
