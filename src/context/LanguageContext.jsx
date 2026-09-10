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
    
    // Check underscore format if dot was passed (e.g. track.title -> track_title)
    const underscoreKey = key.replace(/\./g, '_');
    if (currentDict && currentDict[underscoreKey] !== undefined) {
      return currentDict[underscoreKey];
    }

    // Check specific prompt alias mappings
    const keyMap = {
      'track.placeholder.complaintId': 'track_ph_id',
      'track.helper.findId': 'track_helper_find_id',
      'track.error.invalidId': 'track_err_invalid_id',
      'track.error.notFound': 'track_err_not_found',
      'track.status.queuedMessage': 'track_status_queued_message',
      'track.status.submitted': 'track_status_submitted',
      'track.status.underReview': 'track_status_under_review',
      'track.status.assigned': 'track_status_assigned',
      'track.status.actionTaken': 'track_status_action_taken',
      'track.status.resolved': 'track_status_resolved',
      'track.status.rejected': 'track_status_rejected',
    };

    if (keyMap[key] && currentDict && currentDict[keyMap[key]] !== undefined) {
      return currentDict[keyMap[key]];
    }

    // Fallback to English dictionary if key missing in current language
    if (translations.en) {
      if (translations.en[key] !== undefined) return translations.en[key];
      if (translations.en[underscoreKey] !== undefined) return translations.en[underscoreKey];
      if (keyMap[key] && translations.en[keyMap[key]] !== undefined) return translations.en[keyMap[key]];
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
