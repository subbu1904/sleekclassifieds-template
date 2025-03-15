
import { en } from './en';
import { hi } from './hi';
import { bn } from './bn';
import { ta } from './ta';
import { es } from './es';
import { fr } from './fr';

export const translations = {
  en,
  hi,
  bn,
  ta,
  es,
  fr
};

export type SupportedLanguage = keyof typeof translations;
export type TranslationKey = keyof typeof en;
