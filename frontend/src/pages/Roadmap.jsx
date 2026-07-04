import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Compass, ChevronLeft, Calendar, HelpCircle, CheckSquare, Target, Code, ClipboardList, BookOpen } from 'lucide-react';
import api from '../utils/api';

const Roadmap = () => {
  const [searchParams] = useSearchParams();
  const selectedCareer = searchParams.get('career');

  const [roadmap, setRoadmap] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCareerName, setActiveCareerName] = useState(selectedCareer || '');
  
  const [checkedItems, setCheckedItems] = useState({});

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await api.get('/api/recommendations');
        setRecommendations(response.data);
        if (response.data.length > 0 && !activeCareerName) {
          setActiveCareerName(response.data[0].career_name);
        }
      } catch (err) {
        setError('Failed to fetch recommendation coordinates.');
      }
    };
    fetchRecommendations();
  }, [activeCareerName]);

  useEffect(() => {
    const fetchRoadmap = async () => {
      if (!activeCareerName) return;
      setLoading(true);
      setError('');
      try {
        const response = await api.get(`/api/recommendations/roadmap/${activeCareerName}`);
        setRoadmap(response.data);
        
        // Retrieve local checklist values
        const savedChecklist = localStorage.getItem(`checklist_${activeCareerName}`);
        if (savedChecklist) {
          setCheckedItems(JSON.parse(savedChecklist));
        } else {
          setCheckedItems({});
        }
      } catch (err) {
        setError('No roadmap found for the selected career track. Complete your assessment first.');
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmap();
  }, [activeCareerName]);

  const toggleCheck = (id) => {
    const updated = { ...checkedItems, [id]: !checkedItems[id] };
    setCheckedItems(updated);
    localStorage.setItem(`checklist_${activeCareerName}`, JSON.stringify(updated));
  };

  if (loading && !roadmap) {
    return (
      <div className="flex-grow flex items-center justify-center dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  const handleCareerChange = (e) => {
    setActiveCareerName(e.target.value);
  };

  // Safe parsing lists from JSON strings in database
  const parseList = (str) => {
    try {
      return JSON.parse(str || "[]");
    } catch (e) {
      return [];
    }
  };

  const months = parseList(roadmap?.month_wise_plan);
  const weeks = parseList(roadmap?.week_wise_plan);
  const projects = parseList(roadmap?.projects);
  const assignments = parseList(roadmap?.assignments);
  const practiceProblems = parseList(roadmap?.practice_problems);
  const interviewPrep = parseList(roadmap?.interview_prep);

  return (
    <div className="flex-grow max-w-6xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8 dark:bg-slate-950 transition-colors duration-300">
      
      {/* Title */}
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <Link to="/recommendations" className="text-xs font-semibold text-slate-400 hover:text-slate-600 flex items-center space-x-1 mb-2">
            <ChevronLeft className="h-4 w-4" />
            <span>Back to Recommendations</span>
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Actionable Learning Roadmap</h1>
        </div>

        {/* Career Selector */}
        <select
          value={activeCareerName}
          onChange={handleCareerChange}
          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2 text-sm focus:outline-none dark:text-white"
        >
          {recommendations.map(r => (
            <option key={r.career_name} value={r.career_name}>{r.career_name}</option>
          ))}
        </select>
      </div>

      {error ? (
        <div className="p-8 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-3xl text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400 font-semibold">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Month-wise & Week-wise Study Plan */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Month-wise block */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-850 shadow-sm">
              <h2 className="text-lg font-bold text-slate-850 dark:text-white mb-6 flex items-center space-x-2">
                <Target className="h-5 w-5 text-brand-500" />
                <span>Month-Wise Progression Target</span>
              </h2>

              <div className="space-y-6 relative border-l border-slate-100 dark:border-slate-800 pl-6 ml-4">
                {months.map((m) => {
                  const checkId = `month_${m.month}`;
                  const isChecked = !!checkedItems[checkId];
                  return (
                    <div key={m.month} className="relative">
                      {/* Timeline dot */}
                      <span onClick={() => toggleCheck(checkId)} className={`absolute -left-10 top-0.5 h-7 w-7 rounded-full border-2 flex items-center justify-center cursor-pointer transition-colors ${
                        isChecked 
                          ? 'bg-brand-500 border-brand-500 text-white' 
                          : 'bg-white border-slate-300 dark:bg-slate-950 dark:border-slate-800 text-slate-300'
                      }`}>
                        {isChecked ? '✓' : m.month}
                      </span>
                      
                      <div className="pl-2">
                        <h4 className={`text-base font-bold transition-all ${isChecked ? 'line-through text-slate-400' : 'text-slate-850 dark:text-white'}`}>
                          {m.topic}
                        </h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{m.details}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Week-wise checklist */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-850 shadow-sm">
              <h2 className="text-lg font-bold text-slate-850 dark:text-white mb-6 flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-brand-500" />
                <span>Week-Wise Practice Details</span>
              </h2>

              <div className="space-y-4">
                {weeks.map((w) => {
                  const checkId = `week_${w.week}`;
                  const isChecked = !!checkedItems[checkId];
                  return (
                    <div
                      key={w.week}
                      onClick={() => toggleCheck(checkId)}
                      className={`flex items-start space-x-3.5 p-4 rounded-2xl border cursor-pointer transition-all duration-150 ${
                        isChecked
                          ? 'border-brand-300 bg-brand-50/10 dark:border-brand-900/20'
                          : 'border-slate-100 dark:border-slate-850 hover:border-slate-200'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="mt-1 h-4.5 w-4.5 rounded text-brand-600 border-slate-350 focus:ring-brand-500 cursor-pointer pointer-events-none"
                      />
                      <div>
                        <h4 className={`text-sm font-bold transition-all ${isChecked ? 'line-through text-slate-400' : 'text-slate-850 dark:text-white'}`}>
                          Week {w.week}: {w.topic}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">{w.practice}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Projects, Assignments, Preparation */}
          <div className="space-y-6">
            
            {/* Capstone Projects */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-850 shadow-sm">
              <h2 className="text-base font-bold text-slate-850 dark:text-white mb-4 flex items-center space-x-2">
                <Code className="h-4.5 w-4.5 text-brand-500" />
                <span>Recommended Projects</span>
              </h2>
              <div className="space-y-4">
                {projects.map((p, i) => (
                  <div key={i} className="p-4 bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl border border-slate-100 dark:border-slate-850">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-xs font-bold text-slate-850 dark:text-white">{p.title}</h4>
                      <span className="text-[9px] font-bold px-2 py-0.5 bg-brand-100 text-brand-700 dark:bg-brand-950/30 dark:text-brand-300 rounded-md">
                        {p.difficulty}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{p.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Assignments & Practice Problems */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-850 shadow-sm space-y-4">
              
              <div>
                <h2 className="text-base font-bold text-slate-850 dark:text-white mb-3 flex items-center space-x-2">
                  <ClipboardList className="h-4.5 w-4.5 text-brand-500" />
                  <span>Assignments Tasks</span>
                </h2>
                <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
                  {assignments.map((a, i) => (
                    <div key={i} className="flex items-start space-x-2 py-1">
                      <span className="text-brand-500 font-bold">•</span>
                      <div>
                        <span className="font-semibold text-slate-700 dark:text-slate-350">{a.title}</span>: {a.task}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <hr className="border-slate-100 dark:border-slate-800" />

              <div>
                <h2 className="text-base font-bold text-slate-850 dark:text-white mb-3 flex items-center space-x-2">
                  <BookOpen className="h-4.5 w-4.5 text-brand-500" />
                  <span>Algorithmic Problems</span>
                </h2>
                <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
                  {practiceProblems.map((p, i) => (
                    <div key={i} className="flex justify-between py-1 bg-slate-50/50 dark:bg-slate-950/20 px-3 rounded-lg">
                      <span className="font-medium text-slate-700 dark:text-slate-300">{p.problem}</span>
                      <span className="text-[9px] text-slate-400 font-semibold">{p.platform}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Interview Prep tips */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-850 shadow-sm">
              <h2 className="text-base font-bold text-slate-850 dark:text-white mb-4 flex items-center space-x-2">
                <HelpCircle className="h-4.5 w-4.5 text-brand-500" />
                <span>Interview Preparation</span>
              </h2>
              <div className="space-y-3">
                {interviewPrep.map((item, i) => (
                  <div key={i} className="p-3 bg-brand-50/10 dark:bg-brand-950/10 border border-brand-100/30 dark:border-brand-900/10 rounded-2xl">
                    <h4 className="text-xs font-bold text-slate-850 dark:text-white">{item.topic}</h4>
                    <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{item.tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Roadmap;
