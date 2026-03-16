import { useState, useEffect, useRef } from 'react';
import { X, Eye, FileText, Upload, CheckCircle, Clock, AlertCircle, User, Activity, MessageSquare, Send, Paperclip, RefreshCw, ChevronDown } from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const OrderDetails = ({ order, onClose }) => {
  const [activeTab, setActiveTab] = useState('itr-details');
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [itrData, setItrData] = useState(null);
  const [loadingItr, setLoadingItr] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [requesting, setRequesting] = useState(false);
  const [uploadingRequestId, setUploadingRequestId] = useState(null);
  const [syncCooldown, setSyncCooldown] = useState(0);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(order.status);
  const [statusChanged, setStatusChanged] = useState(false);
  const [statusRemarks, setStatusRemarks] = useState('');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const statusDropdownRef = useRef(null);
  const fileInputRef = useRef(null);
  const { user } = useAuth();
  const isAdminOrCA = user?.role === 'admin' || user?.role === 'ca';

  // Handle sync cooldown timer
  useEffect(() => {
    let timer;
    if (syncCooldown > 0) {
      timer = setInterval(() => {
        setSyncCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [syncCooldown]);

  // Handle clicks outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target)) {
        setShowStatusDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchItrDetails = async () => {
      // Set initial data from props if available for immediate responsiveness
      if (order.originalData && order.originalData.personalInfo) {
        setItrData(order.originalData);
      }

      // Always fetch fresh data to ensure we have the latest updates (e.g., requested docs)
      const idToFetch = order.itrId || order.originalData?.itrId || order.originalData?._id || order.id;
      if (!idToFetch) return;

      try {
        setLoadingItr(true);
        const { data } = await api.get(`/itr/${idToFetch}`);
        if (data.success) {
          setItrData(data.data);
          setSelectedStatus(data.data.status);
          setStatusChanged(false);
        }
      } catch (error) {
        console.error('Error fetching ITR details:', error);
      } finally {
        setLoadingItr(false);
      }
    };

    fetchItrDetails();
  }, [order.id, order.itrId, order.originalData]);

  const handleUpdateStatus = async () => {
    const idToUpdate = itrData?._id || order.itrId || order.originalData?._id || order.id;
    if (!idToUpdate) return;

    try {
      setUpdatingStatus(true);
      const { data } = await api.put(`/itr/${idToUpdate}/status`, {
        status: selectedStatus,
        remarks: statusRemarks
      });
      if (data.success) {
        setItrData(data.data);
        setStatusChanged(false);
        setStatusRemarks('');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Use real data from itrData if available
  const clientDocuments = itrData?.uploadedDocs || [];
  const caDocuments = []; // This would ideally also come from ITR data once implemented

  const handleSelectAll = () => {
    const docs = activeTab === 'client-docs' ? clientDocuments : caDocuments;
    if (selectedDocs.length === docs.length) {
      setSelectedDocs([]);
    } else {
      setSelectedDocs(docs.map(doc => doc.id));
    }
  };

  const handleSelectDoc = (docId) => {
    if (selectedDocs.includes(docId)) {
      setSelectedDocs(selectedDocs.filter(id => id !== docId));
    } else {
      setSelectedDocs([...selectedDocs, docId]);
    }
  };

  const handleDownloadSelected = () => {
    console.log('Downloading documents:', selectedDocs);
    // Implement download logic
  };

  const handleViewDocument = (doc) => {
    if (doc.fileUrl) {
      window.open(doc.fileUrl, '_blank');
    }
  };

  const handleDownloadDocument = (doc) => {
    if (doc.fileUrl) {
      const link = document.createElement('a');
      link.href = doc.fileUrl;
      link.download = doc.fileName || 'document';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      verified: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle, label: 'Verified' },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock, label: 'Pending Review' },
      rejected: { bg: 'bg-red-100', text: 'text-red-700', icon: AlertCircle, label: 'Rejected' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
        <Icon size={12} />
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';

    // If it's already a formatted string like "17/03/2026", return it or try to parse
    // But en-IN toLocaleDateString is common.
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      // If parsing failed, it might already be formatted. Check for basic date patterns.
      if (typeof dateString === 'string' && (dateString.includes('/') || dateString.includes('-'))) {
        return dateString;
      }
      return 'Invalid Date';
    }

    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSendRequest = async () => {
    if (!requestMessage.trim()) return;
    try {
      setRequesting(true);
      const { data } = await api.post(`/itr/${itrData._id}/request-document`, { message: requestMessage });
      if (data.success) {
        setItrData(data.data);
        setRequestMessage('');
      }
    } catch (error) {
      console.error('Error sending document request:', error);
    } finally {
      setRequesting(false);
    }
  };

  const handleRefresh = async () => {
    if (syncCooldown > 0) return;

    // Correctly resolve ID based on where the component is used (Admin vs User)
    const idToFetch = itrData?._id || order.itrId || order.originalData?._id || order.id;
    if (!idToFetch) {
      console.warn('Could not find ITR ID to refresh');
      return;
    }

    try {
      setLoadingItr(true);
      const { data } = await api.get(`/itr/${idToFetch}`);
      if (data.success) {
        setItrData(data.data);
        setSyncCooldown(30); // 30 seconds cooldown
      }
    } catch (error) {
      console.error('Error refreshing ITR details:', error);
    } finally {
      setLoadingItr(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !uploadingRequestId) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      // 1. Upload the file
      const uploadRes = await api.post('/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (uploadRes.data.success) {
        const documentId = uploadRes.data.data._id;

        // 2. Link it to the request
        const { data } = await api.put(`/itr/${itrData._id}/request/${uploadingRequestId}/fulfill`, {
          documentId
        });

        if (data.success) {
          setItrData(data.data);
          setUploadingRequestId(null);
        }
      }
    } catch (error) {
      console.error('Error uploading document:', error);
    }
  };

  const triggerUpload = (requestId) => {
    setUploadingRequestId(requestId);
    fileInputRef.current.click();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden transition-all duration-500 scale-100 animate-in fade-in zoom-in-95">
        {/* Header - Balanced Compact */}
        <div className="relative bg-[#2563eb] p-6 text-white flex-shrink-0 z-20">
          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-white/5 rounded-full blur-3xl overflow-hidden pointer-events-none"></div>

          <div className="relative flex items-center justify-between mb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <h2 className="text-2xl font-bold tracking-tight">Order Insight</h2>
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-black bg-white/20 backdrop-blur-md border border-white/10 uppercase tracking-widest">
                  #{order.id.slice(-6).toUpperCase()}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <p className="text-blue-50 text-[11px] flex items-center gap-1.5 opacity-80 font-medium">
                  <Clock size={11} className="opacity-70" />
                  Placed {formatDate(order.date)}
                </p>
                {itrData && itrData.updatedAt && (
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-1 rounded-full bg-white/30 hidden sm:block"></div>
                    <p className="text-blue-50 text-[11px] flex items-center gap-1.5 font-bold">
                      <CheckCircle size={11} className="text-blue-200" />
                      Status: {itrData.status} at {formatDate(itrData.updatedAt)}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-2xl transition-all group"
            >
              <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>

          <div className="relative grid grid-cols-3 gap-3">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/5">
              <p className="text-blue-100 text-[9px] uppercase font-black opacity-70 mb-1 tracking-wider">Plan</p>
              <p className="font-bold text-xs truncate">{order.service}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/5">
              <p className="text-blue-100 text-[9px] uppercase font-black opacity-70 mb-1 tracking-wider">Investment</p>
              <p className="font-black text-base">{order.amount}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/5 flex flex-col justify-center">
              <p className="text-blue-100 text-[9px] uppercase font-black opacity-70 mb-1 tracking-wider">Status</p>
              {isAdminOrCA ? (
                <div className="flex flex-col gap-1.5">
                  <div className="relative" ref={statusDropdownRef}>
                    <div
                      onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                      className="flex items-center justify-between bg-white/10 border border-white/5 rounded-lg px-2.5 py-1.5 hover:bg-white/20 transition-all cursor-pointer group"
                    >
                      <span className="text-white text-[11px] font-bold uppercase tracking-wider">
                        {selectedStatus}
                      </span>
                      <ChevronDown size={12} className={`text-white/60 transition-transform duration-300 ${showStatusDropdown ? 'rotate-180' : ''}`} />
                    </div>

                    {showStatusDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-2xl py-1 z-[100] animate-in fade-in zoom-in-95 duration-200 border border-slate-200 overflow-hidden">
                        {['Pending', 'CA Reviewing', 'Filed', 'Completed', 'Rejected'].map((status) => (
                          <div
                            key={status}
                            onClick={() => {
                              setSelectedStatus(status);
                              setStatusChanged(status !== (itrData?.status || order.status));
                              setShowStatusDropdown(false);
                            }}
                            className={`px-3 py-2 text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-colors flex items-center gap-2 ${selectedStatus === status
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-slate-600 hover:bg-slate-50'
                              }`}
                          >
                            <div className={`w-1.5 h-1.5 rounded-full ${status === 'Completed' ? 'bg-green-500' :
                                status === 'Rejected' ? 'bg-red-500' :
                                  status === 'Pending' ? 'bg-amber-500' : 'bg-blue-500'
                              }`}></div>
                            {status}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {itrData?.updatedAt && !statusChanged && (
                    <p className="text-[9px] text-blue-100/50 font-medium italic mt-0.5">
                      Last update: {formatDate(itrData.updatedAt)}
                    </p>
                  )}
                  {statusChanged && (
                    <div className="flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-1 duration-300 mt-1">
                      <textarea
                        value={statusRemarks}
                        onChange={(e) => setStatusRemarks(e.target.value)}
                        placeholder="Add remarks for user..."
                        className="bg-white/10 border border-white/20 rounded-lg p-2 text-[10px] text-white placeholder:text-blue-100/40 focus:outline-none focus:ring-1 focus:ring-white/30 resize-none h-14"
                      />
                      <button
                        onClick={handleUpdateStatus}
                        disabled={updatingStatus}
                        className="flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-800 disabled:opacity-50 text-white px-2 py-2 rounded-lg text-[9px] font-black tracking-widest transition-all shadow-lg shadow-emerald-900/20"
                      >
                        {updatingStatus ? (
                          <Activity size={10} className="animate-spin" />
                        ) : (
                          <Send size={10} />
                        )}
                        UPDATE & SEND MAIL
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                 <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${(itrData?.status || order.status)?.toLowerCase() === 'completed' ? 'bg-green-400' : 'bg-yellow-400'
                      }`}></div>
                    <p className="font-bold capitalize text-xs">{(itrData?.status || order.status)?.replace('-', ' ')}</p>
                  </div>
                  {itrData?.updatedAt && (
                    <p className="text-[9px] text-blue-200/60 font-medium ml-3 italic">
                      {formatDate(itrData.updatedAt)}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs - Sleek */}
        <div className="bg-slate-50 border-b border-slate-200 flex-shrink-0 px-6">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('itr-details')}
              className={`relative px-1 py-4 font-bold text-sm transition-all duration-300 ${activeTab === 'itr-details' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
                }`}
            >
              Filled Form Details
              {activeTab === 'itr-details' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#2563eb] rounded-t-full"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('ca-docs')}
              className={`relative px-1 py-4 font-bold text-sm transition-all duration-300 ${activeTab === 'ca-docs' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
                }`}
            >
              {isAdminOrCA ? 'Request Document from User' : 'Requested Documents by CA'}
              {activeTab === 'ca-docs' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#2563eb] rounded-t-full"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`relative px-1 py-4 font-bold text-sm transition-all duration-300 ${activeTab === 'chat' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
                }`}
            >
              Chat
              {activeTab === 'chat' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#2563eb] rounded-t-full"></div>
              )}
            </button>

            {isAdminOrCA && (
              <button
                onClick={handleRefresh}
                disabled={loadingItr || syncCooldown > 0}
                className={`px-3 py-4 transition-all duration-300 flex items-center gap-1.5 ${loadingItr || syncCooldown > 0
                    ? 'cursor-not-allowed opacity-50 text-slate-400'
                    : 'cursor-pointer text-slate-500 hover:text-blue-600'
                  }`}
                title={syncCooldown > 0 ? `Please wait ${syncCooldown}s` : "Refresh Data"}
              >
                <RefreshCw size={16} className={loadingItr ? 'animate-spin text-blue-600' : ''} />
                <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                  {syncCooldown > 0 ? `Wait ${syncCooldown}s` : 'Sync'}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto bg-white">
          <div className="p-6 space-y-8">

            {/* Documents List */}
            {activeTab === 'itr-details' ? (
              <div className="space-y-8 animate-in fade-in duration-500">
                {loadingItr ? (
                  <div className="text-center py-12">
                    <Activity className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                    <p className="text-slate-600">Fetching filled form details...</p>
                  </div>
                ) : itrData ? (
                  <>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <User className="text-blue-600" />
                        Personal Information
                      </h3>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(itrData.personalInfo || {}).map(([key, value]) => {
                          if (typeof value === 'object') return null;
                          const label = key
                            .replace(/([A-Z])/g, ' $1')
                            .replace(/^./, str => str.toUpperCase());

                          return (
                            <div key={key} className="group bg-slate-50 rounded-2xl p-4 border border-slate-100 hover:border-blue-200 hover:bg-white hover:shadow-md transition-all duration-300">
                              <p className="text-[10px] text-blue-600 uppercase font-black mb-1.5 opacity-70 tracking-tight">{label}</p>
                              <p className="font-bold text-slate-800 text-[13px] break-words line-clamp-2" title={value?.toString()}>{value?.toString() || '—'}</p>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {itrData.incomeDetails && Object.keys(itrData.incomeDetails).length > 0 && (
                      <div className="pt-8 border-t border-slate-200">
                        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                          <AlertCircle className="text-blue-600" />
                          Income Details
                        </h3>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {Object.entries(itrData.incomeDetails).map(([key, value]) => {
                            if (typeof value === 'object') return null;
                            const label = key
                              .replace(/([A-Z])/g, ' $1')
                              .replace(/^./, str => str.toUpperCase());

                            return (
                              <div key={key} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                <p className="text-xs text-slate-500 uppercase font-bold mb-1 tracking-wider">{label}</p>
                                <p className="font-semibold text-slate-900">{value?.toString() || 'N/A'}</p>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {itrData.uploadedDocs && itrData.uploadedDocs.length > 0 && (
                      <div className="pt-8 border-t border-slate-200">
                        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                          <Upload className="text-blue-600" />
                          Uploaded Documents
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          {itrData.uploadedDocs.map((doc, index) => (
                            <div key={doc._id || index} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                  <FileText size={20} />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-bold text-slate-900 truncate max-w-[200px]">
                                    {doc.fileName || 'Document'}
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    {formatDate(doc.uploadedAt || doc.createdAt)}
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleViewDocument(doc)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="View"
                                >
                                  <Eye size={18} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                    <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600 font-medium">No filled form data found for this order.</p>
                  </div>
                )}
              </div>
            ) : activeTab === 'ca-docs' ? (
              <div className="space-y-6 animate-in fade-in duration-500">
                {/* Admin/CA: Request Form Section */}
                {isAdminOrCA && (
                  <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
                    <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Upload size={16} className="text-blue-600" />
                      New Document Request
                    </h4>
                    <div className="space-y-4">
                      <textarea
                        rows={4}
                        value={requestMessage}
                        onChange={(e) => setRequestMessage(e.target.value)}
                        placeholder="Type the list of documents you need from the user (e.g., 1. Form 16, 2. Bank Statements...)"
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none transition-all"
                      ></textarea>
                      <div className="flex justify-end">
                        <button
                          onClick={handleSendRequest}
                          disabled={requesting || !requestMessage.trim()}
                          className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {requesting ? <Activity size={14} className="animate-spin" /> : <Send size={14} />}
                          Send Request to User
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* History/User Section */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-900 px-2 flex items-center gap-2">
                    <FileText size={16} className="text-blue-600" />
                    {isAdminOrCA ? 'Request History' : 'Active Requests'}
                  </h4>

                  {itrData?.documentRequests && itrData.documentRequests.length > 0 ? (
                    [...itrData.documentRequests].reverse().map((req, idx) => (
                      <div key={req._id || idx} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex justify-between items-start mb-3">
                          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                            Requested {formatDate(req.requestedAt)}
                          </p>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase transition-colors ${req.status === 'Fulfilled' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                            {req.status}
                          </span>
                        </div>
                        <p className="text-[13px] text-slate-700 font-medium mb-4 leading-relaxed whitespace-pre-wrap">
                          {req.message}
                        </p>

                        {/* User: Upload Action */}
                        {!isAdminOrCA && req.status !== 'Fulfilled' && (
                          <button
                            onClick={() => triggerUpload(req._id)}
                            className="w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all border border-blue-200/50"
                          >
                            <Paperclip size={14} />
                            Upload Requested Document
                          </button>
                        )}

                        {/* Show Fulfillment Badge if completed */}
                        {req.status === 'Fulfilled' && (
                          <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50/50 p-2 rounded-lg border border-emerald-100">
                            <CheckCircle size={14} />
                            <span className="text-[11px] font-bold">Document successfully submitted</span>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                      <FileText className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                      <p className="text-slate-600 font-medium text-sm">No active requests found.</p>
                    </div>
                  )}
                </div>
              </div>
            ) : activeTab === 'chat' ? (
              <div className="flex flex-col h-[400px] animate-in fade-in duration-500">
                <div className="flex-1 bg-slate-50 rounded-2xl border border-slate-200 p-4 overflow-y-auto mb-4">
                  <div className="flex flex-col items-center justify-center h-full opacity-40">
                    <MessageSquare size={48} className="text-slate-400 mb-2" />
                    <p className="text-sm font-bold uppercase tracking-widest text-slate-500">Chat with Client Coming Soon</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type a message to the client..."
                    className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    disabled
                  />
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm opacity-50 cursor-not-allowed">
                    Send
                  </button>
                </div>
              </div>
            ) : null}

          </div>
        </div>

        {/* Footer - Balanced */}
        <div className="border-t border-slate-200 p-6 bg-slate-50 flex-shrink-0">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-10 py-3 bg-white border border-slate-300 text-slate-700 rounded-2xl font-bold text-sm hover:bg-slate-50 hover:border-slate-400 transition-all shadow-sm"
            >
              Close Insight
            </button>
          </div>
        </div>
      </div>

      {/* Hidden File Input for fulfilling requests */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Request Document Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900">Request Document</h3>
              <button
                onClick={() => setShowRequestModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Document Type
                </label>
                <select className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select document type</option>
                  <option value="form16">Form 16</option>
                  <option value="form26as">Form 26AS</option>
                  <option value="ais">Annual Information Statement</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Message to Client
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Please provide additional details..."
                ></textarea>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    console.log('Document requested');
                    setShowRequestModal(false);
                  }}
                  className="flex-1 px-4 py-3 bg-[#2563eb] text-white rounded-xl font-semibold hover:bg-blue-700 transition-all"
                >
                  Send Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
