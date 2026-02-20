import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Lock, ShieldCheck } from 'lucide-react';
import api from '../../api/axios';
import CheckoutForm from './CheckoutForm';

const stripePromise = loadStripe('pk_test_51T1qNy53JomMzv2hooXHIpsMNbs95cJntx6Ok5frGotdPuAncp7R26ncKI4Za6oUj2JB3asRqo1bsYlZTHj1Zle600ctbquuts');

const PaymentGateway = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [clientSecret, setClientSecret] = useState('');
    const [amount, setAmount] = useState(0);

    // data passed from ServiceDetail
    const { serviceId, planId, amount: planPrice, planName } = location.state || {}; // planName here

    useEffect(() => {
        if (!planId) {
            navigate('/services/individual'); // Redirect if no plan selected
            return;
        }

        const createPaymentIntent = async () => {
            // ... create intent logic uses planId
            try {
                const { data } = await api.post('/payments/create-intent', {
                    planId,
                    amount: planPrice
                });
                setClientSecret(data.clientSecret);
                setAmount(planPrice); // Use planPrice which is actually just for display/local, backend uses planId
            } catch (error) {
                console.error("Payment intent error:", error);
                alert("Failed to initialize payment. Please try again.");
            }
        };

        createPaymentIntent();
    }, [planId, planPrice, navigate]);

    const appearance = {
        theme: 'stripe',
    };
    const options = {
        clientSecret,
        appearance,
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
                <div className="text-center">
                    <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <Lock className="w-8 h-8 text-blue-600" />
                    </div>
                    <h2 className="mt-2 text-3xl font-bold text-slate-900">Secure Payment</h2>
                    <p className="mt-2 text-sm text-slate-600">
                        Complete purchase for <span className="font-semibold">{planName || 'ITR Filing'}</span>
                    </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="flex justify-between items-center mb-2">
                        {/* Show Service ID as fallback name if planName missing */}
                        <span className="text-slate-600">Service</span>
                        <span className="font-semibold text-slate-900 capitalize">{planName || serviceId || 'ITR Filing'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-slate-600">Total Amount</span>
                        <span className="font-bold text-lg text-blue-600">₹{amount.toLocaleString()}</span>
                    </div>
                </div>

                {clientSecret && (
                    <Elements options={options} stripe={stripePromise}>
                        <CheckoutForm serviceId={serviceId} planId={planId} planName={planName} />
                    </Elements>
                )}

                <div className="flex justify-center items-center gap-2 text-xs text-slate-500 mt-4">
                    <ShieldCheck className="w-4 h-4 text-green-500" />
                    <span>Payments are secure and encrypted</span>
                </div>
            </div>
        </div>
    );
};

export default PaymentGateway;
