
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation, TranslationKey, updateTranslations } from '../utils/translations';
import { toast } from "@/components/ui/use-toast";

export type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  changeLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  isRTL: boolean;
  isUpdatingTranslations: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Try to get language from localStorage or use browser language
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && ['en', 'ar'].includes(savedLang)) {
      return savedLang;
    }
    const browserLang = navigator.language.split('-')[0];
    return browserLang === 'ar' ? 'ar' : 'en';
  });
  
  const [isUpdatingTranslations, setIsUpdatingTranslations] = useState(false);
  const { t } = useTranslation(language);
  const isRTL = language === 'ar';

  // Update document direction when language changes
  useEffect(() => {
    // Save language to localStorage when it changes
    localStorage.setItem('language', language);
    
    // Update document direction and lang attributes
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    
    // Add a class to the body for RTL-specific styling
    if (isRTL) {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  }, [language, isRTL]);

  // Fetch remote translations when language changes (except for English which is the default)
  const fetchAndUpdateTranslations = async (newLang: Language) => {
    if (newLang === 'en') return; // Skip for English
    
    setIsUpdatingTranslations(true);
    try {
      // Update translations from remote server
      await updateTranslations(newLang);
      toast({
        title: "Language Updated",
        description: "Translations have been updated successfully.",
      });
    } catch (error) {
      console.error('Failed to update translations:', error);
      toast({
        title: "Translation Error",
        description: "Failed to update translations. Using cached versions.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingTranslations(false);
    }
  };

  const toggleLanguage = async () => {
    const newLang = language === 'en' ? 'ar' : 'en';
    setLanguage(newLang);
    
    // Fetch translations for the new language
    await fetchAndUpdateTranslations(newLang);
  };

  const changeLanguage = async (newLang: Language) => {
    if (newLang !== language) {
      setLanguage(newLang);
      
      // Fetch translations for the new language
      await fetchAndUpdateTranslations(newLang);
    }
  };
  
  const contextValue: LanguageContextType = {
    language,
    toggleLanguage,
    changeLanguage,
    t,
    isRTL,
    isUpdatingTranslations
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguageContext = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguageContext must be used within a LanguageProvider');
  }
  return context;
};
