import React from 'react';
import { useTheme } from '../components/ThemeProvider';
import { Sun, Moon, Shield, Key, Eye } from 'lucide-react';

const Settings = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  return (
    <div className="flex-grow max-w-4xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8 dark:bg-slate-950 transition-colors duration-300">
      
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Application Settings</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Customize themes and verify account credentials.
        </p>
      </div>

      <div className="space-y-6">
        
        {/* Theme Settings */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-850 shadow-sm">
          <h3 className="text-base font-bold text-slate-850 dark:text-white mb-4 flex items-center space-x-2">
            <span>Visual Theme Preference</span>
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Switch between light corporate layout and dark visual panels.</p>
            </div>
            
            <button
              onClick={toggleDarkMode}
              className="flex items-center space-x-1.5 px-4.5 py-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold transition-colors"
            >
              {darkMode ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4 text-brand-500" />}
              <span>Toggle Mode</span>
            </button>
          </div>
        </div>

        {/* Security / Admin Coordinates */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-850 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-850 dark:text-white mb-2 flex items-center space-x-2">
            <Shield className="h-4.5 w-4.5 text-brand-500" />
            <span>Account Privileges status</span>
          </h3>
          
          <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800/80">
            <span className="text-xs text-slate-500">Access Tier:</span>
            <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
              isAdmin 
                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-450' 
                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-350'
            }`}>
              {isAdmin ? 'System Administrator' : 'Candidate Tier'}
            </span>
          </div>

          <div className="flex justify-between items-center py-2">
            <span className="text-xs text-slate-500">JWT Token Status:</span>
            <span className="text-xs font-semibold text-emerald-500">Active / Encrypted (HS256)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
