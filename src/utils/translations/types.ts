
// Types and interfaces for the translation system

export type TranslationKey = string;

export interface TranslationRecord {
  [key: string]: string; // Only accepts string values
}

// Empty base translations object to be extended by language files
export const translations = {};

export type Translations = Record<string, string>;
