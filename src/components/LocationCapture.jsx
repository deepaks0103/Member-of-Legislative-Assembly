import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

// Kallakurichi Assembly Constituency (TN-78) GeoJSON Boundary Polygon
const KALLAKURICHI_BOUNDARY_POLYGON = [
  [78.8350, 11.6600],
  [78.8500, 11.7400],
  [78.8800, 11.8300],
  [78.9500, 11.8600],
  [79.0500, 11.8400],
  [79.1100, 11.7800],
  [79.1200, 11.7000],
  [79.0800, 11.6400],
  [78.9800, 11.6200],
  [78.8900, 11.6300],
  [78.8350, 11.6600], // Closed loop
];

// Ray-Casting Point-in-Polygon check
const isPointInsidePolygon = (point, polygon) => {
  const [lng, lat] = point;
  let isInside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];

    const intersect = ((yi > lat) !== (yj > lat)) &&
      (lng < (xj - xi) * (lat - yi) / (yj - yi) + xi);

    if (intersect) isInside = !isInside;
  }

  return isInside;
};

// Fallback reverse geocoding addresses for Kallakurichi area in Tamil and English
const getFallbackAddress = (lat, lng, isInside, lang) => {
  if (lang === 'ta') {
    if (isInside) {
      return `சேலம் - கடலூர் மெயின் ரோடு, காந்தி ரோடு அருகில், வார்டு 8, கள்ளக்குறிச்சி, தமிழ்நாடு 606202, இந்தியா`;
    }
    return `மாநில நெடுஞ்சாலை-69 அருகில், உளுந்தூர்பேட்டை - கள்ளக்குறிச்சி சாலை, தமிழ்நாடு, இந்தியா`;
  }
  if (isInside) {
    return `Salem-Cuddalore Main Road, Near Gandhi Road, Ward 8, Kallakurichi, Tamil Nadu 606202, India`;
  }
  return `Near SH-69, Ulundurpet - Kallakurichi Road, Tamil Nadu, India`;
};

