import { useNavigate, useLocation } from 'react-router-dom';
import { XCircle, RefreshCcw, LayoutDashboard, Home } from 'lucide-react';

const PaymentFailure = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { errorMessage, planName, serviceId } = location.state || {};

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <XCircle className="w-10 h-10 text-red-600" />
                </div>

                <h2 className="text-3xl font-bold text-slate-900 mb-2">Payment Failed</h2>
                <p className="text-slate-600 mb-6">
                    We couldn't process your payment for <span className="font-semibold">{planName || 'the service'}</span>.
                </p>

                {errorMessage && (
                    <div className="bg-red-50 p-4 rounded-xl border border-red-200 mb-8 inline-block w-full">
                        <p className="text-xs text-red-500 uppercase tracking-wide font-semibold mb-1">Error Details</p>
                        <p className="text-slate-800 font-medium">{errorMessage}</p>
                    </div>
                )}

                <div className="space-y-3">
                    <button
                        onClick={() => navigate(serviceId ? `/services/${serviceId}` : '/')} // Try to go back to service detail/plan selection
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                    >
                        <RefreshCcw size={18} />
                        Try Again
                    </button>

                    <button
                        onClick={() => navigate('/dashboard')}
                        className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 py-3 px-6 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                    >
                        <LayoutDashboard size={18} />
                        Go to Dashboard
                    </button>

                    <button
                        onClick={() => navigate('/')}
                        className="text-slate-500 text-sm hover:text-slate-700 font-medium mt-2"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailure;
