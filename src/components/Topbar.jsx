import { MapPin, Phone, Mail } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Topbar = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="bg-primary text-white text-[10px] md:text-xs py-1.5 md:py-2 px-4 md:px-8 flex justify-between items-center">
      <div className="flex items-center space-x-1 md:space-x-2">
        <MapPin size={12} className="md:w-3.5 md:h-3.5" />
        <span className="font-medium">{t('topbar_location', 'Kallakurichi Office')}</span>
      </div>
      
      <div className="flex items-center space-x-4 md:space-x-6">
        <div className="flex items-center space-x-1 md:space-x-2">
          <Phone size={12} className="md:w-3.5 md:h-3.5" />
          <span className="font-medium">+91 98765 43210</span>
        </div>
        
        <div className="hidden sm:flex items-center space-x-2">
          <Mail size={12} className="md:w-3.5 md:h-3.5" />
          <span className="font-medium">kallakurichioffice@gmail.com</span>
        </div>
        
        {/* Language Switcher */}
        <div className="flex items-center space-x-2 text-[9px] md:text-xs notranslate">
          <button 
            type="button"
            onClick={() => setLanguage('ta')}
            aria-label="Switch to Tamil"
            className={`px-2 py-1 md:px-4 md:py-1.5 rounded transition cursor-pointer ${language === 'ta' ? 'bg-white text-primary font-bold shadow-xs' : 'border border-white/40 text-white hover:bg-white/20'}`}
          >
            தமிழ்
          </button>
          <button 
            type="button"
            onClick={() => setLanguage('en')}
            aria-label="Switch to English"
            className={`px-2 py-1 md:px-4 md:py-1.5 rounded transition cursor-pointer ${language === 'en' ? 'bg-white text-primary font-bold shadow-xs' : 'border border-white/40 text-white hover:bg-white/20'}`}
          >
            ENG
          </button>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