// Reverse geocode helper function with dynamic language support
const fetchReverseGeocode = async (lat, lng, lang, isInside) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);

    const acceptLangHeader = lang === 'ta' ? 'ta,en;q=0.8' : 'en,ta;q=0.8';
    const langParam = lang === 'ta' ? 'ta' : 'en';

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=${langParam}`,
      {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Accept-Language': acceptLangHeader,
        },
      }
    );
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data.display_name) {
        return data.display_name;
      }
    }
  } catch (err) {
    console.warn('Reverse geocoding network error, falling back:', err);
  }

  return getFallbackAddress(lat, lng, isInside, lang);
};

const LocationCapture = ({ value, onChange, constituencyName = 'Kallakurichi' }) => {
  const { language, t } = useLanguage();

  // Component States: 'idle' | 'loading' | 'success' | 'error'
  const [status, setStatus] = useState(value?.lat ? 'success' : 'idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [locationData, setLocationData] = useState(value || null);

  // Cache reverse geocoded addresses by language { en: '...', ta: '...' }
  const addressCacheRef = useRef({});

  const displayConstituency = language === 'ta' ? 'கள்ளக்குறிச்சி' : constituencyName;

  // Re-fetch / translate address automatically when language changes if location is already captured
  useEffect(() => {
    if (!locationData || !locationData.lat || !locationData.lng) return;

    const latNum = parseFloat(locationData.lat);
    const lngNum = parseFloat(locationData.lng);
    const currentLang = language;

    // Check if we already have this language in cache
    if (addressCacheRef.current[currentLang]) {
      const updatedAddress = addressCacheRef.current[currentLang];
      setLocationData((prev) => {
        if (!prev) return prev;
        const updated = {
          ...prev,
          formattedAddress: updatedAddress,
          constituencyName: displayConstituency,
        };
        if (onChange) onChange(updated);
        return updated;
      });
      return;
    }

    // Otherwise fetch the reverse geocode in the new language
    let isMounted = true;
    fetchReverseGeocode(latNum, lngNum, currentLang, locationData.isInsideBoundary)
      .then((newAddress) => {
        if (!isMounted) return;
        addressCacheRef.current[currentLang] = newAddress;
        setLocationData((prev) => {
          if (!prev) return prev;
          const updated = {
            ...prev,
            formattedAddress: newAddress,
            constituencyName: displayConstituency,
          };
          if (onChange) onChange(updated);
          return updated;
        });
      });

    return () => {
      isMounted = false;
    };
  }, [language, displayConstituency]);

  // Handle GPS detection on button click
  const handleDetectLocation = () => {
    setStatus('loading');
    setErrorMessage('');

    if (!navigator.geolocation) {
      setStatus('error');
      setErrorMessage(t('err_location_unsupported', 'Geolocation is not supported by your browser.'));
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const latNum = parseFloat(latitude.toFixed(5));
        const lngNum = parseFloat(longitude.toFixed(5));

        // Check if inside constituency boundary
        const isInside = isPointInsidePolygon([lngNum, latNum], KALLAKURICHI_BOUNDARY_POLYGON);
        const boundaryStatus = isInside ? 'Inside' : 'Outside';

        // Clear cache for fresh coordinates
        addressCacheRef.current = {};

        // Fetch address in the currently active UI language
        const formattedAddress = await fetchReverseGeocode(latNum, lngNum, language, isInside);
        addressCacheRef.current[language] = formattedAddress;

        const capturedData = {
          lat: latNum.toFixed(5),
          lng: lngNum.toFixed(5),
          formattedAddress,
          isInsideBoundary: isInside,
          boundaryStatus,
          constituencyName: displayConstituency,
          accuracy: Math.round(position.coords.accuracy || 10),
        };

        setLocationData(capturedData);
        setStatus('success');
        if (onChange) {
          onChange(capturedData);
        }
      },
      (error) => {
        setStatus('error');
        if (error.code === 1) {
          // PERMISSION_DENIED
          setErrorMessage(t('err_location_denied', 'Location access denied. Please enable it in your browser settings.'));
        } else if (error.code === 2 || error.code === 3) {
          // POSITION_UNAVAILABLE or TIMEOUT
          setErrorMessage(t('err_location_timeout', 'Could not detect location. Please try again.'));
        } else {
          setErrorMessage(t('err_location_timeout', 'Could not detect location. Please try again.'));
        }
      },
      options
    );
  };

  // Clear / remove captured location
  const handleClearLocation = () => {
    setStatus('idle');
    setLocationData(null);
    addressCacheRef.current = {};
    setErrorMessage('');
    if (onChange) {
      onChange(null);
    }
  };

  // Formatted helper text above button
  const getHelperTextAbove = () => {
    if (status === 'success' && locationData) {
      if (locationData.isInsideBoundary) {
        return t('txt_location_captured_inside', 'Location captured (Inside {constituency} constituency - complaints are welcomed).')
          .replace('{constituency}', displayConstituency);
      }
      return t('txt_location_captured_outside', 'Location captured (Outside {constituency} constituency - complaints are welcomed).')
        .replace('{constituency}', displayConstituency);
    }

    return t(
      'sub_gps_tag',
      'Share your current GPS location to automatically tag the grievance coordinates (both inside and outside Kallakurichi are supported).'
    );
  };

  const getStatusLineText = () => {
    if (!locationData) return '';
    if (locationData.isInsideBoundary) {
      return t('lbl_location_status_inside', 'Location: Inside {constituency} Constituency (Accepted)')
        .replace('{constituency}', displayConstituency);
    }
    return t('lbl_location_status_outside', 'Location: Outside {constituency} Constituency (Accepted)')
      .replace('{constituency}', displayConstituency);
  };

  return (
    <div className="pt-1 space-y-1.5">
      {/* Title */}
      <h3 className="form-label !mb-0.5">
        {t('lbl_your_location', 'Your Location (optional GPS tag)')}
      </h3>

      {/* Helper text above button */}
      <p className={`text-[11px] leading-relaxed transition-colors ${status === 'success' ? 'text-emerald-700 font-medium' : 'text-gray-500'
        }`}>
        {getHelperTextAbove()}
      </p>

      {/* Button Row */}
      <div className="flex flex-wrap items-center gap-2 pt-0.5">
        <button
          type="button"
          onClick={handleDetectLocation}
          disabled={status === 'loading'}
          className="btn-outline !h-[36px] !py-1 !px-3 !text-xs rounded-md"
        >
          {status === 'loading' ? (
            <>
              <Loader2 size={14} className="animate-spin text-[#800000]" />
              <span>{t('btn_detecting_location', 'Detecting Location...')}</span>
            </>
          ) : (
            <>
              <MapPin size={14} className="text-[#800000]" />
              <span>{t('btn_use_location', 'Use My Location')}</span>
            </>
          )}
        </button>

        {status === 'success' && (
          <button
            type="button"
            onClick={handleClearLocation}
            className="inline-flex items-center gap-1 text-[11px] text-gray-500 hover:text-red-600 transition cursor-pointer underline"
          >
            <X size={12} />
            <span>{t('btn_remove_location', 'Remove GPS')}</span>
          </button>
        )}
      </div>

      {/* Helper text below button for Idle, Loading, or Error states */}
      {status === 'idle' && (
        <p className="text-[11px] text-gray-400">
          {t('txt_location_not_shared', 'Location not shared yet.')}
        </p>
      )}

      {status === 'loading' && (
        <p className="text-xs text-[#800000] font-medium flex items-center gap-1.5 animate-pulse">
          <Loader2 size={12} className="animate-spin text-[#800000]" />
          {t('txt_fetching_location', 'Fetching your location...')}
        </p>
      )}

      {status === 'error' && errorMessage && (
        <p className="text-xs text-red-600 flex items-center gap-1.5 font-medium">
          <AlertCircle size={13} className="shrink-0 text-red-500" />
          <span>{errorMessage}</span>
        </p>
      )}

      {/* SUCCESS RESULT CARD */}
      {status === 'success' && locationData && (
        <div className="info-card text-left shadow-2xs space-y-2 animate-in fade-in duration-200">
          {/* Row 1: Status Line + Raw Coordinates */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-blue-600 shrink-0" />
              <span className="text-xs sm:text-sm font-bold text-gray-900">
                {getStatusLineText()}
              </span>
            </div>

            {/* Raw coordinates right-aligned */}
            <span className="text-[11px] sm:text-xs text-gray-500 font-mono sm:text-right">
              {locationData.lat}, {locationData.lng}
            </span>
          </div>

          {/* Row 2: Detected Area + Full Address */}
          <div className="text-xs text-gray-600 leading-relaxed pl-6">
            <span className="font-semibold text-gray-700 mr-1.5">
              {t('lbl_detected_area', 'Detected Area:')}
            </span>
            <span className="text-gray-600 break-words">
              {locationData.formattedAddress}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationCapture;
