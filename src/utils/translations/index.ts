
// Main exports for the translation system

// Export types properly
export type { TranslationRecord, Translations } from './types';
// Export values
export { translations } from './registry';
export type { TranslationKey } from './registry';
export * from './hooks';
export { enTranslations } from './en';
export { arTranslations } from './ar';
