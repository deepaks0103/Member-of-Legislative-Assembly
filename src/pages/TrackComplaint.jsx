import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Phone, 
  FileText, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  Wrench, 
  AlertCircle, 
  XCircle, 
  Copy, 
  Check, 
  ArrowRight, 
  Printer, 
  Volume2, 
  Play, 
  Pause, 
  Paperclip, 
  MapPin, 
  Calendar, 
  Building2, 
  ShieldAlert, 
  RotateCcw,
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MobileNav from '../components/MobileNav';
import { useLanguage } from '../context/LanguageContext';
import { grievanceCategoriesData } from '../data/grievanceCategories';

// Retrieve grievances registered in the current session / browser
const getRegisteredComplaints = () => {
  try {
    const raw = localStorage.getItem('cdo_registered_complaints');
    if (raw) {
      const list = JSON.parse(raw);
      if (Array.isArray(list)) return list;
    }
  } catch (e) {
    console.warn('Error reading cdo_registered_complaints from localStorage', e);
  }
  return [];
};

const TrackComplaint = () => {
  const { language, t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  // Search Mode State ('id' | 'mobile')
  const [activeTab, setActiveTab] = useState('id');

  // Input States
  const [complaintIdInput, setComplaintIdInput] = useState('');
  const [mobileInput, setMobileInput] = useState('');

  // Result & UI States
  const [mobileResults, setMobileResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeComplaint, setActiveComplaint] = useState(null);
  const [copiedId, setCopiedId] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // Audio Playback State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Auto-search if query param 'id' is in URL
  useEffect(() => {
    window.scrollTo(0, 0);
    const queryId = searchParams.get('id');
    if (queryId) {
      setComplaintIdInput(queryId);
      performSearchById(queryId);
    }
  }, [searchParams]);

  // Search By Complaint ID - Searches actual registered complaints
  const performSearchById = (idToSearch) => {
    const cleanId = (idToSearch || complaintIdInput).trim().toUpperCase();
    setErrorMessage('');

    if (!cleanId) {
      setErrorMessage(t('track_err_invalid_id', 'Please enter a valid Complaint ID.'));
      return;
    }

    setIsSearching(true);

    setTimeout(() => {
      const storedComplaints = getRegisteredComplaints();
      const found = storedComplaints.find(
        (c) => c.id && (c.id.toUpperCase() === cleanId || c.id.replace(/-/g, '').toUpperCase() === cleanId.replace(/-/g, ''))
      );

      if (found) {
        setActiveComplaint(found);
        setMobileResults([]);
        setErrorMessage('');
      } else {
        setActiveComplaint(null);
        setErrorMessage(t('track_err_not_found', 'No complaint found matching this ID. Please check the ID or register a new complaint.'));
      }
      setIsSearching(false);
    }, 400);
  };

  // Search By Mobile Number - Searches actual registered complaints
  const performSearchByMobile = (mobileToSearch) => {
    const rawMobile = mobileToSearch !== undefined ? mobileToSearch : mobileInput;
    const cleanedMobile = (rawMobile || '').replace(/\D/g, '');
    setErrorMessage('');

    if (cleanedMobile.length !== 10) {
      setErrorMessage(t('track_err_invalid_mobile', 'Please enter a valid 10-digit mobile number.'));
      return;
    }

    setIsSearching(true);
    setActiveComplaint(null);
    setMobileResults([]);

    setTimeout(() => {
      const storedComplaints = getRegisteredComplaints();
      const matches = storedComplaints.filter((c) => {
        const cMobile = (c.mobileNumber || '').replace(/\D/g, '');
        return cMobile === cleanedMobile;
      });

      if (matches.length === 1) {
        setActiveComplaint(matches[0]);
        setMobileResults([]);
        setErrorMessage('');
      } else if (matches.length > 1) {
        setMobileResults(matches);
        setActiveComplaint(null);
        setErrorMessage('');
      } else {
        setActiveComplaint(null);
        setMobileResults([]);
        setErrorMessage(t('track_err_no_mobile_records', 'No complaints found registered with this mobile number. Please register a new grievance.'));
      }
      setIsSearching(false);
    }, 400);
  };

  // Select a grievance from mobile list
  const handleSelectFromList = (complaint) => {
    setActiveComplaint(complaint);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  // Copy ID
  const handleCopyId = (id) => {
    if (id) {
      navigator.clipboard.writeText(id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  // Print Report
  const handlePrint = () => {
    window.print();
  };

  // Reset all search
  const handleBackToSearch = () => {
    setActiveComplaint(null);
    setMobileResults([]);
    setErrorMessage('');
    setSearchParams({});
    setComplaintIdInput('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper to get formatted status badge class & text
  const getStatusBadge = (status) => {
    const statusKey = (status || 'Submitted').toLowerCase().replace(/\s+/g, '_');
    switch (statusKey) {
      case 'submitted':
        return {
          className: 'status-badge-submitted',
          label: t('track_status_submitted', 'Submitted'),
          icon: Clock,
        };
      case 'under_review':
        return {
          className: 'status-badge-under-review',
          label: t('track_status_under_review', 'Under Review'),
          icon: FileText,
        };
      case 'assigned':
        return {
          className: 'status-badge-assigned',
          label: t('track_status_assigned', 'Assigned'),
          icon: UserCheck,
        };
      case 'action_taken':
        return {
          className: 'status-badge-action-taken',
          label: t('track_status_action_taken', 'Action Taken'),
          icon: Wrench,
        };
      case 'resolved':
        return {
          className: 'status-badge-resolved',
          label: t('track_status_resolved', 'Resolved'),
          icon: CheckCircle2,
        };
      case 'rejected':
        return {
          className: 'status-badge-rejected',
          label: t('track_status_rejected', 'Rejected'),
          icon: XCircle,
        };
      default:
        return {
          className: 'status-badge-submitted',
          label: status,
          icon: Clock,
        };
    }
  };

  // Helper to lookup Grievance Type and Category label
  const getGrievanceLabels = (complaint) => {
    const typeLabel = complaint.grievanceType || 'General';
    let subCategoryLabel = complaint.category || '';

    if (complaint.grievanceType && grievanceCategoriesData[complaint.grievanceType]) {
      const list = grievanceCategoriesData[complaint.grievanceType][language] || grievanceCategoriesData[complaint.grievanceType].en || [];
      const match = list.find((item) => item.id === complaint.category);
      if (match) {
        subCategoryLabel = match.label;
      }
    }

    return { typeLabel, subCategoryLabel };
  };

  // 5 Standard Stepper Stage definitions
  const stepperStages = [
    { key: 'submitted', num: 1, title: t('track_stepper_step1_name', 'Submitted'), desc: t('track_stepper_step1_desc', 'Grievance submitted online'), icon: FileText },
    { key: 'under_review', num: 2, title: t('track_stepper_step2_name', 'Under Review'), desc: t('track_stepper_step2_desc', 'Grievance cell scrutiny'), icon: Clock },
    { key: 'assigned', num: 3, title: t('track_stepper_step3_name', 'Assigned'), desc: t('track_stepper_step3_desc', 'Assigned to field officer'), icon: UserCheck },
    { key: 'action_taken', num: 4, title: t('track_stepper_step4_name', 'Action Taken'), desc: t('track_stepper_step4_desc', 'Ground work in progress'), icon: Wrench },
    { key: 'resolved', num: 5, title: t('track_stepper_step5_name', 'Resolved'), desc: t('track_stepper_step5_desc', 'Issue resolved & verified'), icon: CheckCircle2 },
  ];

  // Calculate current stage index based on complaint status
  const currentStageIndex = useMemo(() => {
    if (!activeComplaint) return 0;
    const s = (activeComplaint.status || '').toLowerCase().replace(/\s+/g, '_');
    if (s === 'submitted') return 0;
    if (s === 'under_review') return 1;
    if (s === 'assigned') return 2;
    if (s === 'action_taken') return 3;
    if (s === 'resolved') return 4;
    if (s === 'rejected') return 1; // Rejected halts after review
    return 0;
  }, [activeComplaint]);

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
      <Navbar />

      <main className="flex-grow py-8 sm:py-12 px-3 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-6">

          {/* 1. PAGE TITLE BLOCK */}
          <div className="text-center space-y-2 no-print">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wide uppercase">
              <Sparkles size={14} />
              <span>{t('constituency', 'Kallakurichi')} Digital Office</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
              {t('track_title', 'Track Complaint Status')}
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto leading-relaxed">
              {t('track_subtitle', 'Enter your complaint ID or mobile number to check real-time progress and official resolution updates.')}
            </p>
          </div>

          {/* 2. SEARCH CARD */}
          <div className="form-card p-5 sm:p-8 transition-all no-print">
            
            {/* Search Tab Switcher */}
            <div className="grid grid-cols-2 gap-2 p-1.5 bg-gray-100/90 rounded-lg mb-6 border border-gray-200/80">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('id');
                  setErrorMessage('');
                }}
                className={`track-tab-btn ${activeTab === 'id' ? 'active' : ''}`}
              >
                <FileText size={16} className="shrink-0" />
                <span>{t('track_tab_id', 'Complaint ID')}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('mobile');
                  setErrorMessage('');
                }}
                className={`track-tab-btn ${activeTab === 'mobile' ? 'active' : ''}`}
              >
                <Phone size={16} className="shrink-0" />
                <span>{t('track_tab_mobile', 'Search by Mobile Number')}</span>
              </button>
            </div>

            {/* TAB 1: Search By Complaint ID Form */}
            {activeTab === 'id' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  performSearchById();
                }}
                className="space-y-4"
              >
                <div>
                  <label htmlFor="complaintIdInput" className="form-label font-semibold">
                    {t('track_lbl_complaint_id', 'Complaint ID')} <span className="text-red-500 font-bold">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <div className="input-leading-icon-wrap">
                      <Search size={18} className="text-gray-400 shrink-0" />
                    </div>
                    <input
                      id="complaintIdInput"
                      type="text"
                      value={complaintIdInput}
                      onChange={(e) => {
                        setComplaintIdInput(e.target.value);
                        if (errorMessage) setErrorMessage('');
                      }}
                      placeholder={t('track_ph_id', 'e.g. KLK-2026-10001')}
                      className={`form-input form-input-with-icon font-mono tracking-wide uppercase ${
                        errorMessage ? 'border-red-500 bg-red-50/20' : ''
                      }`}
                    />
                  </div>
                </div>

                {/* Inline Error Message */}
                {errorMessage && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2.5 text-xs text-red-700 animate-in fade-in duration-200">
                    <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Submit Track Button */}
                <button
                  type="submit"
                  disabled={!complaintIdInput.trim() || isSearching}
                  className="btn-solid w-full !py-3 !h-11 !text-sm sm:!text-base shadow-xs hover:shadow-md transition-all gap-2"
                >
                  {isSearching ? (
                    <span>{t('btn_detecting_location', 'Searching records...')}</span>
                  ) : (
                    <>
                      <Search size={17} className="shrink-0" />
                      <span>{t('track_btn_track', 'Track')}</span>
                    </>
                  )}
                </button>

                {/* Helper text below input */}
                <p className="text-xs text-gray-500 flex items-center gap-1.5 pt-1">
                  <Info size={13} className="text-gray-400 shrink-0" />
                  <span>{t('track_helper_find_id', 'You can find your Complaint ID in the SMS/confirmation you received.')}</span>
                </p>
              </form>
            )}

            {/* TAB 2: Search By Mobile Number Form */}
            {activeTab === 'mobile' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  performSearchByMobile();
                }}
                className="space-y-4"
              >
                <div>
                  <label htmlFor="mobileInput" className="form-label font-semibold">
                    {t('lbl_mobile_number', 'Mobile Number')} <span className="text-red-500 font-bold">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <div className="input-leading-icon-wrap">
                      <Phone size={18} className="text-gray-400 shrink-0" />
                    </div>
                    <input
                      id="mobileInput"
                      type="tel"
                      maxLength={10}
                      value={mobileInput}
                      onChange={(e) => {
                        setMobileInput(e.target.value.replace(/\D/g, ''));
                        if (errorMessage) setErrorMessage('');
                      }}
                      placeholder={t('track_ph_mobile', 'Enter 10-digit mobile number')}
                      className={`form-input form-input-with-icon font-mono ${
                        errorMessage ? 'border-red-500 bg-red-50/20' : ''
                      }`}
                    />
                  </div>
                </div>

                {/* Inline Error Message with /register CTA */}
                {errorMessage && (
                  <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-red-700 animate-in fade-in duration-200">
                    <div className="flex items-start gap-2.5 min-w-0">
                      <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{errorMessage}</span>
                    </div>
                    <Link
                      to="/register"
                      className="font-bold text-[#800000] hover:underline flex items-center gap-1 shrink-0 ml-6 sm:ml-0"
                    >
                      <span>{t('track_btn_register_new', 'Register a New Complaint')}</span>
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                )}

                {/* Submit Track Button */}
                <button
                  type="submit"
                  disabled={mobileInput.trim().length !== 10 || isSearching}
                  className="btn-solid w-full !py-3 !h-11 !text-sm sm:!text-base shadow-xs hover:shadow-md transition-all gap-2"
                >
                  {isSearching ? (
                    <span>{t('track_btn_searching', 'Searching records...')}</span>
                  ) : (
                    <>
                      <Search size={17} className="shrink-0" />
                      <span>{t('track_btn_track', 'Track')}</span>
                    </>
                  )}
                </button>

                {/* Helper text below input */}
                <p className="text-xs text-gray-500 flex items-center gap-1.5 pt-1">
                  <Info size={13} className="text-gray-400 shrink-0" />
                  <span>{t('track_helper_mobile', 'Enter the 10-digit mobile number used during registration.')}</span>
                </p>
              </form>
            )}

          </div>

          {/* MULTIPLE RESULTS LIST (When searched by Mobile and >1 records found) */}
          {mobileResults.length > 1 && !activeComplaint && (
            <div className="form-card p-5 sm:p-8 space-y-4 animate-in fade-in duration-200">
              <div className="border-b border-gray-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 break-words">
                    {t('track_multiple_results_title', 'Complaints linked to')} <span className="font-mono text-[#800000]">{mobileInput}</span>
                  </h2>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {t('track_multiple_results_subtitle', 'Select any complaint below to view detailed timeline and status.')}
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-50 text-[#800000] border border-red-100 shrink-0 self-start sm:self-center">
                  {mobileResults.length} {language === 'ta' ? 'பதிவுகள்' : (mobileResults.length === 1 ? 'Record' : 'Records')}
                </span>
              </div>

              <div className="space-y-3">
                {mobileResults.map((c) => {
                  const badge = getStatusBadge(c.status);
                  const { typeLabel, subCategoryLabel } = getGrievanceLabels(c);
                  const submittedDate = c.submittedAt
                    ? new Date(c.submittedAt).toLocaleDateString(language === 'ta' ? 'ta-IN' : 'en-IN', { dateStyle: 'medium' })
                    : null;

                  return (
                    <div
                      key={c.id}
                      onClick={() => handleSelectFromList(c)}
                      className="p-4 border border-gray-200 rounded-xl hover:border-[#800000] hover:shadow-xs transition-all bg-white cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                    >
                      <div className="space-y-1.5 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-bold text-sm text-[#800000] group-hover:underline">{c.id}</span>
                          <span className={`status-badge ${badge.className}`}>
                            <badge.icon size={12} />
                            <span>{badge.label}</span>
                          </span>
                          {submittedDate && (
                            <span className="text-[11px] text-gray-500 flex items-center gap-1">
                              <Calendar size={12} className="text-gray-400" />
                              <span>{submittedDate}</span>
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-semibold text-gray-800 line-clamp-1 break-words">{c.subject || typeLabel}</p>
                        <p className="text-[11px] text-gray-500 flex items-center gap-1.5 flex-wrap">
                          <span>{c.wardArea || c.streetLocality || c.address}</span>
                          <span>•</span>
                          <span>{subCategoryLabel || typeLabel}</span>
                        </p>
                      </div>

                      <button
                        type="button"
                        className="btn-outline !text-xs !py-1.5 !px-3 shrink-0 self-start sm:self-center group-hover:bg-[#800000] group-hover:text-white transition-colors"
                      >
                        <span>{t('track_btn_view_details', 'View Timeline')}</span>
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. RESULT SECTION (Detailed Timeline & Status Card) */}
          {activeComplaint && (
            <div className="form-card p-5 sm:p-8 md:p-10 space-y-8 animate-in fade-in duration-300">
              
              {/* Header Row: Complaint ID + Status Chip + Date */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                      {t('track_lbl_complaint_id', 'Complaint ID')}:
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-[#800000] font-mono tracking-wide">
                      {activeComplaint.id}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyId(activeComplaint.id)}
                      title="Copy Reference ID"
                      className="p-1 rounded-md text-gray-400 hover:text-[#800000] hover:bg-red-50 border border-gray-200 transition cursor-pointer"
                    >
                      {copiedId ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                    </button>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar size={13} />
                      <span>{new Date(activeComplaint.submittedAt || Date.now()).toLocaleDateString(language === 'ta' ? 'ta-IN' : 'en-IN', { dateStyle: 'medium' })}</span>
                    </span>
                    {activeComplaint.fullName && (
                      <span>• {activeComplaint.fullName}</span>
                    )}
                  </div>
                </div>

                {/* Status Badge & Actions */}
                <div className="flex items-center gap-2 flex-wrap">
                  {(() => {
                    const badge = getStatusBadge(activeComplaint.status);
                    return (
                      <span className={`status-badge !text-xs !py-1.5 !px-3.5 ${badge.className}`}>
                        <badge.icon size={14} />
                        <span>{badge.label}</span>
                      </span>
                    );
                  })()}

                  <button
                    type="button"
                    onClick={handlePrint}
                    title={t('track_btn_print', 'Print / Save Report')}
                    className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-black transition cursor-pointer no-print"
                  >
                    <Printer size={16} />
                  </button>
                </div>
              </div>

              {/* REJECTION / QUEUED BANNER */}
              {activeComplaint.status === 'Rejected' && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-900">
                  <ShieldAlert size={20} className="text-rose-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm">{t('track_status_rejected', 'Grievance Rejected / Closed')}</h3>
                    <p className="text-xs text-rose-700 leading-relaxed">
                      {activeComplaint.remarks?.[0]?.[language] || activeComplaint.remarks?.[0]?.en || 'This request cannot be processed under constituency public infrastructure development guidelines.'}
                    </p>
                  </div>
                </div>
              )}

              {activeComplaint.status === 'Submitted' && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3 text-blue-900">
                  <Info size={20} className="text-blue-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm">{t('track_status_submitted', 'Grievance Queued for Scrutiny')}</h3>
                    <p className="text-xs text-blue-700 leading-relaxed">
                      {t('track_status_queued_message', 'Your complaint is currently queued and will be reviewed by an officer within 24 hours.')}
                    </p>
                  </div>
                </div>
              )}

              {/* 5-STAGE RESPONSIVE TIMELINE STEPPER */}
              {activeComplaint.status !== 'Rejected' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="section-title">
                      {t('how_it_works_title', 'RESOLUTION TIMELINE')}
                    </h3>
                    <span className="text-[11px] text-gray-400 font-medium">
                      Stage {Math.min(currentStageIndex + 1, 5)} of 5
                    </span>
                  </div>

                  {/* Desktop Horizontal Stepper (lg:flex) */}
                  <div className="hidden lg:block pt-4 pb-2">
                    <div className="relative flex justify-between items-start">
                      
                      {/* Background Connector Bar */}
                      <div className="absolute top-5 left-6 right-6 h-1 bg-gray-200 -z-0">
                        {/* Completed Progress Fill */}
                        <div
                          className="h-full bg-emerald-600 transition-all duration-500"
                          style={{ width: `${(currentStageIndex / (stepperStages.length - 1)) * 100}%` }}
                        ></div>
                      </div>

                      {/* Stepper Nodes */}
                      {stepperStages.map((stage, idx) => {
                        const isCompleted = idx < currentStageIndex || (idx === currentStageIndex && activeComplaint.status === 'Resolved');
                        const isCurrent = idx === currentStageIndex && activeComplaint.status !== 'Resolved';

                        const timelineMatch = activeComplaint.timeline?.find((t) => t.step === stage.num);
                        const timestamp = timelineMatch?.date;

                        return (
                          <div key={stage.key} className="flex flex-col items-center text-center relative z-10 w-36 px-1">
                            
                            {/* Circle Indicator */}
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 font-bold text-xs ${
                                isCompleted
                                  ? 'bg-emerald-600 text-white shadow-sm ring-4 ring-emerald-100'
                                  : isCurrent
                                  ? 'bg-[#800000] text-white shadow-md ring-4 ring-red-100 animate-pulse'
                                  : 'bg-white border-2 border-gray-300 text-gray-400'
                              }`}
                            >
                              {isCompleted ? (
                                <Check size={18} strokeWidth={2.5} />
                              ) : (
                                <span>{stage.num}</span>
                              )}
                            </div>

                            {/* Label & Description */}
                            <div className="mt-3 space-y-0.5 w-full">
                              <p
                                className={`stepper-node-title font-bold text-xs ${
                                  isCompleted
                                    ? 'text-gray-900'
                                    : isCurrent
                                    ? 'text-[#800000] font-black'
                                    : 'text-gray-400'
                                }`}
                              >
                                {stage.title}
                              </p>
                              <p className="stepper-node-desc text-[11px] text-gray-500 leading-tight">
                                {stage.desc}
                              </p>
                              {timestamp && (
                                <p className="text-[10px] text-emerald-700 font-semibold pt-1">
                                  {timestamp}
                                </p>
                              )}
                            </div>

                          </div>
                        );
                      })}

                    </div>
                  </div>

                  {/* Mobile Vertical Stepper (<lg) */}
                  <div className="block lg:hidden space-y-6 pt-2 relative pl-6 border-l-2 border-gray-200 ml-4">
                    {stepperStages.map((stage, idx) => {
                      const isCompleted = idx < currentStageIndex || (idx === currentStageIndex && activeComplaint.status === 'Resolved');
                      const isCurrent = idx === currentStageIndex && activeComplaint.status !== 'Resolved';

                      const timelineMatch = activeComplaint.timeline?.find((t) => t.step === stage.num);
                      const timestamp = timelineMatch?.date;

                      return (
                        <div key={stage.key} className="relative group">
                          
                          {/* Dot Node on left vertical line */}
                          <div
                            className={`absolute -left-[35px] top-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                              isCompleted
                                ? 'bg-emerald-600 text-white ring-4 ring-emerald-50'
                                : isCurrent
                                ? 'bg-[#800000] text-white ring-4 ring-red-50 animate-pulse'
                                : 'bg-white border-2 border-gray-300 text-gray-400'
                            }`}
                          >
                            {isCompleted ? <Check size={14} strokeWidth={2.5} /> : stage.num}
                          </div>

                          {/* Content */}
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p
                                className={`font-bold text-sm ${
                                  isCompleted
                                    ? 'text-gray-900'
                                    : isCurrent
                                    ? 'text-[#800000]'
                                    : 'text-gray-400'
                                }`}
                              >
                                {stage.title}
                              </p>
                              {isCurrent && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-[#800000] font-bold uppercase">
                                  Current
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500">{stage.desc}</p>
                            {timestamp && (
                              <p className="text-[11px] text-emerald-700 font-semibold pt-0.5">
                                {timestamp}
                              </p>
                            )}
                          </div>

                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 1px Subtle Section Divider */}
              <hr className="border-t border-gray-200/80" />

              {/* OFFICER REMARKS & PROGRESS UPDATES */}
              {activeComplaint.remarks && activeComplaint.remarks.length > 0 && (
                <div className="space-y-4">
                  <h3 className="section-title flex items-center gap-1.5">
                    <Building2 size={16} className="text-[#800000]" />
                    <span>{t('track_officer_remarks_title', 'OFFICER REMARKS & PROGRESS')}</span>
                  </h3>

                  {/* Department & Officer Details Card */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs">
                    <div>
                      <span className="text-gray-500 font-medium block mb-0.5">{t('track_dept_label', 'Department')}:</span>
                      <span className="font-bold text-gray-900">
                        {activeComplaint.department?.[language] || activeComplaint.department?.en || 'Constituency Public Works Wing'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 font-medium block mb-0.5">{t('track_officer_label', 'Assigned Officer')}:</span>
                      <span className="font-bold text-gray-900">
                        {activeComplaint.officer?.name || 'Departmental Field Incharge'}
                      </span>
                      {activeComplaint.officer?.designation && (
                        <p className="text-[11px] text-gray-500">
                          {activeComplaint.officer.designation[language] || activeComplaint.officer.designation.en}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Remarks History Logs */}
                  <div className="space-y-2.5">
                    {activeComplaint.remarks.map((remark, rIdx) => (
                      <div
                        key={rIdx}
                        className="p-3.5 bg-white border border-gray-200 rounded-lg text-xs space-y-1.5 shadow-2xs"
                      >
                        <div className="flex items-center justify-between text-[11px] text-gray-500 border-b border-gray-100 pb-1">
                          <span className="font-bold text-[#800000]">{remark.stage}</span>
                          <span>{remark.date}</span>
                        </div>
                        <p className="text-gray-800 leading-relaxed">
                          {remark[language] || remark.en}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 1px Subtle Section Divider */}
              <hr className="border-t border-gray-200/80" />

              {/* CITIZEN GRIEVANCE DETAILS SUMMARY */}
              <div className="space-y-4">
                <h3 className="section-title">
                  {t('track_details_title', 'GRIEVANCE SUMMARY')}
                </h3>

                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200/80 space-y-3.5 text-xs">
                  
                  {/* Category & Location Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-500 block mb-0.5">{t('track_lbl_category', 'Category')}:</span>
                      <span className="font-bold text-gray-900 capitalize">
                        {getGrievanceLabels(activeComplaint).typeLabel}
                      </span>
                      {getGrievanceLabels(activeComplaint).subCategoryLabel && (
                        <p className="text-gray-600 font-medium text-[11px]">
                          {getGrievanceLabels(activeComplaint).subCategoryLabel}
                        </p>
                      )}
                    </div>

                    <div>
                      <span className="text-gray-500 block mb-0.5">{t('track_lbl_location', 'Location / Ward')}:</span>
                      <span className="font-bold text-gray-900">
                        {activeComplaint.streetLocality || activeComplaint.address}
                      </span>
                      {activeComplaint.wardArea && (
                        <p className="text-[11px] text-gray-600">
                          {activeComplaint.wardArea}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* GPS Coordinates (if available) */}
                  {activeComplaint.gpsLocation && (
                    <div className="pt-2 border-t border-gray-200/60 flex items-center gap-2 text-blue-800">
                      <MapPin size={14} className="text-blue-600 shrink-0" />
                      <span>
                        GPS Tagged: {activeComplaint.gpsLocation.lat}, {activeComplaint.gpsLocation.lng} ({activeComplaint.gpsLocation.boundaryStatus || 'Inside Kallakurichi'})
                      </span>
                    </div>
                  )}

                  {/* Subject & Description */}
                  <div className="pt-2 border-t border-gray-200/60 space-y-1">
                    <span className="text-gray-500 block mb-0.5">{t('track_lbl_subject', 'Subject')}:</span>
                    <p className="font-bold text-gray-900 text-sm">{activeComplaint.subject}</p>
                  </div>

                  <div className="pt-2 border-t border-gray-200/60 space-y-1">
                    <span className="text-gray-500 block mb-0.5">{t('track_lbl_description', 'Description')}:</span>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{activeComplaint.description}</p>
                  </div>

                </div>
              </div>

              {/* ATTACHMENTS & VOICE RECORDING SECTION */}
              {((activeComplaint.attachments && activeComplaint.attachments.length > 0) || activeComplaint.hasAudio) && (
                <div className="space-y-4">
                  <h3 className="section-title">
                    {t('track_lbl_attachments', 'ATTACHMENTS & MEDIA')}
                  </h3>

                  <div className="space-y-3">
                    {/* Voice Note Player */}
                    {activeComplaint.hasAudio && (
                      <div className="p-3.5 bg-red-50/60 border border-red-100 rounded-xl flex items-center gap-3 max-w-md">
                        <button
                          type="button"
                          onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                          className="w-9 h-9 rounded-full bg-[#800000] text-white flex items-center justify-center shrink-0 cursor-pointer shadow-xs hover:bg-[#680000] transition"
                        >
                          {isPlayingAudio ? <Pause size={15} /> : <Play size={15} className="ml-0.5" />}
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-800 truncate">
                            {t('track_lbl_voice_recording', 'Citizen Voice Note')}
                          </p>
                          <p className="text-[11px] text-gray-500">
                            Duration: {activeComplaint.audioDuration || '00:15'}
                          </p>
                        </div>
                        <Volume2 size={18} className="text-gray-400 shrink-0" />
                      </div>
                    )}

                    {/* Image / File Thumbnails */}
                    {activeComplaint.attachments && activeComplaint.attachments.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {activeComplaint.attachments.map((att, attIdx) => (
                          <div
                            key={attIdx}
                            onClick={() => att.url && setPreviewImage(att.url)}
                            className="group relative border border-gray-200 rounded-lg overflow-hidden bg-gray-50 p-2 cursor-pointer hover:border-[#800000] transition flex items-center gap-2 text-xs"
                          >
                            {att.url ? (
                              <img
                                src={att.url}
                                alt={att.name}
                                className="w-12 h-12 rounded object-cover border border-gray-200 group-hover:scale-105 transition"
                              />
                            ) : (
                              <Paperclip size={18} className="text-gray-400" />
                            )}
                            <div className="min-w-0">
                              <p className="font-medium text-gray-800 truncate text-xs">{att.name}</p>
                              <p className="text-[10px] text-gray-400">{att.size}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ACTION FOOTER BUTTONS */}
              <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3 no-print">
                {mobileResults.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveComplaint(null);
                      window.scrollTo({ top: 250, behavior: 'smooth' });
                    }}
                    className="flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition cursor-pointer border border-gray-200 text-center flex items-center justify-center gap-2"
                  >
                    <ChevronRight size={15} className="rotate-180" />
                    <span>{t('track_btn_back_to_list', 'Back to complaints list')}</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleBackToSearch}
                  className="flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition cursor-pointer border border-gray-200 text-center flex items-center justify-center gap-2"
                >
                  <RotateCcw size={15} />
                  <span>{t('track_btn_back_search', 'Search Another Complaint')}</span>
                </button>
                <Link
                  to="/register"
                  className="flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#800000] hover:bg-[#680000] transition cursor-pointer shadow-xs text-center flex items-center justify-center gap-2"
                >
                  <span>{t('track_btn_register_new', 'Register a New Complaint')}</span>
                  <ArrowRight size={15} />
                </Link>
              </div>

            </div>
          )}

          {/* 4. DEFAULT EMPTY SEARCH GUIDE CARD */}
          {!activeComplaint && mobileResults.length === 0 && (
            <div className="form-card p-6 sm:p-8 text-center space-y-3 bg-white/70 no-print">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto">
                <Search size={22} />
              </div>
              <h3 className="font-bold text-gray-900 text-base">
                {t('track_empty_title', 'Track Your Grievance')}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
                {t('track_empty_desc', 'Enter your Complaint ID or Mobile number above to view real-time tracking, assigned department details, and resolution history.')}
              </p>
              <div className="pt-2">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#800000] hover:underline"
                >
                  <span>{t('track_btn_register_new', 'Need to register a new complaint? Click here')}</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs cursor-pointer animate-in fade-in"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-2xl w-full bg-white rounded-xl overflow-hidden p-2">
            <img src={previewImage} alt="Attachment Full Preview" className="w-full h-auto max-h-[80vh] object-contain rounded-lg" />
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 bg-black/70 text-white rounded-full p-2 hover:bg-black transition cursor-pointer"
            >
              <XCircle size={20} />
            </button>
          </div>
        </div>
      )}

      <Footer />
      <MobileNav />
    </div>
  );
};

export default TrackComplaint;
