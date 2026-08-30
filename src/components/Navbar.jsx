import { useState } from 'react';
import { Menu, X, Landmark, Globe } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();

  const navLinksBefore = [
    { name: t('nav_home', 'Home'), path: '/' },
    { name: t('nav_register', 'Register Complaint'), path: '/register' },
    { name: t('nav_track', 'Track Complaint'), path: '/track' },
  ];

  const navLinksAfter = [
    { name: t('nav_contact', 'Contact Office'), path: '/contact' },
    { name: t('nav_faq', 'Help / FAQ'), path: '/faq' },
  ];

  return (
    <nav className="navbar sticky top-0 z-50 w-full bg-secondary shadow-sm overflow-hidden md:overflow-visible transition-all duration-300">
      <div className="w-full px-2.5 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 md:h-16 items-center">

          {/* Logo Section */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-3 min-w-0">
            <img
              src="/TVK_Logo.png"
              alt="TN Govt Logo"
              className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 object-contain shrink-0"
            />
            <div className="flex flex-col min-w-0">
              <span className="mla-title text-primary font-bold text-sm sm:text-base md:text-xl lg:text-2xl leading-tight mt-0.5 md:mt-1 truncate">
                {t('mla_name', 'C. Arul Vignesh')} <span className="text-[10px] sm:text-xs md:text-sm font-semibold">{t('mla_qualification', 'M.Sc.,MLA')}</span>
              </span>
              <span className="mla-subtitle text-primary text-[10px] sm:text-xs md:text-sm font-medium truncate">
                {t('mla_designation', 'Kallakurichi Member of Legislative Assembly')}
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="navbar-nav hidden lg:flex items-center space-x-8">
            {navLinksBefore.map((link, index) => (
              <Link
                key={index}
                to={link.path}
                className={`nav-link text-sm font-semibold transition whitespace-nowrap ${location.pathname === link.path
                    ? 'text-primary border-b-2 border-primary pb-1'
                    : 'text-primary/80 hover:text-primary'
                  }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Instant Language Switcher between Track Complaint and Contact Office */}
            <div className="lang-toggle-container flex items-center bg-primary/10 hover:bg-primary/15 border border-primary/25 rounded-full p-0.5 shadow-xs transition notranslate shrink-0">
              <button
                type="button"
                onClick={() => setLanguage('ta')}
                title="தமிழுக்கு மாற்றவும்"
                aria-label="Switch to Tamil"
                className={`lang-switch-btn px-2.5 py-1 text-xs font-bold rounded-full transition-all duration-200 cursor-pointer ${language === 'ta'
                    ? 'bg-primary text-secondary shadow-sm font-bold scale-100'
                    : 'text-primary/80 hover:text-primary hover:bg-primary/10'
                  }`}
              >
                தமிழ்
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                title="Switch to English"
                aria-label="Switch to English"
                className={`lang-switch-btn px-2.5 py-1 text-xs font-bold rounded-full transition-all duration-200 cursor-pointer ${language === 'en'
                    ? 'bg-primary text-secondary shadow-sm font-bold scale-100'
                    : 'text-primary/80 hover:text-primary hover:bg-primary/10'
                  }`}
              >
                ENG
              </button>
            </div>

            {navLinksAfter.map((link, index) => (
              <Link
                key={index}
                to={link.path}
                className={`nav-link text-sm font-semibold transition whitespace-nowrap ${location.pathname === link.path
                    ? 'text-primary border-b-2 border-primary pb-1'
                    : 'text-primary/80 hover:text-primary'
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-primary hover:text-secondary focus:outline-none cursor-pointer p-1"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div className={`fixed inset-0 z-[60] flex justify-end transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div
          className="fixed inset-0 bg-gray-900/10 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>

        {/* Sidebar */}
        <div className={`relative flex flex-col max-w-[280px] w-full h-full bg-secondary shadow-2xl transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>

          <div className="px-5 pt-6 pb-6 flex items-center justify-between border-b border-primary/20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-secondary">
                <Landmark size={20} strokeWidth={2} />
              </div>
              <div className="flex flex-col">
                <span className="text-primary font-bold text-lg leading-tight mt-1 uppercase">
                  {t('constituency', 'Kallakurichi')}
                </span>
              </div>
            </div>
            {/* Modern Close Button Inside Sidebar */}
            <button
              className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-secondary transition-colors focus:outline-none cursor-pointer"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <nav className="px-4 space-y-2">
              {navLinksBefore.map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  className="group flex items-center px-3 py-3 text-base font-semibold text-primary rounded-md hover:bg-primary hover:text-secondary transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

              {/* Language Switcher between Track Complaint and Contact Office in Mobile menu */}
              <div className="my-3 px-3 py-2.5 bg-primary/10 rounded-lg border border-primary/20 notranslate">
                <div className="text-[11px] font-semibold text-primary/70 mb-1.5 flex items-center gap-1.5">
                  <Globe size={13} />
                  <span>{t('language_label', 'Language')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setLanguage('ta');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-md text-center transition cursor-pointer ${language === 'ta'
                        ? 'bg-primary text-secondary shadow-sm font-bold'
                        : 'bg-primary/10 text-primary hover:bg-primary/20'
                      }`}
                  >
                    தமிழ்
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLanguage('en');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-md text-center transition cursor-pointer ${language === 'en'
                        ? 'bg-primary text-secondary shadow-sm font-bold'
                        : 'bg-primary/10 text-primary hover:bg-primary/20'
                      }`}
                  >
                    ENG
                  </button>
                </div>
              </div>

              {navLinksAfter.map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  className="group flex items-center px-3 py-3 text-base font-semibold text-primary rounded-md hover:bg-primary hover:text-secondary transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
