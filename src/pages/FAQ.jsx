import React, { useState, useEffect, useMemo } from 'react';
import {
  HelpCircle,
  Search,
  ChevronDown,
  FileText,
  Clock,
  MapPin,
  Phone,
  PhoneCall,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  X,
  MessageSquare,
  Users,
  Copy,
  Check,
  ExternalLink,
  HeartPulse,
  Flame
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MobileNav from '../components/MobileNav';
import { useLanguage } from '../context/LanguageContext';

const faqList = [
  // 1. Filing Grievances
  {
    id: 'faq-1',
    category: 'register',
    icon: FileText,
    question: {
      en: 'How do I register a public complaint or grievance online?',
      ta: 'ஆன்லைனில் பொதுமக்கள் புகாரை எவ்வாறு பதிவு செய்வது?'
    },
    answer: {
      en: 'To register a complaint, navigate to the "Register Complaint" page from the top menu. Enter your Full Name, 10-digit Mobile Number, Address, select your Ward or Area, pick the Grievance Type and Category, and describe your issue. Once submitted, you will receive an instant Complaint Reference ID (e.g. KLK-2026-XXXXX) for tracking.',
      ta: 'புகார் பதிவு செய்ய மேல் மெனுவில் உள்ள "புகார் பதிவு" பக்கத்திற்குச் செல்லவும். உங்கள் முழு பெயர், 10 இலக்க மொபைல் எண், முகவரி, வார்டு அல்லது பகுதியைத் தேர்வுசெய்து, புகார் வகை மற்றும் காரணத்தை தேர்ந்தெடுத்து உங்கள் பிரச்சனையை விவரிக்கவும். சமர்ப்பித்தவுடன் உடனடி புகார் குறிப்பு எண் (எ.கா. KLK-2026-XXXXX) வழங்கப்படும்.'
    }
  },
  {
    id: 'faq-2',
    category: 'register',
    icon: FileText,
    question: {
      en: 'Are photo, video, audio attachments or GPS location mandatory?',
      ta: 'புகைப்படம், ஆடியோ அல்லது GPS இருப்பிடம் பதிவு செய்வது கட்டாயமா?'
    },
    answer: {
      en: 'No. Attachments (photos, videos, voice notes) and GPS coordinate tagging are completely OPTIONAL. They help our field officers inspect the exact spot faster, but your grievance will be fully processed even with just text details.',
      ta: 'இல்லை. புகைப்படங்கள், குரல் பதிவுகள் (Voice Notes) மற்றும் GPS இருப்பிடக் குறிப்புகள் முற்றிலும் விருப்பத்திற்குரியவை (Optional). அவை கள அதிகாரிகளுக்கு இடத்தை விரைவாகக் கண்டறிய உதவும், ஆனால் அவை இல்லாவிட்டாலும் உங்கள் புகார் முழுமையாக ஏற்றுக்கொள்ளப்பட்டு நடவடிக்கை எடுக்கப்படும்.'
    }
  },
  {
    id: 'faq-3',
    category: 'register',
    icon: MapPin,
    question: {
      en: 'What if my village, street, or locality is not listed in the dropdown?',
      ta: 'எனது கிராமம் அல்லது தெரு பட்டியலில் இல்லை என்றால் என்ன செய்வது?'
    },
    answer: {
      en: 'If your street or village name is not in the predefined list, simply check the "My street / area is not listed" checkbox under the Location section. You can then freely enter your exact street, village, town, or landmark.',
      ta: 'உங்கள் தெரு அல்லது கிராமப் பெயர் பட்டியலில் இல்லையெனில், இருப்பிடப் பிரிவின் கீழ் உள்ள "எனது பகுதி பட்டியலில் இல்லை" என்ற தேர்வை டிக் செய்யவும். பின்னர் உங்கள் தெரு, கிராமம் அல்லது அடையாளக் குறியீட்டை நேரடியாக உள்ளிடலாம்.'
    }
  },

  // 2. Tracking & Status
  {
    id: 'faq-4',
    category: 'tracking',
    icon: Search,
    question: {
      en: 'How can I check the live status of my submitted grievance?',
      ta: 'எனது புகாரின் தற்போதைய நிலையை எவ்வாறு அறிவது?'
    },
    answer: {
      en: 'Visit the "Track Complaint" page. You can search in two ways: either enter your Complaint Reference ID (e.g. KLK-2026-XXXXX) or enter the 10-digit mobile number used during registration. You will see a detailed 5-stage progress timeline.',
      ta: '"புகார் நிலை அறிய" பக்கத்திற்குச் செல்லவும். உங்கள் புகார் குறிப்பு எண்ணை (KLK-2026-XXXXX) உள்ளிட்டோ அல்லது பதிவு செய்த 10 இலக்க மொபைல் எண்ணை உள்ளிட்டோ நிகழ்நேர 5-படிநிலை முன்னேற்றத்தை நேரடியாகக் காணலாம்.'
    }
  },
  {
    id: 'faq-5',
    category: 'tracking',
    icon: Clock,
    question: {
      en: 'What are the 5 resolution stages shown in the tracker?',
      ta: 'புகார் கண்காணிப்பில் காட்டப்படும் 5 நிலைகள் என்னென்ன?'
    },
    answer: {
      en: 'The stages are: 1. Submitted (received online) → 2. Under Review (scrutinized by constituency grievance cell) → 3. Assigned (allocated to designated departmental field officer) → 4. Action Taken (field work / rectification in progress) → 5. Resolved (completed and verified).',
      ta: 'அவை: 1. சமர்ப்பிக்கப்பட்டது (Submitted) → 2. பரிசீலனையில் உள்ளது (Under Review) → 3. நியமிக்கப்பட்டது (Assigned) → 4. நடவடிக்கை எடுக்கப்படுகிறது (Action Taken) → 5. தீர்க்கப்பட்டது (Resolved).'
    }
  },
  {
    id: 'faq-6',
    category: 'tracking',
    icon: Search,
    question: {
      en: 'What should I do if I forgot or misplaced my Complaint Reference ID?',
      ta: 'எனது புகார் குறிப்பு எண்ணை மறந்துவிட்டால் என்ன செய்வது?'
    },
    answer: {
      en: 'Don’t worry! You do not need to remember the ID. Just go to "Track Complaint", switch to "Search by Mobile Number", and enter your 10-digit mobile number. All grievances registered under that number will appear.',
      ta: 'கவலைப்பட வேண்டாம்! "புகார் நிலை அறிய" பக்கத்தில் "மொபைல் எண் மூலம் தேடு" என்பதைத் தேர்வுசெய்து, பதிவுசெய்த 10 இலக்க மொபைல் எண்ணை உள்ளிடுவதன் மூலம் உங்கள் அனைத்து புகார்களையும் பார்க்கலாம்.'
    }
  },

  // 3. MLA & Office Meetings
  {
    id: 'faq-7',
    category: 'mla',
    icon: Users,
    question: {
      en: 'When and where can citizens meet the MLA in person?',
      ta: 'சட்டமன்ற உறுப்பினரை நேரில் எப்போது, எங்கு சந்திக்கலாம்?'
    },
    answer: {
      en: 'Kallakurichi MLA C. Arul Vignesh conducts public grievance meetings at the Kallakurichi Constituency Office every Tuesday and Friday between 10:30 AM and 1:30 PM. Citizens are encouraged to bring relevant documents or prior grievance IDs.',
      ta: 'கள்ளக்குறிச்சி சட்டமன்ற உறுப்பினர் C. அருள் விக்னேஷ் அவர்கள், ஒவ்வொரு செவ்வாய் மற்றும் வெள்ளிக்கிழமைகளில் காலை 10:30 மணி முதல் மதியம் 1:30 மணி வரை கள்ளக்குறிச்சி தொகுதி அலுவலகத்தில் பொதுமக்களை நேரில் சந்தித்து மனுக்களைப் பெறுகிறார்.'
    }
  },
  {
    id: 'faq-8',
    category: 'mla',
    icon: Clock,
    question: {
      en: 'What are the working hours and location of the Constituency Office?',
      ta: 'தொகுதி அலுவலக வேலை நேரம் மற்றும் முகவரி என்ன?'
    },
    answer: {
      en: 'The Constituency Office is open Monday through Saturday from 10:00 AM to 6:00 PM (closed on Sundays & Public Holidays). It is located at the Kallakurichi Constituency Office, Gandhi Road (near Taluk Office / Collectorate area), Kallakurichi - 606202.',
      ta: 'தொகுதி அலுவலகம் திங்கள் முதல் சனிக்கிழமை வரை காலை 10:00 மணி முதல் மாலை 6:00 மணி வரை செயல்படுகிறது (ஞாயிறு மற்றும் அரசு விடுமுறை நாட்கள் தவிர). முகவரி: கள்ளக்குறிச்சி தொகுதி அலுவலகம், காந்தி ரோடு (தாலுகா அலுவலகம் அருகில்), கள்ளக்குறிச்சி - 606202.'
    }
  },

  // 4. Emergency & Helplines
  {
    id: 'faq-9',
    category: 'emergency',
    icon: ShieldAlert,
    question: {
      en: 'Can I report urgent medical, fire, or police emergencies on this portal?',
      ta: 'அவசர மருத்துவ, தீயணைப்பு அல்லது காவல் தேவைகளை இந்த தளத்தில் பதிவு செய்யலாமா?'
    },
    answer: {
      en: 'No. This digital portal is intended for public grievances and civic development matters. For immediate life-safety emergencies, please directly call 108 (Ambulance), 100 (Police), 101 (Fire & Rescue), or 181 (Women Helpline) for instant dispatch.',
      ta: 'இல்லை. இந்த தளம் பொது மக்கள் குறைகள் மற்றும் தொகுதி மேம்பாட்டு பணிகளுக்கானது. உடனடி அவசர தேவைகளுக்கு 108 (ஆம்புலன்ஸ்), 100 (காவல்துறை), 101 (தீயணைப்பு) அல்லது 181 (பெண்கள் உதவி எண்) ஆகிய எண்களை நேரடியாக அழைக்கவும்.'
    }
  }
];

const FAQ = () => {
  const { language, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState('faq-1');
  const [isHelplineModalOpen, setIsHelplineModalOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState('');

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const categories = [
    { id: 'all', label: t('faq_category_all', 'All Questions') },
    { id: 'register', label: t('faq_category_register', 'Filing Grievances') },
    { id: 'tracking', label: t('faq_category_tracking', 'Tracking & Status') },
    { id: 'mla', label: t('faq_category_mla', 'MLA & Office Meetings') },
    { id: 'emergency', label: t('faq_category_emergency', 'Emergency & Helplines') },
  ];

  // Filter FAQs dynamically based on category tab & search keyword
  const filteredFaqs = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return faqList.filter((item) => {
      const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
      if (!matchCategory) return false;

      if (!q) return true;

      const questionText = (item.question[language] || item.question.en || '').toLowerCase();
      const answerText = (item.answer[language] || item.answer.en || '').toLowerCase();
      return questionText.includes(q) || answerText.includes(q);
    });
  }, [selectedCategory, searchQuery, language]);

  const toggleAccordion = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleCopy = (text, key) => {
    if (text) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(''), 2500);
    }
  };

  const handleCallHelplineClick = (e) => {
    e.preventDefault();
    setIsHelplineModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa] font-sans text-gray-900 pb-16 lg:pb-0">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">

        {/* 1. CENTERED PAGE HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#800000]/10 text-[#800000] text-xs sm:text-sm font-bold uppercase tracking-wider mb-3.5">
            <HelpCircle size={16} />
            <span>{t('nav_faq', 'Help / FAQ')}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#800000] tracking-tight">
            {t('faq_page_title', 'Help & Frequently Asked Questions')}
          </h1>
          <p className="mt-3 text-sm sm:text-base text-gray-600 font-normal leading-relaxed">
            {t('faq_page_subtitle', 'Find clear answers to common questions about filing grievances, tracking status, visiting the MLA office, and citizen services.')}
          </p>

          {/* Search Input Bar */}
          <div className="mt-8 max-w-xl mx-auto relative">
            <div className="relative flex items-center">
              <Search className="absolute left-4 text-gray-400 pointer-events-none" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('faq_search_placeholder', 'Search questions by topic (e.g. tracking, meeting, attachments)...')}
                className="w-full pl-11 pr-10 py-3.5 bg-white rounded-xl sm:rounded-2xl border border-gray-200 focus:border-[#800000] focus:ring-2 focus:ring-[#800000]/10 focus:outline-none text-sm text-gray-900 placeholder:text-gray-400 shadow-2xs transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 2. THREE SIMPLE STEPS SUMMARY BANNER */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-8 shadow-2xs mb-10">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles size={18} className="text-[#800000]" />
            <h2 className="text-sm sm:text-base font-bold text-gray-900 uppercase tracking-wide">
              {t('faq_quick_steps_title', 'How It Works in 3 Simple Steps')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Step 1 */}
            <div className="p-4 rounded-xl bg-[#800000]/5 border border-[#800000]/15 flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-lg bg-[#800000] text-white font-bold text-xs flex items-center justify-center mb-3 shadow-xs">
                  1
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">
                  {t('faq_step1_title', '1. Register Grievance')}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {t('faq_step1_desc', 'Fill in your name, contact, area, and issue details online anytime.')}
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-xl bg-[#800000]/5 border border-[#800000]/15 flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-lg bg-[#800000] text-white font-bold text-xs flex items-center justify-center mb-3 shadow-xs">
                  2
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">
                  {t('faq_step2_title', '2. Ground Scrutiny')}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {t('faq_step2_desc', 'Our MLA team reviews and routes the complaint to the concerned field department.')}
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-xl bg-[#800000]/5 border border-[#800000]/15 flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-lg bg-[#800000] text-white font-bold text-xs flex items-center justify-center mb-3 shadow-xs">
                  3
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">
                  {t('faq_step3_title', '3. Track Resolution')}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {t('faq_step3_desc', 'Monitor real-time progress using your ID or mobile number until solved.')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. CATEGORY TABS / FILTER PILLS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer shrink-0 border ${
                selectedCategory === cat.id
                  ? 'bg-[#800000] text-white border-[#800000] shadow-xs'
                  : 'bg-white text-gray-700 border-gray-200/90 hover:bg-gray-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 4. ACCORDION FAQ LIST */}
        <div className="space-y-4 mb-12">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => {
              const isOpen = expandedId === faq.id;
              const Icon = faq.icon;
              const qText = faq.question[language] || faq.question.en;
              const aText = faq.answer[language] || faq.answer.en;

              return (
                <div
                  key={faq.id}
                  className={`bg-white rounded-xl sm:rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'border-[#800000]/40 shadow-xs ring-1 ring-[#800000]/10'
                      : 'border-gray-200/80 hover:border-gray-300'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full text-left p-4 sm:p-5 flex items-start sm:items-center justify-between gap-4 cursor-pointer"
                  >
                    <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          isOpen ? 'bg-[#800000] text-white' : 'bg-red-50 text-[#800000]'
                        }`}
                      >
                        <Icon size={18} />
                      </div>
                      <span className="text-sm sm:text-base font-bold text-gray-900 leading-snug">
                        {qText}
                      </span>
                    </div>

                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 bg-red-50 text-[#800000]' : 'text-gray-400 bg-gray-50'
                      }`}
                    >
                      <ChevronDown size={16} />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 animate-in fade-in duration-150">
                      <div className="pl-12 pr-2 text-gray-700 font-normal">
                        {aText}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200/80 p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
                <AlertCircle size={24} />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-1">
                {t('faq_no_results', 'No matching questions found')}
              </h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto mb-4">
                {t('faq_no_results_desc', 'Try searching with different keywords or contact our support team directly.')}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-xl transition cursor-pointer"
              >
                Clear Search & Filters
              </button>
            </div>
          )}
        </div>

        {/* 5. STILL HAVE QUESTIONS? CALLOUT BANNER */}
        <div className="bg-gradient-to-br from-[#800000] to-[#500000] text-white rounded-2xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <h3 className="text-lg sm:text-xl font-black mb-2 tracking-tight">
              {t('faq_contact_banner_title', 'Still have questions or need direct assistance?')}
            </h3>
            <p className="text-xs sm:text-sm text-red-100/90 leading-relaxed">
              {t('faq_contact_banner_desc', 'Our constituency digital support team and ground coordinators are here to assist you.')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/contact"
              className="px-5 py-2.5 bg-white text-[#800000] hover:bg-red-50 text-xs sm:text-sm font-bold rounded-xl transition-colors shadow-xs"
            >
              {t('faq_btn_contact_office', 'Contact Office')}
            </Link>
            
            {/* Interactive Call Helpline Button */}
            <button
              type="button"
              onClick={handleCallHelplineClick}
              className="px-5 py-2.5 bg-[#FFCC00] text-[#800000] hover:bg-yellow-400 text-xs sm:text-sm font-bold rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <PhoneCall size={16} />
              <span>{t('faq_btn_call_helpline', 'Call Helpline')}</span>
            </button>
          </div>
        </div>

      </main>

      {/* HELPLINE MODAL POPUP */}
      {isHelplineModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-gray-100 relative max-h-[90vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              onClick={() => setIsHelplineModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-[#800000] flex items-center justify-center shrink-0">
                <PhoneCall size={20} />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900">
                  {t('faq_modal_helpline_title', 'Constituency Direct Helplines')}
                </h3>
                <p className="text-xs text-gray-500">
                  {t('faq_modal_helpline_subtitle', 'Call or message directly with the Kallakurichi MLA Constituency team.')}
                </p>
              </div>
            </div>

            {/* Helpline Numbers List */}
            <div className="space-y-3 mb-6">
              
              {/* Helpline Mobile */}
              <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/70 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide block">
                    {t('contact_phone_helpline_label', 'Constituency Helpline')}
                  </span>
                  <span className="text-sm sm:text-base font-bold text-gray-900 block truncate">
                    +91 98765 43210
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCopy('+919876543210', 'mobile')}
                    title="Copy Number"
                    className="p-2 rounded-lg bg-white border border-gray-200 hover:border-gray-400 text-gray-600 transition cursor-pointer shadow-2xs"
                  >
                    {copiedKey === 'mobile' ? <Check size={15} className="text-emerald-600" /> : <Copy size={15} />}
                  </button>
                  <a
                    href="tel:+919876543210"
                    className="px-3 py-1.5 bg-[#800000] hover:bg-[#680000] text-white text-xs font-bold rounded-lg transition shadow-2xs flex items-center gap-1"
                  >
                    <Phone size={12} />
                    <span>{t('faq_modal_call_now', 'Call')}</span>
                  </a>
                </div>
              </div>

              {/* Office Landline */}
              <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/70 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide block">
                    {t('contact_phone_landline_label', 'Office Landline')}
                  </span>
                  <span className="text-sm sm:text-base font-bold text-gray-900 block truncate">
                    04151-228802
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCopy('04151228802', 'landline')}
                    title="Copy Number"
                    className="p-2 rounded-lg bg-white border border-gray-200 hover:border-gray-400 text-gray-600 transition cursor-pointer shadow-2xs"
                  >
                    {copiedKey === 'landline' ? <Check size={15} className="text-emerald-600" /> : <Copy size={15} />}
                  </button>
                  <a
                    href="tel:04151228802"
                    className="px-3 py-1.5 bg-[#800000] hover:bg-[#680000] text-white text-xs font-bold rounded-lg transition shadow-2xs flex items-center gap-1"
                  >
                    <Phone size={12} />
                    <span>{t('faq_modal_call_now', 'Call')}</span>
                  </a>
                </div>
              </div>

              {/* WhatsApp Support */}
              <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide block">
                    {t('contact_whatsapp_label', 'WhatsApp Support')}
                  </span>
                  <span className="text-sm sm:text-base font-bold text-gray-900 block truncate">
                    +91 98765 43210
                  </span>
                </div>
                <a
                  href="https://wa.me/919876543210?text=Vanakkam%20MLA%20Office"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold rounded-lg transition shadow-2xs flex items-center gap-1 shrink-0"
                >
                  <span>{t('faq_modal_whatsapp', 'WhatsApp')}</span>
                  <ExternalLink size={12} />
                </a>
              </div>

            </div>

            {/* Emergency 24/7 Grid */}
            <div className="pt-4 border-t border-gray-100">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-2.5">
                {t('faq_modal_emergency_header', '24/7 Government Emergency Services')}
              </span>
              <div className="grid grid-cols-4 gap-2 text-center">
                <a
                  href="tel:108"
                  className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition flex flex-col items-center"
                >
                  <HeartPulse size={16} className="text-emerald-700 mb-1" />
                  <span className="text-xs font-black text-emerald-900">108</span>
                  <span className="text-[10px] text-emerald-700 font-medium truncate w-full">Ambulance</span>
                </a>
                <a
                  href="tel:100"
                  className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 transition flex flex-col items-center"
                >
                  <ShieldAlert size={16} className="text-blue-700 mb-1" />
                  <span className="text-xs font-black text-blue-900">100</span>
                  <span className="text-[10px] text-blue-700 font-medium truncate w-full">Police</span>
                </a>
                <a
                  href="tel:101"
                  className="p-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 transition flex flex-col items-center"
                >
                  <Flame size={16} className="text-red-700 mb-1" />
                  <span className="text-xs font-black text-red-900">101</span>
                  <span className="text-[10px] text-red-700 font-medium truncate w-full">Fire</span>
                </a>
                <a
                  href="tel:1091"
                  className="p-2 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 transition flex flex-col items-center"
                >
                  <PhoneCall size={16} className="text-purple-700 mb-1" />
                  <span className="text-xs font-black text-purple-900">1091</span>
                  <span className="text-[10px] text-purple-700 font-medium truncate w-full">Women</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

      <Footer />
      <MobileNav />
    </div>
  );
};

export default FAQ;
