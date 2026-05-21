import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "../frontend/Navbar";
import Footer from "../frontend/Footer";

const IncomeTaxCalculator = () => {
  const [income, setIncome] = useState(500000);
  const [deductions, setDeductions] = useState(150000);
  const [regime, setRegime] = useState("new");

  // Tax slabs for FY 2024-25
  const oldRegimeTax = (taxableIncome) => {
    if (taxableIncome <= 250000) return 0;
    if (taxableIncome <= 500000) return (taxableIncome - 250000) * 0.05;
    if (taxableIncome <= 1000000) return 12500 + (taxableIncome - 500000) * 0.2;
    if (taxableIncome <= 1500000) return 112500 + (taxableIncome - 1000000) * 0.3;
    return 262500 + (taxableIncome - 1500000) * 0.3;
  };

  const newRegimeTax = (taxableIncome) => {
    if (taxableIncome <= 300000) return 0;
    if (taxableIncome <= 600000) return (taxableIncome - 300000) * 0.05;
    if (taxableIncome <= 900000) return 15000 + (taxableIncome - 600000) * 0.1;
    if (taxableIncome <= 1200000) return 45000 + (taxableIncome - 900000) * 0.15;
    if (taxableIncome <= 1500000) return 90000 + (taxableIncome - 1200000) * 0.2;
    return 150000 + (taxableIncome - 1500000) * 0.3;
  };

  const taxableIncomeOld = Math.max(0, income - deductions);
  const taxableIncomeNew = Math.max(0, income);

  const taxOld = oldRegimeTax(taxableIncomeOld);
  const taxNew = newRegimeTax(taxableIncomeNew);
  const cess = (regime === "old" ? taxOld : taxNew) * 0.04;
  const totalTax = (regime === "old" ? taxOld : taxNew) + cess;

  const afterTaxIncome = income - totalTax;

  return (
    <>
      <Navbar />

      <main className="bg-slate-50 min-h-screen">
        {/* Hero */}
        <div className="bg-gradient-to-br from-slate-900 to-blue-900 text-white py-10 px-4">
          <div className="max-w-4xl mx-auto">
            <Link
              to="/calculators"
              className="inline-flex items-center gap-1.5 text-blue-300 hover:text-white text-sm mb-4 transition-colors"
            >
              <ArrowLeft size={15} />
              Back to Calculators
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold">Income Tax Calculator</h1>
            <p className="text-slate-300 text-sm mt-2">Calculate your tax liability with old and new regime comparison</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">

          <div className="grid lg:grid-cols-3 gap-8">

            {/* Input Section */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sticky top-20">
                <h2 className="text-lg font-bold text-slate-900 mb-6">Enter Details</h2>

                {/* Income */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Annual Income (₹)
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={income === 0 ? "" : income}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      setIncome(val === "" ? 0 : Number(val));
                    }}
                    placeholder="0"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="range"
                    min="0"
                    max="5000000"
                    step="50000"
                    value={income}
                    onChange={(e) => setIncome(Number(e.target.value))}
                    className="w-full mt-2 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                {/* Deductions (Old Regime) */}
                {regime === "old" && (
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Deductions (80C, 80D, etc.) (₹)
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={deductions === 0 ? "" : deductions}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        setDeductions(val === "" ? 0 : Number(val));
                      }}
                      placeholder="0"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="range"
                      min="0"
                      max="500000"
                      step="10000"
                      value={deductions}
                      onChange={(e) => setDeductions(Number(e.target.value))}
                      className="w-full mt-2 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>
                )}

                {/* Regime Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Tax Regime
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors" style={{ borderColor: regime === "old" ? "#2563eb" : "" }}>
                      <input
                        type="radio"
                        name="regime"
                        value="old"
                        checked={regime === "old"}
                        onChange={(e) => setRegime(e.target.value)}
                        className="w-4 h-4 accent-blue-600"
                      />
                      <span className="text-sm font-medium text-slate-700">Old Regime</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors" style={{ borderColor: regime === "new" ? "#2563eb" : "" }}>
                      <input
                        type="radio"
                        name="regime"
                        value="new"
                        checked={regime === "new"}
                        onChange={(e) => setRegime(e.target.value)}
                        className="w-4 h-4 accent-blue-600"
                      />
                      <span className="text-sm font-medium text-slate-700">New Regime</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="lg:col-span-2 space-y-6">

              {/* Current Regime Result */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
                <h2 className="text-lg font-bold text-slate-900 mb-6">
                  {regime === "old" ? "Old Regime" : "New Regime"} Calculation
                </h2>

                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <span className="text-slate-600">Gross Income</span>
                    <span className="font-semibold text-slate-900">₹{income.toLocaleString()}</span>
                  </div>

                  {regime === "old" && (
                    <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                      <span className="text-slate-600">Deductions (80C, 80D, etc.)</span>
                      <span className="font-semibold text-slate-900">-₹{deductions.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <span className="text-slate-600">Taxable Income</span>
                    <span className="font-semibold text-slate-900">
                      ₹{(regime === "old" ? taxableIncomeOld : taxableIncomeNew).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <span className="text-slate-600">Income Tax</span>
                    <span className="font-semibold text-slate-900">
                      ₹{(regime === "old" ? taxOld : taxNew).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <span className="text-slate-600">Health & Education Cess (4%)</span>
                    <span className="font-semibold text-slate-900">₹{cess.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center pt-3 bg-blue-50 px-4 py-3 rounded-lg">
                    <span className="font-semibold text-slate-900">Total Tax Liability</span>
                    <span className="text-lg font-bold text-blue-600">₹{totalTax.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center pt-3 bg-green-50 px-4 py-3 rounded-lg">
                    <span className="font-semibold text-slate-900">After-Tax Income</span>
                    <span className="text-lg font-bold text-green-600">₹{afterTaxIncome.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Comparison */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
                <h2 className="text-lg font-bold text-slate-900 mb-6">Old vs New Regime Comparison</h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-sm text-slate-600 mb-2">Old Regime Tax</p>
                    <p className="text-2xl font-bold text-slate-900">₹{(taxOld + (taxOld * 0.04)).toLocaleString()}</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4">
                    <p className="text-sm text-slate-600 mb-2">New Regime Tax</p>
                    <p className="text-2xl font-bold text-blue-600">₹{(taxNew + (taxNew * 0.04)).toLocaleString()}</p>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-900">
                    <strong>Recommendation:</strong> {
                      (taxOld + (taxOld * 0.04)) < (taxNew + (taxNew * 0.04))
                        ? "Old Regime is more beneficial. You can save ₹" + ((taxNew + (taxNew * 0.04)) - (taxOld + (taxOld * 0.04))).toLocaleString()
                        : "New Regime is more beneficial. You can save ₹" + ((taxOld + (taxOld * 0.04)) - (taxNew + (taxNew * 0.04))).toLocaleString()
                    }
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </main>

      <Footer />
    </>
  );
};

export default IncomeTaxCalculator;
