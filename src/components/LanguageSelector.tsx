
import { useState, useEffect } from "react";
import { useLanguage } from "@/providers/LanguageProvider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe } from "lucide-react";

export const LanguageSelector = () => {
  const { language, setLanguage, availableLanguages } = useLanguage();
  const [mounted, setMounted] = useState(false);

  // Ensure hydration matches the server
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const languageNames: Record<string, string> = {
    en: "English",
    es: "Español",
    fr: "Français",
  };

  return (
    <Select
      value={language}
      onValueChange={(value) => {
        if (value in languageNames) {
          setLanguage(value as any);
        }
      }}
    >
      <SelectTrigger className="w-[90px] bg-transparent">
        <SelectValue placeholder={<Globe size={18} />}>
          <div className="flex items-center gap-2">
            <Globe size={16} />
            <span className="hidden sm:inline">
              {language.toUpperCase()}
            </span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {availableLanguages.map((lang) => (
          <SelectItem key={lang} value={lang}>
            {languageNames[lang] || lang.toUpperCase()}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
