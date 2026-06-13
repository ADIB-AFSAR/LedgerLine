import { useEffect, useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { CheckCircle, LayoutDashboard, FileText } from 'lucide-react';
import api from '../../api/axios';

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const [countdown, setCountdown] = useState(10);
    const [confirming, setConfirming] = useState(false);
    const [confirmError, setConfirmError] = useState(null);

    const orderIdFromUrl = searchParams.get('order_id');

    const [paymentState, setPaymentState] = useState({
        transactionId: location.state?.transactionId || orderIdFromUrl || null,
        serviceId: location.state?.serviceId || null,
        purchaseId: location.state?.purchaseId || null,
        planName: location.state?.planName || null,
    });

    useEffect(() => {
        const confirmFromReturnUrl = async () => {
            if (!orderIdFromUrl || location.state?.purchaseId) return;

            setConfirming(true);
            try {
                const { data } = await api.post('/payments/confirm', { orderId: orderIdFromUrl });
                if (data.success && data.purchaseId) {
                    setPaymentState({
                        transactionId: orderIdFromUrl,
                        serviceId: data.serviceId || null,
                        purchaseId: data.purchaseId,
                        planName: data.planName || null,
                    });
                } else {
                    setConfirmError('Payment confirmation failed. Please contact support.');
                }
            } catch (err) {
                console.error('Payment confirmation error:', err);
                setConfirmError(
                    err.response?.data?.message || 'Could not confirm payment. Check your dashboard for order status.'
                );
            } finally {
                setConfirming(false);
            }
        };

        confirmFromReturnUrl();
    }, [orderIdFromUrl, location.state?.purchaseId]);

    const { transactionId, serviceId, purchaseId, planName } = paymentState;

    const targetUrl =
        serviceId && purchaseId
            ? `/services/userform?service=${serviceId}&purchaseId=${purchaseId}`
            : '/dashboard';

    useEffect(() => {
        if (!transactionId || confirming || confirmError) return;

        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    navigate(targetUrl, { replace: true });
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [navigate, targetUrl, transactionId, confirming, confirmError]);

    if (confirming) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <p className="text-slate-600">Confirming your payment...</p>
            </div>
        );
    }

    if (!transactionId) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-slate-600 mb-4">{confirmError || 'No payment information found.'}</p>
                    <button
                        onClick={() => navigate('/dashboard', { replace: true })}
                        className="text-blue-600 font-semibold"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                </div>

                <h2 className="text-3xl font-bold text-slate-900 mb-2">Payment Successful!</h2>
                <p className="text-slate-600 mb-6">
                    Thank you for your payment. You can now proceed to file your
                    <span className="font-semibold text-slate-800"> {planName || 'ITR'}</span>.
                </p>

                {confirmError && (
                    <p className="text-amber-600 text-sm mb-4">{confirmError}</p>
                )}

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-8 inline-block w-full">
                    <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-1">
                        Transaction ID
                    </p>
                    <p className="text-slate-800 font-mono font-medium truncate">{transactionId}</p>
                </div>

                <div className="space-y-3">
                    {purchaseId && (
                        <button
                            onClick={() => navigate(targetUrl, { replace: true })}
                            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                        >
                            <FileText size={18} />
                            Start Filing Now
                        </button>
                    )}

                    <button
                        onClick={() => navigate('/dashboard', { replace: true })}
                        className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 py-3 px-6 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                    >
                        <LayoutDashboard size={18} />
                        Go to Dashboard
                    </button>

                    {purchaseId && (
                        <p className="text-sm text-slate-500 mt-4">
                            Redirecting in <span className="font-bold text-blue-600">{countdown}</span> seconds...
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
