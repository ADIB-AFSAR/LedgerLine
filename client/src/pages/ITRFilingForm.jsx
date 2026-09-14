import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  User,
  MapPin,
  CreditCard,
  Briefcase,
  Home,
  TrendingUp,
  PiggyBank,
  Calculator,
  ArrowRight,
  ArrowLeft,
  Info,
  Check,
} from "lucide-react";
import Navbar from "./frontend/Navbar";
import Footer from "./frontend/Footer";
import { useAuth } from "../context/AuthContext";

/* ─── Indian states list ─── */
const STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
  "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
  "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
  "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  "Andaman and Nicobar Islands","Chandigarh","Dadra and Nagar Haveli and Daman and Diu",
  "Delhi","Jammu and Kashmir","Ladakh","Lakshadweep","Puducherry",
];

/* ─── Step definitions ─── */
const STEPS = [
  { id: 0, label: "Personal Info" },
  { id: 1, label: "Income Sources" },
  { id: 2, label: "Tax Saving" },
  { id: 3, label: "Tax Summary" },
];

/* ─── Field helper components ─── */
const FloatingInput = ({ label, name, value, onChange, type = "text", placeholder, hint, error, required, readOnly }) => (
  <div className="flex flex-col gap-1">
    <div className="relative">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        placeholder=" "
        className={`peer w-full border rounded-lg px-4 pt-5 pb-2 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 transition-all
          ${error ? "border-red-400 focus:ring-red-200" : "border-slate-300 focus:ring-blue-200 focus:border-blue-500"}
          ${readOnly ? "bg-slate-50 cursor-not-allowed" : ""}
        `}
      />
      <label className="absolute left-4 top-3.5 text-xs text-slate-400 transition-all pointer-events-none
        peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs
        peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-blue-500
        peer-[&:not(:placeholder-shown)]:top-1 peer-[&:not(:placeholder-shown)]:text-[10px]">
        {label}{required && " *"}
      </label>
    </div>
    {hint && !error && <p className="text-[11px] text-slate-400 flex items-center gap-1"><Info size={10} />{hint}</p>}
    {error && <p className="text-[11px] text-red-500 flex items-center gap-1"><AlertCircle size={10} />{error}</p>}
  </div>
);

const FloatingSelect = ({ label, name, value, onChange, options, error, required }) => (
  <div className="flex flex-col gap-1">
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`peer w-full border rounded-lg px-4 pt-5 pb-2 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 transition-all appearance-none
          ${error ? "border-red-400 focus:ring-red-200" : "border-slate-300 focus:ring-blue-200 focus:border-blue-500"}
        `}
      >
        <option value="" disabled> </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <label className={`absolute left-4 pointer-events-none transition-all
        ${value ? "top-1 text-[10px] text-blue-500" : "top-3.5 text-xs text-slate-400"}
      `}>
        {label}{required && " *"}
      </label>
      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
    </div>
    {error && <p className="text-[11px] text-red-500 flex items-center gap-1"><AlertCircle size={10} />{error}</p>}
  </div>
);

/* ─── Collapsible card section ─── */
const FormSection = ({ icon, title, subtitle, badge, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-slate-200 rounded-2xl mb-5 overflow-hidden shadow-sm">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 bg-white hover:bg-slate-50/60 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
            {icon}
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-sm">{title}</span>
              {badge && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                  <Check size={9} /> {badge}
                </span>
              )}
            </div>
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
        </div>
        {open ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
      </button>
      {open && <div className="px-6 pb-6 pt-1 bg-white border-t border-slate-100">{children}</div>}
    </div>
  );
};

