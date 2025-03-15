
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Globe } from "lucide-react";
import { useLanguage } from "@/providers/LanguageProvider";
import { useState } from "react";
import { toast } from "sonner";

interface TranslationToggleProps {
  onToggle: (enabled: boolean) => void;
  initialState?: boolean;
  className?: string;
}

export const TranslationToggle = ({ 
  onToggle, 
  initialState = false,
  className = ""
}: TranslationToggleProps) => {
  const { t, language } = useLanguage();
  const [isEnabled, setIsEnabled] = useState(initialState);
  
  const handleToggle = () => {
    const newState = !isEnabled;
    setIsEnabled(newState);
    onToggle(newState);
    
    if (newState) {
      toast.success(t('translation', 'enabled'));
    } else {
      toast.info(t('translation', 'disabled'));
    }
  };
  
  // If user is already viewing in their native language, disable the toggle
  const isNativeLanguage = language === 'en'; // Assuming English is the original content language
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Globe className="h-4 w-4 text-primary" />
      <span className="text-sm">{t('translation', 'autoTranslate')}</span>
      <Switch 
        checked={isEnabled}
        onCheckedChange={handleToggle}
        disabled={isNativeLanguage}
      />
    </div>
  );
};
