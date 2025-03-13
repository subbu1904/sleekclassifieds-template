
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, SupportedLanguage } from '@/translations';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (section: string, key: string, replacements?: Record<string, string>) => string;
  availableLanguages: SupportedLanguage[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    const savedLanguage = localStorage.getItem('language') as SupportedLanguage;
    const browserLanguage = navigator.language.split('-')[0] as SupportedLanguage;
    
    // Check if the browser language is supported, otherwise default to English
    if (savedLanguage && Object.keys(translations).includes(savedLanguage)) {
      return savedLanguage;
    } else if (Object.keys(translations).includes(browserLanguage)) {
      return browserLanguage;
    }
    return 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
  };

  const t = (section: string, key: string, replacements?: Record<string, string>): string => {
    try {
      const currentTranslations = translations[language];
      let translation = currentTranslations[section]?.[key] || `${section}.${key}`;
      
      // Handle replacements
      if (replacements) {
        Object.entries(replacements).forEach(([key, value]) => {
          translation = translation.replace(`{${key}}`, value);
        });
      }
      
      return translation;
    } catch (error) {
      console.error(`Translation error for ${section}.${key}:`, error);
      return `${section}.${key}`;
    }
  };

  const availableLanguages: SupportedLanguage[] = Object.keys(translations) as SupportedLanguage[];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, availableLanguages }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
