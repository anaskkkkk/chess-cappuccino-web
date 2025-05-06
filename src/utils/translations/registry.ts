
// Registry of all translations

import { translations as baseTranslations } from './types';
import enTranslations from './en';
import arTranslations from './ar';

// Register all translations
export const translations = {
  ...baseTranslations,
  en: enTranslations,
  ar: arTranslations
};

// Export the keys type
export type TranslationKey = keyof typeof enTranslations;
