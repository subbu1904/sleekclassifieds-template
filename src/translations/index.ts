
import { en } from './en';
import { hi } from './hi';
import { bn } from './bn';
import { ta } from './ta';

export const translations = {
  en,
  hi,
  bn,
  ta
};

export type SupportedLanguage = keyof typeof translations;
export type TranslationKey = keyof typeof en;
