import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Compass, GraduationCap, Star, Clock, Globe, ArrowUpRight } from 'lucide-react';
import api from '../utils/api';

const Courses = () => {
  const [searchParams] = useSearchParams();
  const careerParam = searchParams.get('career');

  const [courses, setCourses] = useState([]);
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
        // Recommendations missing is fine, fallback is triggered in API
      }
    };
    fetchRecommendations();
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError('');
      try {
        const url = activeCareerName ? `/api/courses?career_name=${activeCareerName}` : '/api/courses';
        const response = await api.get(url);
        setCourses(response.data);
      } catch (err) {
        setError('Failed to load courses database.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [activeCareerName]);

  return (
    <div className="flex-grow max-w-6xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8 dark:bg-slate-950 transition-colors duration-300">
      
      {/* Title */}
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Curated Course Recommendations</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Highly-rated training programs from Coursera, Udemy, and freeCodeCamp selected to bridge your skill gaps.
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-850 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow duration-200">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-brand-100 text-brand-700 dark:bg-brand-950/30 dark:text-brand-300 rounded uppercase">
                    {course.provider}
                  </span>
                  <span className="flex items-center text-xs text-amber-500 font-semibold">
                    <Star className="h-3.5 w-3.5 fill-current mr-1" />
                    {course.rating.toFixed(1)}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-850 dark:text-white leading-snug">{course.title}</h3>
                <span className="text-[10px] text-slate-450 mt-1 block">Mapped for: {course.career_name}</span>

                <div className="mt-4 flex items-center space-x-4 text-xs text-slate-550 dark:text-slate-400">
                  <span className="flex items-center">
                    <Clock className="h-3.5 w-3.5 mr-1 text-slate-400" />
                    {course.duration}
                  </span>
                  <span className="flex items-center">
                    <Globe className="h-3.5 w-3.5 mr-1 text-slate-400" />
                    {course.difficulty}
                  </span>
                </div>

                <div className="mt-4 border-t border-slate-100 dark:border-slate-800 pt-3">
                  <h4 className="text-[10px] font-semibold text-slate-450 uppercase">Acquired Skills:</h4>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {course.required_skills.split(',').map(s => (
                      <span key={s} className="px-2 py-0.5 bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 rounded-md text-[9px]">
                        {s.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <a
                  href={course.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center space-x-1 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-semibold shadow-md shadow-brand-500/10 transition-colors"
                >
                  <span>Explore Course</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          ))}
          
          {courses.length === 0 && (
            <div className="col-span-full p-8 text-center text-sm text-slate-400 border border-dashed rounded-3xl">
              No recommended courses found matching this profile target.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Courses;
