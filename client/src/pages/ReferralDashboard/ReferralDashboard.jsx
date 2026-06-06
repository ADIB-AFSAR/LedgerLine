// client/src/pages/ReferralDashboard.jsx
// Add a route for this in App.jsx:
//   <Route path="/dashboard/referrals" element={<ProtectedRoute><ReferralDashboard /></ProtectedRoute>} />

import React, { useEffect, useState } from 'react';
import { Copy, Check, Gift, Users, Coins, ArrowDownToLine, Clock, CheckCircle2, XCircle } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || '/api/v1';

const ReferralDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const [withdrawing, setWithdrawing] = useState(false);
    const [withdrawMsg, setWithdrawMsg] = useState({ text: '', type: '' });

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    const fetchReferral = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/referral/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const json = await res.json();
            if (json.success) setData(json.data);
            else setError(json.error || 'Failed to load referral data');
        } catch {
            setError('Could not connect to server');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchReferral(); }, []);

    const handleCopy = () => {
        if (!data?.referralLink) return;
        navigator.clipboard.writeText(data.referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleWithdraw = async () => {
        if (!data || data.coins < 50) return;
        setWithdrawing(true);
        setWithdrawMsg({ text: '', type: '' });
        try {
            const res = await fetch(`${API}/referral/withdraw`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            const json = await res.json();
            if (json.success) {
                setWithdrawMsg({ text: json.message, type: 'success' });
                fetchReferral(); // Refresh data
            } else {
                setWithdrawMsg({ text: json.error || 'Withdrawal failed', type: 'error' });
            }
        } catch {
            setWithdrawMsg({ text: 'Could not connect to server', type: 'error' });
        } finally {
            setWithdrawing(false);
        }
    };

    const tierColors = {
        standard: 'bg-slate-100 text-slate-600',
        silver:   'bg-gray-200 text-gray-700',
        gold:     'bg-yellow-100 text-yellow-700',
        partner:  'bg-purple-100 text-purple-700'
    };

    const tierLabels = {
        standard: 'Standard',
        silver:   '🥈 Silver',
        gold:     '🥇 Gold Partner',
        partner:  '💎 Premium Partner'
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
    );

    if (error) return (
        <div className="p-6 text-center text-red-500">{error}</div>
    );

    const hasPendingWithdrawal = data?.withdrawalRequests?.some(r => r.status === 'pending');

    return (
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Refer & Earn</h1>
                <p className="text-slate-500 text-sm mt-1">Earn coins for every friend you refer. 1 coin = ₹1.</p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center">
                    <Coins className="mx-auto text-yellow-500 mb-1" size={22} />
                    <p className="text-2xl font-bold text-slate-800">{data.coins}</p>
                    <p className="text-xs text-slate-500">Coin Balance</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center">
                    <Users className="mx-auto text-blue-500 mb-1" size={22} />
                    <p className="text-2xl font-bold text-slate-800">{data.totalReferrals}</p>
                    <p className="text-xs text-slate-500">Referrals</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center">
                    <Gift className="mx-auto text-purple-500 mb-1" size={22} />
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${tierColors[data.referralTier]}`}>
                        {tierLabels[data.referralTier]}
                    </span>
                    <p className="text-xs text-slate-500 mt-1">Your Tier</p>
                </div>
            </div>

            {/* Referral Link */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <p className="text-sm font-semibold text-slate-700 mb-3">Your Referral Link</p>
                <div className="flex gap-2">
                    <input
                        readOnly
                        value={data.referralLink}
                        className="flex-1 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 outline-none"
                    />
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-all"
                    >
                        {copied ? <Check size={15} /> : <Copy size={15} />}
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                </div>
                <p className="text-xs text-slate-400 mt-2">Share this link. When your friend makes their first purchase, you earn coins automatically.</p>
            </div>

            {/* Milestone Progress */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <p className="text-sm font-semibold text-slate-700 mb-4">Milestone Rewards</p>
                <div className="space-y-3">
                    {[
                        { count: 5,  bonus: '₹500 bonus',  tier: 'silver'  },
                        { count: 10, bonus: '₹1,500 bonus', tier: 'gold'    },
                        { count: 25, bonus: 'Partner status', tier: 'partner' }
                    ].map(m => {
                        const reached = data.totalReferrals >= m.count;
                        return (
                            <div key={m.count} className={`flex items-center justify-between p-3 rounded-xl border ${reached ? 'border-green-200 bg-green-50' : 'border-slate-100 bg-slate-50'}`}>
                                <div className="flex items-center gap-3">
                                    {reached
                                        ? <CheckCircle2 size={18} className="text-green-500" />
                                        : <div className="w-4 h-4 rounded-full border-2 border-slate-300" />
                                    }
                                    <span className="text-sm text-slate-700">{m.count} successful referrals</span>
                                </div>
                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${reached ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-500'}`}>
                                    {m.bonus}
                                </span>
                            </div>
                        );
                    })}
                </div>
                {data.totalReferrals < 25 && (
                    <p className="text-xs text-slate-400 mt-3">
                        {25 - data.totalReferrals} more referral{25 - data.totalReferrals !== 1 ? 's' : ''} to reach Premium Partner status
                    </p>
                )}
            </div>

            {/* Withdraw */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <p className="text-sm font-semibold text-slate-700">Withdraw Coins</p>
                        <p className="text-xs text-slate-400 mt-0.5">Minimum 50 coins · 1 coin = ₹1 · Processed within 24 hours</p>
                    </div>
                    <span className="text-lg font-bold text-slate-800">₹{data.coins}</span>
                </div>

                {hasPendingWithdrawal && (
                    <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl mb-3">
                        <Clock size={15} className="text-amber-600" />
                        <p className="text-xs text-amber-700 font-medium">You have a pending withdrawal request. Processing within 24 hours.</p>
                    </div>
                )}

                {withdrawMsg.text && (
                    <div className={`p-3 rounded-xl mb-3 text-xs font-medium ${withdrawMsg.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-600'}`}>
                        {withdrawMsg.text}
                    </div>
                )}

                <button
                    onClick={handleWithdraw}
                    disabled={withdrawing || data.coins < 50 || hasPendingWithdrawal}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-slate-800 text-white font-semibold rounded-xl hover:bg-slate-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed text-sm"
                >
                    <ArrowDownToLine size={16} />
                    {withdrawing ? 'Submitting...' : `Withdraw ₹${data.coins}`}
                </button>

                {data.coins < 50 && !hasPendingWithdrawal && (
                    <p className="text-xs text-slate-400 text-center mt-2">
                        You need at least 50 coins to withdraw. ({50 - data.coins} more needed)
                    </p>
                )}
            </div>

            {/* History Table */}
            {data.referralHistory?.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                    <p className="text-sm font-semibold text-slate-700 mb-4">Earning History</p>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-xs text-slate-400 uppercase border-b border-slate-100">
                                    <th className="text-left pb-2 font-semibold">Friend / Event</th>
                                    <th className="text-left pb-2 font-semibold">Plan</th>
                                    <th className="text-right pb-2 font-semibold">Coins</th>
                                    <th className="text-right pb-2 font-semibold">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {data.referralHistory.map((item, i) => (
                                    <tr key={i} className="py-2">
                                        <td className="py-2.5 text-slate-700 font-medium">
                                            {item.isBonus
                                                ? <span className="text-purple-600">🎁 Milestone Bonus</span>
                                                : item.referredUserName || 'Friend'
                                            }
                                        </td>
                                        <td className="py-2.5 text-slate-500 text-xs">{item.planName}</td>
                                        <td className="py-2.5 text-right font-bold text-green-600">+{item.coinsEarned}</td>
                                        <td className="py-2.5 text-right text-xs text-slate-400">
                                            {new Date(item.earnedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Withdrawal History */}
            {data.withdrawalRequests?.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                    <p className="text-sm font-semibold text-slate-700 mb-4">Withdrawal History</p>
                    <div className="space-y-2">
                        {data.withdrawalRequests.map((r, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                <div className="flex items-center gap-2">
                                    {r.status === 'approved' && <CheckCircle2 size={15} className="text-green-500" />}
                                    {r.status === 'pending'  && <Clock size={15} className="text-amber-500" />}
                                    {r.status === 'rejected' && <XCircle size={15} className="text-red-400" />}
                                    <span className="text-sm text-slate-700 font-medium">₹{r.amount}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                                        r.status === 'approved' ? 'bg-green-100 text-green-700' :
                                        r.status === 'pending'  ? 'bg-amber-100 text-amber-700' :
                                                                   'bg-red-100 text-red-600'
                                    }`}>
                                        {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                                    </span>
                                </div>
                                <span className="text-xs text-slate-400">
                                    {new Date(r.requestedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Terms */}
            <div className="text-xs text-slate-400 space-y-1 pb-4">
                <p className="font-semibold text-slate-500">Terms & Conditions</p>
                <p>• Referral reward is applicable only after successful payment and service completion.</p>
                <p>• Self-referrals are strictly not allowed.</p>
                <p>• Rewards apply to your friend's first purchase only.</p>
                <p>• Cancelled or refunded orders do not qualify for referral rewards.</p>
                <p>• Powerfiling reserves the right to modify or discontinue this program at any time.</p>
            </div>
        </div>
    );
};

export default ReferralDashboard;