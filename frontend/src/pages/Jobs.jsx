import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Briefcase, MapPin, DollarSign, ArrowUpRight, Compass } from 'lucide-react';
import api from '../utils/api';

const Jobs = () => {
  const [searchParams] = useSearchParams();
  const careerParam = searchParams.get('career');

  const [jobs, setJobs] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCareerName, setActiveCareerName] = useState(careerParam || '');

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await api.get('/api/recommendations');
        setRecommendations(response.data);
        if (response.data.length > 0 && !activeCareerName) {
          setActiveCareerName(response.data[0].career_name);
        }
      } catch (err) {
        // Recommendations missing is fine
      }
    };
    fetchRecommendations();
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError('');
      try {
        const url = activeCareerName ? `/api/jobs?career_name=${activeCareerName}` : '/api/jobs';
        const response = await api.get(url);
        setJobs(response.data);
      } catch (err) {
        setError('Failed to load jobs database.');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [activeCareerName]);

  return (
    <div className="flex-grow max-w-6xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8 dark:bg-slate-950 transition-colors duration-300">
      
      {/* Title */}
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Matched Job Opportunities</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Open roles at top hiring companies matching your primary career recommendations.
          </p>
        </div>

        {/* Career Selector */}
        {recommendations.length > 0 && (
          <select
            value={activeCareerName}
            onChange={(e) => setActiveCareerName(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2 text-sm focus:outline-none dark:text-white"
          >
            <option value="">All Career Tracks</option>
            {recommendations.map(r => (
              <option key={r.career_name} value={r.career_name}>{r.career_name}</option>
            ))}
          </select>
        )}
      </div>

      {loading ? (
        <div className="flex-grow flex items-center justify-center dark:bg-slate-950">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
        </div>
      ) : error ? (
        <div className="p-8 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-3xl text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400 font-semibold">{error}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-850 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-md transition-shadow duration-200">
              
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-brand-50 dark:bg-brand-950/30 rounded-2xl text-brand-600 flex-shrink-0">
                  <Briefcase className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-850 dark:text-white">{job.role}</h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">{job.company}</p>
                  
                  <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
                    <span className="flex items-center">
                      <MapPin className="h-3.5 w-3.5 mr-1 text-slate-400" />
                      {job.location}
                    </span>
                    <span className="flex items-center font-semibold text-slate-700 dark:text-slate-350">
                      <DollarSign className="h-3.5 w-3.5 mr-0.5 text-slate-400" />
                      {job.salary}
                    </span>
                  </div>

                  <div className="mt-3.5 flex flex-wrap gap-1">
                    {job.required_skills.split(',').map(s => (
                      <span key={s} className="px-2 py-0.5 bg-slate-50 dark:bg-slate-950 text-slate-550 dark:text-slate-400 rounded-md text-[9px] border border-slate-100 dark:border-slate-850">
                        {s.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="w-full md:w-auto flex-shrink-0">
                <a
                  href={job.apply_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full md:w-auto inline-flex items-center justify-center space-x-1.5 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-semibold shadow-md shadow-brand-500/10 transition-colors"
                >
                  <span>Apply Now</span>
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          ))}

          {jobs.length === 0 && (
            <div className="p-8 text-center text-sm text-slate-400 border border-dashed rounded-3xl">
              No recommended jobs matching this selected profile target.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Jobs;
