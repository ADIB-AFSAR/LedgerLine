import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Info } from "lucide-react";
import Navbar from "../frontend/Navbar";
import Footer from "../frontend/Footer";

// ── TDS Rate Table (FY 2025-26) ───────────────────────────────────────────────
// Sources: Section 192, 193, 194, 194A, 194C, 194H, 194I, 194J, 194N, etc.

const TDS_SECTIONS = [
  {
    section: "192",
    nature: "Salary",
    category: "salary",
    threshold: 0,
    rate: null, // slab-based, handled separately
    surcharge: true,
    notes: "TDS on salary is deducted at applicable income tax slab rate. No fixed rate.",
    isSlab: true,
  },
  {
    section: "194A",
    nature: "Interest on FD / Savings (Bank)",
    category: "interest",
    threshold: 50000, // ₹50,000 for senior citizens; ₹40,000 for others
    rate: 0.10,
    surcharge: false,
    notes: "Threshold: ₹40,000/year for general; ₹50,000/year for senior citizens. PAN mandatory to avoid 20% TDS.",
  },
  {
    section: "194A",
    nature: "Interest (Non-Banking)",
    category: "interest",
    threshold: 5000,
    rate: 0.10,
    surcharge: false,
    notes: "Interest from loans, deposits with non-banks. Threshold ₹5,000/year.",
  },
  {
    section: "194C",
    nature: "Payment to Contractor",
    category: "contractor",
    threshold: 30000, // Single; ₹1,00,000 aggregate
    rate: 0.01, // 1% individual/HUF, 2% others
    surcharge: false,
    notes: "1% for Individual/HUF payees; 2% for companies. Single payment > ₹30,000 or aggregate > ₹1,00,000.",
    hasVariant: true,
    variantLabel: "Payee Type",
    variants: [
      { label: "Individual / HUF", rate: 0.01 },
      { label: "Company / Firm", rate: 0.02 },
    ],
  },
  {
    section: "194H",
    nature: "Commission / Brokerage",
    category: "commission",
    threshold: 15000,
    rate: 0.05,
    surcharge: false,
    notes: "Threshold ₹15,000/year. Covers insurance agents, brokers, etc.",
  },
  {
    section: "194I",
    nature: "Rent",
    category: "rent",
    threshold: 240000, // ₹2,40,000/year
    rate: 0.10, // 2% plant & machinery, 10% land/building
    surcharge: false,
    notes: "10% for land, building, furniture; 2% for plant & machinery. Threshold ₹2,40,000/year.",
    hasVariant: true,
    variantLabel: "Asset Type",
    variants: [
      { label: "Land / Building / Furniture", rate: 0.10 },
      { label: "Plant & Machinery", rate: 0.02 },
    ],
  },
  {
    section: "194IB",
    nature: "Rent by Individual / HUF (>₹50K/month)",
    category: "rent",
    threshold: 50000, // per month
    rate: 0.05,
    surcharge: false,
    notes: "5% TDS when monthly rent exceeds ₹50,000. Deducted once a year or on last month of tenancy.",
  },
  {
    section: "194J",
    nature: "Professional / Technical Fees",
    category: "professional",
    threshold: 30000,
    rate: 0.10, // 2% for technical, 10% for professional
    surcharge: false,
    notes: "2% for technical services; 10% for professional services (doctors, lawyers, CAs, etc.).",
    hasVariant: true,
    variantLabel: "Service Type",
    variants: [
      { label: "Professional Services", rate: 0.10 },
      { label: "Technical Services", rate: 0.02 },
    ],
  },
  {
    section: "194N",
    nature: "Cash Withdrawal from Bank",
    category: "cash",
    threshold: 2000000,
    rate: 0.02,
    surcharge: false,
    notes: "2% on cash withdrawal above ₹20L (if ITR filed for last 3 years); 5% above ₹20L if ITR not filed.",
  },
  {
    section: "194Q",
    nature: "Purchase of Goods",
    category: "goods",
    threshold: 5000000,
    rate: 0.001,
    surcharge: false,
    notes: "0.1% on purchase exceeding ₹50L in a year. Applies to buyers with turnover > ₹10 crore.",
  },
  {
    section: "194IA",
    nature: "Sale of Immovable Property",
    category: "property",
    threshold: 5000000,
    rate: 0.01,
    surcharge: false,
    notes: "1% TDS by buyer on purchase of property worth ₹50L or more. Deducted from payment to seller.",
  },
];

const CATEGORIES = ["All", "salary", "interest", "contractor", "commission", "rent", "professional", "cash", "goods", "property"];
const CATEGORY_LABELS = {
  All: "All",
  salary: "Salary",
  interest: "Interest",
  contractor: "Contractor",
  commission: "Commission",
  rent: "Rent",
  professional: "Professional",
  cash: "Cash",
  goods: "Goods",
  property: "Property",
};

const fmt = (n) => "₹" + Math.round(n).toLocaleString("en-IN");
const fmtPct = (r) => (r * 100).toFixed(1) + "%";

