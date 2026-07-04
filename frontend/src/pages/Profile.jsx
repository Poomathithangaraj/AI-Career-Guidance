import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, Phone, Calendar, GraduationCap, School, BookOpen, BarChart3, Tag, Heart, Shield, AlertTriangle, Briefcase, MapPin, CheckCircle, ShieldAlert } from 'lucide-react';
import api from '../utils/api';

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit, reset } = useForm();
  
  const [activeTab, setActiveTab] = useState('personal');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/api/profile');
        reset(response.data);
      } catch (err) {
        setError('Failed to fetch profile details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [reset]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    setSuccess(false);
    setError('');
    
    // Ensure numerical types are cast correctly
    if (data.age) data.age = parseInt(data.age, 10);
    if (data.cgpa) data.cgpa = parseFloat(data.cgpa);

    try {
      await api.put('/api/profile', data);
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update profile parameters.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  const tabClass = (tab) => `pb-4 text-sm font-semibold border-b-2 px-1 transition-all ${
    activeTab === tab 
      ? 'border-brand-500 text-brand-600 dark:text-brand-400' 
      : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-350'
  }`;

  return (
    <div className="flex-grow max-w-5xl w-full mx-auto px-4 py-10 sm:px-6 lg:px-8 dark:bg-slate-950 transition-colors duration-300">
      
      {/* Banner / Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Profile Configuration</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Populate these details carefully. The recommendation engine utilizes these parameters to align career vectors.
        </p>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 rounded-2xl flex items-center space-x-2.5 text-emerald-800 dark:text-emerald-400 text-sm">
          <CheckCircle className="h-5 w-5 flex-shrink-0" />
          <span>Profile configuration saved successfully.</span>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 rounded-2xl flex items-center space-x-2.5 text-rose-800 dark:text-rose-400 text-sm">
          <ShieldAlert className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800/80 space-x-8 mb-8 overflow-x-auto">
        <button onClick={() => setActiveTab('personal')} className={tabClass('personal')}>Personal Details</button>
        <button onClick={() => setActiveTab('academic')} className={tabClass('academic')}>Academic Context</button>
        <button onClick={() => setActiveTab('skills')} className={tabClass('skills')}>Skills & Characteristics</button>
        <button onClick={() => setActiveTab('career')} className={tabClass('career')}>Career Preferences</button>
      </div>

      {/* Form wrapper */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-8 rounded-3xl shadow-xl shadow-slate-100/50 dark:shadow-none">
        
        {/* Tab 1: Personal */}
        {activeTab === 'personal' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Full Name</label>
              <div className="mt-1.5 relative">
                <input type="text" {...register('full_name')} className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 pl-10 pr-4 py-3 text-sm focus:border-brand-500 focus:outline-none dark:text-white" placeholder="John Doe" />
                <User className="h-4.5 w-4.5 text-slate-400 absolute left-3.5 top-4" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Phone Number</label>
              <div className="mt-1.5 relative">
                <input type="tel" {...register('phone')} className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 pl-10 pr-4 py-3 text-sm focus:border-brand-500 focus:outline-none dark:text-white" placeholder="+91 98765 43210" />
                <Phone className="h-4.5 w-4.5 text-slate-400 absolute left-3.5 top-4" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Age</label>
              <div className="mt-1.5 relative">
                <input type="number" {...register('age')} className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 pl-10 pr-4 py-3 text-sm focus:border-brand-500 focus:outline-none dark:text-white" placeholder="21" />
                <Calendar className="h-4.5 w-4.5 text-slate-400 absolute left-3.5 top-4" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Gender</label>
              <div className="mt-1.5">
                <select {...register('gender')} className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none dark:text-white appearance-none">
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Academic */}
        {activeTab === 'academic' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">College / University</label>
              <div className="mt-1.5 relative">
                <input type="text" {...register('college')} className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 pl-10 pr-4 py-3 text-sm focus:border-brand-500 focus:outline-none dark:text-white" placeholder="IIT Bombay, Stanford, etc." />
                <School className="h-4.5 w-4.5 text-slate-400 absolute left-3.5 top-4" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Department / Focus</label>
              <div className="mt-1.5 relative">
                <input type="text" {...register('department')} className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 pl-10 pr-4 py-3 text-sm focus:border-brand-500 focus:outline-none dark:text-white" placeholder="Computer Science, Electrical, etc." />
                <BookOpen className="h-4.5 w-4.5 text-slate-400 absolute left-3.5 top-4" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Qualification</label>
              <div className="mt-1.5 relative">
                <input type="text" {...register('qualification')} className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 pl-10 pr-4 py-3 text-sm focus:border-brand-500 focus:outline-none dark:text-white" placeholder="B.Tech, B.Sc, M.Sc, etc." />
                <GraduationCap className="h-4.5 w-4.5 text-slate-400 absolute left-3.5 top-4" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">CGPA / GPA (Out of 10 or 4)</label>
              <div className="mt-1.5 relative">
                <input type="number" step="0.01" {...register('cgpa')} className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 pl-10 pr-4 py-3 text-sm focus:border-brand-500 focus:outline-none dark:text-white" placeholder="8.50 or 3.70" />
                <BarChart3 className="h-4.5 w-4.5 text-slate-400 absolute left-3.5 top-4" />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Skills & Characteristics */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Current Technical Skills (Comma-separated)</label>
              <div className="mt-1.5 relative">
                <textarea rows="3" {...register('current_skills')} className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 pl-10 pr-4 py-3 text-sm focus:border-brand-500 focus:outline-none dark:text-white" placeholder="Python, React, JavaScript, SQL, AWS, Git" />
                <Tag className="h-4.5 w-4.5 text-slate-400 absolute left-3.5 top-4" />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Separate skills with commas (e.g. Python, SQL). These will be cross-analyzed in resume checks.</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Interests (Comma-separated)</label>
                <div className="mt-1.5 relative">
                  <textarea rows="3" {...register('interests')} className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 pl-10 pr-4 py-3 text-sm focus:border-brand-500 focus:outline-none dark:text-white" placeholder="Machine Learning, ethics hacking, UI/UX" />
                  <Heart className="h-4.5 w-4.5 text-slate-400 absolute left-3.5 top-4" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Your Strengths</label>
                <div className="mt-1.5 relative">
                  <textarea rows="3" {...register('strengths')} className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 pl-10 pr-4 py-3 text-sm focus:border-brand-500 focus:outline-none dark:text-white" placeholder="Problem Solving, Public Speaking, Agile Execution" />
                  <Shield className="h-4.5 w-4.5 text-slate-400 absolute left-3.5 top-4" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Your Weaknesses</label>
                <div className="mt-1.5 relative">
                  <textarea rows="3" {...register('weaknesses')} className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 pl-10 pr-4 py-3 text-sm focus:border-brand-500 focus:outline-none dark:text-white" placeholder="Impatience, Delegation fear, speaking anxiety" />
                  <AlertTriangle className="h-4.5 w-4.5 text-slate-400 absolute left-3.5 top-4" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Preferences */}
        {activeTab === 'career' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Preferred Career Role</label>
              <div className="mt-1.5 relative">
                <select {...register('preferred_career')} className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 pl-10 pr-4 py-3 text-sm focus:border-brand-500 focus:outline-none dark:text-white appearance-none">
                  <option value="">Select Target Career</option>
                  {[
                    'Software Engineer', 'Python Developer', 'Java Developer', 'Frontend Developer',
                    'Backend Developer', 'Full Stack Developer', 'AI Engineer', 'Machine Learning Engineer',
                    'Data Scientist', 'Cloud Engineer', 'DevOps Engineer', 'Cyber Security Analyst',
                    'Business Analyst', 'Database Administrator', 'QA Engineer', 'Embedded Engineer',
                    'IoT Engineer', 'Electronics Engineer', 'Project Manager', 'Product Manager'
                  ].map((role) => <option key={role} value={role}>{role}</option>)}
                </select>
                <Briefcase className="h-4.5 w-4.5 text-slate-400 absolute left-3.5 top-4" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Preferred Job Location</label>
              <div className="mt-1.5 relative">
                <input type="text" {...register('preferred_location')} className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 pl-10 pr-4 py-3 text-sm focus:border-brand-500 focus:outline-none dark:text-white" placeholder="Bangalore, remote, San Francisco" />
                <MapPin className="h-4.5 w-4.5 text-slate-400 absolute left-3.5 top-4" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Profile Photo URL</label>
              <div className="mt-1.5 relative">
                <input type="text" {...register('profile_photo_url')} className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 pl-10 pr-4 py-3 text-sm focus:border-brand-500 focus:outline-none dark:text-white" placeholder="https://example.com/photo.jpg" />
                <User className="h-4.5 w-4.5 text-slate-400 absolute left-3.5 top-4" />
              </div>
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80 flex justify-end space-x-3">
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3.5 bg-brand-500 hover:bg-brand-600 text-white rounded-2xl text-sm font-medium shadow-md shadow-brand-500/20 transition-all duration-200 disabled:opacity-50 hover:-translate-y-0.5"
          >
            {submitting ? 'Saving Configuration...' : 'Save Configuration'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
