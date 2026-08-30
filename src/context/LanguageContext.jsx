import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../translations/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    // Check localStorage first
    const saved = localStorage.getItem('language');
    if (saved === 'ta' || saved === 'en') {
      return saved;
    }
    // Fallback: check cookie if set previously
    const match = document.cookie.match(/googtrans=\/en\/(ta|en)/);
    if (match && match[1]) {
      return match[1];
    }
    return 'en';
  });

  const setLanguage = (lang) => {
    if (lang !== 'ta' && lang !== 'en') return;
    setLanguageState(lang);
    try {
      localStorage.setItem('language', lang);
      document.documentElement.lang = lang;
    } catch (e) {
      console.error('Error saving language setting:', e);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'ta' ? 'en' : 'ta');
  };

  const t = (key, fallback = '') => {
    if (!key) return '';
    const currentDict = translations[language] || translations.en;
    if (currentDict && currentDict[key] !== undefined) {
      return currentDict[key];
    }
    // Fallback to English dictionary if key missing in current language
    if (translations.en && translations.en[key] !== undefined) {
      return translations.en[key];
    }
    return fallback || key;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
