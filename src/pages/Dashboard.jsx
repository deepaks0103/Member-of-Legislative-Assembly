import React, { useState, useEffect, useMemo } from 'react';
import {
  LogOut,
  Shield,
  User,
  Mail,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Search,
  Filter,
  RefreshCw,
  Eye,
  X,
  MapPin,
  Calendar,
  FileText,
  Paperclip,
  Check,
  Copy,
  ChevronDown,
  Loader2,
  ExternalLink,
  UserCheck,
  Wrench
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MobileNav from '../components/MobileNav';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabaseClient';

const Dashboard = () => {
  const { user, staffProfile, signOut, isAuthenticated, loading: authLoading } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Active detail modal state
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [statusUpdateVal, setStatusUpdateVal] = useState('');
  const [statusHistory, setStatusHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [updateSuccessMsg, setUpdateSuccessMsg] = useState('');
  const [updateErrorMsg, setUpdateErrorMsg] = useState('');
  const [copiedId, setCopiedId] = useState(false);

  // Fetch all complaints from Supabase only after authenticated session is confirmed
  const fetchComplaints = async (isManualRefresh = false) => {
    if (!isAuthenticated || !user) return;
    if (isManualRefresh) setIsRefreshing(true);
    else setLoading(true);
    setFetchError('');

    try {
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setComplaints(data || []);
    } catch (err) {
      console.error('[Dashboard] Error fetching complaints:', err);
      setFetchError(err.message || 'Failed to load complaints from database.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated || !user) {
        navigate('/login', { replace: true });
        return;
      }
      fetchComplaints();
    }
  }, [authLoading, isAuthenticated, user]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('Sign out error:', err);
      navigate('/login', { replace: true });
    }
  };

  // Prevent any UI or data flash while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin text-[#800000]" />
          <span className="text-xs font-semibold text-gray-500 tracking-wide uppercase">
            Verifying staff session...
          </span>
        </div>
      </div>
    );
  }

  // If not authenticated, do not render dashboard contents
  if (!isAuthenticated || !user) {
    return null;
  }

  // Status Badge Helper
  const getStatusBadgeConfig = (status) => {
    let key = (status || 'submitted').toLowerCase().replace(/\s+/g, '_');
    if (key === 'in_review') key = 'under_review';
    switch (key) {
      case 'submitted':
        return {
          bgClass: 'bg-gray-100 text-gray-700 border-gray-200',
          dotClass: 'bg-gray-500',
          label: t('dash_status_submitted', 'Submitted'),
          icon: Clock
        };
      case 'under_review':
        return {
          bgClass: 'bg-amber-50 text-amber-800 border-amber-200',
          dotClass: 'bg-amber-500',
          label: t('dash_status_under_review', 'Under Review'),
          icon: Clock
        };
      case 'assigned':
        return {
          bgClass: 'bg-blue-50 text-blue-800 border-blue-200',
          dotClass: 'bg-blue-500',
          label: t('dash_status_assigned', 'Assigned'),
          icon: UserCheck
        };
      case 'action_taken':
        return {
          bgClass: 'bg-purple-50 text-purple-800 border-purple-200',
          dotClass: 'bg-purple-500',
          label: t('dash_status_action_taken', 'Action Taken'),
          icon: Wrench
        };
      case 'resolved':
        return {
          bgClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          dotClass: 'bg-emerald-500',
          label: t('dash_status_resolved', 'Resolved'),
          icon: CheckCircle2
        };
      case 'rejected':
        return {
          bgClass: 'bg-rose-50 text-rose-800 border-rose-200',
          dotClass: 'bg-rose-500',
          label: t('dash_status_rejected', 'Rejected'),
          icon: XCircle
        };
      default:
        return {
          bgClass: 'bg-gray-100 text-gray-700 border-gray-200',
          dotClass: 'bg-gray-500',
          label: status,
          icon: Clock
        };
    }
  };

  // Filtered complaints list (default 'all' excludes 'resolved' complaints)
  const filteredComplaints = useMemo(() => {
    return complaints.filter((item) => {
      // Status filter
      let itemStatus = (item.status || 'submitted').toLowerCase().replace(/\s+/g, '_');
      if (itemStatus === 'in_review') itemStatus = 'under_review';
      
      const matchesStatus =
        statusFilter === 'all'
          ? itemStatus !== 'resolved'
          : itemStatus === statusFilter;

      // Text Search
      const query = searchQuery.trim().toLowerCase();
      if (!query) return matchesStatus;

      const idMatch = (item.complaint_id || '').toLowerCase().includes(query);
      const nameMatch = (item.name || '').toLowerCase().includes(query);
      const mobileMatch = (item.mobile || '').includes(query);
      const categoryMatch = (item.category || '').toLowerCase().includes(query);
      const descMatch = (item.description || '').toLowerCase().includes(query);

      return matchesStatus && (idMatch || nameMatch || mobileMatch || categoryMatch || descMatch);
    });
  }, [complaints, statusFilter, searchQuery]);

  // Status Counters
  const counts = useMemo(() => {
    const res = { total: complaints.length, submitted: 0, under_review: 0, assigned: 0, action_taken: 0, resolved: 0, rejected: 0 };
    complaints.forEach((c) => {
      let s = (c.status || 'submitted').toLowerCase().replace(/\s+/g, '_');
      if (s === 'in_review') s = 'under_review';
      if (res[s] !== undefined) res[s]++;
      else res.submitted++;
    });
    return res;
  }, [complaints]);

  // Open complaint detail modal and fetch status history
  const handleOpenDetail = async (complaint) => {
    setSelectedComplaint(complaint);
    let s = (complaint.status || 'submitted').toLowerCase().replace(/\s+/g, '_');
    if (s === 'in_review') s = 'under_review';
    setStatusUpdateVal(s);
    setUpdateSuccessMsg('');
    setUpdateErrorMsg('');
    setStatusHistory([]);
    setLoadingHistory(true);

    try {
      const targetCode = complaint.complaint_id || complaint.id;
      const { data, error } = await supabase
        .from('complaint_status_history')
        .select('*')
        .eq('complaint_id', targetCode)
        .order('changed_at', { ascending: true });

      if (!error && Array.isArray(data)) {
        setStatusHistory(data);
      }
    } catch (e) {
      console.warn('[Status History Fetch Error]:', e);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Close modal
  const handleCloseDetail = () => {
    setSelectedComplaint(null);
    setStatusHistory([]);
    setUpdateSuccessMsg('');
    setUpdateErrorMsg('');
  };

  // Handle Status Update in Database & Record History
  const handleUpdateStatus = async () => {
    if (!selectedComplaint) return;
    setIsUpdatingStatus(true);
    setUpdateSuccessMsg('');
    setUpdateErrorMsg('');

    try {
      const targetId = selectedComplaint.id;
      const targetCode = selectedComplaint.complaint_id || selectedComplaint.id;
      const staffEmail = user?.email || staffProfile?.email || displayName || 'Staff';

      // 1. Update complaints table status
      const { error: updateError } = await supabase
        .from('complaints')
        .update({ status: statusUpdateVal })
        .eq('id', targetId);

      if (updateError) {
        throw updateError;
      }

      // 2. Insert into complaint_status_history
      const nowIso = new Date().toISOString();
      const historyEntry = {
        complaint_id: targetCode,
        status: statusUpdateVal,
        changed_at: nowIso,
        changed_by: staffEmail
      };

      try {
        const { data: histData, error: histErr } = await supabase
          .from('complaint_status_history')
          .insert([historyEntry])
          .select()
          .single();

        if (!histErr && histData) {
          setStatusHistory((prev) => [...prev, histData]);
        } else {
          setStatusHistory((prev) => [...prev, { ...historyEntry, id: String(Date.now()) }]);
        }
      } catch (histCatch) {
        console.warn('[Status History Insert Notice]:', histCatch);
        setStatusHistory((prev) => [...prev, { ...historyEntry, id: String(Date.now()) }]);
      }

      // Update local state immediately
      setComplaints((prev) =>
        prev.map((c) => (c.id === targetId ? { ...c, status: statusUpdateVal } : c))
      );

      setSelectedComplaint((prev) => (prev ? { ...prev, status: statusUpdateVal } : null));
      setUpdateSuccessMsg(t('dash_modal_update_success', 'Status updated successfully!'));

      setTimeout(() => {
        setUpdateSuccessMsg('');
      }, 4000);
    } catch (err) {
      console.error('[Dashboard] Error updating complaint status:', err);
      setUpdateErrorMsg(err.message || t('dash_modal_update_error', 'Failed to update status. Please try again.'));
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleCopyId = (id) => {
    if (!id) return;
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const displayName = staffProfile?.name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'Staff Officer';
  const roleName = staffProfile?.role || user?.user_metadata?.role || 'Staff';

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa] font-sans text-gray-900 pb-16 lg:pb-0">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* PAGE HEADER ROW */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-[#800000] text-white">
                <Shield size={12} className="shrink-0" />
                <span>{roleName}</span>
              </span>
              <span className="text-xs text-gray-500 font-medium">
                {user?.email}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#800000] tracking-tight">
              {t('dash_title', 'Complaints Dashboard')}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {t('dash_subtitle', 'View, filter, and manage public grievances in real-time')}
            </p>
          </div>

          {/* Action Buttons: Refresh & Sign Out */}
          <div className="flex items-center gap-2.5 self-start md:self-auto">
            <button
              type="button"
              onClick={() => fetchComplaints(true)}
              disabled={isRefreshing || loading}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:text-[#800000] hover:border-gray-300 text-xs sm:text-sm font-semibold shadow-2xs transition cursor-pointer disabled:opacity-60"
            >
              <RefreshCw size={14} className={isRefreshing ? 'animate-spin text-[#800000]' : ''} />
              <span>{t('dash_refresh', 'Refresh')}</span>
            </button>

            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white hover:bg-red-50 border border-gray-200 hover:border-red-200 text-[#800000] text-xs sm:text-sm font-bold shadow-2xs transition cursor-pointer"
            >
              <LogOut size={15} />
              <span>{t('dash_signout', 'Sign Out')}</span>
            </button>
          </div>
        </div>

        {/* SUMMARY COUNTERS CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3 my-6">
          {/* Total */}
          <div
            onClick={() => setStatusFilter('all')}
            className={`bg-white rounded-xl border p-3.5 shadow-2xs cursor-pointer transition-all ${
              statusFilter === 'all' ? 'border-[#800000] ring-1 ring-[#800000]' : 'border-gray-200/80 hover:border-gray-300'
            }`}
          >
            <span className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
              {t('dash_total_complaints', 'Total Complaints')}
            </span>
            <span className="text-lg sm:text-2xl font-black text-gray-900">{counts.total}</span>
          </div>

          {/* Submitted */}
          <div
            onClick={() => setStatusFilter('submitted')}
            className={`bg-white rounded-xl border p-3.5 shadow-2xs cursor-pointer transition-all ${
              statusFilter === 'submitted' ? 'border-[#800000] ring-1 ring-[#800000]' : 'border-gray-200/80 hover:border-gray-300'
            }`}
          >
            <span className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
              {t('dash_status_submitted', 'Submitted')}
            </span>
            <span className="text-lg sm:text-2xl font-black text-gray-700">{counts.submitted}</span>
          </div>

          {/* Under Review */}
          <div
            onClick={() => setStatusFilter('under_review')}
            className={`bg-white rounded-xl border p-3.5 shadow-2xs cursor-pointer transition-all ${
              statusFilter === 'under_review' ? 'border-[#800000] ring-1 ring-[#800000]' : 'border-gray-200/80 hover:border-gray-300'
            }`}
          >
            <span className="text-[10px] sm:text-[11px] font-bold text-amber-700 uppercase tracking-wider block mb-1">
              {t('dash_status_under_review', 'Under Review')}
            </span>
            <span className="text-lg sm:text-2xl font-black text-amber-800">{counts.under_review}</span>
          </div>

          {/* Assigned */}
          <div
            onClick={() => setStatusFilter('assigned')}
            className={`bg-white rounded-xl border p-3.5 shadow-2xs cursor-pointer transition-all ${
              statusFilter === 'assigned' ? 'border-[#800000] ring-1 ring-[#800000]' : 'border-gray-200/80 hover:border-gray-300'
            }`}
          >
            <span className="text-[10px] sm:text-[11px] font-bold text-blue-700 uppercase tracking-wider block mb-1">
              {t('dash_status_assigned', 'Assigned')}
            </span>
            <span className="text-lg sm:text-2xl font-black text-blue-800">{counts.assigned}</span>
          </div>

          {/* Action Taken */}
          <div
            onClick={() => setStatusFilter('action_taken')}
            className={`bg-white rounded-xl border p-3.5 shadow-2xs cursor-pointer transition-all ${
              statusFilter === 'action_taken' ? 'border-[#800000] ring-1 ring-[#800000]' : 'border-gray-200/80 hover:border-gray-300'
            }`}
          >
            <span className="text-[10px] sm:text-[11px] font-bold text-purple-700 uppercase tracking-wider block mb-1">
              {t('dash_status_action_taken', 'Action Taken')}
            </span>
            <span className="text-lg sm:text-2xl font-black text-purple-800">{counts.action_taken}</span>
          </div>

          {/* Resolved */}
          <div
            onClick={() => setStatusFilter('resolved')}
            className={`bg-white rounded-xl border p-3.5 shadow-2xs cursor-pointer transition-all ${
              statusFilter === 'resolved' ? 'border-[#800000] ring-1 ring-[#800000]' : 'border-gray-200/80 hover:border-gray-300'
            }`}
          >
            <span className="text-[10px] sm:text-[11px] font-bold text-emerald-700 uppercase tracking-wider block mb-1">
              {t('dash_status_resolved', 'Resolved')}
            </span>
            <span className="text-lg sm:text-2xl font-black text-emerald-800">{counts.resolved}</span>
          </div>

          {/* Rejected */}
          <div
            onClick={() => setStatusFilter('rejected')}
            className={`bg-white rounded-xl border p-3.5 shadow-2xs cursor-pointer transition-all col-span-2 sm:col-span-1 ${
              statusFilter === 'rejected' ? 'border-[#800000] ring-1 ring-[#800000]' : 'border-gray-200/80 hover:border-gray-300'
            }`}
          >
            <span className="text-[10px] sm:text-[11px] font-bold text-rose-700 uppercase tracking-wider block mb-1">
              {t('dash_status_rejected', 'Rejected')}
            </span>
            <span className="text-lg sm:text-2xl font-black text-rose-800">{counts.rejected}</span>
          </div>
        </div>

        {/* SEARCH & FILTER CONTROLS */}
        <div className="bg-white rounded-xl border border-gray-200/80 p-4 mb-6 shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between">
          
          {/* Search Input */}
          <div className="relative w-full sm:max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('dash_search_placeholder', 'Search by ID, name, mobile, category...')}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-lg border border-gray-200 focus:border-[#800000] focus:ring-2 focus:ring-[#800000]/10 focus:outline-none transition bg-gray-50/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Status Quick Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {['all', 'submitted', 'under_review', 'assigned', 'action_taken', 'resolved', 'rejected'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  statusFilter === st
                    ? 'bg-[#800000] text-white shadow-2xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {st === 'all'
                  ? t('dash_filter_all', 'All')
                  : t(`dash_status_${st}`, st.charAt(0).toUpperCase() + st.slice(1).replace('_', ' '))}
              </button>
            ))}
          </div>

        </div>

        {/* FETCH ERROR BANNER */}
        {fetchError && (
          <div className="p-4 mb-6 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-xs text-red-700">
            <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <strong className="font-bold block mb-0.5">Database Error</strong>
              <span>{fetchError}</span>
            </div>
            <button
              onClick={() => fetchComplaints(true)}
              className="px-2.5 py-1 bg-white border border-red-200 rounded-md font-bold text-red-700 hover:bg-red-50 text-xs"
            >
              Retry
            </button>
          </div>
        )}

        {/* TABLE CONTAINER */}
        <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden">
          
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3">
              <Loader2 size={32} className="animate-spin text-[#800000]" />
              <span className="text-xs sm:text-sm font-semibold text-gray-500">
                {t('dash_loading', 'Loading complaints from Supabase...')}
              </span>
            </div>
          ) : filteredComplaints.length === 0 ? (
            <div className="py-16 text-center px-4">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
                <FileText size={26} />
              </div>
              <h3 className="text-base font-bold text-gray-900">
                {t('dash_no_complaints', 'No complaints found')}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-sm mx-auto">
                {t('dash_no_complaints_desc', 'There are no grievances matching your filter criteria.')}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-[11px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <th className="py-3.5 px-4 sm:px-6">{t('dash_col_id', 'Complaint ID')}</th>
                    <th className="py-3.5 px-4 sm:px-6">{t('dash_col_citizen', 'Citizen Name')}</th>
                    <th className="py-3.5 px-4 sm:px-6">{t('dash_col_mobile', 'Mobile')}</th>
                    <th className="py-3.5 px-4 sm:px-6">{t('dash_col_category', 'Category')}</th>
                    <th className="py-3.5 px-4 sm:px-6">{t('dash_col_status', 'Status')}</th>
                    <th className="py-3.5 px-4 sm:px-6">{t('dash_col_date', 'Submitted Date')}</th>
                    <th className="py-3.5 px-4 sm:px-6 text-right">{t('dash_col_actions', 'Actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
                  {filteredComplaints.map((item) => {
                    const badge = getStatusBadgeConfig(item.status);
                    const formattedDate = new Date(item.created_at || Date.now()).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    }) + ', ' + new Date(item.created_at || Date.now()).toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    });

                    return (
                      <tr
                        key={item.id || item.complaint_id}
                        onClick={() => handleOpenDetail(item)}
                        className="hover:bg-red-50/30 transition-colors cursor-pointer group"
                      >
                        {/* ID */}
                        <td className="py-3.5 px-4 sm:px-6 font-mono font-bold text-[#800000] whitespace-nowrap">
                          {item.complaint_id}
                        </td>

                        {/* Citizen Name */}
                        <td className="py-3.5 px-4 sm:px-6 font-semibold text-gray-900 whitespace-nowrap">
                          {item.name}
                        </td>

                        {/* Mobile */}
                        <td className="py-3.5 px-4 sm:px-6 text-gray-600 whitespace-nowrap">
                          {item.mobile}
                        </td>

                        {/* Category */}
                        <td className="py-3.5 px-4 sm:px-6 text-gray-700 whitespace-nowrap">
                          <span className="capitalize">{item.category?.replace(/_/g, ' ')}</span>
                        </td>

                        {/* Status Badge */}
                        <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${badge.bgClass}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${badge.dotClass}`}></span>
                            <span>{badge.label}</span>
                          </span>
                        </td>

                        {/* Date */}
                        <td className="py-3.5 px-4 sm:px-6 text-gray-500 whitespace-nowrap">
                          {formattedDate}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDetail(item);
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold text-[#800000] bg-red-50 hover:bg-red-100 transition cursor-pointer border border-red-200/80"
                          >
                            <Eye size={13} />
                            <span>{t('dash_view_details', 'View')}</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

        </div>

      </main>

      {/* DETAIL MODAL WITH LIVE STATUS UPDATE */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative max-h-[90vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              onClick={handleCloseDetail}
              className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition cursor-pointer"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {/* Modal Header */}
            <div className="border-b border-gray-200 pb-4 mb-6">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                {t('dash_modal_title', 'Complaint Details')}
              </span>
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black text-[#800000] font-mono">
                  {selectedComplaint.complaint_id}
                </h2>
                <button
                  type="button"
                  onClick={() => handleCopyId(selectedComplaint.complaint_id)}
                  className="p-1 rounded-md text-gray-400 hover:text-[#800000] border border-gray-200 hover:bg-red-50 text-xs transition"
                  title="Copy ID"
                >
                  {copiedId ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            {/* Feedback Banners */}
            {updateSuccessMsg && (
              <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span>{updateSuccessMsg}</span>
              </div>
            )}

            {updateErrorMsg && (
              <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-2 animate-in fade-in">
                <AlertCircle size={16} className="text-red-600 shrink-0" />
                <span>{updateErrorMsg}</span>
              </div>
            )}

            {/* Complaint Info Grid */}
            <div className="space-y-4 text-xs sm:text-sm">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50/70 p-4 rounded-xl border border-gray-200/70">
                <div>
                  <span className="text-gray-400 block text-[11px] font-bold uppercase mb-0.5">{t('dash_col_citizen', 'Citizen Name')}</span>
                  <span className="font-bold text-gray-900">{selectedComplaint.name}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[11px] font-bold uppercase mb-0.5">{t('dash_col_mobile', 'Mobile Number')}</span>
                  <a href={`tel:${selectedComplaint.mobile}`} className="font-bold text-[#800000] hover:underline">
                    {selectedComplaint.mobile}
                  </a>
                </div>
                <div>
                  <span className="text-gray-400 block text-[11px] font-bold uppercase mb-0.5">{t('dash_col_category', 'Category')}</span>
                  <span className="font-semibold text-gray-800 capitalize">{selectedComplaint.category?.replace(/_/g, ' ')}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[11px] font-bold uppercase mb-0.5">{t('dash_col_date', 'Submitted Date')}</span>
                  <span className="font-semibold text-gray-800">
                    {new Date(selectedComplaint.created_at || Date.now()).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Address */}
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <MapPin size={14} className="text-[#800000]" />
                  <span>{t('dash_modal_address', 'Address & Location')}</span>
                </h4>
                <div className="bg-white p-3.5 rounded-xl border border-gray-200 text-gray-800 leading-relaxed text-xs sm:text-sm">
                  <p>{selectedComplaint.address || 'Address not provided'}</p>
                  {selectedComplaint.latitude && selectedComplaint.longitude && (
                    <p className="mt-1 text-xs text-blue-700 font-semibold flex items-center gap-1">
                      <span>GPS: {selectedComplaint.latitude}, {selectedComplaint.longitude}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <FileText size={14} className="text-[#800000]" />
                  <span>{t('dash_modal_description', 'Full Description')}</span>
                </h4>
                <div className="bg-white p-3.5 rounded-xl border border-gray-200 text-gray-800 leading-relaxed text-xs sm:text-sm whitespace-pre-wrap">
                  {selectedComplaint.description}
                </div>
              </div>

              {/* Attachments */}
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Paperclip size={14} className="text-[#800000]" />
                  <span>{t('dash_modal_attachments', 'Attachments')}</span>
                </h4>
                {selectedComplaint.attachments && Array.isArray(selectedComplaint.attachments) && selectedComplaint.attachments.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {selectedComplaint.attachments.map((att, idx) => (
                      <div key={idx} className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between gap-2">
                        <span className="truncate text-xs font-medium text-gray-800">{att.name || `Attachment ${idx + 1}`}</span>
                        {att.url && (
                          <a
                            href={att.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 text-[#800000] hover:bg-red-50 rounded"
                            title="Open file"
                          >
                            <ExternalLink size={14} />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic bg-gray-50 p-3 rounded-xl border border-gray-200/70">
                    {t('dash_modal_no_attachments', 'No attachments uploaded with this complaint.')}
                  </p>
                )}
              </div>

              {/* Status History Section */}
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} className="text-[#800000]" />
                    <span>{t('dash_modal_status_history', 'Status History')}</span>
                  </span>
                  {statusHistory.length > 0 && (
                    <span className="text-[11px] font-medium text-gray-400">
                      {statusHistory.length} {statusHistory.length === 1 ? 'record' : 'records'}
                    </span>
                  )}
                </h4>

                {loadingHistory ? (
                  <div className="flex items-center gap-2 p-3 text-xs text-gray-500 bg-gray-50 rounded-xl border border-gray-200">
                    <Loader2 size={14} className="animate-spin text-[#800000]" />
                    <span>Loading history...</span>
                  </div>
                ) : statusHistory.length > 0 ? (
                  <div className="bg-gray-50/80 rounded-xl border border-gray-200/80 p-3.5 space-y-3">
                    <div className="relative pl-5 space-y-3 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                      {statusHistory.map((item, idx) => {
                        const badge = getStatusBadgeConfig(item.status);
                        const formattedTime = new Date(item.changed_at).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        }) + ', ' + new Date(item.changed_at).toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true
                        });

                        return (
                          <div key={item.id || idx} className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                            <span className="absolute -left-5 top-1.5 w-2 h-2 rounded-full bg-[#800000] ring-3 ring-red-100" />
                            
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badge.bgClass}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${badge.dotClass}`} />
                                <span>{badge.label}</span>
                              </span>
                              {item.changed_by && (
                                <span className="text-[11px] text-gray-500">
                                  by <span className="text-gray-700 font-semibold">{item.changed_by}</span>
                                </span>
                              )}
                            </div>

                            <span className="text-[11px] text-gray-500 font-mono">
                              {formattedTime}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic bg-gray-50 p-3 rounded-xl border border-gray-200/70">
                    {t('dash_modal_no_history', 'No status change history recorded yet.')}
                  </p>
                )}
              </div>

              {/* STATUS UPDATE ACTION SECTION */}
              <div className="mt-6 pt-5 border-t border-gray-200 bg-red-50/40 p-4 sm:p-5 rounded-xl border border-red-100">
                <label className="block text-xs font-bold text-[#800000] uppercase tracking-wider mb-2">
                  {t('dash_modal_status_update', 'Update Grievance Status')}
                </label>
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <select
                    value={statusUpdateVal}
                    onChange={(e) => setStatusUpdateVal(e.target.value)}
                    className="w-full sm:flex-1 px-4 py-2.5 rounded-lg sm:rounded-xl border border-gray-300 bg-white text-xs sm:text-sm font-semibold text-gray-900 focus:border-[#800000] focus:ring-2 focus:ring-[#800000]/10 focus:outline-none cursor-pointer"
                  >
                    <option value="submitted">{t('dash_status_submitted', 'Submitted')}</option>
                    <option value="under_review">{t('dash_status_under_review', 'Under Review')}</option>
                    <option value="assigned">{t('dash_status_assigned', 'Assigned')}</option>
                    <option value="action_taken">{t('dash_status_action_taken', 'Action Taken')}</option>
                    <option value="resolved">{t('dash_status_resolved', 'Resolved')}</option>
                    <option value="rejected">{t('dash_status_rejected', 'Rejected')}</option>
                  </select>

                  <button
                    type="button"
                    onClick={handleUpdateStatus}
                    disabled={isUpdatingStatus || statusUpdateVal === selectedComplaint.status}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-lg sm:rounded-xl bg-[#800000] hover:bg-[#680000] text-white text-xs sm:text-sm font-bold shadow-xs transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                  >
                    {isUpdatingStatus ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        <span>{t('dash_modal_updating', 'Updating...')}</span>
                      </>
                    ) : (
                      <span>{t('dash_modal_update_btn', 'Save Status')}</span>
                    )}
                  </button>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
              <button
                type="button"
                onClick={handleCloseDetail}
                className="px-5 py-2 rounded-xl text-xs sm:text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition cursor-pointer"
              >
                {t('dash_close', 'Close')}
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

export default Dashboard;
