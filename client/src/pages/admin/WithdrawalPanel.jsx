// client/src/pages/admin/WithdrawalPanel.jsx
// Drop this file in the same folder as your admin dashboard
// Add to admin dashboard:
//   import WithdrawalPanel from './WithdrawalPanel';
//   case 'withdrawals': return <WithdrawalPanel />;
//   { id: 'withdrawals', label: 'Withdrawals', icon: ArrowDownToLine, adminOnly: true }

import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Clock, User, Mail, Phone, Coins, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../../api/axios';

const WithdrawalPanel = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(null);
    const [adminNotes, setAdminNotes] = useState({});
    const [activeNote, setActiveNote] = useState(null);
    const [filter, setFilter] = useState('pending');
    const [allRequests, setAllRequests] = useState([]);
    const [successMsg, setSuccessMsg] = useState('');

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/referral/admin/withdrawals');
            if (data.success) {
                setAllRequests(data.data);
                setRequests(data.data);
            }
        } catch (err) {
            console.error('[WithdrawalPanel] fetch error:', err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };console.log(requests);

    useEffect(() => { fetchRequests(); }, []);

    const handleAction = async (userId, requestId, action) => {
        setProcessing(requestId);
        setSuccessMsg('');
        try {
            const { data } = await api.put(
                `/referral/admin/withdrawals/${userId}/${requestId}`,
                { action, adminNote: adminNotes[requestId] || '' }
            );
            if (data.success) {
                setSuccessMsg(`${data.data.userName}'s withdrawal ${action === 'approve' ? 'approved' : 'rejected'} successfully.`);
                setAdminNotes(prev => ({ ...prev, [requestId]: '' }));
                setActiveNote(null);
                fetchRequests();
                setTimeout(() => setSuccessMsg(''), 4000);
            }
        } catch (err) {
            alert(err.response?.data?.error || 'Action failed. Please try again.');
        } finally {
            setProcessing(null);
        }
    };

    const tierColors = {
        standard: 'bg-slate-700 text-slate-300',
        silver:   'bg-gray-600 text-gray-200',
        gold:     'bg-yellow-900 text-yellow-300',
        partner:  'bg-purple-900 text-purple-300'
    };

    const tierLabels = {
        standard: '⭐ Standard',
        silver:   '🥈 Silver',
        gold:     '🥇 Gold',
        partner:  '💎 Partner'
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-white">Withdrawal Requests</h2>
                    <p className="text-zinc-400 text-sm mt-1">Process coin withdrawal requests within 24 hours</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="bg-amber-500/20 text-amber-400 text-sm font-bold px-3 py-1.5 rounded-full border border-amber-500/30">
                        {requests.length} Pending
                    </span>
                    <button
                        onClick={fetchRequests}
                        className="text-xs text-zinc-400 hover:text-white border border-zinc-700 px-3 py-1.5 rounded-lg transition-colors"
                    >
                        Refresh
                    </button>
                </div>
            </div>

            {/* Success message */}
            {successMsg && (
                <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-xl">
                    <CheckCircle2 size={16} className="text-green-400" />
                    <p className="text-sm text-green-400 font-medium">{successMsg}</p>
                </div>
            )}

            {/* Empty state */}
            {requests.length === 0 ? (
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center">
                    <CheckCircle2 className="mx-auto text-green-500 mb-3" size={36} />
                    <p className="text-zinc-400 font-medium">No pending withdrawal requests</p>
                    <p className="text-zinc-600 text-sm mt-1">All caught up!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {requests.map((req) => (
                        <div key={req.requestId} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-colors">
                            
                            {/* Top row - user info + amount */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-bold text-white text-lg">{req.userName}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${tierColors[req.tier] || tierColors.standard}`}>
                                            {tierLabels[req.tier] || '⭐ Standard'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-sm text-zinc-400">
                                        <Mail size={13} />
                                        <span>{req.userEmail}</span>
                                    </div>
                                    {req.userMobile && !req.userMobile.startsWith('G-') && (
                                        <div className="flex items-center gap-1.5 text-sm text-zinc-400">
                                            <Phone size={13} />
                                            <span>{req.userMobile}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Amount */}
                                <div className="text-right">
                                    <p className="text-3xl font-bold text-white">₹{req.requestedAmount}</p>
                                    <p className="text-xs text-zinc-500 mt-0.5">{req.requestedAmount} coins</p>
                                </div>
                            </div>

                            {/* Stats row */}
                            <div className="grid grid-cols-3 gap-3 p-3 bg-zinc-800/50 rounded-xl mb-4 border border-zinc-800">
                                <div className="text-center">
                                    <p className="text-xs text-zinc-500 mb-0.5">UPI ID</p>
                                    <p className="text-sm font-semibold text-white truncate">{req.upiId || 'Not provided'}</p>
                                </div>
                                <div className="text-center border-x border-zinc-700">
                                    <p className="text-xs text-zinc-500 mb-0.5">Total Referrals</p>
                                    <p className="text-sm font-bold text-blue-400">{req.totalReferrals}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-zinc-500 mb-0.5">Requested</p>
                                    <p className="text-sm font-semibold text-white">
                                        {new Date(req.requestedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                    </p>
                                </div>
                            </div>

                            {/* Admin note input */}
                            {activeNote === req.requestId && (
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        value={adminNotes[req.requestId] || ''}
                                        onChange={e => setAdminNotes(prev => ({ ...prev, [req.requestId]: e.target.value }))}
                                        placeholder="Optional note to user (e.g. payment sent, invalid UPI...)"
                                        className="w-full px-3 py-2.5 text-sm bg-zinc-800 border border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-zinc-500"
                                    />
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex items-center gap-2 flex-wrap">
                                <button
                                    onClick={() => setActiveNote(activeNote === req.requestId ? null : req.requestId)}
                                    className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                                >
                                    {activeNote === req.requestId ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                                    {activeNote === req.requestId ? 'Hide note' : 'Add note'}
                                </button>

                                <div className="flex-1" />

                                <button
                                    onClick={() => handleAction(req.userId, req.requestId, 'reject')}
                                    disabled={processing === req.requestId}
                                    className="flex items-center gap-1.5 px-4 py-2 border border-red-500/40 text-red-400 text-sm font-semibold rounded-xl hover:bg-red-500/10 transition-all disabled:opacity-50"
                                >
                                    <XCircle size={15} />
                                    Reject
                                </button>

                                <button
                                    onClick={() => handleAction(req.userId, req.requestId, 'approve')}
                                    disabled={processing === req.requestId}
                                    className="flex items-center gap-1.5 px-5 py-2 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 transition-all disabled:opacity-50"
                                >
                                    <CheckCircle2 size={15} />
                                    {processing === req.requestId ? 'Processing...' : `Approve ₹${req.requestedAmount}`}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WithdrawalPanel;