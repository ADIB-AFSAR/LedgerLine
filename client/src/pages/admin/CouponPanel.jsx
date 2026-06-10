// client/src/pages/admin/CouponPanel.jsx
// Add to admin dashboard:
//   import CouponPanel from './CouponPanel';
//   case 'coupons': return <CouponPanel />;
//   { id: 'coupons', label: 'Coupons', icon: Tag, adminOnly: true }

import { useEffect, useState } from 'react';
import { Plus, Trash2, Edit2, Check, X, RefreshCw, Copy, ToggleLeft, ToggleRight, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../../api/axios';

const EMPTY_FORM = {
    code: '',
    description: '',
    discountAmount: '',
    expiresAt: '',
    isActive: true
};

const CouponPanel = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [expandedId, setExpandedId] = useState(null);
    const [copied, setCopied] = useState('');

    const fetchCoupons = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/coupons');
            if (data.success) setCoupons(data.data);
        } catch (err) {
            console.error('[CouponPanel] fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCoupons(); }, []);

    const handleGenerateCode = async () => {
        try {
            const { data } = await api.get('/coupons/generate-code');
            if (data.success) setForm(prev => ({ ...prev, code: data.code }));
        } catch (err) {
            console.error('Generate code error:', err);
        }
    };

    const handleCopy = (code) => {
        navigator.clipboard.writeText(code);
        setCopied(code);
        setTimeout(() => setCopied(''), 2000);
    };

    const handleSubmit = async () => {
        setError('');
        if (!form.code.trim()) return setError('Coupon code is required');
        if (!form.discountAmount || form.discountAmount <= 0) return setError('Discount amount must be greater than 0');

        setSubmitting(true);
        try {
            if (editingId) {
                await api.put(`/coupons/${editingId}`, {
                    description: form.description,
                    discountAmount: Number(form.discountAmount),
                    expiresAt: form.expiresAt || null,
                    isActive: form.isActive
                });
                setSuccessMsg('Coupon updated successfully');
            } else {
                await api.post('/coupons', {
                    code: form.code,
                    description: form.description,
                    discountAmount: Number(form.discountAmount),
                    expiresAt: form.expiresAt || null,
                    isActive: form.isActive
                });
                setSuccessMsg('Coupon created successfully');
            }
            setShowForm(false);
            setEditingId(null);
            setForm(EMPTY_FORM);
            fetchCoupons();
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (coupon) => {
        setEditingId(coupon._id);
        setForm({
            code: coupon.code,
            description: coupon.description || '',
            discountAmount: coupon.discountAmount,
            expiresAt: coupon.expiresAt
                ? new Date(coupon.expiresAt).toISOString().split('T')[0]
                : '',
            isActive: coupon.isActive
        });
        setShowForm(true);
        setError('');
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this coupon? This cannot be undone.')) return;
        try {
            await api.delete(`/coupons/${id}`);
            setSuccessMsg('Coupon deleted');
            fetchCoupons();
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Delete failed');
        }
    };

    const handleToggle = async (coupon) => {
        try {
            await api.put(`/coupons/${coupon._id}`, { isActive: !coupon.isActive });
            fetchCoupons();
        } catch (err) {
            console.error('Toggle error:', err);
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingId(null);
        setForm(EMPTY_FORM);
        setError('');
    };

    const isExpired = (expiresAt) => expiresAt && new Date() > new Date(expiresAt);

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
                    <h2 className="text-xl font-bold text-white">Coupon Manager</h2>
                    <p className="text-zinc-400 text-sm mt-1">Create and manage discount coupons · Single use per user · Max 50% of plan price</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={fetchCoupons}
                        className="p-2 text-zinc-400 hover:text-white border border-zinc-700 rounded-lg transition-colors"
                    >
                        <RefreshCw size={16} />
                    </button>
                    <button
                        onClick={() => { setShowForm(true); setEditingId(null); setForm(EMPTY_FORM); setError(''); }}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-all"
                    >
                        <Plus size={16} />
                        New Coupon
                    </button>
                </div>
            </div>

            {/* Success message */}
            {successMsg && (
                <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-xl">
                    <Check size={16} className="text-green-400" />
                    <p className="text-sm text-green-400 font-medium">{successMsg}</p>
                </div>
            )}

            {/* Create / Edit Form */}
            {showForm && (
                <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-5">
                    <h3 className="text-white font-bold mb-4">
                        {editingId ? 'Edit Coupon' : 'Create New Coupon'}
                    </h3>

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl mb-4">
                            <p className="text-sm text-red-400">{error}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Code */}
                        <div>
                            <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
                                Coupon Code *
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={form.code}
                                    onChange={e => setForm(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                                    disabled={!!editingId}
                                    placeholder="e.g. SAVE200"
                                    className="flex-1 px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed uppercase"
                                />
                                {!editingId && (
                                    <button
                                        type="button"
                                        onClick={handleGenerateCode}
                                        className="px-3 py-2.5 bg-zinc-700 text-zinc-300 text-xs rounded-xl hover:bg-zinc-600 transition-colors whitespace-nowrap"
                                    >
                                        Auto
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Discount Amount */}
                        <div>
                            <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
                                Discount Amount (₹) *
                            </label>
                            <input
                                type="number"
                                value={form.discountAmount}
                                onChange={e => setForm(prev => ({ ...prev, discountAmount: e.target.value }))}
                                placeholder="e.g. 200"
                                min="1"
                                className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
                                Description
                            </label>
                            <input
                                type="text"
                                value={form.description}
                                onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="e.g. Diwali Special Offer"
                                className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Expiry Date */}
                        <div>
                            <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
                                Expiry Date <span className="text-zinc-500 normal-case font-normal">(leave empty = never)</span>
                            </label>
                            <input
                                type="date"
                                value={form.expiresAt}
                                onChange={e => setForm(prev => ({ ...prev, expiresAt: e.target.value }))}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Active toggle */}
                    <div className="flex items-center gap-3 mt-4">
                        <button
                            type="button"
                            onClick={() => setForm(prev => ({ ...prev, isActive: !prev.isActive }))}
                            className={`relative w-10 h-6 rounded-full transition-colors ${form.isActive ? 'bg-green-500' : 'bg-zinc-600'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${form.isActive ? 'translate-x-5' : 'translate-x-1'}`} />
                        </button>
                        <span className="text-sm text-zinc-300">{form.isActive ? 'Active' : 'Inactive'}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 mt-5">
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50"
                        >
                            <Check size={15} />
                            {submitting ? 'Saving...' : editingId ? 'Update Coupon' : 'Create Coupon'}
                        </button>
                        <button
                            onClick={handleCancel}
                            className="flex items-center gap-2 px-5 py-2.5 border border-zinc-700 text-zinc-400 text-sm font-semibold rounded-xl hover:bg-zinc-800 transition-all"
                        >
                            <X size={15} />
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Coupon List */}
            {coupons.length === 0 ? (
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center">
                    <p className="text-zinc-400">No coupons yet. Create your first one!</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {coupons.map(coupon => (
                        <div
                            key={coupon._id}
                            className={`bg-zinc-900 border rounded-2xl overflow-hidden transition-colors ${
                                !coupon.isActive || isExpired(coupon.expiresAt)
                                    ? 'border-zinc-800 opacity-60'
                                    : 'border-zinc-700 hover:border-zinc-600'
                            }`}
                        >
                            <div className="p-4 flex items-center justify-between gap-4">
                                {/* Code + info */}
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div
                                        className="flex items-center gap-1.5 bg-zinc-800 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-zinc-700 transition-colors"
                                        onClick={() => handleCopy(coupon.code)}
                                    >
                                        <span className="font-mono font-bold text-white text-sm">{coupon.code}</span>
                                        {copied === coupon.code
                                            ? <Check size={13} className="text-green-400" />
                                            : <Copy size={13} className="text-zinc-400" />
                                        }
                                    </div>

                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-sm font-bold text-green-400">₹{coupon.discountAmount} off</span>
                                            {coupon.description && (
                                                <span className="text-xs text-zinc-400 truncate">{coupon.description}</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                                                !coupon.isActive ? 'bg-zinc-700 text-zinc-400' :
                                                isExpired(coupon.expiresAt) ? 'bg-red-900/40 text-red-400' :
                                                'bg-green-900/40 text-green-400'
                                            }`}>
                                                {!coupon.isActive ? 'Inactive' : isExpired(coupon.expiresAt) ? 'Expired' : 'Active'}
                                            </span>
                                            <span className="text-xs text-zinc-500">
                                                {coupon.totalUses} use{coupon.totalUses !== 1 ? 's' : ''}
                                            </span>
                                            {coupon.expiresAt && (
                                                <span className="text-xs text-zinc-500">
                                                    Expires {new Date(coupon.expiresAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </span>
                                            )}
                                            {!coupon.expiresAt && (
                                                <span className="text-xs text-zinc-500">No expiry</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-1.5 shrink-0">
                                    <button
                                        onClick={() => handleToggle(coupon)}
                                        title={coupon.isActive ? 'Deactivate' : 'Activate'}
                                        className="p-2 rounded-lg hover:bg-zinc-800 transition-colors"
                                    >
                                        {coupon.isActive
                                            ? <ToggleRight size={18} className="text-green-400" />
                                            : <ToggleLeft size={18} className="text-zinc-500" />
                                        }
                                    </button>
                                    <button
                                        onClick={() => handleEdit(coupon)}
                                        className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => setExpandedId(expandedId === coupon._id ? null : coupon._id)}
                                        className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                                    >
                                        {expandedId === coupon._id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(coupon._id)}
                                        className="p-2 rounded-lg hover:bg-red-900/30 text-zinc-400 hover:text-red-400 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Expanded — used by list */}
                            {expandedId === coupon._id && (
                                <div className="border-t border-zinc-800 px-4 py-3">
                                    <p className="text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">
                                        Used by ({coupon.usedBy?.length || 0} users)
                                    </p>
                                    {coupon.usedBy?.length === 0 ? (
                                        <p className="text-xs text-zinc-600">No one has used this coupon yet.</p>
                                    ) : (
                                        <div className="space-y-1 max-h-40 overflow-y-auto">
                                            {coupon.usedBy.map((u, i) => (
                                                <div key={i} className="flex items-center justify-between text-xs text-zinc-400">
                                                    <span>{u.userId?.name || u.userId?.email || u.userId?.toString()}</span>
                                                    <span>{new Date(u.usedAt).toLocaleDateString('en-IN')}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CouponPanel;