/* ─── Step progress bar ─── */
const StepBar = ({ current }) => (
  <div className="flex items-center gap-0 mb-8">
    {STEPS.map((step, i) => {
      const done = current > i;
      const active = current === i;
      return (
        <div key={step.id} className="flex items-center flex-1 last:flex-none">
          <div className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap
            ${active ? "bg-slate-900 text-white shadow-md" : done ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-white text-slate-400 border border-slate-200"}
          `}>
            {done ? <CheckCircle2 size={15} className="text-emerald-500 flex-shrink-0" /> : <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${active ? "bg-white text-slate-900" : "bg-slate-100 text-slate-400"}`}>{i + 1}</span>}
            <span className="hidden sm:inline">{step.label}</span>
            {!done && !active && <AlertCircle size={13} className="text-orange-400 flex-shrink-0" />}
          </div>
          {i < STEPS.length - 1 && (
            <div className={`flex-1 h-px mx-1 ${done ? "bg-emerald-300" : "bg-slate-200"}`} />
          )}
        </div>
      );
    })}
  </div>
);

/* ─── Tax Summary row ─── */
const SummaryRow = ({ label, value, highlight, bold }) => (
  <div className={`flex items-center justify-between py-3 border-b border-slate-100 last:border-0 ${highlight ? "bg-blue-50 -mx-5 px-5 rounded-xl" : ""}`}>
    <span className={`text-sm ${bold ? "font-bold text-slate-900" : "text-slate-600"}`}>{label}</span>
    <span className={`text-sm font-bold ${highlight ? "text-blue-700 text-base" : "text-slate-900"}`}>{value}</span>
  </div>
);

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
const ITRFilingForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});

  /* ── Personal Info state ── */
  const [personal, setPersonal] = useState({
    firstName: user?.name?.split(" ")[0] || "",
    middleName: "",
    lastName: user?.name?.split(" ").slice(1).join(" ") || "",
    dob: "",
    fatherName: "",
    gender: "",
    maritalStatus: "",
    // Address
    flatDoorNo: "",
    premiseName: "",
    roadStreet: "",
    areaLocality: "",
    pincode: "",
    country: "INDIA",
    state: "",
    city: "",
    // Identification
    aadhaar: "",
    pan: "",
    mobileCountry: "+91",
    mobile: "",
    email: user?.email || "",
    // Additional
    bankName: "",
    accountNumber: "",
    ifsc: "",
    accountType: "",
  });

  /* ── Income Sources state ── */
  const [income, setIncome] = useState({
    hasSalary: false,
    grossSalary: "",
    hra: "",
    lta: "",
    otherAllowances: "",
    hasHouseProperty: false,
    rentReceived: "",
    municipalTax: "",
    homeLoanInterest: "",
    hasCapitalGains: false,
    stcgEquity: "",
    ltcgEquity: "",
    stcgOther: "",
    ltcgOther: "",
    hasOtherIncome: false,
    interestSavings: "",
    interestFD: "",
    dividends: "",
    otherIncome: "",
  });

  /* ── Tax Saving state ── */
  const [taxSaving, setTaxSaving] = useState({
    regime: "new",
    sec80C: "",
    sec80D_self: "",
    sec80D_parents: "",
    sec80E: "",
    sec80G: "",
    sec80TTA: "",
    nps80CCD: "",
    homeLoan80EEA: "",
  });

  const handlePersonal = (e) => {
    const { name, value } = e.target;
    setPersonal((p) => ({ ...p, [name]: value }));
    setErrors((e) => ({ ...e, [name]: "" }));
  };

  const handleIncome = (e) => {
    const { name, value, type, checked } = e.target;
    setIncome((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleTaxSaving = (e) => {
    const { name, value } = e.target;
    setTaxSaving((p) => ({ ...p, [name]: value }));
  };

  /* ── Validations ── */
  const validatePersonal = () => {
    const e = {};
    if (!personal.firstName.trim()) e.firstName = "First name is required";
    if (!personal.dob) e.dob = "Date of birth is required";
    if (!personal.fatherName.trim()) e.fatherName = "Father's name is required";
    if (!personal.flatDoorNo.trim()) e.flatDoorNo = "Flat/Door No is required";
    if (!personal.areaLocality.trim()) e.areaLocality = "Area / Locality is required";
    if (!personal.pincode || !/^\d{6}$/.test(personal.pincode)) e.pincode = "Enter a valid 6-digit pincode";
    if (!personal.state) e.state = "State is required";
    if (!personal.city.trim()) e.city = "City is required";
    if (!personal.aadhaar || !/^\d{12}$/.test(personal.aadhaar.replace(/\s/g, ""))) e.aadhaar = "Enter valid 12-digit Aadhaar";
    if (!personal.pan || !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(personal.pan.toUpperCase())) e.pan = "Enter valid PAN (e.g. ABCDE1234F)";
    if (!personal.mobile || !/^\d{10}$/.test(personal.mobile)) e.mobile = "Enter valid 10-digit mobile number";
    if (!personal.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personal.email)) e.email = "Enter valid email address";
    return e;
  };

  /* ── Tax computation (simplified) ── */
  const computeTax = () => {
    const sal = parseFloat(income.grossSalary) || 0;
    const houseIncome = Math.max(0, (parseFloat(income.rentReceived) || 0) - (parseFloat(income.municipalTax) || 0) - (parseFloat(income.homeLoanInterest) || 0));
    const capGains = (parseFloat(income.stcgEquity) || 0) + (parseFloat(income.ltcgEquity) || 0) + (parseFloat(income.stcgOther) || 0) + (parseFloat(income.ltcgOther) || 0);
    const other = (parseFloat(income.interestSavings) || 0) + (parseFloat(income.interestFD) || 0) + (parseFloat(income.dividends) || 0) + (parseFloat(income.otherIncome) || 0);

    const grossTotal = sal + houseIncome + capGains + other;

    // Deductions under old regime
    const deductions80C = Math.min(parseFloat(taxSaving.sec80C) || 0, 150000);
    const deductions80D = (parseFloat(taxSaving.sec80D_self) || 0) + (parseFloat(taxSaving.sec80D_parents) || 0);
    const totalDeductions = deductions80C + deductions80D +
      (parseFloat(taxSaving.sec80E) || 0) + (parseFloat(taxSaving.sec80G) || 0) +
      (parseFloat(taxSaving.sec80TTA) || 0) + (parseFloat(taxSaving.nps80CCD) || 0) +
      (parseFloat(taxSaving.homeLoan80EEA) || 0);

    const stdDeduction = sal > 0 ? 75000 : 0; // FY 2024-25 standard deduction under new regime

    const taxableOld = Math.max(0, grossTotal - totalDeductions);
    const taxableNew = Math.max(0, grossTotal - stdDeduction);

    const calcTax = (income, regime) => {
      let tax = 0;
      if (regime === "old") {
        if (income <= 250000) tax = 0;
        else if (income <= 500000) tax = (income - 250000) * 0.05;
        else if (income <= 1000000) tax = 12500 + (income - 500000) * 0.2;
        else tax = 112500 + (income - 1000000) * 0.3;
      } else {
        if (income <= 300000) tax = 0;
        else if (income <= 700000) tax = (income - 300000) * 0.05;
        else if (income <= 1000000) tax = 20000 + (income - 700000) * 0.1;
        else if (income <= 1200000) tax = 50000 + (income - 1000000) * 0.15;
        else if (income <= 1500000) tax = 80000 + (income - 1200000) * 0.2;
        else tax = 140000 + (income - 1500000) * 0.3;
        // Rebate u/s 87A for new regime (income ≤ 7L)
        if (income <= 700000) tax = 0;
      }
      const cess = tax * 0.04;
      return Math.round(tax + cess);
    };

    const taxOld = calcTax(taxableOld, "old");
    const taxNew = calcTax(taxableNew, "new");
    const chosen = taxSaving.regime === "old" ? taxOld : taxNew;
    const saving = Math.abs(taxOld - taxNew);
    const betterRegime = taxNew < taxOld ? "New" : "Old";

    return { grossTotal, taxableOld, taxableNew, taxOld, taxNew, chosen, saving, betterRegime, totalDeductions, stdDeduction };
  };

  const fmt = (n) => `₹${Math.abs(n).toLocaleString("en-IN")}`;

  /* ── Navigation ── */
  const goNext = () => {
    if (step === 0) {
      const errs = validatePersonal();
      if (Object.keys(errs).length > 0) {
        setErrors(errs);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
    }
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const goBack = () => { setStep((s) => s - 1); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const tax = computeTax();

  /* ────────────────── RENDER ────────────────── */
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">

          {/* Step bar */}
          <StepBar current={step} />

          {/* ── STEP 0 : PERSONAL INFO ── */}
          {step === 0 && (
            <div>
              {/* Permanent Information */}
              <FormSection
                icon={<User size={16} />}
                title="Permanent Information"
                subtitle="Please provide all info as per your government identity documents (PAN, Aadhaar etc.)"
                badge="Details Added"
              >
                <div className="mt-4 space-y-5">
                  {/* Name row */}
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-3">
                      Name <span className="text-red-500">*</span>
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      <FloatingInput label="First Name" name="firstName" value={personal.firstName} onChange={handlePersonal} required error={errors.firstName} />
                      <FloatingInput label="Middle Name" name="middleName" value={personal.middleName} onChange={handlePersonal} />
                      <FloatingInput label="Last Name" name="lastName" value={personal.lastName} onChange={handlePersonal} />
                    </div>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-2">
                      <Info size={10} /> Name should be as per the PAN; 5th character of PAN no. is the first letter of the last name
                    </p>
                  </div>

                  {/* DOB */}
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-2">Date of Birth <span className="text-red-500">*</span></p>
                    <FloatingInput label="DD/MM/YYYY" name="dob" type="date" value={personal.dob} onChange={handlePersonal} required hint="Specify date in a format like DD/MM/YYYY" error={errors.dob} />
                  </div>

                  {/* Father's name */}
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-2">Father's Name <span className="text-red-500">*</span></p>
                    <FloatingInput label="Father's Name" name="fatherName" value={personal.fatherName} onChange={handlePersonal} required error={errors.fatherName} />
                  </div>

                  {/* Gender + Marital status */}
                  <div className="grid grid-cols-2 gap-4">
                    <FloatingSelect label="Gender" name="gender" value={personal.gender} onChange={handlePersonal}
                      options={[{ value: "M", label: "Male" }, { value: "F", label: "Female" }, { value: "O", label: "Other" }]} />
                    <FloatingSelect label="Marital Status" name="maritalStatus" value={personal.maritalStatus} onChange={handlePersonal}
                      options={[{ value: "single", label: "Single" }, { value: "married", label: "Married" }]} />
                  </div>
                </div>
              </FormSection>

              {/* Address */}
              <FormSection
                icon={<MapPin size={16} />}
                title="Your Address"
                subtitle="You can provide either your current address or permanent address of residence."
                badge="Details Added"
              >
                <div className="mt-4 space-y-4">
                  <FloatingInput label="Flat / Door No" name="flatDoorNo" value={personal.flatDoorNo} onChange={handlePersonal} required error={errors.flatDoorNo} />
                  <FloatingInput label="Premise Name" name="premiseName" value={personal.premiseName} onChange={handlePersonal} />
                  <FloatingInput label="Road / Street" name="roadStreet" value={personal.roadStreet} onChange={handlePersonal} />
                  <FloatingInput label="Area Locality" name="areaLocality" value={personal.areaLocality} onChange={handlePersonal} required error={errors.areaLocality} />
                  <FloatingInput label="Pincode / ZipCode" name="pincode" value={personal.pincode} onChange={handlePersonal} required error={errors.pincode} hint="6-digit pincode" />
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-3">Country | State | City <span className="text-red-500">*</span></p>
                    <div className="grid grid-cols-3 gap-3">
                      <FloatingSelect label="Country" name="country" value={personal.country} onChange={handlePersonal}
                        options={[{ value: "INDIA", label: "INDIA" }]} />
                      <FloatingSelect label="State" name="state" value={personal.state} onChange={handlePersonal} required error={errors.state}
                        options={STATES.map((s) => ({ value: s.toUpperCase(), label: s }))} />
                      <FloatingInput label="City" name="city" value={personal.city} onChange={handlePersonal} required error={errors.city} />
                    </div>
                  </div>
                </div>
              </FormSection>

              {/* Identification & Contact */}
              <FormSection
                icon={<CreditCard size={16} className="text-rose-500" style={{ color: "#f87171" }} />}
                title="Identification & Contact details"
                subtitle="To e-file your returns, please provide your Aadhaar, PAN and contact details."
                badge="Details Added"
              >
                <div className="mt-4 space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-2">Aadhaar Details <span className="text-red-500">*</span></p>
                    <FloatingInput label="Aadhaar Number" name="aadhaar" value={personal.aadhaar} onChange={handlePersonal} required error={errors.aadhaar} hint="Don't remember your Aadhaar number? Search it here" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-2">PAN <span className="text-red-500">*</span></p>
                    <FloatingInput label="PAN" name="pan" value={personal.pan} onChange={(e) => handlePersonal({ target: { name: "pan", value: e.target.value.toUpperCase() } })} required error={errors.pan} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-2">Mobile No <span className="text-red-500">*</span></p>
                    <div className="flex gap-2">
                      <div className="w-24">
                        <FloatingSelect label="Code" name="mobileCountry" value={personal.mobileCountry} onChange={handlePersonal}
                          options={[{ value: "+91", label: "+91" }]} />
                      </div>
                      <div className="flex-1">
                        <FloatingInput label="Mobile Number" name="mobile" value={personal.mobile} onChange={handlePersonal} required error={errors.mobile} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-2">Email <span className="text-red-500">*</span></p>
                    <FloatingInput label="Email" name="email" type="email" value={personal.email} onChange={handlePersonal} required error={errors.email} />
                  </div>

                  {/* Optional: Additional info */}
                  <details className="group">
                    <summary className="flex items-center gap-2 text-blue-600 text-sm font-semibold cursor-pointer select-none list-none mt-2">
                      <span>Add Additional Information (Optional)</span>
                      <ChevronDown size={14} className="group-open:rotate-180 transition-transform" />
                    </summary>
                    <div className="mt-4 space-y-4 border-t border-slate-100 pt-4">
                      <FloatingInput label="Bank Name" name="bankName" value={personal.bankName} onChange={handlePersonal} />
                      <FloatingInput label="Account Number" name="accountNumber" value={personal.accountNumber} onChange={handlePersonal} />
                      <FloatingInput label="IFSC Code" name="ifsc" value={personal.ifsc} onChange={handlePersonal} />
                      <FloatingSelect label="Account Type" name="accountType" value={personal.accountType} onChange={handlePersonal}
                        options={[{ value: "savings", label: "Savings" }, { value: "current", label: "Current" }]} />
                    </div>
                  </details>
                </div>
              </FormSection>
            </div>
          )}

          {/* ── STEP 1 : INCOME SOURCES ── */}
          {step === 1 && (
            <div>
              <p className="text-xs text-slate-500 mb-5 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-center gap-2">
                <Info size={14} className="text-blue-500 flex-shrink-0" />
                Select all income sources that apply. Only fill what's relevant — leave the rest blank.
              </p>

              {/* Salary */}
              <FormSection icon={<Briefcase size={16} />} title="Salary / Pension" subtitle="Income from employment or pension">
                <div className="mt-3 mb-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" name="hasSalary" checked={income.hasSalary} onChange={handleIncome}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                    <span className="text-sm font-semibold text-slate-700">I have salary / pension income</span>
                  </label>
                </div>
                {income.hasSalary && (
                  <div className="space-y-4 mt-4">
                    <FloatingInput label="Gross Salary (as per Form 16)" name="grossSalary" type="number" value={income.grossSalary} onChange={handleIncome} hint="Sum of all salary components before deductions" />
                    <div className="grid grid-cols-2 gap-4">
                      <FloatingInput label="HRA Received" name="hra" type="number" value={income.hra} onChange={handleIncome} />
                      <FloatingInput label="LTA Received" name="lta" type="number" value={income.lta} onChange={handleIncome} />
                    </div>
                    <FloatingInput label="Other Allowances" name="otherAllowances" type="number" value={income.otherAllowances} onChange={handleIncome} />
                  </div>
                )}
              </FormSection>

              {/* House Property */}
              <FormSection icon={<Home size={16} />} title="House Property" subtitle="Rental income, self-occupied or let-out property">
                <div className="mt-3 mb-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" name="hasHouseProperty" checked={income.hasHouseProperty} onChange={handleIncome}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                    <span className="text-sm font-semibold text-slate-700">I have house property income / loss</span>
                  </label>
                </div>
                {income.hasHouseProperty && (
                  <div className="space-y-4 mt-4">
                    <FloatingInput label="Annual Rent Received (₹)" name="rentReceived" type="number" value={income.rentReceived} onChange={handleIncome} />
                    <div className="grid grid-cols-2 gap-4">
                      <FloatingInput label="Municipal Tax Paid (₹)" name="municipalTax" type="number" value={income.municipalTax} onChange={handleIncome} />
                      <FloatingInput label="Home Loan Interest (₹)" name="homeLoanInterest" type="number" value={income.homeLoanInterest} onChange={handleIncome} hint="Max ₹2L deduction for self-occupied" />
                    </div>
                  </div>
                )}
              </FormSection>

              {/* Capital Gains */}
              <FormSection icon={<TrendingUp size={16} />} title="Capital Gains" subtitle="Stocks, Mutual Funds, Property, F&O">
                <div className="mt-3 mb-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" name="hasCapitalGains" checked={income.hasCapitalGains} onChange={handleIncome}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                    <span className="text-sm font-semibold text-slate-700">I have capital gains / losses</span>
                  </label>
                </div>
                {income.hasCapitalGains && (
                  <div className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FloatingInput label="STCG — Equity / MF (15%)" name="stcgEquity" type="number" value={income.stcgEquity} onChange={handleIncome} />
                      <FloatingInput label="LTCG — Equity / MF (10%)" name="ltcgEquity" type="number" value={income.ltcgEquity} onChange={handleIncome} hint="Gains above ₹1L taxable" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FloatingInput label="STCG — Other assets (30%)" name="stcgOther" type="number" value={income.stcgOther} onChange={handleIncome} />
                      <FloatingInput label="LTCG — Other assets (20%)" name="ltcgOther" type="number" value={income.ltcgOther} onChange={handleIncome} />
                    </div>
                  </div>
                )}
              </FormSection>

              {/* Other income */}
              <FormSection icon={<PiggyBank size={16} />} title="Other Income" subtitle="Interest, dividends, freelance, gifts etc.">
                <div className="mt-3 mb-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" name="hasOtherIncome" checked={income.hasOtherIncome} onChange={handleIncome}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                    <span className="text-sm font-semibold text-slate-700">I have other income</span>
                  </label>
                </div>
                {income.hasOtherIncome && (
                  <div className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FloatingInput label="Interest — Savings A/c (₹)" name="interestSavings" type="number" value={income.interestSavings} onChange={handleIncome} />
                      <FloatingInput label="Interest — FD / RD (₹)" name="interestFD" type="number" value={income.interestFD} onChange={handleIncome} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FloatingInput label="Dividends (₹)" name="dividends" type="number" value={income.dividends} onChange={handleIncome} />
                      <FloatingInput label="Any Other Income (₹)" name="otherIncome" type="number" value={income.otherIncome} onChange={handleIncome} />
                    </div>
                  </div>
                )}
              </FormSection>
            </div>
          )}

          {/* ── STEP 2 : TAX SAVING ── */}
          {step === 2 && (
            <div>
              {/* Regime selector */}
              <div className="mb-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <p className="text-sm font-bold text-slate-900 mb-3">Choose Tax Regime</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { val: "new", label: "New Regime", sub: "Lower rates, fewer deductions (Default from FY 2023-24)" },
                    { val: "old", label: "Old Regime", sub: "Higher rates but more deductions (80C, 80D etc.)" },
                  ].map((r) => (
                    <label key={r.val}
                      className={`flex flex-col gap-1 p-4 rounded-xl border-2 cursor-pointer transition-all ${taxSaving.regime === r.val ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-slate-300"}`}>
                      <input type="radio" name="regime" value={r.val} checked={taxSaving.regime === r.val} onChange={handleTaxSaving} className="sr-only" />
                      <span className={`font-bold text-sm ${taxSaving.regime === r.val ? "text-blue-700" : "text-slate-700"}`}>{r.label}</span>
                      <span className="text-xs text-slate-500 leading-snug">{r.sub}</span>
                    </label>
                  ))}
                </div>
                {/* Recommendation chip */}
                <div className="mt-3 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-emerald-500 flex-shrink-0" />
                  {tax.betterRegime} Regime saves you <strong>{fmt(tax.saving)}</strong> based on your income
                </div>
              </div>

              <FormSection icon={<Calculator size={16} />} title="Chapter VI-A Deductions"
                subtitle="Applicable only under Old Regime. Enter the amounts you have invested / paid.">
                <div className="mt-4 space-y-4">
                  <FloatingInput label="Sec 80C — LIC, PPF, ELSS, EPF, School fees etc. (Max ₹1.5L)" name="sec80C" type="number" value={taxSaving.sec80C} onChange={handleTaxSaving} hint="Combined cap of ₹1,50,000" />
                  <div className="grid grid-cols-2 gap-4">
                    <FloatingInput label="Sec 80D — Health Insurance (Self/Family)" name="sec80D_self" type="number" value={taxSaving.sec80D_self} onChange={handleTaxSaving} hint="Max ₹25,000" />
                    <FloatingInput label="Sec 80D — Health Insurance (Parents)" name="sec80D_parents" type="number" value={taxSaving.sec80D_parents} onChange={handleTaxSaving} hint="Max ₹50,000 (senior citizen)" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FloatingInput label="Sec 80E — Education Loan Interest" name="sec80E" type="number" value={taxSaving.sec80E} onChange={handleTaxSaving} />
                    <FloatingInput label="Sec 80G — Donations" name="sec80G" type="number" value={taxSaving.sec80G} onChange={handleTaxSaving} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FloatingInput label="Sec 80TTA — Savings Interest (Max ₹10K)" name="sec80TTA" type="number" value={taxSaving.sec80TTA} onChange={handleTaxSaving} />
                    <FloatingInput label="Sec 80CCD(1B) — NPS (Max ₹50K)" name="nps80CCD" type="number" value={taxSaving.nps80CCD} onChange={handleTaxSaving} />
                  </div>
                  <FloatingInput label="Sec 80EEA — Home Loan (First-time buyers)" name="homeLoan80EEA" type="number" value={taxSaving.homeLoan80EEA} onChange={handleTaxSaving} hint="Max ₹1.5L, loan sanctioned between 1 Apr 2019 – 31 Mar 2022" />
                </div>
              </FormSection>
            </div>
          )}

          {/* ── STEP 3 : TAX SUMMARY ── */}
          {step === 3 && (
            <div>
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm mb-5">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5 text-white">
                  <div className="flex items-center gap-3 mb-1">
                    <Calculator size={20} />
                    <h2 className="font-extrabold text-lg">Your Tax Computation Summary</h2>
                  </div>
                  <p className="text-blue-100 text-sm">
                    FY 2024–25 · Assessment Year 2025–26 · {taxSaving.regime === "new" ? "New" : "Old"} Regime
                  </p>
                </div>

                {/* Body */}
                <div className="px-5 py-5">
                  <SummaryRow label="Gross Total Income" value={fmt(tax.grossTotal)} />
                  {taxSaving.regime === "new"
                    ? <SummaryRow label="Standard Deduction (Sec 16)" value={`- ${fmt(tax.stdDeduction)}`} />
                    : <SummaryRow label="Total Deductions (Chapter VI-A)" value={`- ${fmt(tax.totalDeductions)}`} />
                  }
                  <SummaryRow label="Taxable Income" value={fmt(taxSaving.regime === "new" ? tax.taxableNew : tax.taxableOld)} bold />
                  <div className="h-3" />
                  <SummaryRow label="Tax Payable (Old Regime)" value={fmt(tax.taxOld)} />
                  <SummaryRow label="Tax Payable (New Regime)" value={fmt(tax.taxNew)} />
                  <div className="h-3" />
                  <SummaryRow
                    label={`✅ Tax under ${taxSaving.regime === "new" ? "New" : "Old"} Regime (Your Choice)`}
                    value={fmt(tax.chosen)}
                    highlight bold
                  />
                </div>

                {/* Savings callout */}
                <div className="mx-5 mb-5 bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-emerald-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-emerald-800">
                      {tax.betterRegime} Regime is more beneficial for you
                    </p>
                    <p className="text-xs text-emerald-700 mt-0.5">
                      Switching saves you <strong>{fmt(tax.saving)}</strong> in tax
                    </p>
                  </div>
                </div>
              </div>

              {/* Personal summary card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm mb-5">
                <h3 className="font-bold text-slate-900 text-sm mb-4">Filing Details</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    { l: "Name", v: [personal.firstName, personal.middleName, personal.lastName].filter(Boolean).join(" ") },
                    { l: "PAN", v: personal.pan || "—" },
                    { l: "Date of Birth", v: personal.dob || "—" },
                    { l: "Mobile", v: personal.mobile ? `${personal.mobileCountry} ${personal.mobile}` : "—" },
                    { l: "Email", v: personal.email || "—" },
                    { l: "City", v: personal.city || "—" },
                  ].map((item) => (
                    <div key={item.l} className="bg-slate-50 rounded-lg p-3">
                      <p className="text-xs text-slate-400 mb-1">{item.l}</p>
                      <p className="font-semibold text-slate-800 truncate">{item.v}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Proceed to service */}
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
                <p className="text-sm text-blue-900 font-bold mb-1">Ready to file your ITR?</p>
                <p className="text-xs text-blue-700 mb-4">
                  Your tax summary is ready. Choose a plan to have a CA review and e-file your return.
                </p>
                <button
                  onClick={() => navigate("/services/individual")}
                  className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  Proceed to Select Plan & File <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ── Navigation buttons ── */}
          <div className="flex items-center justify-between mt-6 pt-5 border-t border-slate-200">
            <button
              type="button"
              onClick={step === 0 ? () => navigate("/itr-filing") : goBack}
              className="flex items-center gap-2 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft size={16} />
              {step === 0 ? "Back to Home" : "Previous"}
            </button>

            {step < 3 && (
              <button
                type="button"
                onClick={goNext}
                className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
              >
                {step === 2 ? "View Tax Summary" : "Save & Continue"}
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ITRFilingForm;
