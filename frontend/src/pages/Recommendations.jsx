import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Award, Compass, Cpu, Briefcase, DollarSign, Building2, TrendingUp, AlertCircle, CheckCircle, ArrowRight, Milestone } from 'lucide-react';
import api from '../utils/api';

const Recommendations = () => {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab');
  
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCareerName, setActiveCareerName] = useState('');

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await api.get('/api/recommendations');
        setRecommendations(response.data);
        if (response.data.length > 0) {
          // Set default career tab based on query params or fallback to highest match
          const defaultExists = response.data.find(r => r.career_name === defaultTab);
          setActiveCareerName(defaultExists ? defaultExists.career_name : response.data[0].career_name);
        }
      } catch (err) {
        setError('Failed to fetch recommendations. Please take the career assessment exam first.');
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, [defaultTab]);

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  if (error || recommendations.length === 0) {
    return (
      <div className="flex-grow max-w-3xl w-full mx-auto px-4 py-16 text-center dark:bg-slate-950">
        <div className="p-8 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-3xl mb-6">
          <AlertCircle className="h-10 w-10 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recommendations Not Found</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            You must complete the 50-question career assessment to calculate your optimal technology target roles.
          </p>
        </div>
        <Link
          to="/assessment"
          className="inline-flex items-center space-x-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-brand-500/20 transition-all duration-200 hover:-translate-y-0.5"
        >
          <span>Start Assessment Now</span>
          <ArrowRight className="h-4.5 w-4.5" />
        </Link>
      </div>
    );
  }

  const activeRec = recommendations.find(r => r.career_name === activeCareerName) || recommendations[0];
  const requiredSkillsList = JSON.parse(activeRec.required_skills || "[]");
  const missingSkillsList = JSON.parse(activeRec.missing_skills || "[]");
  const matchingSkillsList = requiredSkillsList.filter(s => !missingSkillsList.includes(s));

  return (
    <div className="flex-grow max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8 dark:bg-slate-950 transition-colors duration-300">
      
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">AI Career Fit Recommendations</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          We analyzed your exam performance and profile parameters. Below are your top 5 compatible career directions.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Side: Career Tabs List */}
        <div className="space-y-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2 px-1">Recommendations list</span>
          {recommendations.map((rec) => {
            const isActive = rec.career_name === activeCareerName;
            return (
              <button
                key={rec.career_name}
                onClick={() => setActiveCareerName(rec.career_name)}
                className={`w-full text-left p-4 rounded-2xl border transition-all duration-150 flex items-center justify-between ${
                  isActive
                    ? 'border-brand-500 bg-brand-50/20 shadow-md shadow-brand-500/5 text-slate-900 dark:bg-brand-950/20 dark:text-white'
                    : 'border-slate-100 hover:border-slate-200 dark:border-slate-850 dark:hover:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                }`}
              >
                <div>
                  <h4 className="text-sm font-bold truncate max-w-[160px]">{rec.career_name}</h4>
                  <span className={`text-[10px] font-bold ${isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400'}`}>
                    {rec.match_percentage}% Score Alignment
                  </span>
                </div>
                <Award className={`h-5 w-5 ${isActive ? 'text-brand-500' : 'text-slate-300'}`} />
              </button>
            );
          })}
        </div>

        {/* Right Side: Active Recommendation Info Panels */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Cover detail panel */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-805 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-6 mb-6">
              <div>
                <span className="text-xs font-bold px-2.5 py-1 bg-brand-100 text-brand-700 dark:bg-brand-950/30 dark:text-brand-300 rounded-full">
                  {activeRec.match_percentage}% Compatibility Match
                </span>
                <h2 className="text-2xl font-extrabold text-slate-850 dark:text-white mt-3">{activeRec.career_name}</h2>
              </div>
              
              {/* Actions */}
              <div className="flex gap-2">
                <Link
                  to={`/roadmap?career=${activeRec.career_name}`}
                  className="flex items-center space-x-1.5 px-4.5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-semibold shadow-md shadow-brand-500/10 transition-colors"
                >
                  <Milestone className="h-4 w-4" />
                  <span>Study Roadmap</span>
                </Link>
                <Link
                  to={`/gap?career=${activeRec.career_name}`}
                  className="flex items-center space-x-1.5 px-4.5 py-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-350 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold transition-colors"
                >
                  <span>Skill Gap Check</span>
                </Link>
              </div>
            </div>

            {/* Reason */}
            <div>
              <h3 className="text-sm font-bold text-slate-850 dark:text-white mb-2">Why this career fits:</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-950/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-850">
                {activeRec.reason}
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-850 shadow-sm flex items-start space-x-4">
              <span className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-2xl text-blue-500"><DollarSign className="h-6 w-6" /></span>
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Salary Range</span>
                <span className="text-sm font-extrabold text-slate-850 dark:text-white mt-1 block">{activeRec.salary_range}</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-850 shadow-sm flex items-start space-x-4">
              <span className="p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl text-emerald-500"><TrendingUp className="h-6 w-6" /></span>
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Job Demand</span>
                <span className="text-sm font-extrabold text-slate-850 dark:text-white mt-1 block">{activeRec.job_demand}</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-850 shadow-sm flex items-start space-x-4">
              <span className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-2xl text-purple-500"><Cpu className="h-6 w-6" /></span>
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Difficulty Index</span>
                <span className="text-sm font-extrabold text-slate-850 dark:text-white mt-1 block">{activeRec.difficulty}</span>
              </div>
            </div>
          </div>

          {/* Details & Corporate list grids */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Future Scope */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-850 shadow-sm">
              <h3 className="text-sm font-bold text-slate-850 dark:text-white mb-3">Future Outlook & Scope</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{activeRec.future_scope}</p>
            </div>

            {/* Certifications and Hiring companies */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-850 shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-850 dark:text-white mb-2">Recommended Certifications</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{activeRec.recommended_certifications}</p>
              </div>
              <hr className="border-slate-100 dark:border-slate-800" />
              <div>
                <h3 className="text-sm font-bold text-slate-850 dark:text-white mb-2">Top Hiring Companies</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{activeRec.top_hiring_companies}</p>
              </div>
            </div>
          </div>

          {/* Skills Breakdown */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-850 shadow-sm">
            <h3 className="text-sm font-bold text-slate-850 dark:text-white mb-4">Required Skills Match Matrix</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Matched skills */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1.5">
                  <CheckCircle className="h-4 w-4" />
                  <span>Matching Capabilities ({matchingSkillsList.length})</span>
                </span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {matchingSkillsList.map(skill => (
                    <span key={skill} className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-900/30 text-xs font-medium">
                      {skill}
                    </span>
                  ))}
                  {matchingSkillsList.length === 0 && (
                    <span className="text-xs text-slate-400 italic">No matching skills detected in your profile.</span>
                  )}
                </div>
              </div>

              {/* Missing skills */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center space-x-1.5">
                  <AlertCircle className="h-4 w-4" />
                  <span>Missing Gaps ({missingSkillsList.length})</span>
                </span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {missingSkillsList.map(skill => (
                    <span key={skill} className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 border border-rose-100/50 dark:border-rose-900/30 text-xs font-medium">
                      {skill}
                    </span>
                  ))}
                  {missingSkillsList.length === 0 && (
                    <span className="text-xs text-emerald-500 font-medium italic">All required skills fully mastered!</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