function InfoTip({ text }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-flex items-center">
      <button type="button" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}
        className="text-slate-400 hover:text-slate-600 transition-colors" aria-label="Info">
        <Info size={13} />
      </button>
      {show && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-30 w-64 bg-slate-800 text-white text-xs rounded-lg px-3 py-2 shadow-xl leading-relaxed whitespace-normal pointer-events-none">
          {text}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
        </span>
      )}
    </span>
  );
}

function RupeeInput({ label, value, onChange, info }) {
  return (
    <div className="mb-5">
      <label className="flex items-center gap-1.5 text-sm font-medium text-slate-600 mb-1.5">
        {label} {info && <InfoTip text={info} />}
      </label>
      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-400 bg-white">
        <span className="px-3 text-slate-400 text-sm border-r border-slate-200 py-2.5 bg-slate-50">₹</span>
        <input type="text" inputMode="numeric"
          value={value === 0 ? "" : value.toLocaleString("en-IN")}
          onChange={(e) => { const r = e.target.value.replace(/[^0-9]/g, ""); onChange(r === "" ? 0 : Number(r)); }}
          placeholder="0"
          className="flex-1 px-3 py-2.5 text-sm text-slate-800 outline-none bg-white" />
      </div>
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function TDSCalculator() {
  const [selectedSection, setSelectedSection] = useState(TDS_SECTIONS[1]); // default: FD interest
  const [amount, setAmount] = useState(0);
  const [variantIdx, setVariantIdx] = useState(0);
  const [hasPAN, setHasPAN] = useState(true);
  const [filterCat, setFilterCat] = useState("All");

  const activeRate = useMemo(() => {
    if (selectedSection.isSlab) return null;
    if (!hasPAN) return 0.20; // No PAN → 20% or double, whichever higher
    if (selectedSection.hasVariant) return selectedSection.variants[variantIdx].rate;
    return selectedSection.rate;
  }, [selectedSection, hasPAN, variantIdx]);

  const result = useMemo(() => {
    if (!amount || selectedSection.isSlab) return null;
    const rate = activeRate;
    const tds = Math.round(amount * rate);
    const netAmount = amount - tds;
    return { tds, netAmount, rate };
  }, [amount, activeRate, selectedSection]);

  const filteredSections = useMemo(() =>
    filterCat === "All" ? TDS_SECTIONS : TDS_SECTIONS.filter((s) => s.category === filterCat),
    [filterCat]
  );

  return (
    <>
      <Navbar />
      <main className="bg-white min-h-screen">
        {/* Header */}
        <div className="border-b border-slate-100 bg-white px-4 py-4">
          <div className="max-w-6xl mx-auto">
            <Link to="/calculators" className="inline-flex items-center gap-1.5 text-blue-500 hover:text-blue-700 text-sm mb-3 transition-colors">
              <ArrowLeft size={14} /> Back to Calculators
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">TDS Calculator</h1>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-xs text-slate-400">Tax Deducted at Source · FY 2025-26</span>
              <span className="text-[11px] font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Updated</span>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
          <div className="flex flex-col lg:flex-row gap-6 items-start">

            {/* Left — selector + inputs */}
            <div className="w-full lg:flex-1 space-y-5">

              {/* Category filter */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <h2 className="text-sm font-bold text-slate-700 mb-3">Payment Category</h2>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button key={cat} onClick={() => { setFilterCat(cat); }}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${filterCat === cat ? "bg-blue-600 text-white border-blue-600" : "border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-600"}`}>
                      {CATEGORY_LABELS[cat]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Section picker */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <h2 className="text-sm font-bold text-slate-700 mb-3">Select Payment Type</h2>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {filteredSections.map((s, i) => (
                    <button key={i} onClick={() => { setSelectedSection(s); setVariantIdx(0); }}
                      className={`w-full text-left rounded-xl px-4 py-3 border transition-all ${selectedSection === s ? "border-blue-500 bg-blue-50" : "border-slate-100 hover:border-blue-300 hover:bg-slate-50"}`}>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-800">{s.nature}</span>
                        <span className="text-[11px] font-bold text-slate-400">Sec {s.section}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {s.isSlab ? "Slab rate" : `${fmtPct(s.rate)} · Threshold: ${fmt(s.threshold)}`}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Inputs */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h2 className="text-sm font-bold text-slate-700 mb-4">Calculate TDS</h2>

                {/* Variant selector (contractor / rent / professional) */}
                {selectedSection.hasVariant && (
                  <div className="mb-5">
                    <label className="text-sm font-medium text-slate-600 mb-2 block">{selectedSection.variantLabel}</label>
                    <div className="flex flex-wrap gap-2">
                      {selectedSection.variants.map((v, i) => (
                        <button key={i} onClick={() => setVariantIdx(i)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${variantIdx === i ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-600 hover:border-blue-300"}`}>
                          {v.label} ({fmtPct(v.rate)})
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <RupeeInput label="Payment Amount" value={amount} onChange={setAmount}
                  info="Enter the gross payment amount before TDS deduction." />

                {/* PAN toggle */}
                <div className="mb-4">
                  <label className="text-sm font-medium text-slate-600 mb-2 block flex items-center gap-1.5">
                    PAN Available?
                    <InfoTip text="If payee's PAN is not provided, TDS is deducted at 20% or double the applicable rate, whichever is higher, as per Section 206AA." />
                  </label>
                  <div className="flex gap-3">
                    {[{ v: true, l: "Yes — PAN provided" }, { v: false, l: "No — PAN not provided" }].map(({ v, l }) => (
                      <button key={String(v)} onClick={() => setHasPAN(v)}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${hasPAN === v ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-600 hover:border-blue-300"}`}>
                        {l}
                      </button>
                    ))}
                  </div>
                </div>

                {selectedSection.isSlab && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-xs text-blue-800 leading-relaxed">
                    <strong>Salary TDS (Section 192)</strong> is calculated based on your estimated annual income and applicable tax slab. Use the <Link to="/calculators/income-tax" className="underline font-semibold">Income Tax Calculator</Link> to estimate your salary TDS.
                  </div>
                )}
              </div>
            </div>

            {/* Right — result */}
            <div className="w-full lg:w-72 xl:w-80 shrink-0 sticky top-20 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-5 pt-5 pb-4 bg-gradient-to-r from-blue-600 to-indigo-600 border-b border-slate-100">
                  <h2 className="text-base font-bold text-white text-center">TDS Summary</h2>
                  <p className="text-blue-200 text-xs text-center mt-0.5">Section {selectedSection.section}</p>
                </div>
                <div className="px-5 py-5">
                  {selectedSection.isSlab ? (
                    <div className="text-center py-4">
                      <p className="text-slate-500 text-sm">Salary TDS is slab-based.</p>
                      <Link to="/calculators/income-tax" className="inline-block mt-3 text-sm font-semibold text-blue-600 underline">
                        Use Income Tax Calculator →
                      </Link>
                    </div>
                  ) : result ? (
                    <div className="space-y-2.5">
                      {[
                        { label: "Gross Payment", value: fmt(amount) },
                        { label: "TDS Rate", value: fmtPct(result.rate) + (!hasPAN ? " (No PAN)" : "") },
                        { label: "TDS Amount", value: fmt(result.tds), red: true },
                        { label: "Net Amount Payable", value: fmt(result.netAmount), green: true },
                      ].map(({ label, value, red, green }) => (
                        <div key={label} className={`flex justify-between items-center py-2.5 border-b border-slate-50 last:border-0 ${red ? "bg-red-50 px-3 rounded-lg" : green ? "bg-green-50 px-3 rounded-lg" : ""}`}>
                          <span className="text-sm text-slate-600">{label}</span>
                          <span className={`font-bold text-sm ${red ? "text-red-600" : green ? "text-green-700" : "text-slate-800"}`}>{value}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-slate-400 text-sm">Enter a payment amount to calculate TDS.</p>
                    </div>
                  )}
                </div>
                {!selectedSection.isSlab && (
                  <div className="px-5 pb-5 border-t border-slate-100 pt-4">
                    <p className="text-[11px] text-slate-400 leading-relaxed mb-4">{selectedSection.notes}</p>
                    <Link to="/services/salary-basic-itr"
                      className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold text-center py-3 rounded-xl transition-colors">
                      File ITR & Claim TDS Refund
                    </Link>
                  </div>
                )}
              </div>

              {/* No PAN warning */}
              {!hasPAN && !selectedSection.isSlab && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                  <p className="text-xs text-red-800 font-semibold mb-1">Section 206AA — No PAN</p>
                  <p className="text-xs text-red-700 leading-relaxed">
                    Without PAN, TDS is deducted at <strong>20%</strong> or double the normal rate, whichever is higher.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Full rate reference table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800">TDS Rate Reference Table — FY 2025-26</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    {["Section", "Nature of Payment", "Threshold", "TDS Rate"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TDS_SECTIONS.map((s, i) => (
                    <tr key={i} className={`border-b border-slate-50 hover:bg-blue-50/40 transition-colors ${i % 2 === 1 ? "bg-slate-50/60" : ""}`}>
                      <td className="px-4 py-3 font-semibold text-blue-700 whitespace-nowrap">{s.section}</td>
                      <td className="px-4 py-3 text-slate-700">{s.nature}</td>
                      <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{fmt(s.threshold)}/yr</td>
                      <td className="px-4 py-3 font-semibold text-slate-800 whitespace-nowrap">
                        {s.isSlab ? "Slab rate" : fmtPct(s.rate)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="px-5 py-3 text-[11px] text-slate-400">
              All rates are subject to 4% health & education cess. Surcharge applies for higher incomes. TDS at 20% if PAN not provided (Sec 206AA).
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
