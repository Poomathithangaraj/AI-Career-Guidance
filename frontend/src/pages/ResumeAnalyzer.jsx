import React, { useEffect, useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, FileSearch, Sparkles, TrendingUp } from 'lucide-react';
import api from '../utils/api';

const ResumeAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');
  
  const [loadingLatest, setLoadingLatest] = useState(true);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const response = await api.get('/api/resume/latest');
        setAnalysis(response.data);
      } catch (err) {
        // No prior analysis is fine
      } finally {
        setLoadingLatest(false);
      }
    };
    fetchLatest();
  }, []);

  const handleFileChange = (e) => {
    setError('');
    const selected = e.target.files[0];
    if (selected && selected.type === 'application/pdf') {
      setFile(selected);
    } else {
      setError('Please select a valid PDF document template.');
      setFile(null);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/api/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setAnalysis(response.data);
      setFile(null);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to scan and upload resume. Make sure PDF contains copyable text (not scanned images).');
    } finally {
      setUploading(false);
    }
  };

  if (loadingLatest) {
    return (
      <div className="flex-grow flex items-center justify-center dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  return (
    <div className="flex-grow max-w-5xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8 dark:bg-slate-950 transition-colors duration-300">
      
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">AI Resume Analyzer</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Upload your resume PDF. The parser evaluates keywords, projects, education completeness, and grades formatting templates.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Upload box */}
        <div>
          <form onSubmit={handleUploadSubmit} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-850 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-850 dark:text-white">Upload Resume PDF</h3>
            
            {/* Upload Area */}
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-brand-500 dark:hover:border-brand-500 rounded-2xl p-6 text-center cursor-pointer transition-colors relative">
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-350 block">
                {file ? file.name : 'Select PDF File'}
              </span>
              <span className="text-[10px] text-slate-400 mt-1 block">Maximum size: 5MB</span>
            </div>

            {error && (
              <div className="p-3.5 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 rounded-xl text-rose-800 dark:text-rose-450 text-xs">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!file || uploading}
              className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-semibold shadow-md shadow-brand-500/10 transition-colors disabled:opacity-50"
            >
              {uploading ? 'Analyzing Documents...' : 'Start Scanning'}
            </button>
          </form>
        </div>

        {/* Right Column: Scan analysis results */}
        <div className="lg:col-span-2 space-y-6">
          
          {analysis ? (
            <>
              {/* Score card */}
              <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-850 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-brand-500/5 rounded-full blur-2xl pointer-events-none"></div>
                <div className="flex items-center space-x-6">
                  {/* Circular Score representation */}
                  <div className="w-24 h-24 rounded-full border-4 border-brand-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-extrabold text-slate-850 dark:text-white">{analysis.resume_score}</span>
                  </div>
                  <div>
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-brand-100 text-brand-700 dark:bg-brand-950/30 dark:text-brand-300 rounded-md text-[10px] font-bold uppercase tracking-wide">
                      <Sparkles className="h-3 w-3" />
                      <span>Scan score rating</span>
                    </span>
                    <h3 className="text-lg font-bold text-slate-850 dark:text-white mt-2">Resume Score Analysis Finished</h3>
                    <p className="text-xs text-slate-500 mt-1">Parsed file: <span className="font-semibold">{analysis.filename}</span></p>
                  </div>
                </div>
              </div>

              {/* Suggestions */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-850 shadow-sm">
                <h3 className="text-sm font-bold text-slate-850 dark:text-white mb-3 flex items-center space-x-1.5">
                  <TrendingUp className="h-4.5 w-4.5 text-brand-500" />
                  <span>AI Suggestions for Improvement</span>
                </h3>
                <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400 pl-2">
                  {analysis.suggestions ? (
                    analysis.suggestions.split('\n').map((line, i) => (
                      <div key={i} className="flex items-start space-x-2 py-1">
                        <span className="text-brand-500 font-bold">•</span>
                        <span>{line}</span>
                      </div>
                    ))
                  ) : (
                    <p className="italic">No critical suggestions. Your resume covers all core targets!</p>
                  )}
                </div>
              </div>

              {/* Extracted Details */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-850 shadow-sm space-y-4">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Detected Tech Skills</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-100 dark:border-slate-850 leading-relaxed">
                    {analysis.extracted_skills || 'No recognizable technical skills keywords found.'}
                  </p>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Extracted Education Coordinates</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-100 dark:border-slate-850 leading-relaxed">
                    {analysis.extracted_education || 'No academic coordinates parsed.'}
                  </p>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Extracted Projects details</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-100 dark:border-slate-850 leading-relaxed">
                    {analysis.extracted_projects || 'No projects structures detected.'}
                  </p>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Extracted Certifications</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-100 dark:border-slate-850 leading-relaxed">
                    {analysis.extracted_certifications || 'No certifications keywords detected.'}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-3xl p-12 text-center text-slate-400 text-sm">
              <FileSearch className="h-10 w-10 text-slate-350 mx-auto mb-3" />
              <span>Submit your PDF resume to generate evaluations scores and feedback scans.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalyzer;
