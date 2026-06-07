import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getReferralCode, clearReferralCode } from '../../utils/referral/referral';
import api from '../../api/axios';
import { useEffect } from 'react';

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
        const { data } = await api.post('/referral/validate', { referralCode }); // ← use api
        if (data.success) {
            setReferralMsg({ text: data.message, type: 'success' });
        } else {
            setReferralMsg({ text: data.error || 'Invalid referral code', type: 'error' });
        }
    } catch (err) {
        setReferralMsg({ text: err.response?.data?.error || 'Could not validate code.', type: 'error' });
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
                    clearReferralCode();
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
    referralCode ? (
        <div className="mt-4 flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-300 rounded-xl">
            <span className="text-green-600 font-bold text-sm">✓ Referral Code Applied</span>
        </div>
    ) : null
);

    return (
        <form id="payment-form" onSubmit={handleSubmit} className="mt-6 space-y-6">
            <PaymentElement id="payment-element" options={paymentElementOptions} />
            <ReferralCouponBox/>
            <button
                disabled={isLoading || !stripe || !elements}
                id="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-75 disabled:cursor-not-allowed transition-colors"
            >
                <span id="button-text">
                    {isLoading ? <div className="spinner" id="spinner">Processing...</div> : "Pay Now & Continue"}
                </span>
            </button>
            {message && <div id="payment-message" className="text-red-600 text-sm text-center">{message}</div>}
        </form>
    );
}
