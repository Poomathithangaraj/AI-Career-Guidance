import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Compass, AlertTriangle, CheckCircle, ChevronLeft, Calendar, ArrowRight, Gauge } from 'lucide-react';
import api from '../utils/api';

const SkillGap = () => {
  const [searchParams] = useSearchParams();
  const selectedCareer = searchParams.get('career');

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCareerName, setActiveCareerName] = useState(selectedCareer || '');

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await api.get('/api/recommendations');
        setRecommendations(response.data);
        if (response.data.length > 0 && !activeCareerName) {
          setActiveCareerName(response.data[0].career_name);
        }
      } catch (err) {
        setError('Failed to fetch skill gap profiles. Ensure career assessment is completed.');
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, [activeCareerName]);

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
          <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recommendations Not Found</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            You must complete the career assessment to perform a detailed skill gap analysis.
          </p>
        </div>
        <Link to="/assessment" className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-sm font-semibold transition-transform">
          Start Assessment
        </Link>
      </div>
    );
  }

  const activeRec = recommendations.find(r => r.career_name === activeCareerName) || recommendations[0];
  const requiredSkills = JSON.parse(activeRec.required_skills || "[]");
  const missingSkills = JSON.parse(activeRec.missing_skills || "[]");
  const matchingSkills = requiredSkills.filter(s => !missingSkills.includes(s));
  
  const totalSkillsCount = requiredSkills.length;
  const gapCount = missingSkills.length;
  
  const gapPercentage = totalSkillsCount > 0 ? Math.round((gapCount / totalSkillsCount) * 100) : 0;
  const matchPercentage = 100 - gapPercentage;

  // Mocking priority weights and completion times
  const priorities = missingSkills.map((skill, index) => {
    let priority = "High";
    let estWeeks = "2-3 weeks";
    if (index === 0) { priority = "Critical"; estWeeks = "1-2 weeks"; }
    else if (index > 2) { priority = "Medium"; estWeeks = "3-4 weeks"; }
    return { skill, priority, estWeeks };
  });

  return (
    <div className="flex-grow max-w-5xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8 dark:bg-slate-950 transition-colors duration-300">
      
      {/* Title */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link to="/recommendations" className="text-xs font-semibold text-slate-400 hover:text-slate-600 flex items-center space-x-1 mb-2">
            <ChevronLeft className="h-4 w-4" />
            <span>Back to Recommendations</span>
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Skill Gap Analysis</h1>
        </div>

        {/* Career Selector */}
        <select
          value={activeCareerName}
          onChange={(e) => setActiveCareerName(e.target.value)}
          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2 text-sm focus:outline-none dark:text-white"
        >
          {recommendations.map(r => (
            <option key={r.career_name} value={r.career_name}>{r.career_name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Summary Metrics */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-850 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-850 dark:text-white mb-6">Target: {activeRec.career_name}</h2>
            
            {/* Visual Progress Circle */}
            <div className="relative w-40 h-40 mx-auto flex items-center justify-center mb-8">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#f1f5f9" strokeWidth="8" fill="transparent" className="dark:stroke-slate-800" />
                <circle cx="50" cy="50" r="40" stroke="#0e87e3" strokeWidth="8" fill="transparent" strokeDasharray={251.2} strokeDashoffset={251.2 - (251.2 * matchPercentage) / 100} className="transition-all duration-1000" />
              </svg>
              <div className="absolute text-center">
                <span className="text-3xl font-extrabold text-slate-800 dark:text-white">{matchPercentage}%</span>
                <span className="text-[10px] text-slate-400 block uppercase font-bold mt-1">Skill Match</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Total Required Skills:</span>
                <span className="font-semibold text-slate-800 dark:text-white">{totalSkillsCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Skills Acquired:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">{matchingSkills.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Unacquired Gaps:</span>
                <span className="font-semibold text-rose-500">{gapCount}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
            <Link
              to={`/roadmap?career=${activeRec.career_name}`}
              className="w-full inline-flex items-center justify-center space-x-2 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-semibold shadow-md shadow-brand-500/20"
            >
              <span>View Learning Roadmap</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Right: Skills Listing & Priority */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Detailed Gaps & Priority Levels */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-850 shadow-sm">
            <h2 className="text-lg font-bold text-slate-850 dark:text-white mb-6">Skills Priority & Completion Estimate</h2>
            
            {priorities.length > 0 ? (
              <div className="space-y-4">
                {priorities.map((item) => (
                  <div key={item.skill} className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-950/30 rounded-2xl border border-slate-100 dark:border-slate-850">
                    <div>
                      <h4 className="text-sm font-bold text-slate-850 dark:text-white">{item.skill}</h4>
                      <div className="flex items-center space-x-3 mt-1.5 text-xs text-slate-400">
                        <span className="flex items-center space-x-1">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{item.estWeeks} Est.</span>
                        </span>
                      </div>
                    </div>
                    
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                      item.priority === 'Critical'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400'
                        : item.priority === 'High'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-400'
                    }`}>
                      {item.priority}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-sm text-slate-400 bg-emerald-50/20 rounded-2xl border border-dashed border-emerald-200">
                <CheckCircle className="h-8 w-8 text-emerald-500 mx-auto mb-3" />
                <span>Congratulations! Your profile has no skill gaps matching this career target role!</span>
              </div>
            )}
          </div>

          {/* Existing Skills Match */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-850 shadow-sm">
            <h2 className="text-lg font-bold text-slate-850 dark:text-white mb-4">Acquired Skill Matrix</h2>
            <div className="flex flex-wrap gap-2">
              {matchingSkills.map(skill => (
                <span key={skill} className="px-3.5 py-2 rounded-2xl bg-emerald-50/50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 text-xs font-semibold border border-emerald-100 dark:border-emerald-900/30 flex items-center space-x-1.5">
                  <CheckCircle className="h-4 w-4" />
                  <span>{skill}</span>
                </span>
              ))}
              {matchingSkills.length === 0 && (
                <span className="text-xs text-slate-400 italic">No matching skills detected in your profile. Update your profile coordinates.</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillGap;
