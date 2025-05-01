
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation, TranslationKey } from '../utils/translations';

export type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  changeLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  isRTL: boolean;
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
  
  const { t } = useTranslation(language);
  
  const isRTL = language === 'ar';

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

  const toggleLanguage = () => {
    setLanguage(prevLang => prevLang === 'en' ? 'ar' : 'en');
  };

  const changeLanguage = (newLang: Language) => {
    setLanguage(newLang);
  };
  
  const contextValue: LanguageContextType = {
    language,
    toggleLanguage,
    changeLanguage,
    t,
    isRTL
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
