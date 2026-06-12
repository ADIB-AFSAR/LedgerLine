import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getReferralCode, clearReferralCode } from '../../utils/referral/referral';
import api from '../../api/axios';
import { useEffect } from 'react';

export default function CheckoutForm({ serviceId, planId, planName, amount:planPrice}) {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [referralCode, setReferralCode] = useState('');
    const [referralMsg, setReferralMsg] = useState({ text: '', type: '' }); // type: 'success'|'error'
    const [referralValidating, setReferralValidating] = useState(false);

    const [useReferralCoins, setUseReferralCoins] = useState(false);
    const [useCashbackCoins, setUseCashbackCoins] = useState(false);

    const [termsAccepted, setTermsAccepted] = useState(false);
    console.log(termsAccepted)

    //cashback states
    const [coinsToUse, setCoinsToUse] = useState(0);
    const [userCoins, setUserCoins] = useState({ referral: 0, cashback: 0 });
    const [discountData, setDiscountData] = useState(null);

    //cupon states
    const [couponCode, setCouponCode] = useState('');
    const [couponValidating, setCouponValidating] = useState(false);
    const [ couponData, setCouponData] = useState(null); // null = not applied
    const [couponMsg, setCouponMsg] = useState({ text: '', type: '' });
    const [couponDiscount, setCouponDiscount] = useState(null);

    const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponValidating(true);
    setCouponMsg({ text: '', type: '' });
    setCouponData(null);
    try {
        const { data } = await api.post('/coupons/validate', {
            code: couponCode.trim(),
            planId
        });
        if (data.success) {
            setCouponData(data.data);
            console.log("Coupon validation response:", data);
            setCouponMsg({
                text: data.data.capped
                    ? `Coupon applied! ₹${data.data.actualDiscount} off (capped at 50% of plan price)`
                    : `Coupon applied! ₹${data.data.actualDiscount} off`,
                type: 'success',
            });
            setCouponDiscount(data.data.actualDiscount); 
            console.log(couponDiscount)
        }
    } catch (err) {
        setCouponMsg({
            text: err.response?.data?.error || 'Invalid coupon code',
            type: 'error'
        });
    } finally {
        setCouponValidating(false);
    }
};
 
const handleRemoveCoupon = () => {
    setCouponData(null);
    setCouponCode('');
    setCouponMsg({ text: '', type: '' })
    setCouponDiscount(0);
};

    const totalCoins = userCoins.coins + userCoins.cashbackCoins;
    const maxDiscount = Math.floor(planPrice * 0.5); // planPrice prop needed
    const maxUsable = Math.min(totalCoins, maxDiscount);
    useEffect(() => {
    const stored = getReferralCode();
    if (stored) setReferralCode(stored);

    //cashback
    const fetchCoins = async () => {
        try {
            const { data } = await api.get('/referral/me');
            if (data.success) {
                setUserCoins({
                    referral: data.data.coins,
                    cashback: data.data.cashbackCoins
                });
            }
        } catch (err) {
            console.error('Could not fetch coins:', err);
        }
    };
    fetchCoins();
    }, []);

   // Coupon discount (not capped)
const maxCoinDiscount = Math.floor(planPrice * 0.5);

const referralCoinsToUse = useReferralCoins 
    ? Math.min(userCoins.referral, maxCoinDiscount) 
    : 0;

const remainingAfterReferral = maxCoinDiscount - referralCoinsToUse;

const cashbackCoinsToUse = useCashbackCoins 
    ? Math.min(userCoins.cashback, remainingAfterReferral) 
    : 0;

const totalCoinDiscount = referralCoinsToUse + cashbackCoinsToUse;

// Disable cashback if referral already fills 50%
const disableCashback = useReferralCoins && referralCoinsToUse >= maxCoinDiscount;
// Disable referral if cashback already fills 50%
const disableReferral = useCashbackCoins && cashbackCoinsToUse >= maxCoinDiscount;

