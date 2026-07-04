import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Compass, GraduationCap, Award, FileText, CheckCircle2, ArrowRight, Download, RefreshCw, ChevronRight, Sparkles } from 'lucide-react';
import api from '../utils/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/api/dashboard');
        setData(response.data);
      } catch (err) {
        setError('Failed to fetch dashboard data. Please verify your login credentials.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const handleDownloadReport = async () => {
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
      alert('Failed to generate report. Make sure you have completed the profile and assessment exam.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-grow flex items-center justify-center py-16 dark:bg-slate-950 text-rose-500">
        <span>{error}</span>
      </div>
    );
  }

  // Formatting assessment category scores for Radar Charts
  const radarData = Object.entries(data.category_scores || {}).map(([key, val]) => ({
    subject: key,
    score: val,
    fullMark: 5,
  }));

  const hasRecommendations = data.recommended_careers && data.recommended_careers.length > 0;

  return (
    <div className="flex-grow max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8 dark:bg-slate-950 transition-colors duration-300">
      
      {/* 1. WELCOME CARD */}
      <div className="relative overflow-hidden bg-gradient-to-r from-brand-900 to-brand-750 dark:from-slate-900 dark:to-slate-850 p-8 sm:p-10 rounded-3xl text-white mb-8 shadow-xl shadow-brand-950/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none -translate-y-1/3 translate-x-1/3"></div>
        <div className="relative z-10 max-w-3xl">
          <span className="inline-flex items-center space-x-1 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold tracking-wide text-brand-200 mb-4 border border-white/5">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Career Assistant Online</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Welcome back, {data.welcome_name}!
          </h1>
          <p className="mt-3 text-slate-200 text-sm sm:text-base leading-relaxed max-w-2xl">
            {hasRecommendations 
              ? "Your career path recommendations are fully compiled. Take a look at your customized learning roadmap and matched job opportunities below."
              : "Let's discover your technology fits. Set up your academic credentials and complete the 50-Q assessment to unlock matching career plans."}
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            {!hasRecommendations ? (
              <Link
                to="/assessment"
                className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-md shadow-brand-500/20 hover:-translate-y-0.5"
              >
                Start Assessment
              </Link>
            ) : (
              <>
                <button
                  onClick={handleDownloadReport}
                  disabled={downloading}
                  className="flex items-center justify-center space-x-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-850 rounded-xl text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 shadow-md disabled:opacity-50"
                >
                  <Download className="h-4.5 w-4.5" />
                  <span>{downloading ? 'Generating Report...' : 'Download Report PDF'}</span>
                </button>
                <Link
                  to="/assessment"
                  className="flex items-center justify-center space-x-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-md shadow-brand-500/20 hover:-translate-y-0.5"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Re-take Assessment</span>
                </Link>
              </>
            )}
            <Link
              to="/profile"
              className="flex items-center justify-center px-6 py-3 bg-white/10 hover:bg-white/15 border border-white/10 text-white rounded-xl text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
            >
              Configure Profile
            </Link>
          </div>
        </div>
      </div>

      {/* 2. STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Profile Completion */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Profile Status</span>
            <span className="p-2 bg-blue-50 dark:bg-blue-950/20 rounded-xl text-blue-500"><Compass className="h-5 w-5" /></span>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold text-slate-800 dark:text-white">{data.profile_completion}%</h3>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
              <div className="bg-blue-500 h-2 rounded-full transition-all duration-500" style={{ width: `${data.profile_completion}%` }}></div>
            </div>
            <span className="text-[10px] text-slate-400 mt-2 block">Configure all fields to optimize recommendation matchings.</span>
          </div>
        </div>

        {/* Highest Career Match */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Career Alignment</span>
            <span className="p-2 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl text-emerald-500"><Award className="h-5 w-5" /></span>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold text-slate-800 dark:text-white">
              {data.highest_career_match ? `${data.highest_career_match}%` : 'N/A'}
            </h3>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
              <div className="bg-emerald-500 h-2 rounded-full transition-all duration-500" style={{ width: `${data.highest_career_match || 0}%` }}></div>
            </div>
            <span className="text-[10px] text-slate-400 mt-2 block">Max match percentage with recommended career targets.</span>
          </div>
        </div>

        {/* Latest Assessment Score */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Assessment Marks</span>
            <span className="p-2 bg-purple-50 dark:bg-purple-950/20 rounded-xl text-purple-500"><GraduationCap className="h-5 w-5" /></span>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold text-slate-800 dark:text-white">
              {data.latest_assessment_score ? `${data.latest_assessment_score}/50` : 'N/A'}
            </h3>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
              <div className="bg-purple-500 h-2 rounded-full transition-all duration-500" style={{ width: `${data.latest_assessment_percentage || 0}%` }}></div>
            </div>
            <span className="text-[10px] text-slate-400 mt-2 block">Correct responses ratio in core exam.</span>
          </div>
        </div>

        {/* Resume Score */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Resume Rating</span>
            <span className="p-2 bg-rose-50 dark:bg-rose-950/20 rounded-xl text-rose-500"><FileText className="h-5 w-5" /></span>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold text-slate-800 dark:text-white">
              {data.resume_score ? `${data.resume_score}/100` : 'N/A'}
            </h3>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
              <div className="bg-rose-500 h-2 rounded-full transition-all duration-500" style={{ width: `${data.resume_score || 0}%` }}></div>
            </div>
            <span className="text-[10px] text-slate-400 mt-2 block">CV parsing score based on structure scans.</span>
          </div>
        </div>
      </div>

      {/* 3. CHARTS & RECENT ACTIVITIES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* Assessment Breakdown Chart */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 lg:col-span-2">
          <h2 className="text-lg font-bold text-slate-850 dark:text-white mb-6">Assessment Score Breakdown</h2>
          
          {radarData.length > 0 ? (
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" radius="75%" data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 5]} />
                  <Radar name="Scored" dataKey="score" stroke="#0e87e3" fill="#0e87e3" fillOpacity={0.4} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[320px] flex items-center justify-center text-sm text-slate-400">
              Complete the assessment exam to populate this score radar mapping.
            </div>
          )}
        </div>

        {/* Timeline / Activities */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-850 dark:text-white mb-6">Recent Activity Log</h2>
          
          <div className="flow-root">
            <ul className="-mb-8">
              {data.activities.map((activity, activityIdx) => (
                <li key={activityIdx}>
                  <div className="relative pb-8">
                    {activityIdx !== data.activities.length - 1 ? (
                      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200 dark:bg-slate-800" aria-hidden="true"></span>
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-brand-500 font-bold text-xs ring-8 ring-white dark:ring-slate-900">
                          {data.activities.length - activityIdx}
                        </span>
                      </div>
                      <div className="flex-grow pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm font-bold text-slate-850 dark:text-white">{activity.title}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{activity.description}</p>
                        </div>
                        <div className="text-right text-xs whitespace-nowrap text-slate-400">
                          <time>{activity.time}</time>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 4. CAREER RECOMMENDATIONS GRID */}
      {hasRecommendations && (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Top Career Matches</h2>
            <Link to="/recommendations" className="text-xs font-semibold text-brand-600 hover:text-brand-500 dark:text-brand-400 flex items-center space-x-1">
              <span>View Detailed Reports</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.recommended_careers.map((career) => (
              <div key={career.career_name} className="p-6 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold px-2.5 py-1 bg-brand-100 text-brand-700 dark:bg-brand-950/30 dark:text-brand-300 rounded-full">
                      {career.match_percentage}% Match
                    </span>
                    <span className="text-xs text-slate-400">{career.difficulty} Index</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{career.career_name}</h3>
                  <p className="text-xs text-slate-500 mt-2">Est. Market Salary: <span className="font-semibold text-slate-700 dark:text-slate-350">{career.salary_range}</span></p>
                </div>
                <div className="mt-6 flex space-x-2">
                  <Link
                    to={`/recommendations?tab=${career.career_name}`}
                    className="flex-grow text-center py-2 bg-white dark:bg-slate-900 hover:bg-slate-100 border border-slate-200 dark:border-slate-800 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    Roadmap
                  </Link>
                  <Link
                    to={`/jobs?career=${career.career_name}`}
                    className="flex-grow text-center py-2 bg-brand-500 hover:bg-brand-600 text-xs font-semibold rounded-xl text-white transition-colors"
                  >
                    Matched Jobs
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
