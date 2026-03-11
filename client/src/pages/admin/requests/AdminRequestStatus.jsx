import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ArrowLeft, Loader2 } from 'lucide-react';
import api from '../../../api/axios';

const AdminRequestStatus = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Poll for status updates every 5 seconds
        const pollStatus = setInterval(async () => {
            try {
                const { data } = await api.get('/auth/me');
                if (data.success) {
                    const user = data.data;
                    if (user.role === 'admin' || user.role === 'ca') {
                        clearInterval(pollStatus);
                        navigate('/admin/dashboard');
                    } else if (user.adminStatus === 'rejected') {
                        clearInterval(pollStatus);
                        navigate('/admin/rejected');
                    }
                }
            } catch (error) {
                console.error('Polling error:', error);
            }
        }, 5000);

        return () => clearInterval(pollStatus); // Cleanup on unmount
    }, [navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center">
                <div className="bg-white rounded-3xl shadow-2xl p-10 overflow-hidden relative">
                    {/* Decorative Background */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-blue-500"></div>
                    
                    <div className="w-24 h-24 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-8 relative">
                        <Clock className="w-12 h-12 text-blue-600" />
                        <div className="absolute -top-1 -right-1">
                            <span className="flex h-4 w-4">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500"></span>
                            </span>
                        </div>
                    </div>

                    <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Request Pending</h2>
                    <p className="text-slate-600 mb-8 leading-relaxed">
                        Your administrative access request is currently under review by our core team. This usually takes between <span className="font-bold text-slate-900">2-4 business hours</span>.
                    </p>

                    <div className="space-y-4 mb-10">
                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center">
                                <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                            </div>
                            <div className="text-left">
                                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Current Status</p>
                                <p className="text-sm font-bold text-slate-900">Waiting for Approval</p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/')}
                        className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2"
                    >
                        <ArrowLeft size={18} />
                        Return to Site
                    </button>
                    
                    <p className="mt-8 text-xs text-slate-400 font-medium uppercase tracking-widest">
                        Reference ID: LL-REQ-{Math.floor(Math.random() * 10000)}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminRequestStatus;
