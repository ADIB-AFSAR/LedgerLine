import {
  ShieldCheck,
  Lock,
} from "lucide-react";

const Footer = () => {
  return (
    <>
      <footer className="bg-slate-900 text-slate-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm">
              © 2026 Powerfilling. All rights reserved. Designed for Indian
              Taxpayers.
            </p>
            <div className="flex gap-8 text-sm">
              <span className="flex items-center gap-1">
                <ShieldCheck size={14} /> ISO 27001 Certified
              </span>
              <span className="flex items-center gap-1">
                <Lock size={14} /> 256-bit Encrypted
              </span>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer;