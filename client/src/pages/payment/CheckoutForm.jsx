import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getReferralCode, clearReferralCode } from '../../utils/referral/referral';
import api from '../../api/axios';

export default function CheckoutForm({ serviceId, planId, planName }) {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();

    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [referralCode, setReferralCode] = useState('');
    const [referralMsg, setReferralMsg] = useState({ text: '', type: '' }); // type: 'success'|'error'
    const [referralValidating, setReferralValidating] = useState(false);

    useEffect(() => {
    const stored = getReferralCode();
    if (stored) setReferralCode(stored);
    }, []);

    const handleValidateReferral = async () => {
    if (!referralCode.trim()) return;
    setReferralValidating(true);
    setReferralMsg({ text: '', type: '' });
    try {
        const res = await fetch('/api/v1/referral/validate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // use your auth token from context
            },
            body: JSON.stringify({ referralCode })
        });
        const data = await res.json();
        if (data.success) {
            setReferralMsg({ text: data.message, type: 'success' });
        } else {
            setReferralMsg({ text: data.error || 'Invalid referral code', type: 'error' });
        }
    } catch {
        setReferralMsg({ text: 'Could not validate code. Try again.', type: 'error' });
    } finally {
        setReferralValidating(false);
    }
};

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);

        // Confirm the payment on the client
        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: 'if_required',
        });

        if (error) {
            if (error.type === "card_error" || error.type === "validation_error") {
                setMessage(error.message);
            } else {
                setMessage("An unexpected error occurred.");
            }
            setIsLoading(false);
        } else if (paymentIntent && paymentIntent.status === "succeeded") {
            // Payment succeeded, now confirm on backend to create purchase record
            try {
                // Confirm on backend
                // Note: Ideally, the backend should handle the webhook, 
                // but for this flow we are calling an endpoint to record the purchase immediately.
                // This requires the backend to verify the paymentIntent status again to be secure.
                const { data } = await api.post('/payments/confirm', {
                    paymentIntentId: paymentIntent.id,
                    planId: planId,
                    referralCode
                });

                if (data.success && data.purchaseId) {
                    // Navigate to Payment Success Page instead of directly form
                    // Use replace: true so the user can't go back to the payment form
                    navigate('/payment-success', {
                        replace: true,
                        state: {
                            transactionId: paymentIntent.id,
                            serviceId: serviceId,
                            purchaseId: data.purchaseId,
                            planName: planName // Pass plan name if available
                        }
                    });
                } else {
                    setMessage("Payment successful but failed to confirm on server. Please contact support.");
                }

            } catch (err) {
                console.error("Backend confirmation error", err);
                setMessage("Payment processed, but network error occurred. Please refresh or contact support.");
            }
            setIsLoading(false);
        } else {
            setMessage("Payment status: " + paymentIntent.status);
            setIsLoading(false);
        }

        setIsLoading(false);
    };

    const paymentElementOptions = {
        layout: "tabs",
    };

    const ReferralCouponBox = () => (
    <div className="mt-4">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
            Referral / Coupon Code <span className="text-slate-400 font-normal normal-case">(optional)</span>
        </label>
        <div className="flex gap-2">
            <input
                type="text"
                value={referralCode}
                onChange={(e) => {
                    setReferralCode(e.target.value);
                    setReferralMsg({ text: '', type: '' });
                }}
                placeholder="Enter referral code"
                className={`flex-1 px-4 py-2.5 bg-slate-50 border rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500 focus:bg-white ${
                    referralMsg.type === 'success'
                        ? 'border-green-400 bg-green-50'
                        : referralMsg.type === 'error'
                        ? 'border-red-300'
                        : 'border-slate-200'
                }`}
            />
            <button
                type="button"
                onClick={handleValidateReferral}
                disabled={referralValidating || !referralCode.trim()}
                className="px-4 py-2.5 bg-slate-800 text-white text-sm font-semibold rounded-xl hover:bg-slate-700 transition-all disabled:opacity-50 whitespace-nowrap"
            >
                {referralValidating ? 'Checking...' : 'Apply'}
            </button>
        </div>
        {referralMsg.text && (
            <p className={`text-xs mt-1.5 ml-1 font-medium ${
                referralMsg.type === 'success' ? 'text-green-600' : 'text-red-500'
            }`}>
                {referralMsg.type === 'success' ? '✓ ' : '✗ '}{referralMsg.text}
            </p>
        )}
        <p className="text-xs text-slate-400 mt-1 ml-1">Referral rewards are credited to your referrer after payment.</p>
    </div>
);

    return (
        <form id="payment-form" onSubmit={handleSubmit} className="mt-6 space-y-6">
            <PaymentElement id="payment-element" options={paymentElementOptions} />
            <button
                disabled={isLoading || !stripe || !elements}
                id="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-75 disabled:cursor-not-allowed transition-colors"
            >
            <ReferralCouponBox/>
                <span id="button-text">
                    {isLoading ? <div className="spinner" id="spinner">Processing...</div> : "Pay Now & Continue"}
                </span>
            </button>
            {message && <div id="payment-message" className="text-red-600 text-sm text-center">{message}</div>}
        </form>
    );
}
