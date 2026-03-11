import React from 'react';
import { Mail, Clock } from 'lucide-react';

const EmailLogin = () => {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
        <Mail size={32} />
      </div>
      <div>
        <h3 className="text-lg font-bold text-slate-800">Email Login</h3>
        <p className="text-sm text-slate-500 max-w-[250px] mx-auto">
          We are currently working on bringing email authentication to your experience.
        </p>
      </div>
      <div className="flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">
        <Clock size={12} />
        Coming Soon
      </div>
    </div>
  );
};

export default EmailLogin;
