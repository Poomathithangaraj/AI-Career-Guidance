import React, { useState } from 'react';
import { FileText, Download, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../utils/api';

const Reports = () => {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');

  const handleDownload = async () => {
    setDownloading(false);
    setError('');
    setDownloading(true);
    try {
      const response = await api.get('/api/report', { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'AI_Career_Guidance_Report.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError('Failed to generate report. Please ensure your profile is fully complete and you have submitted answers to the career assessment.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex-grow max-w-4xl w-full mx-auto px-4 py-12 sm:px-6 lg:px-8 dark:bg-slate-950 transition-colors duration-300">
      
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">PDF Career Report</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Generate and download a comprehensive 3-page career breakdown report containing score charts, roadmaps, and profile stats.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-850 shadow-sm text-center">
        <div className="p-4 bg-brand-50 dark:bg-brand-950/30 rounded-2xl text-brand-650 inline-block mb-4">
          <FileText className="h-10 w-10 text-brand-500" />
        </div>
        
        <h2 className="text-xl font-bold text-slate-850 dark:text-white">Candidate Career Evaluation Portfolio</h2>
        <p className="mt-2 text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
          Report compiles candidate details, overall assessment scores, strength analysis, top 5 matching careers, and CV evaluations checklist.
        </p>

        {error && (
          <div className="max-w-md mx-auto mt-6 p-4 bg-amber-50 dark:bg-amber-955/10 border border-amber-200 dark:border-amber-900/30 rounded-2xl flex items-start space-x-2 text-left text-amber-800 dark:text-amber-300 text-xs">
            <AlertCircle className="h-4.5 w-4.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="mt-8">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="inline-flex items-center space-x-2 px-8 py-3.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-brand-500/20 transition-all disabled:opacity-50 hover:-translate-y-0.5"
          >
            <Download className="h-4.5 w-4.5" />
            <span>{downloading ? 'Compiling Report PDF...' : 'Download Evaluation Report'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reports;
