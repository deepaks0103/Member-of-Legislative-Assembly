import React, { useState, useEffect } from 'react';
import {
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  Shield,
  Globe
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MobileNav from '../components/MobileNav';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { language, setLanguage, t } = useLanguage();
  const { isAuthenticated, signInWithPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // If already logged in, redirect to protected route
  useEffect(() => {
    if (isAuthenticated) {
      const redirectPath = location.state?.from?.pathname || '/dashboard';
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmailFormat = (val) => {
    if (!val.trim()) return '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val.trim())) {
      return t('login_err_invalid_email', 'Enter a valid email');
    }
    return '';
  };

  const validatePasswordFormat = (val) => {
    if (!val.trim()) {
      return t('login_err_password_required', 'Password is required');
    }
    return '';
  };

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    if (authError) setAuthError('');
    if (emailTouched) {
      setEmailError(validateEmailFormat(val));
    }
  };

  const handleEmailBlur = () => {
    setEmailTouched(true);
    setEmailError(validateEmailFormat(email));
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    if (authError) setAuthError('');
    if (passwordTouched) {
      setPasswordError(validatePasswordFormat(val));
    }
  };

  const handlePasswordBlur = () => {
    setPasswordTouched(true);
    setPasswordError(validatePasswordFormat(password));
  };

  const isEmailValid = email.trim().length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isPasswordValid = password.trim().length > 0;
  const isFormValid = isEmailValid && isPasswordValid;

  const handleLanguageToggle = () => {
    const nextLang = language === 'en' ? 'ta' : 'en';
    setLanguage(nextLang);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');

    const currentEmailErr = validateEmailFormat(email) || (!email.trim() ? t('login_err_invalid_email', 'Enter a valid email') : '');
    const currentPassErr = validatePasswordFormat(password);

    setEmailTouched(true);
    setPasswordTouched(true);
    setEmailError(currentEmailErr);
    setPasswordError(currentPassErr);

    if (currentEmailErr || currentPassErr || !isFormValid) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Real Supabase Auth sign-in
      await signInWithPassword({ email, password });
      const targetRoute = location.state?.from?.pathname || '/dashboard';
      navigate(targetRoute, { replace: true });
    } catch (err) {
      // Inline auth error on failure without exposing field specifics
      setAuthError(t('login_err_auth_failed', 'Invalid email or password'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa] font-sans text-gray-900 pb-16 lg:pb-0">
      <Navbar />

      <main className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="w-full max-w-md mx-auto">
          
          {/* Centered Login Card */}
          <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200/80 p-6 sm:p-8 md:p-9 shadow-2xs">
            
            {/* Top of Card: MLA Office Branding Mark / TVK Makkal Sevai Heading Area */}
            <div className="flex items-center justify-center gap-3 pb-4">
              <img
                src="/TVK_Logo.png"
                alt="Logo"
                className="w-12 h-12 object-contain shrink-0"
              />
              <div className="flex flex-col min-w-0 text-left">
                <span className="text-primary font-bold text-base sm:text-lg leading-tight">
                  {t('mla_name', 'C. Arul Vignesh')}&nbsp;<span className="text-xs font-semibold">{t('mla_qualification', 'M.Sc.,MLA')}</span>
                </span>
                <span className="text-primary/90 text-xs font-medium">
                  {t('mla_designation', 'Kallakurichi Member of Legislative Assembly')}
                </span>
              </div>
            </div>

            {/* Solid Dark-Red Filled Pill Badge: Centered below Branding Area */}
            <div className="flex justify-center mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider bg-[#800000] text-white shadow-xs">
                <Shield size={12} className="shrink-0" />
                <span>{t('login_badge', 'STAFF ACCESS ONLY')}</span>
              </span>
            </div>

            {/* Heading & Subtitle */}
            <div className="text-center mb-6">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#800000] tracking-tight">
                {t('login_heading', 'Sign In')}
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-gray-500 font-normal leading-relaxed">
                {t('login_page_subtitle', 'Constituency Digital Office staff and administrative access')}
              </p>
            </div>

            {/* Inline Auth Error Message */}
            {authError && (
              <div className="mb-5 p-3.5 sm:p-4 bg-red-50 border border-red-200 rounded-xl text-xs sm:text-sm text-red-800 flex items-start gap-2.5 animate-in fade-in">
                <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
                <span className="leading-snug">{authError}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-4 sm:space-y-5">
              
              {/* Email Field */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                  {t('login_lbl_email', 'Official Email')}
                </label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={handleEmailBlur}
                  placeholder={t('login_ph_email', 'officer@kallakurichi.gov.in')}
                  className={`w-full px-4 py-2.5 sm:py-3 text-sm text-gray-900 rounded-lg sm:rounded-xl border ${
                    emailTouched && emailError ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : 'border-gray-200 focus:border-[#800000] focus:ring-[#800000]/10'
                  } focus:ring-2 focus:outline-none transition-all placeholder:text-gray-400 bg-white`}
                  autoComplete="email"
                />
                {emailTouched && emailError && (
                  <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1 font-medium">
                    <span>{emailError}</span>
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                  {t('login_lbl_password', 'Password')}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={password}
                    onChange={handlePasswordChange}
                    onBlur={handlePasswordBlur}
                    placeholder={t('login_ph_password', 'Enter your password')}
                    className={`w-full px-4 py-2.5 sm:py-3 pr-11 text-sm text-gray-900 rounded-lg sm:rounded-xl border ${
                      passwordTouched && passwordError ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : 'border-gray-200 focus:border-[#800000] focus:ring-[#800000]/10'
                    } focus:ring-2 focus:outline-none transition-all placeholder:text-gray-400 bg-white`}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer p-1"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {passwordTouched && passwordError && (
                  <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1 font-medium">
                    <span>{passwordError}</span>
                  </p>
                )}
              </div>

              {/* Sign In Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 sm:py-3 px-6 rounded-lg sm:rounded-xl bg-[#800000] hover:bg-[#680000] active:scale-[0.99] text-white text-sm font-bold shadow-xs hover:shadow transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>{t('login_btn_signing_in', 'Signing in...')}</span>
                    </>
                  ) : (
                    <span>{t('login_btn_signin', 'Sign In')}</span>
                  )}
                </button>
              </div>

            </form>

            {/* Card Footer Security Note */}
            <div className="mt-6 pt-4 border-t border-gray-100 text-center">
              <p className="text-[11px] text-gray-400 leading-tight">
                {t('login_footer_note', 'Authorized personnel only. All access attempts are logged.')}
              </p>
            </div>

          </div>

          {/* Centered Below Form Card: Language Toggle Button + Helper Link */}
          <div className="mt-6 flex flex-col items-center justify-center gap-3">
            
            {/* Centered Language Toggle Button */}
            <button
              type="button"
              onClick={handleLanguageToggle}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border border-primary/25 bg-primary/10 text-primary hover:bg-primary/20 transition-all cursor-pointer notranslate"
              aria-label="Toggle language"
            >
              <Globe size={14} />
              <span>{language === 'en' ? 'தமிழ்' : 'English'}</span>
            </button>

            {/* Helper Link */}
            <div className="text-center text-xs sm:text-sm text-gray-500 flex items-center justify-center gap-1.5 flex-wrap">
              <span>{t('login_help_text', 'Having trouble?')}</span>
              <Link
                to="/faq"
                className="font-semibold text-[#800000] hover:text-[#680000] hover:underline transition-colors"
              >
                {t('login_help_link', 'Visit Help / FAQ')}
              </Link>
            </div>

          </div>

        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
};

export default Login;
