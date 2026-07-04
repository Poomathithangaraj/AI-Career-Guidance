import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, AlertCircle, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="flex-grow flex items-center justify-center py-20 px-4 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="p-4 bg-rose-50 dark:bg-rose-950/20 rounded-3xl inline-block text-rose-500 border border-rose-100 dark:border-rose-900/30">
          <AlertCircle className="h-12 w-12" />
        </div>
        
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">404 - Page Not Found</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
          The coordinate pathway you are trying to reach does not exist or has been moved from the portal map.
        </p>

        <div>
          <Link
            to="/dashboard"
            className="inline-flex items-center space-x-1.5 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-semibold shadow-md shadow-brand-500/25 transition-transform hover:-translate-y-0.5"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
