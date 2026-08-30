import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useLanguage();

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50">
      <div 
        className={`transition-all duration-500 ease-in-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
      >
        <button
          onClick={scrollToTop}
          className="bg-white/70 backdrop-blur-md text-primary border-2 border-primary p-2 md:p-2.5 rounded-full shadow-sm hover:shadow-md hover:bg-primary/10 transition-all duration-300 group flex items-center justify-center cursor-pointer"
          aria-label={t('back_to_top', 'Back to top')}
        >
          <ArrowUp size={20} strokeWidth={2.5} className="group-hover:-translate-y-1 transition-transform duration-300" />
        </button>
      </div>
    </div>
  );
};

export default BackToTop;
