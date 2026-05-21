import { useState } from "react";
import { Link } from "react-router-dom";
import { Calculator, ChevronRight, Star } from "lucide-react";
import Navbar from "../frontend/Navbar";
import Footer from "../frontend/Footer";

const calculators = [
  {
    id: "income-tax",
    title: "Income Tax Calculator",
    description: "Calculate your income tax liability with old and new regime comparison",
    category: "Tax",
    isMustHave: true,
    icon: "📊",
  },
  {
    id: "old-new-regime",
    title: "Old vs New Regime Calculator",
    description: "Compare tax savings between old and new tax regimes",
    category: "Tax",
    isMustHave: true,
    icon: "⚖️",
  },
  {
    id: "salary-tax",
    title: "Salary Tax Calculator",
    description: "Calculate tax on your salary income with deductions",
    category: "Tax",
    isMustHave: false,
    icon: "💼",
  },
  {
    id: "capital-gain-tax",
    title: "Capital Gain Tax Calculator",
    description: "Calculate tax on short-term and long-term capital gains",
    category: "Tax",
    isMustHave: false,
    icon: "📈",
  },
  {
    id: "hra-calculator",
    title: "HRA Calculator",
    description: "Calculate HRA exemption based on salary and rent paid",
    category: "Tax",
    isMustHave: false,
    icon: "🏠",
  },
  {
    id: "tds-calculator",
    title: "TDS Calculator",
    description: "Calculate Tax Deducted at Source on various payments",
    category: "Tax",
    isMustHave: false,
    icon: "💰",
  },
  {
    id: "home-loan-emi",
    title: "Home Loan EMI Calculator",
    description: "Calculate monthly EMI for your home loan",
    category: "Loan",
    isMustHave: true,
    icon: "🏡",
  },
  {
    id: "car-loan-emi",
    title: "Car Loan EMI Calculator",
    description: "Calculate monthly EMI for your car loan",
    category: "Loan",
    isMustHave: false,
    icon: "🚗",
  },
  {
    id: "personal-loan-emi",
    title: "Personal Loan EMI Calculator",
    description: "Calculate monthly EMI for your personal loan",
    category: "Loan",
    isMustHave: false,
    icon: "💳",
  },
];

const categories = ["All", ...Array.from(new Set(calculators.map((c) => c.category)))];

const CalculatorHub = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? calculators
      : calculators.filter((c) => c.category === activeCategory);

  return (
    <>
      <Navbar />

      <main className="bg-slate-50 min-h-screen">
        {/* Hero */}
        <div className="bg-gradient-to-br from-slate-900 to-blue-900 text-white py-14 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <span className="inline-block bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
              Tools
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">Financial Calculators</h1>
            <p className="text-slate-300 text-sm max-w-xl mx-auto">
              Use our suite of calculators to plan your finances, calculate taxes, and understand your loan EMIs.
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-blue-600 text-white shadow"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-blue-400 hover:text-blue-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Calculator Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((calc) => (
              <Link
                key={calc.id}
                to={`/calculators/${calc.id}`}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col overflow-hidden group"
              >
                {/* Header with icon */}
                <div className="p-6 pb-4 bg-gradient-to-br from-blue-50 to-slate-50 border-b border-slate-100">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-4xl">{calc.icon}</span>
                    {calc.isMustHave && (
                      <span className="flex items-center gap-1 bg-amber-100 text-amber-700 text-xs font-semibold px-2 py-1 rounded-full">
                        <Star size={12} fill="currentColor" />
                        Popular
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-slate-900 font-bold text-base mb-2 line-clamp-2">
                    {calc.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed flex-1">
                    {calc.description}
                  </p>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50 group-hover:bg-blue-50 transition-colors">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {calc.category}
                  </span>
                  <ChevronRight size={16} className="text-blue-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
};

export default CalculatorHub;
