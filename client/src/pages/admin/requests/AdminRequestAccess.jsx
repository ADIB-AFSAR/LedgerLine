import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, Send, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import api from '../../../api/axios';

const AdminRequestAccess = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        if (token) {
            localStorage.setItem('token', token);
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    }, [location]);

    useEffect(() => {
        let pollInterval;
        if (isSubmitted) {
            pollInterval = setInterval(async () => {
                try {
                    const { data } = await api.get('/auth/me');
                    if (data.success) {
                        const user = data.data;
                        if (user.role === 'admin' || user.role === 'ca') {
                            clearInterval(pollInterval);
                            navigate('/admin/dashboard');
                        } else if (user.adminStatus === 'rejected') {
                            clearInterval(pollInterval);
                            navigate('/admin/rejected');
                        }
                    }
                } catch (error) {
                    console.error('Polling error:', error);
                }
            }, 5000);
        }
        return () => clearInterval(pollInterval);
    }, [isSubmitted, navigate]);

    const handleRequest = async () => {
        setIsLoading(true);
        setError('');
        try {
            const { data } = await api.post('/auth/request-admin');
            if (data.success) {
                setIsSubmitted(true);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit request');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
                    {!isSubmitted ? (
                        <>
                            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Shield className="w-10 h-10 text-blue-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Restricted</h2>
                            <p className="text-slate-600 mb-8">
                                You are attempting to access the Administrative Portal. Your account currently does not have the necessary permissions.
                            </p>

                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-3">
                                    <AlertCircle size={20} />
                                    <span className="text-sm font-medium">{error}</span>
                                </div>
                            )}

                            <button
                                onClick={handleRequest}
                                disabled={isLoading}
                                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <Send size={20} />
                                )}
                                Raise Access Request
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-10 h-10 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Request Submitted</h2>
                            <p className="text-slate-600 mb-8">
                                Your request for administrative access has been submitted. An administrator will review your application shortly.
                            </p>
                            <div className="p-4 bg-blue-50 rounded-xl mb-8">
                                <p className="text-sm text-blue-800 font-medium">
                                    You will be able to access the dashboard once your request is approved.
                                </p>
                            </div>
                        </>
                    )}

                    <button
                        onClick={() => navigate('/admin/login')}
                        className="mt-6 text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium flex items-center justify-center gap-2 mx-auto"
                    >
                        <ArrowLeft size={16} />
                        Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminRequestAccess;
