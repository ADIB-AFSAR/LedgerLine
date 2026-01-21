import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Home, ArrowRight } from 'lucide-react';

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [countdown, setCountdown] = useState(5);
    const transactionId = location.state?.transactionId || 'TXN_SUCCESS';

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    navigate('/');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [navigate]);

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-slow">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                </div>

                <h2 className="text-3xl font-bold text-slate-900 mb-2">Payment Successful!</h2>
                <p className="text-slate-600 mb-6">
                    Thank you for your payment. Your request has been processed successfully.
                </p>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-8 inline-block w-full">
                    <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-1">Transaction ID</p>
                    <p className="text-slate-800 font-mono font-medium">{transactionId}</p>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={() => navigate('/')}
                        className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-3 px-6 rounded-xl font-semibold hover:bg-slate-800 transition-colors"
                    >
                        <Home size={18} />
                        Back to Home
                    </button>

                    <p className="text-sm text-slate-500">
                        Redirecting to home in <span className="font-bold text-blue-600">{countdown}</span> seconds...
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
