
// Types and interfaces for the translation system

export type TranslationKey = string;

export interface TranslationRecord {
  [key: string]: string; // Only accepts string values
}

export interface Translations {
  [key: string]: TranslationRecord;
}

// Empty base translations object to be extended by language files
export const translations: Translations = {};
