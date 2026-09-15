import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  ExternalLink,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MobileNav from '../components/MobileNav';
import { useLanguage } from '../context/LanguageContext';

const ContactOffice = () => {
  const { t } = useLanguage();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // District Collector Office Coordinates & Map Embed URL
  const officeLat = 11.7387;
  const officeLng = 78.9609;
  // Free, reliable OpenStreetMap embed with exact coordinates & marker (avoids Google X-Frame-Options/API blocking)
  const mapEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=78.9460%2C11.7280%2C78.9740%2C11.7480&layer=mapnik&marker=${officeLat}%2C${officeLng}`;
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${officeLat},${officeLng}`;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage(t('contact_form_err_required', 'Please fill in all fields.'));
      return;
    }

    setIsSubmitting(true);

    // Frontend-only mock success state
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', message: '' });

      // Automatically hide success notification after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa] font-sans text-gray-900 pb-16 lg:pb-0">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        
        {/* CENTERED PAGE HEADER */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#800000] tracking-tight">
            {t('contact_page_title', 'Contact Office')}
          </h1>
          <p className="mt-3 text-sm sm:text-base text-gray-500 font-normal leading-relaxed">
            {t('contact_page_subtitle', 'Reach out to the Kallakurichi Constituency Digital Office for assistance, feedback, or general enquiries.')}
          </p>
        </div>

        {/* TWO-COLUMN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
          
          {/* LEFT COLUMN: Info Cards + Map */}
          <div className="space-y-4">
            
            {/* 1. Office Address Card */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200/80 p-4 sm:p-5 flex items-start sm:items-center gap-4 shadow-2xs hover:border-gray-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-red-50/90 text-[#800000] flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                <MapPin size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
                  {t('contact_lbl_office_address', 'OFFICE ADDRESS')}
                </span>
                <p className="text-sm sm:text-base font-bold text-gray-900 leading-snug">
                  {t('contact_val_office_name', 'Kallakurichi Constituency Office')}
                </p>
                <p className="text-xs sm:text-sm font-semibold text-gray-700 leading-snug mt-0.5">
                  {t('contact_val_office_city', 'Kallakurichi, Tamil Nadu - 606202')}
                </p>
              </div>
            </div>

            {/* 2. Phone Card */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200/80 p-4 sm:p-5 flex items-start sm:items-center gap-4 shadow-2xs hover:border-gray-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-red-50/90 text-[#800000] flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                <Phone size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
                  {t('contact_lbl_phone', 'PHONE')}
                </span>
                <a
                  href="tel:+919876543210"
                  className="text-sm sm:text-base font-bold text-gray-900 hover:text-[#800000] transition-colors inline-block"
                >
                  {t('contact_val_phone', '+91 98765 43210')}
                </a>
              </div>
            </div>

            {/* 3. Email Card */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200/80 p-4 sm:p-5 flex items-start sm:items-center gap-4 shadow-2xs hover:border-gray-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-red-50/90 text-[#800000] flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                <Mail size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
                  {t('contact_lbl_email', 'EMAIL')}
                </span>
                <a
                  href="mailto:kallakurichioffice@gmail.com"
                  className="text-sm sm:text-base font-bold text-gray-900 hover:text-[#800000] transition-colors break-all inline-block"
                >
                  {t('contact_val_email', 'kallakurichioffice@gmail.com')}
                </a>
              </div>
            </div>

            {/* 4. Office Hours Card */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200/80 p-4 sm:p-5 flex items-start sm:items-center gap-4 shadow-2xs hover:border-gray-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-red-50/90 text-[#800000] flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                <Clock size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
                  {t('contact_lbl_hours', 'OFFICE HOURS')}
                </span>
                <p className="text-sm sm:text-base font-bold text-gray-900 leading-snug">
                  {t('contact_val_hours', 'Mon - Sat : 10:00 AM - 6:00 PM')}
                </p>
              </div>
            </div>

            {/* Embedded Google Map with "Open in Maps" Overlay Link */}
            <div className="rounded-xl sm:rounded-2xl overflow-hidden border border-gray-200/80 shadow-2xs relative h-[200px] sm:h-[230px] bg-gray-100">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-3 left-3 z-10 bg-white/95 hover:bg-white text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200/90 shadow-xs flex items-center gap-1.5 transition-all cursor-pointer backdrop-blur-2xs"
              >
                <span>{t('contact_open_maps', 'Open in Maps')}</span>
                <ExternalLink size={12} className="text-gray-500" />
              </a>

              <iframe
                title="Kallakurichi Office Location"
                src={mapEmbedUrl}
                className="w-full h-full border-0"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

          </div>

          {/* RIGHT COLUMN: Contact Form Card */}
          <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200/80 p-6 sm:p-8 md:p-9 shadow-2xs">
            <h2 className="text-xl sm:text-2xl font-black text-[#800000] mb-6 tracking-tight">
              {t('contact_form_title', 'Send a Message')}
            </h2>

            {/* Feedback Notifications */}
            {submitSuccess && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-emerald-800 flex items-start gap-2.5 animate-in fade-in">
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>{t('contact_form_success', 'Thank you! Your message has been sent successfully.')}</span>
              </div>
            )}

            {errorMessage && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-xs sm:text-sm text-red-800 flex items-start gap-2.5 animate-in fade-in">
                <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              
              {/* Name Field */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                  {t('contact_form_name', 'Name')}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t('contact_form_name_ph', 'Your name')}
                  className="w-full px-4 py-2.5 sm:py-3 text-sm text-gray-900 rounded-lg sm:rounded-xl border border-gray-200 focus:border-[#800000] focus:ring-2 focus:ring-[#800000]/10 focus:outline-none transition-all placeholder:text-gray-400 bg-white"
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                  {t('contact_form_email', 'Email')}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t('contact_form_email_ph', 'you@example.com')}
                  className="w-full px-4 py-2.5 sm:py-3 text-sm text-gray-900 rounded-lg sm:rounded-xl border border-gray-200 focus:border-[#800000] focus:ring-2 focus:ring-[#800000]/10 focus:outline-none transition-all placeholder:text-gray-400 bg-white"
                />
              </div>

              {/* Message Field */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                  {t('contact_form_message', 'Message')}
                </label>
                <textarea
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={t('contact_form_message_ph', 'How can we help?')}
                  className="w-full px-4 py-2.5 sm:py-3 text-sm text-gray-900 rounded-lg sm:rounded-xl border border-gray-200 focus:border-[#800000] focus:ring-2 focus:ring-[#800000]/10 focus:outline-none transition-all placeholder:text-gray-400 resize-none bg-white"
                />
              </div>

              {/* Submit Button (Left-aligned, not full width) */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-[#800000] hover:bg-[#680000] active:scale-[0.98] text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <Send size={15} />
                  <span>
                    {isSubmitting
                      ? t('contact_form_btn_sending', 'Sending...')
                      : t('contact_form_btn_send', 'Send Message')}
                  </span>
                </button>
              </div>

            </form>
          </div>

        </div>

      </main>

      <Footer />
      <MobileNav />
    </div>
  );
};

export default ContactOffice;
