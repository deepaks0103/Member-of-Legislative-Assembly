import React, { useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  Clock, 
  Calendar, 
  Phone, 
  PhoneCall, 
  Mail, 
  Navigation, 
  ExternalLink, 
  FileText, 
  Search, 
  HelpCircle, 
  Info, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MobileNav from '../components/MobileNav';
import { useLanguage } from '../context/LanguageContext';

const ContactOffice = () => {
  const { language, t } = useLanguage();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // District Collector Office Coordinates & Map Embed URL
  const officeLat = 11.7387;
  const officeLng = 78.9609;
  const mapEmbedUrl = `https://maps.google.com/maps?q=${officeLat},${officeLng}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${officeLat},${officeLng}`;

  // Social Links config - only renders items with URLs
  const socialLinks = [
    {
      name: 'Facebook',
      url: 'https://facebook.com',
      bg: 'bg-[#1877F2]',
      icon: (
        <svg viewBox="0 0 320 512" width="14" height="14" fill="currentColor">
          <path d="M279.1 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.4 0 225.4 0c-73.22 0-121.1 44.38-121.1 124.7v70.62H22.89V288h81.39v224h100.2V288z"/>
        </svg>
      )
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com',
      bg: 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600',
      icon: (
        <svg viewBox="0 0 448 512" width="14" height="14" fill="currentColor">
          <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1z"/>
        </svg>
      )
    },
    {
      name: 'X (Twitter)',
      url: 'https://x.com',
      bg: 'bg-black',
      icon: (
        <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.007 4.076H5.036z"/>
        </svg>
      )
    },
    {
      name: 'YouTube',
      url: 'https://youtube.com',
      bg: 'bg-[#FF0000]',
      icon: (
        <svg viewBox="0 0 576 512" width="14" height="14" fill="currentColor">
          <path d="M549.7 124.1c-6.28-23.65-24.76-42.28-48.28-48.6-42.66-11.45-213.6-11.45-213.6-11.45s-170.9 0-213.6 11.45c-23.52 6.32-42 24.95-48.28 48.6-11.41 42.87-11.41 132.3-11.41 132.3s0 89.44 11.41 132.3c6.28 23.65 24.76 42.28 48.28 48.6 42.66 11.45 213.6 11.45 213.6 11.45s170.9 0 213.6-11.45c23.52-6.32 42-24.95 48.28-48.6 11.41-42.87 11.41-132.3 11.41 132.3s0-89.44-11.41-132.3zm-317.5 213.5V175.2l142.7 81.2-142.7 81.2z"/>
        </svg>
      )
    }
  ];

  // Grievance meeting day note (conditionally rendered)
  const meetingDayNote = t('contact.office.meetingDay', '');

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 font-sans text-gray-900 pb-20 lg:pb-0">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* 1. Page Title Block */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs md:text-sm font-bold uppercase tracking-wider mb-3">
            <Building2 size={16} className="text-primary" />
            <span>{t('constituency', 'Kallakurichi')} {t('cdo_title', 'Constituency Digital Office')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-primary tracking-tight">
            {t('contact.title', 'Contact Office')}
          </h1>
          <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">
            {t('contact.subtitle', 'Reach out to the constituency office for assistance, public meetings, and grievance resolutions.')}
          </p>
        </div>

        {/* 7. Emergency Note Callout (Informational & Subtle) */}
        <div className="mb-8 p-4 sm:p-5 bg-amber-50/80 border border-amber-200/90 rounded-2xl shadow-xs flex items-start gap-3.5">
          <div className="p-2 bg-amber-100 rounded-xl text-amber-800 shrink-0 mt-0.5">
            <Info size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs sm:text-sm font-bold text-amber-900 uppercase tracking-wide">
              {t('contact_emergency_badge', 'Emergency Note')}
            </h4>
            <p className="mt-1 text-xs sm:text-sm text-amber-950/90 leading-relaxed break-words">
              {t('contact.emergencyNote', 'For medical/police emergencies, contact 108/100 directly. This office handles constituency development and grievance matters.')}
            </p>
          </div>
        </div>

        {/* 2 & 3. Office Details Card + Contact Methods Card (2-Column Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-10">
          
          {/* Card 1: Office Details */}
          <div className="bg-white rounded-2xl shadow-xs border border-gray-200/80 p-6 sm:p-8 flex flex-col justify-between hover:shadow-md transition-shadow duration-200">
            <div>
              <div className="flex items-center gap-3 pb-4 mb-6 border-b border-gray-100">
                <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Building2 size={22} />
                </div>
                <div>
                  <h2 className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider">
                    {t('contact_office_card_title', 'CONSTITUENCY MLA OFFICE')}
                  </h2>
                  <div className="text-base sm:text-lg font-bold text-primary flex flex-wrap items-center gap-1.5 mt-0.5">
                    <span>{t('mla_name', 'C. Arul Vignesh')}</span>
                    <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary font-semibold rounded-md">
                      {t('mla_qualification', 'M.Sc.,MLA')}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {t('mla_designation', 'Kallakurichi Member of Legislative Assembly')}
                  </p>
                </div>
              </div>

              {/* Detail Rows */}
              <div className="space-y-5">
                {/* Address Row */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">
                      {t('lbl_address', 'Address')}
                    </span>
                    <div className="text-sm sm:text-base font-medium text-gray-800 leading-snug break-words">
                      <p>{t('contact_office_address_line1', 'Kallakurichi Constituency Office')}</p>
                      <p>{t('contact_office_address_line2', 'Gandhi Road, Near Taluk Office')}</p>
                      <p>{t('contact_office_address_line3', 'Kallakurichi, Tamil Nadu - 606202')}</p>
                    </div>
                  </div>
                </div>

                {/* Office Hours Row */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">
                      {t('contact_office_hours_label', 'Office Working Hours')}
                    </span>
                    <p className="text-sm sm:text-base font-medium text-gray-800 leading-snug break-words">
                      {t('contact.office.hours', 'Mon - Sat : 10:00 AM - 5:00 PM')}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {language === 'ta' ? '(ஞாயிறு & அரசு விடுமுறை நாட்கள் தவிர)' : '(Closed on Sundays & Public Holidays)'}
                    </p>
                  </div>
                </div>

                {/* Public Meeting / Grievance Day Note (Conditionally Rendered) */}
                {meetingDayNote ? (
                  <div className="flex items-start gap-3.5 p-3.5 bg-secondary/30 rounded-xl border border-primary/10">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                      <Calendar size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-bold text-primary uppercase tracking-wide block mb-0.5">
                        {t('contact_office_meeting_day_label', 'Public Grievance Day')}
                      </span>
                      <p className="text-xs sm:text-sm font-medium text-gray-800 leading-relaxed break-words">
                        {meetingDayNote}
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* Card 2: Contact Methods Card */}
          <div className="bg-white rounded-2xl shadow-xs border border-gray-200/80 p-6 sm:p-8 flex flex-col justify-between hover:shadow-md transition-shadow duration-200">
            <div>
              <div className="flex items-center gap-3 pb-4 mb-6 border-b border-gray-100">
                <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <PhoneCall size={22} />
                </div>
                <div>
                  <h2 className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider">
                    {t('contact_methods_card_title', 'DIRECT CONTACT CHANNELS')}
                  </h2>
                  <p className="text-sm sm:text-base font-bold text-gray-900 mt-0.5">
                    {language === 'ta' ? 'உடனடி தொடர்புக்கான வழிகள்' : 'Reach Us by Phone, Email or WhatsApp'}
                  </p>
                </div>
              </div>

              {/* Contact Rows */}
              <div className="space-y-4">
                
                {/* Landline */}
                <div className="flex items-center justify-between p-3 sm:p-3.5 rounded-xl bg-gray-50/80 hover:bg-gray-100/80 transition-colors border border-gray-100">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Phone size={18} />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[11px] sm:text-xs text-gray-500 font-medium block">
                        {t('contact_phone_landline_label', 'Office Landline')}
                      </span>
                      <a 
                        href="tel:04151228802"
                        className="text-sm sm:text-base font-bold text-gray-900 hover:text-primary transition-colors focus:outline-none focus:underline truncate block"
                      >
                        04151-228802
                      </a>
                    </div>
                  </div>
                  <a 
                    href="tel:04151228802"
                    aria-label="Call Landline"
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-primary hover:text-white hover:border-primary transition-colors shrink-0 shadow-2xs"
                  >
                    {language === 'ta' ? 'அழைக்க' : 'Call'}
                  </a>
                </div>

                {/* Helpline Mobile */}
                <div className="flex items-center justify-between p-3 sm:p-3.5 rounded-xl bg-gray-50/80 hover:bg-gray-100/80 transition-colors border border-gray-100">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                      <PhoneCall size={18} />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[11px] sm:text-xs text-gray-500 font-medium block">
                        {t('contact_phone_helpline_label', 'Constituency Helpline')}
                      </span>
                      <a 
                        href="tel:+919876543210"
                        className="text-sm sm:text-base font-bold text-gray-900 hover:text-primary transition-colors focus:outline-none focus:underline truncate block"
                      >
                        +91 98765 43210
                      </a>
                    </div>
                  </div>
                  <a 
                    href="tel:+919876543210"
                    aria-label="Call Helpline"
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-primary hover:text-white hover:border-primary transition-colors shrink-0 shadow-2xs"
                  >
                    {language === 'ta' ? 'அழைக்க' : 'Call'}
                  </a>
                </div>

                {/* Email */}
                <div className="flex items-center justify-between p-3 sm:p-3.5 rounded-xl bg-gray-50/80 hover:bg-gray-100/80 transition-colors border border-gray-100">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
                      <Mail size={18} />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[11px] sm:text-xs text-gray-500 font-medium block">
                        {t('contact_email_label', 'Official Email')}
                      </span>
                      <a 
                        href="mailto:kallakurichioffice@gmail.com"
                        className="text-xs sm:text-sm md:text-base font-bold text-gray-900 hover:text-primary transition-colors focus:outline-none focus:underline truncate block"
                      >
                        kallakurichioffice@gmail.com
                      </a>
                    </div>
                  </div>
                  <a 
                    href="mailto:kallakurichioffice@gmail.com"
                    aria-label="Send Email"
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-primary hover:text-white hover:border-primary transition-colors shrink-0 shadow-2xs"
                  >
                    {language === 'ta' ? 'மின்னஞ்சல்' : 'Email'}
                  </a>
                </div>

                {/* WhatsApp */}
                <div className="flex items-center justify-between p-3 sm:p-3.5 rounded-xl bg-emerald-50/60 hover:bg-emerald-50 transition-colors border border-emerald-100">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-2xs">
                      {/* WhatsApp SVG Icon */}
                      <svg viewBox="0 0 448 512" width="18" height="18" fill="currentColor">
                        <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <span className="text-[11px] sm:text-xs text-emerald-800 font-semibold block">
                        {t('contact_whatsapp_label', 'WhatsApp Support')}
                      </span>
                      <a 
                        href="https://wa.me/919876543210?text=Vanakkam%20MLA%20Office"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm sm:text-base font-bold text-gray-900 hover:text-emerald-700 transition-colors focus:outline-none focus:underline truncate block"
                      >
                        +91 98765 43210
                      </a>
                    </div>
                  </div>
                  <a 
                    href="https://wa.me/919876543210?text=Vanakkam%20MLA%20Office"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#25D366] text-white hover:bg-[#20bd5a] transition-colors shrink-0 shadow-2xs flex items-center gap-1"
                  >
                    <span>{language === 'ta' ? 'செய்தி அனுப்ப' : 'Chat'}</span>
                    <ExternalLink size={12} />
                  </a>
                </div>

              </div>

              {/* Social Links Block (Rendered since URLs exist) */}
              {socialLinks.length > 0 ? (
                <div className="mt-6 pt-5 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {t('contact_social_label', 'Official Social Media')}
                  </span>
                  <div className="flex items-center space-x-2.5">
                    {socialLinks.map((item, idx) => (
                      <a
                        key={idx}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={item.name}
                        className={`w-8 h-8 rounded-full ${item.bg} text-white flex items-center justify-center hover:scale-110 focus:ring-2 focus:ring-primary focus:outline-none transition-transform shadow-2xs`}
                      >
                        {item.icon}
                      </a>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

        </div>

        {/* 4. Embedded Responsive Google Map Card */}
        <div className="bg-white rounded-2xl shadow-xs border border-gray-200/80 p-5 sm:p-7 mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-primary" />
                <h3 className="text-sm sm:text-base font-bold text-gray-900 uppercase tracking-wide">
                  {t('contact_map_card_title', 'OFFICE LOCATION & DIRECTIONS')}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {t('contact_map_hint', 'Locate our constituency office on the interactive map or get direct GPS navigation.')}
              </p>
            </div>
            {/* Get Directions button */}
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-secondary hover:bg-primary/95 text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 shadow-xs shrink-0 self-start sm:self-auto cursor-pointer focus:ring-2 focus:ring-primary focus:outline-none"
            >
              <Navigation size={16} />
              <span>{t('contact_btn_get_directions', 'Get Directions on Google Maps')}</span>
              <ExternalLink size={14} className="opacity-80" />
            </a>
          </div>

          {/* Map Iframe Container (Fixed Aspect Ratio & Responsive) */}
          <div className="w-full aspect-16/9 sm:aspect-21/9 min-h-[260px] md:min-h-[360px] rounded-xl overflow-hidden border border-gray-200 bg-gray-100 shadow-inner relative">
            <iframe
              title="Kallakurichi District Collectorate Office Location"
              src={mapEmbedUrl}
              className="w-full h-full border-0"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Office Location Notice */}
          <div className="mt-3 flex items-center gap-2 text-xs text-primary bg-primary/5 border border-primary/15 rounded-xl px-3.5 py-2.5">
            <MapPin size={15} className="text-primary shrink-0" />
            <span className="font-semibold">
              {t('contact_map_placeholder_note', 'District Collector Office, Kachirapalayam Road, Kallakurichi - 606202')}
            </span>
          </div>
        </div>

        {/* 5. Quick Links Row (Bottom of Page, Above Footer) */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={18} className="text-primary" />
            <h3 className="text-sm sm:text-base font-bold text-gray-900 uppercase tracking-wide">
              {t('contact_quick_links_title', 'QUICK ACTIONS')}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* File Complaint */}
            <Link
              to="/register"
              className="group p-5 bg-white rounded-2xl border border-gray-200/80 hover:border-primary/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileText size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors">
                    {t('contact_quick_file', 'File a Complaint')}
                  </h4>
                </div>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed mb-3">
                {t('contact_quick_file_desc', 'Submit a new public grievance online')}
              </p>
              <span className="inline-flex items-center text-xs font-bold text-primary gap-1 group-hover:translate-x-1 transition-transform">
                <span>{language === 'ta' ? 'பதிவு செய்க' : 'Register Now'}</span>
                <ArrowRight size={14} />
              </span>
            </Link>

            {/* Track Complaint */}
            <Link
              to="/track"
              className="group p-5 bg-white rounded-2xl border border-gray-200/80 hover:border-primary/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Search size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors">
                    {t('contact_quick_track', 'Track a Complaint')}
                  </h4>
                </div>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed mb-3">
                {t('contact_quick_track_desc', 'Check live resolution status by ID or mobile')}
              </p>
              <span className="inline-flex items-center text-xs font-bold text-primary gap-1 group-hover:translate-x-1 transition-transform">
                <span>{language === 'ta' ? 'கண்காணிக்க' : 'Track Status'}</span>
                <ArrowRight size={14} />
              </span>
            </Link>

            {/* Help / FAQ */}
            <Link
              to="/faq"
              className="group p-5 bg-white rounded-2xl border border-gray-200/80 hover:border-primary/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <HelpCircle size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors">
                    {t('contact_quick_faq', 'Help / FAQ')}
                  </h4>
                </div>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed mb-3">
                {t('contact_quick_faq_desc', 'Find answers to common questions')}
              </p>
              <span className="inline-flex items-center text-xs font-bold text-primary gap-1 group-hover:translate-x-1 transition-transform">
                <span>{language === 'ta' ? 'விளக்கங்கள்' : 'View FAQ'}</span>
                <ArrowRight size={14} />
              </span>
            </Link>
          </div>
        </div>

      </main>

      <Footer />
      <MobileNav />
    </div>
  );
};

export default ContactOffice;
