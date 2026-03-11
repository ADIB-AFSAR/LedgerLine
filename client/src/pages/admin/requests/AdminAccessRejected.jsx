import { useNavigate } from 'react-router-dom';
import { XCircle, ArrowLeft, Ghost } from 'lucide-react';

const AdminAccessRejected = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-3xl shadow-2xl p-10 text-center border border-red-100 overflow-hidden relative">
                    {/* Decorative Header */}
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-red-500"></div>

                    <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8">
                        <XCircle className="w-12 h-12 text-red-600" />
                    </div>

                    <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Access Rejected</h2>
                    <p className="text-slate-600 mb-10 leading-relaxed">
                        We're sorry, but your request for administrative access has been <span className="text-red-600 font-bold uppercase">declined</span> by our security team. 
                        <br /><br />
                        This could be due to invalid credentials, mismatched roles, or security policy restrictions.
                    </p>

                    <div className="p-6 bg-red-50/50 rounded-2xl border border-red-100 mb-10 flex items-start gap-4 text-left">
                        <div className="bg-white p-2 rounded-lg shadow-sm">
                            <Ghost className="w-5 h-5 text-red-500" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-red-900 mb-1">What now?</p>
                            <p className="text-xs text-red-700 leading-normal">
                                If you believe this is a mistake, please contact your system administrator or reach out to tech support.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/admin/login')}
                        className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Admin Login
                    </button>
                    
                    <button 
                        onClick={() => navigate('/')}
                        className="mt-6 text-sm font-semibold text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        Return to Public Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminAccessRejected;
