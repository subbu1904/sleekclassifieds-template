
import { en } from './en';
import { es } from './es';
import { fr } from './fr';

export const translations = {
  en,
  es,
  fr
};

export type SupportedLanguage = keyof typeof translations;
export type TranslationKey = keyof typeof en;
