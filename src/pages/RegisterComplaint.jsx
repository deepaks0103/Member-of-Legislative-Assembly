import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Mic, 
  Square, 
  Upload, 
  Paperclip, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Copy, 
  Check, 
  Volume2, 
  Trash2, 
  FileText,
  Play,
  Pause,
  ChevronDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MobileNav from '../components/MobileNav';
import LocationCapture from '../components/LocationCapture';
import { grievanceCategoriesData, defaultCategories, grievanceTypes } from '../data/grievanceCategories';
import { useLanguage } from '../context/LanguageContext';

const wardsList = [
  { id: 'w1', en: 'Ward 1 - Raja Desingh Nagar', ta: 'வார்டு 1 - ராஜா தேசிங்கு நகர்' },
  { id: 'w2', en: 'Ward 2 - Katchirapalayam Road', ta: 'வார்டு 2 - கச்சிராயப்பாளையம் சாலை' },
  { id: 'w3', en: 'Ward 3 - Gandhi Nagar', ta: 'வார்டு 3 - காந்தி நகர்' },
  { id: 'w4', en: 'Ward 4 - Nehruji Road', ta: 'வார்டு 4 - நேருஜி சாலை' },
  { id: 'w5', en: 'Ward 5 - Anna Nagar', ta: 'வார்டு 5 - அண்ணா நகர்' },
  { id: 'w6', en: 'Ward 6 - Periyar Nagar', ta: 'வார்டு 6 - பெரியார் நகர்' },
  { id: 'w7', en: 'Ward 7 - Thiyagadurgam Road', ta: 'வார்டு 7 - தியாகதுருகம் சாலை' },
  { id: 'w8', en: 'Ward 8 - Salem Main Road', ta: 'வார்டு 8 - சேலம் மெயின் ரோடு' },
  { id: 'w9', en: 'Ward 9 - Emaper', ta: 'வார்டு 9 - ஏமப்பேர்' },
  { id: 'w10', en: 'Ward 10 - Sadhasiva Nagar', ta: 'வார்டு 10 - சதாசிவ நகர்' },
  { id: 'w11', en: 'Ward 11 - Siruvangur', ta: 'வார்டு 11 - சிறுவங்கூர்' },
  { id: 'w12', en: 'Ward 12 - Madur', ta: 'வார்டு 12 - மாடூர்' },
  { id: 'w13', en: 'Ward 13 - Indili', ta: 'வார்டு 13 - இந்திலி' },
  { id: 'w14', en: 'Ward 14 - Neelamangalam', ta: 'வார்டு 14 - நீலமங்கலம்' },
  { id: 'w15', en: 'Ward 15 - Vilambar', ta: 'வார்டு 15 - விளம்பார்' },
  { id: 'w16', en: 'Ward 16 - Thachur', ta: 'வார்டு 16 - தச்சூர்' },
  { id: 'w17', en: 'Ward 17 - Porasapattu', ta: 'வார்டு 17 - போரசப்பட்டு' },
  { id: 'w18', en: 'Ward 18 - Virugavur', ta: 'வார்டு 18 - விருகாவூர்' },
  { id: 'w19', en: 'Ward 19 - Malaikottalam', ta: 'வார்டு 19 - மலைக்கோட்டாலம்' },
  { id: 'w20', en: 'Ward 20 - Somandarkudi', ta: 'வார்டு 20 - சோமந்தார்குடி' },
  { id: 'w21', en: 'Ward 21 - Mattaparai', ta: 'வார்டு 21 - மட்டப்பாறை' },
  { id: 'kallakurichi_town', en: 'Kallakurichi Town Municipality', ta: 'கள்ளக்குறிச்சி நகராட்சி' },
  { id: 'chinnasalem', en: 'Chinnasalem Town Panchayat', ta: 'சின்னசேலம் பேரூராட்சி' },
  { id: 'thiyagadurgam', en: 'Thiyagadurgam Town Panchayat', ta: 'தியாகதுருகம் பேரூராட்சி' },
  { id: 'sankarapuram', en: 'Sankarapuram Area', ta: 'சங்கராபுரம் பகுதி' },
  { id: 'rishivandiyam', en: 'Rishivandiyam Area', ta: 'ரிஷிவந்தியம் பகுதி' },
  { id: 'other_outside', en: 'Other / Outside Kallakurichi Constituency', ta: 'பிற / தொகுதிக்கு வெளியே' },
];

