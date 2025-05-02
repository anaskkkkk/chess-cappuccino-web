
// Translation hooks and utilities

import { useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";
import { translations } from './registry';
import { TranslationKey } from './types';

// Hook for using translations
export const useTranslation = (language: string) => {
  const t = (key: TranslationKey): string => {
    const lang = language in translations ? language : 'en';
    return translations[lang][key] || translations.en[key] || key;
  };

  return { t };
};

// Function to fetch translations from remote server
export const fetchRemoteTranslations = async (
  language: string,
  keys: string[]
): Promise<Record<string, string>> => {
  try {
    // Make API call to fetch translations
    const response = await fetch('/api/translations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language,
        keys,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch translations');
    }

    const data = await response.json();
    return data.translations;
  } catch (error) {
    console.error('Error fetching translations:', error);
    return {};
  }
};

// Function to update translations dynamically
export const updateTranslations = async (language: string): Promise<void> => {
  try {
    // Get all English keys
    const englishKeys = Object.keys(translations.en);
    
    // Fetch translations for these keys
    const remoteTranslations = await fetchRemoteTranslations(language, englishKeys);
    
    // Update the translations object with new values
    if (Object.keys(remoteTranslations).length > 0) {
      // Create language section if it doesn't exist
      if (!translations[language]) {
        translations[language] = { ...translations.en };
      }
      
      // Update with fetched translations
      Object.keys(remoteTranslations).forEach(key => {
        if (key in translations.en) {
          translations[language][key] = remoteTranslations[key];
        }
      });
    }
  } catch (error) {
    console.error('Failed to update translations:', error);
  }
};