const finalPrice = Math.max(planPrice - totalCoinDiscount - (couponDiscount || 0), 1);

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
                    referralCode,
                    couponCode: couponData?.code || '',
                    couponDiscount: couponData?.actualDiscount || 0,
                    referralCoinsUsed: referralCoinsToUse,
                    cashbackCoinsUsed: cashbackCoinsToUse,
                    coinsUsed: totalCoinDiscount , 
                    coinType: 'separate',
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

    return (
        <form id="payment-form" onSubmit={handleSubmit} className="mt-6 space-y-6">
            <PaymentElement id="payment-element" options={paymentElementOptions} />
            {/* Coin Discount Box */}
{(userCoins.referral + userCoins.cashback) > 0 && (
    <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
        <p className="text-sm font-semibold text-slate-700">Use Coins for Discount</p>
        <p className="text-xs text-slate-400">Max 50% of plan price can be paid with coins</p>

        {/* Referral coins checkbox */}
      {userCoins.referral > 0 && (
    <label className={`flex items-center justify-between p-3 bg-white border rounded-xl transition-colors ${
        disableReferral ? 'opacity-40 cursor-not-allowed border-slate-200' : 'cursor-pointer hover:border-blue-300 border-slate-200'
    }`}>
        <div className="flex items-center gap-3">
            <input
                type="checkbox"
                checked={useReferralCoins}
                disabled={disableReferral}
                onChange={e => setUseReferralCoins(e.target.checked)}
                className="w-4 h-4 accent-blue-600"
            />
            <div>
                <p className="text-sm font-semibold text-blue-600">Referral Coins</p>
                <p className="text-xs text-slate-400">Withdrawable · expires never</p>
            </div>
        </div>
        <div className="text-right">
            <p className="text-sm font-bold text-slate-800">{userCoins.referral} coins</p>
            <p className="text-xs text-green-600 font-semibold">
                -{referralCoinsToUse > 0 ? referralCoinsToUse : Math.min(userCoins.referral, maxCoinDiscount)} off
            </p>
        </div>
    </label>
)}

{userCoins.cashback > 0 && (
    <label className={`flex items-center justify-between p-3 bg-white border rounded-xl transition-colors ${
        disableCashback ? 'opacity-40 cursor-not-allowed border-slate-200' : 'cursor-pointer hover:border-green-300 border-slate-200'
    }`}>
        <div className="flex items-center gap-3">
            <input
                type="checkbox"
                checked={useCashbackCoins}
                disabled={disableCashback}
                onChange={e => setUseCashbackCoins(e.target.checked)}
                className="w-4 h-4 accent-green-600"
            />
            <div>
                <p className="text-sm font-semibold text-green-600">Cashback Coins</p>
                <p className="text-xs text-slate-400">Discount only · expires in 1 year</p>
            </div>
        </div>
        <div className="text-right">
            <p className="text-sm font-bold text-slate-800">{userCoins.cashback} coins</p>
            <p className="text-xs text-green-600 font-semibold">
                -{cashbackCoinsToUse > 0 ? cashbackCoinsToUse : Math.min(userCoins.cashback, remainingAfterReferral)} off
            </p>
        </div>
    </label>
)}
        
        {/* //Coupon jsx */}
    <div className="mt-4">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
            Coupon Code <span className="text-slate-400 font-normal normal-case">(optional)</span>
        </label>
 
        {couponData ? (
            // Applied state
            <div className="flex items-center justify-between px-4 py-3 bg-green-50 border border-green-300 rounded-xl">
                <div>
                    <p className="text-sm font-bold text-green-700">
                        🎉 {couponData.code} applied — ₹{couponData.actualDiscount} off
                    </p>
                    {couponData.capped && (
                        <p className="text-xs text-green-600 mt-0.5">Capped at 50% of plan price</p>
                    )}
                </div>
                <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-xs text-red-500 hover:text-red-700 font-semibold ml-3"
                >
                    Remove
                </button>
            </div>
        ) : (
            // Input state
            <div>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={couponCode}
                        onChange={e => {
                            setCouponCode(e.target.value.toUpperCase());
                            setCouponMsg({ text: '', type: '' });
                        }}
                        placeholder="Enter coupon code"
                        className={`flex-1 px-4 py-2.5 bg-slate-50 border rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500 focus:bg-white uppercase ${
                            couponMsg.type === 'error' ? 'border-red-300' : 'border-slate-200'
                        }`}
                    />
                    <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={couponValidating || !couponCode.trim()}
                        className="px-4 py-2.5 bg-slate-800 text-white text-sm font-semibold rounded-xl hover:bg-slate-700 transition-all disabled:opacity-50 whitespace-nowrap"
                    >
                        {couponValidating ? 'Checking...' : 'Apply'}
                    </button>
                </div>
                {couponMsg.text && (
                    <p className={`text-xs mt-1.5 ml-1 font-medium ${
                        couponMsg.type === 'success' ? 'text-green-600' : 'text-red-500'
                    }`}>
                        {couponMsg.text}
                    </p>
                )}
            </div>
        )}
    </div>


        {/* Summary */}
        {/* Combined Price Summary */}
{(useReferralCoins || useCashbackCoins || couponData) && (
    <div className="p-3 bg-green-50 border border-green-200 rounded-lg space-y-1 mt-4">
        <div className="flex justify-between text-sm">
            <span className="text-slate-600">Original price</span>
            <span className="font-semibold">₹{planPrice}</span>
        </div>

        {useReferralCoins && (
            <div className="flex justify-between text-sm">
                <span className="text-blue-600">Referral discount</span>
                <span className="font-semibold text-blue-600">
                    -₹{referralCoinsToUse}
                </span>
            </div>
        )}

        {useCashbackCoins && (
            <div className="flex justify-between text-sm">
                <span className="text-green-600">Cashback discount</span>
                <span className="font-semibold text-green-600">
                    -₹{cashbackCoinsToUse}
                </span>
            </div>
        )}

        {couponData && (
            <div className="flex justify-between text-sm">
                <span className="text-purple-600">Coupon ({couponData.code})</span>
                <span className="font-semibold text-purple-600">
                    -₹{couponData.actualDiscount}
                </span>
            </div>
        )}

        <div className="flex justify-between text-sm font-bold border-t border-green-200 pt-2">
            <span>You pay</span>
            <span className="text-blue-600">
                ₹{Math.max(planPrice - referralCoinsToUse - cashbackCoinsToUse - (couponData?.actualDiscount || 0), 1)}
            </span>
        </div>
    </div>
)}
         
    </div>
)}         
            {/* Terms & Conditions */}
            <div className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <input
                    type="checkbox"
                    id="terms"
                    checked={termsAccepted}
                    onChange={e => setTermsAccepted(e.target.checked)}
                    className="w-4 h-4 mt-0.5 accent-blue-600 shrink-0 cursor-pointer"
                />
                <label htmlFor="terms" className="text-xs text-slate-600 cursor-pointer leading-relaxed">
                    I have read and consent to Powerfiling processing my information in accordance with the{' '}
                    <a href="/terms" target="_blank" className="text-blue-600 hover:underline font-semibold">
                        Terms & Conditions
                    </a>
                    {' '},{' '}
                    <a href="/privacy-policy" target="_blank" className="text-blue-600 hover:underline font-semibold">
                        Privacy Policy
                    </a>
                    {' '}and{' '}
                    <a href="/refund" target="_blank" className="text-blue-600 hover:underline font-semibold">
                        Refund Policy
                    </a>           
                    </label>
            </div>
            <button
                disabled={isLoading || !stripe || !elements || !termsAccepted} 
                id="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-75 disabled:cursor-not-allowed transition-colors"
            >
                <span id="button-text">
                    {isLoading
            ? <div className="spinner" id="spinner">Processing...</div>
            : !termsAccepted
            ? "Accept Terms to Continue"
            : "Pay Now & Continue"
        }
                </span>
            </button>
            {message && <div id="payment-message" className="text-red-600 text-sm text-center">{message}</div>}
        </form>
    );
}