const RegisterComplaint = () => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    address: '',
    wardArea: '',
    streetLocality: '',
    streetNotListed: false,
    grievanceType: '',
    category: '',
    subject: '',
    description: '',
  });

  // GPS Location State (managed via LocationCapture)
  const [gpsLocation, setGpsLocation] = useState(null);

  // Audio Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);
  const audioPlayerRef = useRef(null);

  // File Attachments State
  const [attachments, setAttachments] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Submission & Validation State
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [copiedId, setCopiedId] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Filter Categories dynamically based on selected Grievance
  const availableCategories = useMemo(() => {
    if (!formData.grievanceType) {
      return defaultCategories[language] || defaultCategories.en;
    }
    const catData = grievanceCategoriesData[formData.grievanceType];
    if (catData && catData[language]) {
      return catData[language];
    }
    if (catData && catData.en) {
      return catData.en;
    }
    return defaultCategories[language] || defaultCategories.en;
  }, [formData.grievanceType, language]);

  // Form Validation check - Note: Attachments & GPS are completely OPTIONAL
  const isFormValid = useMemo(() => {
    const cleanedMobile = formData.mobileNumber.replace(/\D/g, '');
    const hasFullName = formData.fullName.trim().length > 0;
    const hasMobile = cleanedMobile.length === 10;
    const hasAddress = formData.address.trim().length > 0;
    const hasWard = formData.wardArea.length > 0;
    const hasStreet = formData.streetNotListed || formData.streetLocality.trim().length > 0;
    const hasGrievance = formData.grievanceType.length > 0;
    const hasCategory = formData.category.length > 0;
    const hasSubject = formData.subject.trim().length > 0;
    const hasDesc = formData.description.trim().length > 0;

    return (
      hasFullName &&
      hasMobile &&
      hasAddress &&
      hasWard &&
      hasStreet &&
      hasGrievance &&
      hasCategory &&
      hasSubject &&
      hasDesc
    );
  }, [formData]);

  // Handle Form Input Change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // When Grievance changes, reset category selection to force fresh valid pick
    if (name === 'grievanceType') {
      setFormData((prev) => ({
        ...prev,
        grievanceType: value,
        category: '',
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Voice Recording Handlers
  const startRecording = async () => {
    try {
      audioChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);

      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.warn('MediaRecorder error, using fallback:', err);
      setIsRecording(true);
      setRecordingDuration(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration((prev) => {
          if (prev >= 6) {
            stopRecordingFallback();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  const stopRecordingFallback = () => {
    clearInterval(recordingTimerRef.current);
    setIsRecording(false);
    setAudioUrl('mock_recording.webm');
    setAudioBlob(new Blob(['mock audio content'], { type: 'audio/webm' }));
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      clearInterval(recordingTimerRef.current);
      setIsRecording(false);
    } else {
      stopRecordingFallback();
    }
  };

  const removeAudioRecording = () => {
    if (audioUrl && audioUrl.startsWith('blob:')) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setAudioBlob(null);
    setRecordingDuration(0);
    setIsPlayingAudio(false);
  };

  const toggleAudioPlay = () => {
    if (!audioPlayerRef.current) return;
    if (isPlayingAudio) {
      audioPlayerRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioPlayerRef.current.play();
      setIsPlayingAudio(true);
    }
  };

  const formatDuration = (sec) => {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Drag and Drop & Native File Upload Handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
    }
  };

  const addFiles = (filesList) => {
    const newFiles = Array.from(filesList).map((file) => ({
      file,
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2),
      type: file.type,
      previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
    }));
    setAttachments((prev) => [...prev, ...newFiles]);
  };

  const removeAttachment = (indexToRemove) => {
    setAttachments((prev) => {
      const item = prev[indexToRemove];
      if (item && item.previewUrl) {
        URL.revokeObjectURL(item.previewUrl);
      }
      return prev.filter((_, index) => index !== indexToRemove);
    });
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = t('err_full_name_required', 'Please enter your full name');
    }

    const cleanedMobile = formData.mobileNumber.replace(/\D/g, '');
    if (!cleanedMobile || cleanedMobile.length !== 10) {
      newErrors.mobileNumber = t('err_mobile_invalid', 'Please enter a valid 10-digit mobile number');
    }

    if (!formData.address.trim()) {
      newErrors.address = t('err_address_required', 'Please enter your address');
    }

    if (!formData.wardArea) {
      newErrors.wardArea = t('err_ward_required', 'Please select a ward or area');
    }

    if (!formData.streetLocality.trim() && !formData.streetNotListed) {
      newErrors.streetLocality = t('err_street_required', 'Please enter your street or locality');
    }

    if (!formData.grievanceType) {
      newErrors.grievanceType = t('err_grievance_required', 'Please select a grievance type');
    }

    if (!formData.category) {
      newErrors.category = t('err_category_required', 'Please select a category');
    }

    if (!formData.subject.trim()) {
      newErrors.subject = t('err_subject_required', 'Please enter a subject');
    }

    if (!formData.description.trim()) {
      newErrors.description = t('err_desc_required', 'Please provide a detailed description');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler - Pure Frontend Local Mock
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) {
      const firstErrorKey = Object.keys(errors)[0];
      const el = document.querySelector(`[name="${firstErrorKey}"]`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }) + ', ' + now.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    const complaintRecord = {
      id: refId,
      ...formData,
      gpsLocation: gpsLocation ? {
        lat: gpsLocation.lat,
        lng: gpsLocation.lng,
        formattedAddress: gpsLocation.formattedAddress,
        isInsideBoundary: gpsLocation.isInsideBoundary,
        boundaryStatus: gpsLocation.boundaryStatus,
      } : null,
      hasAudio: Boolean(audioBlob || audioUrl),
      attachmentCount: attachments.length,
      attachments: attachments.map(a => ({ name: a.name, size: a.size + ' MB', type: a.type, url: a.previewUrl })),
      status: 'Submitted',
      submittedAt: now.toISOString(),
      timeline: [
        { step: 1, key: 'submitted', date: formattedDate, done: true },
        { step: 2, key: 'under_review', date: null, done: false },
        { step: 3, key: 'assigned', date: null, done: false },
        { step: 4, key: 'action_taken', date: null, done: false },
        { step: 5, key: 'resolved', date: null, done: false },
      ],
      remarks: []
    };

    try {
      const existing = JSON.parse(localStorage.getItem('cdo_registered_complaints') || '[]');
      localStorage.setItem('cdo_registered_complaints', JSON.stringify([complaintRecord, ...existing]));
    } catch (err) {
      console.warn('Could not save complaint to localStorage:', err);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedData(complaintRecord);
    }, 500);
  };

  const handleCopyId = () => {
    if (submittedData?.id) {
      navigator.clipboard.writeText(submittedData.id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2500);
    }
  };

  const handleResetForm = () => {
    setFormData({
      fullName: '',
      mobileNumber: '',
      address: '',
      wardArea: '',
      streetLocality: '',
      streetNotListed: false,
      grievanceType: '',
      category: '',
      subject: '',
      description: '',
    });
    setGpsLocation(null);
    removeAudioRecording();
    setAttachments([]);
    setErrors({});
    setSubmitError('');
    setSubmittedData(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
      <Navbar />

      <main className="flex-grow py-4 sm:py-8 px-2.5 sm:px-6 lg:px-8">
        <div className="max-w-[420px] sm:max-w-xl mx-auto">
          
          {/* Main White Card Container */}
          <div className="form-card p-3.5 sm:p-6 md:p-8 transition-all bg-white rounded-lg border border-gray-200/90 shadow-xs">
            
            <form onSubmit={handleSubmit} noValidate>
              
              {/* SECTION 1: YOUR DETAILS */}
              <div className="space-y-2.5">
                <h2 className="section-title">
                  {t('sec_your_details', 'YOUR DETAILS')}
                </h2>

                {/* 2-column inline row */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {/* Full Name */}
                  <div>
                    <label className="form-label">
                      {t('lbl_full_name', 'Full Name')} <span className="text-red-600 font-bold ml-0.5">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder={t('ph_full_name', 'Your full name')}
                      className={`form-input ${errors.fullName ? 'border-red-500 bg-red-50/20' : ''}`}
                    />
                    {errors.fullName && (
                      <p className="mt-0.5 text-[11px] text-red-600 flex items-center gap-1">
                        <AlertCircle size={11} /> {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label className="form-label">
                      {t('lbl_mobile_number', 'Mobile Number')} <span className="text-red-600 font-bold ml-0.5">*</span>
                    </label>
                    <input
                      type="tel"
                      name="mobileNumber"
                      maxLength={10}
                      value={formData.mobileNumber}
                      onChange={handleChange}
                      placeholder={t('ph_mobile_number', '10-digit mobile number')}
                      className={`form-input ${errors.mobileNumber ? 'border-red-500 bg-red-50/20' : ''}`}
                    />
                    {errors.mobileNumber && (
                      <p className="mt-0.5 text-[11px] text-red-600 flex items-center gap-1">
                        <AlertCircle size={11} /> {errors.mobileNumber}
                      </p>
                    )}
                  </div>
                </div>

                {/* Address Full-width row */}
                <div>
                  <label className="form-label">
                    {t('lbl_address', 'Address')} <span className="text-red-600 font-bold ml-0.5">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder={t('ph_address', 'House no., street, area, landmark')}
                    className={`form-input ${errors.address ? 'border-red-500 bg-red-50/20' : ''}`}
                  />
                  {errors.address && (
                    <p className="mt-0.5 text-[11px] text-red-600 flex items-center gap-1">
                      <AlertCircle size={11} /> {errors.address}
                    </p>
                  )}
                </div>
              </div>

              {/* 1px Subtle Section Divider */}
              <hr className="border-t border-gray-200 my-3.5" />

              {/* SECTION 2: LOCATION */}
              <div className="space-y-2.5">
                <h2 className="section-title">
                  {t('sec_location', 'LOCATION')}
                </h2>

                {/* Ward / Constituency Area */}
                <div>
                  <label className="form-label">
                    {t('lbl_ward_area', 'Ward / Constituency Area')} <span className="text-red-600 font-bold ml-0.5">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="wardArea"
                      value={formData.wardArea}
                      onChange={handleChange}
                      className={`form-select appearance-none pr-8 cursor-pointer ${
                        !formData.wardArea ? 'text-gray-400' : 'text-gray-900'
                      } ${errors.wardArea ? 'border-red-500 bg-red-50/20' : ''}`}
                    >
                      <option value="" disabled>
                        {t('ph_select_ward', 'Select ward or area')}
                      </option>
                      {wardsList.map((ward) => (
                        <option key={ward.id} value={ward.id} className="text-gray-900">
                          {language === 'ta' ? ward.ta : ward.en}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                  </div>
                  {errors.wardArea && (
                    <p className="mt-0.5 text-[11px] text-red-600 flex items-center gap-1">
                      <AlertCircle size={11} /> {errors.wardArea}
                    </p>
                  )}
                </div>

                {/* Street / Locality */}
                <div>
                  <label className="form-label">
                    {t('lbl_street_locality', 'Street / Locality')} <span className="text-red-600 font-bold ml-0.5">*</span>
                  </label>
                  <input
                    type="text"
                    name="streetLocality"
                    value={formData.streetLocality}
                    onChange={handleChange}
                    disabled={formData.streetNotListed}
                    placeholder={t('ph_street_locality', 'Enter street, village, town or landmark...')}
                    className={`form-input disabled:bg-gray-100 disabled:text-gray-400 ${
                      errors.streetLocality ? 'border-red-500 bg-red-50/20' : ''
                    }`}
                  />
                  {errors.streetLocality && (
                    <p className="mt-0.5 text-[11px] text-red-600 flex items-center gap-1">
                      <AlertCircle size={11} /> {errors.streetLocality}
                    </p>
                  )}
                </div>

                {/* Street Not Listed Checkbox Row */}
                <div className="flex flex-row items-center justify-between text-xs text-gray-500 gap-1 pt-0.5">
                  <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      name="streetNotListed"
                      checked={formData.streetNotListed}
                      onChange={handleChange}
                      className="w-3.5 h-3.5 rounded border-gray-300 text-[#800000] focus:ring-[#800000] accent-[#800000]"
                    />
                    <span className="text-gray-700 text-[11px] sm:text-xs font-medium">
                      {t('chk_street_not_listed', 'My street / area is not listed')}
                    </span>
                  </label>
                  <span className="text-[10px] sm:text-[11px] text-gray-400 font-normal text-right truncate">
                    {t('txt_applicable_all_wards', 'Applicable across all wards & outside areas')}
                  </span>
                </div>

                {/* Dynamic "Use My Location" GPS Capture Component */}
                <LocationCapture
                  value={gpsLocation}
                  onChange={(data) => setGpsLocation(data)}
                  constituencyName="Kallakurichi"
                />
              </div>

              {/* 1px Subtle Section Divider */}
              <hr className="border-t border-gray-200 my-3.5" />

              {/* SECTION 3: COMPLAINT DETAILS */}
              <div className="space-y-2.5">
                <h2 className="section-title">
                  {t('sec_complaint_details', 'COMPLAINT DETAILS')}
                </h2>

                {/* 2-column inline row for Grievance & Category */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {/* Grievance Type */}
                  <div>
                    <label className="form-label">
                      {t('lbl_grievance', 'Grievance')} <span className="text-red-600 font-bold ml-0.5">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="grievanceType"
                        value={formData.grievanceType}
                        onChange={handleChange}
                        className={`form-select appearance-none pr-7 cursor-pointer ${
                          !formData.grievanceType ? 'text-gray-400' : 'text-gray-900'
                        } ${errors.grievanceType ? 'border-red-500 bg-red-50/20' : ''}`}
                      >
                        <option value="" disabled>
                          {t('ph_select_grievance', 'Select grievance type')}
                        </option>
                        {grievanceTypes.map((type) => (
                          <option key={type.id} value={type.id} className="text-gray-900">
                            {language === 'ta' ? type.ta : type.en}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={15} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                    </div>
                    {errors.grievanceType && (
                      <p className="mt-0.5 text-[11px] text-red-600 flex items-center gap-1">
                        <AlertCircle size={11} /> {errors.grievanceType}
                      </p>
                    )}
                  </div>

                  {/* Category (Filtered dynamically by selected Grievance) */}
                  <div>
                    <label className="form-label">
                      {t('lbl_category', 'Category')} <span className="text-red-600 font-bold ml-0.5">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className={`form-select appearance-none pr-7 cursor-pointer ${
                          !formData.category ? 'text-gray-400' : 'text-gray-900'
                        } ${errors.category ? 'border-red-500 bg-red-50/20' : ''}`}
                      >
                        <option value="" disabled>
                          {formData.grievanceType 
                            ? t('ph_select_category', 'Select category')
                            : t('ph_select_grievance_first', 'Select a grievance type first')}
                        </option>
                        {availableCategories.map((cat) => (
                          <option key={cat.id} value={cat.id} className="text-gray-900">
                            {cat.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={15} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                    </div>
                    {errors.category && (
                      <p className="mt-0.5 text-[11px] text-red-600 flex items-center gap-1">
                        <AlertCircle size={11} /> {errors.category}
                      </p>
                    )}
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="form-label">
                    {t('lbl_subject', 'Subject')} <span className="text-red-600 font-bold ml-0.5">*</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder={t('ph_subject', 'Brief subject of your complaint')}
                    className={`form-input ${errors.subject ? 'border-red-500 bg-red-50/20' : ''}`}
                  />
                  {errors.subject && (
                    <p className="mt-0.5 text-[11px] text-red-600 flex items-center gap-1">
                      <AlertCircle size={11} /> {errors.subject}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="form-label">
                    {t('lbl_description', 'Description')} <span className="text-red-600 font-bold ml-0.5">*</span>
                  </label>
                  <textarea
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder={t('ph_description', 'Describe your complaint in detail...')}
                    className={`form-textarea min-h-[90px] h-[90px] ${errors.description ? 'border-red-500 bg-red-50/20' : ''}`}
                  />
                  {errors.description && (
                    <p className="mt-0.5 text-[11px] text-red-600 flex items-center gap-1">
                      <AlertCircle size={11} /> {errors.description}
                    </p>
                  )}
                </div>
              </div>

              {/* 1px Subtle Section Divider */}
              <hr className="border-t border-gray-200 my-3.5" />

              {/* SECTION 4: ATTACHMENTS (OPTIONAL) */}
              <div className="space-y-3">
                <h2 className="section-title flex items-center gap-1.5">
                  <span>{t('sec_attachments', 'ATTACHMENTS (OPTIONAL)')}</span>
                </h2>

                {/* Voice Complaint Recorder */}
                <div>
                  <label className="form-label">
                    {t('lbl_voice_complaint', 'Voice Complaint (optional - record in your own words)')}
                  </label>

                  <div className="flex flex-wrap items-center gap-2 mt-1.5">
                    {!isRecording ? (
                      <button
                        type="button"
                        onClick={startRecording}
                        className="btn-solid !px-3.5 !py-2 !h-[38px] !text-xs sm:!text-sm !rounded-md gap-1.5"
                      >
                        <Mic size={15} />
                        <span>{t('btn_start_recording', 'Start Recording')}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={stopRecording}
                        className="btn-solid !bg-red-600 hover:!bg-red-700 animate-pulse !px-3.5 !py-2 !h-[38px] !text-xs sm:!text-sm !rounded-md gap-1.5"
                      >
                        <Square size={13} className="fill-white" />
                        <span>{t('btn_stop_recording', 'Stop Recording')} ({formatDuration(recordingDuration)})</span>
                      </button>
                    )}

                    {audioUrl && !isRecording && (
                      <button
                        type="button"
                        onClick={removeAudioRecording}
                        className="text-xs text-gray-500 hover:text-red-600 flex items-center gap-1 cursor-pointer transition ml-1"
                      >
                        <Trash2 size={12} />
                        <span>{t('btn_remove_audio', 'Remove Recording')}</span>
                      </button>
                    )}
                  </div>

                  {/* Audio Status & Audio Player */}
                  <div className="mt-1.5 text-xs text-gray-400">
                    {isRecording ? (
                      <span className="text-red-600 font-medium inline-flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
                        Recording audio... {formatDuration(recordingDuration)}
                      </span>
                    ) : audioUrl ? (
                      <div className="mt-1.5 p-2.5 bg-red-50/60 border border-red-100 rounded-lg flex items-center gap-2.5 max-w-md">
                        {audioUrl.startsWith('blob:') && (
                          <audio
                            ref={audioPlayerRef}
                            src={audioUrl}
                            onEnded={() => setIsPlayingAudio(false)}
                            className="hidden"
                          />
                        )}
                        <button
                          type="button"
                          onClick={toggleAudioPlay}
                          className="w-7 h-7 rounded-full bg-[#800000] text-white flex items-center justify-center shrink-0 cursor-pointer shadow-xs hover:bg-[#680000] transition"
                        >
                          {isPlayingAudio ? <Pause size={13} /> : <Play size={13} className="ml-0.5" />}
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-800 truncate">
                            {t('txt_recording_ready', 'Audio recording ready')}
                          </p>
                          <p className="text-[10px] text-gray-500">
                            Duration: {formatDuration(recordingDuration || 8)}
                          </p>
                        </div>
                        <Volume2 size={15} className="text-gray-400 shrink-0" />
                      </div>
                    ) : (
                      <span className="text-[11px] text-gray-400">{t('txt_no_recording', 'No recording yet.')}</span>
                    )}
                  </div>
                </div>

                {/* Attachments Dropzone */}
                <div>
                  <label className="form-label">
                    {t('lbl_attachments', 'Attachments (photos, video, voice - optional)')}
                  </label>

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                    onChange={handleFileInput}
                    className="hidden"
                  />

                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`dropzone p-4 sm:p-5 text-center flex flex-col items-center justify-center cursor-pointer transition rounded-md ${
                      isDragOver ? 'drag-active border-[#800000] bg-red-50/20' : ''
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 mb-1.5 group-hover:scale-105 transition-transform">
                      <Paperclip size={16} className="text-gray-600 rotate-45" />
                    </div>

                    <p className="text-xs text-gray-700 font-medium mb-1.5">
                      {t('txt_add_media', 'Add photo, video or voice note')}
                    </p>

                    <button
                      type="button"
                      className="btn-outline !text-[11px] !py-1 !px-2.5 !h-7 pointer-events-none"
                    >
                      <Upload size={12} className="text-[#800000]" />
                      <span>{t('btn_browse_files', 'Browse Files')}</span>
                    </button>
                  </div>

                  {/* Uploaded Files Preview List */}
                  {attachments.length > 0 && (
                    <div className="mt-2 space-y-1.5">
                      <p className="text-[11px] text-gray-500 font-medium">
                        {attachments.length} {t('txt_files_selected', 'file(s) selected')}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {attachments.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200 rounded-md text-xs"
                          >
                            <div className="flex items-center gap-2 min-w-0 pr-1.5">
                              {item.previewUrl ? (
                                <img
                                  src={item.previewUrl}
                                  alt="preview"
                                  className="w-7 h-7 rounded object-cover shrink-0 border border-gray-200"
                                />
                              ) : (
                                <FileText size={16} className="text-gray-400 shrink-0" />
                              )}
                              <div className="min-w-0">
                                <p className="font-medium text-[11px] text-gray-800 truncate">{item.name}</p>
                                <p className="text-[9px] text-gray-400">{item.size} MB</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeAttachment(idx);
                              }}
                              className="text-gray-400 hover:text-red-600 p-0.5 rounded-full hover:bg-white cursor-pointer transition"
                              title="Remove file"
                            >
                              <X size={13} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Error Banner */}
              {submitError && (
                <div className="mt-3.5 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-xs text-red-700 animate-in fade-in">
                  <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold block mb-0.5">Submission Error</strong>
                    <span>{submitError}</span>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  className="btn-solid w-full !py-2.5 !h-11 !text-sm sm:!text-base shadow-xs hover:shadow-md transition-all font-bold"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin text-white mr-2" />
                      <span>{t('btn_submitting', 'Submitting Complaint...')}</span>
                    </>
                  ) : (
                    <span>{t('btn_submit_complaint', 'Submit Complaint')}</span>
                  )}
                </button>
              </div>

            </form>

          </div>

        </div>
      </main>

      {/* SUCCESS CONFIRMATION MODAL */}
      {submittedData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 text-center relative max-h-[90vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              onClick={handleResetForm}
              className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Checkmark Icon */}
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <CheckCircle2 size={36} strokeWidth={2.5} />
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">
              {t('modal_success_title', 'Complaint Registered Successfully!')}
            </h3>

            <p className="text-xs sm:text-sm text-gray-600 mb-6 leading-relaxed">
              {t('modal_success_desc', 'Your grievance has been submitted to the Kallakurichi Constituency Digital Office.')}
            </p>

            {/* Reference ID Banner */}
            <div className="bg-orange-50/70 border-2 border-orange-200/80 rounded-xl p-4 mb-6 text-center">
              <p className="text-xs text-orange-900 font-bold uppercase tracking-wider mb-1">
                {t('modal_ref_label', 'Grievance Reference ID')}
              </p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl sm:text-3xl font-black text-[#800000] tracking-wide">
                  {submittedData.id}
                </span>
                <button
                  type="button"
                  onClick={handleCopyId}
                  title="Copy Reference ID"
                  className="p-1.5 rounded-lg bg-white border border-orange-200 text-gray-700 hover:text-[#800000] hover:border-[#800000] transition cursor-pointer shadow-2xs"
                >
                  {copiedId ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
                </button>
              </div>
              {copiedId && (
                <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                  {t('modal_id_copied', 'Copied!')}
                </p>
              )}
            </div>

            {/* Complaint Summary Details */}
            <div className="bg-gray-50 rounded-xl p-4 text-left text-xs space-y-2 border border-gray-200/70 mb-6">
              <div className="flex justify-between border-b border-gray-200/60 pb-1.5">
                <span className="text-gray-500">{t('modal_citizen_label', 'Citizen Name')}:</span>
                <span className="font-semibold text-gray-800">{submittedData.fullName}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200/60 pb-1.5">
                <span className="text-gray-500">{t('modal_contact_label', 'Contact')}:</span>
                <span className="font-semibold text-gray-800">{submittedData.mobileNumber}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200/60 pb-1.5">
                <span className="text-gray-500">{t('modal_location_label', 'Location')}:</span>
                <span className="font-semibold text-gray-800">{submittedData.streetLocality || submittedData.address}</span>
              </div>
              {submittedData.gpsLocation && (
                <div className="flex justify-between border-b border-gray-200/60 pb-1.5">
                  <span className="text-gray-500">GPS Coordinates:</span>
                  <span className="font-semibold text-blue-700">
                    {submittedData.gpsLocation.lat}, {submittedData.gpsLocation.lng} ({submittedData.gpsLocation.boundaryStatus})
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">{t('modal_category_label', 'Category')}:</span>
                <span className="font-semibold text-gray-800 capitalize">{submittedData.grievanceType}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={handleResetForm}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-[#800000] bg-red-50 hover:bg-red-100 transition cursor-pointer border border-red-200"
              >
                {t('modal_btn_another', 'Register Another Complaint')}
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#800000] hover:bg-[#680000] transition cursor-pointer shadow-xs"
              >
                {t('modal_btn_home', 'Go to Home')}
              </button>
            </div>

          </div>
        </div>
      )}

      <Footer />
      <MobileNav />
    </div>
  );
};

export default RegisterComplaint;
