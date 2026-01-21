import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, Lock, ShieldCheck } from 'lucide-react';

const PaymentGateway = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isProcessing, setIsProcessing] = useState(false);

    // data passed from the form
    const { serviceId, formData } = location.state || {};

    // Mock price based on serviceId or default
    const amount = 4999; // In a real app, this would come from the service details

    const handlePayment = (e) => {
        e.preventDefault();
        setIsProcessing(true);

        // Simulate payment processing delay
        setTimeout(() => {
            setIsProcessing(false);
            navigate('/payment-success', { state: { transactionId: 'TXN_' + Math.floor(Math.random() * 1000000) } });
        }, 2000);
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
                        Complete your purchase securely
                    </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-600">Service</span>
                        <span className="font-semibold text-slate-900 capitalize">{serviceId || 'Service Registration'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-slate-600">Total Amount</span>
                        <span className="font-bold text-lg text-blue-600">₹{amount.toLocaleString()}</span>
                    </div>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handlePayment}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="card-number" className="block text-sm font-medium text-slate-700">
                                Card Number
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <CreditCard className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    id="card-number"
                                    className="block w-full pl-10 px-3 py-3 border border-slate-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="0000 0000 0000 0000"
                                    required
                                    defaultValue="4242 4242 4242 4242"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="expiry" className="block text-sm font-medium text-slate-700">
                                    Expiration Date
                                </label>
                                <input
                                    type="text"
                                    id="expiry"
                                    className="mt-1 block w-full px-3 py-3 border border-slate-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="MM/YY"
                                    required
                                    defaultValue="12/25"
                                />
                            </div>
                            <div>
                                <label htmlFor="cvc" className="block text-sm font-medium text-slate-700">
                                    CVC
                                </label>
                                <input
                                    type="text"
                                    id="cvc"
                                    className="mt-1 block w-full px-3 py-3 border border-slate-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="123"
                                    required
                                    defaultValue="123"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                                Cardholder Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                className="mt-1 block w-full px-3 py-3 border border-slate-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
                                placeholder="John Doe"
                                required
                                defaultValue="John Doe"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isProcessing}
                        className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-75 disabled:cursor-not-allowed transition-colors"
                    >
                        {isProcessing ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing Payment...
                            </span>
                        ) : (
                            'Pay Now'
                        )}
                    </button>
                </form>

                <div className="flex justify-center items-center gap-2 text-xs text-slate-500 mt-4">
                    <ShieldCheck className="w-4 h-4 text-green-500" />
                    <span>Payments are secure and encrypted</span>
                </div>
            </div>
        </div>
    );
};

export default PaymentGateway;
