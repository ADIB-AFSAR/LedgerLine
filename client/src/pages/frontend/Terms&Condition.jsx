import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield } from "lucide-react";
import Footer from "./Footer";

const TermsAndConditions = () => {
  const navigate = useNavigate();
  const [terms, setTerms] = useState("");

  useEffect(() => {
    fetch("/Terms & Conditions.docx.txt")
      .then((res) => res.text())
      .then(setTerms)
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20 ">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4 ">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <div className="h-4 w-px bg-slate-200" />

          <div className="flex items-center gap-2">
            <Shield size={18} className="text-blue-600" />
            <span className="font-bold text-slate-800">Terms & Conditions</span>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-900 to-blue-900 text-white py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
            Legal
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Terms & Conditions</h1>
          <p className="text-sm text-slate-500 mt-2 text-white">
            Please read these terms carefully before using Powerfiling services.
          </p>
          <p className="text-slate-300 text-sm mt-2">Last Updated: 2026</p>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-8 ">
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          <div className="p-6 md:p-10">
            <pre
              className="
                                whitespace-pre-wrap
                                break-words
                                text-slate-700
                                text-sm
                                leading-7
                                font-sans
                            "
            >
              {terms}
            </pre>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsAndConditions;
