import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Shield, Users, HelpCircle, GraduationCap, Briefcase, Trash2, PlusCircle, CheckCircle, ShieldAlert } from 'lucide-react';
import api from '../utils/api';

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [users, setUsers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [activeSubTab, setActiveSubTab] = useState('users');
  const [successMsg, setSuccessMsg] = useState('');
  const { register: regQ, handleSubmit: handleQSubmit, reset: resetQForm } = useForm();
  const { register: regC, handleSubmit: handleCSubmit, reset: resetCForm } = useForm();
  const { register: regJ, handleSubmit: handleJSubmit, reset: resetJForm } = useForm();

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [mRes, uRes, qRes] = await Promise.all([
        api.get('/api/admin/metrics'),
        api.get('/api/admin/users'),
        api.get('/api/admin/questions')
      ]);
      setMetrics(mRes.data);
      setUsers(uRes.data);
      setQuestions(qRes.data);
    } catch (err) {
      setError('Failed to fetch administrative metrics. Check user privileges status.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this candidate account?')) return;
    try {
      await api.delete(`/api/admin/users/${id}`);
      setSuccessMsg('Candidate deleted successfully.');
      fetchAdminData();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      alert('Failed to delete user.');
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm('Delete this question permanently?')) return;
    try {
      await api.delete(`/api/admin/questions/${id}`);
      setSuccessMsg('Question deleted successfully.');
      fetchAdminData();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      alert('Failed to delete question.');
    }
  };

  const onQuestionSubmit = async (data) => {
    try {
      await api.post('/api/admin/questions', data);
      setSuccessMsg('Question added successfully.');
      resetQForm();
      fetchAdminData();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      alert('Failed to add question.');
    }
  };

  const onCourseSubmit = async (data) => {
    if (data.rating) data.rating = parseFloat(data.rating);
    try {
      await api.post('/api/admin/courses', data);
      setSuccessMsg('Recommended course listing added.');
      resetCForm();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      alert('Failed to add course.');
    }
  };

  const onJobSubmit = async (data) => {
    try {
      await api.post('/api/admin/jobs', data);
      setSuccessMsg('Matched job listing added.');
      resetJForm();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      alert('Failed to add job.');
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
      <div className="flex-grow flex items-center justify-center py-16 dark:bg-slate-950 text-rose-500 font-semibold">
        <span>{error}</span>
      </div>
    );
  }

  // Formatting chart structures
  const careerChartData = Object.entries(metrics.careers_recommended_count || {}).map(([key, val]) => ({
    name: key,
    Matches: val
  }));

  const subjectChartData = Object.entries(metrics.assessment_averages || {}).map(([key, val]) => ({
    subject: key,
    Average: val
  }));

  const subTabClass = (tab) => `pb-3 text-xs font-bold border-b-2 px-1 transition-all ${
    activeSubTab === tab 
      ? 'border-brand-500 text-brand-600 dark:text-brand-400' 
      : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
  }`;

  return (
    <div className="flex-grow max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8 dark:bg-slate-950 transition-colors duration-300">
      
      {/* Title */}
      <div className="mb-8 flex items-center space-x-3">
        <span className="p-2.5 bg-rose-50 dark:bg-rose-950/20 text-rose-600 rounded-2xl"><Shield className="h-6 w-6" /></span>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Admin Management Portal</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Configure global mock parameters and inspect application activities metrics.</p>
        </div>
      </div>

      {successMsg && (
        <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 rounded-2xl flex items-center space-x-2 text-emerald-800 dark:text-emerald-400 text-xs">
          <CheckCircle className="h-4.5 w-4.5" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-850 flex items-center space-x-4">
          <span className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-2xl text-blue-500"><Users className="h-6 w-6" /></span>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Users</span>
            <span className="text-2xl font-extrabold text-slate-850 dark:text-white mt-1 block">{metrics.total_users}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-850 flex items-center space-x-4">
          <span className="p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl text-emerald-500"><HelpCircle className="h-6 w-6" /></span>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Assessments Done</span>
            <span className="text-2xl font-extrabold text-slate-850 dark:text-white mt-1 block">{metrics.total_assessments}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-850 flex items-center space-x-4">
          <span className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-2xl text-purple-500"><GraduationCap className="h-6 w-6" /></span>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">CVs Analyzed</span>
            <span className="text-2xl font-extrabold text-slate-850 dark:text-white mt-1 block">{metrics.total_resume_uploads}</span>
          </div>
        </div>
      </div>

      {/* Recharts Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        {/* Careers Distribution */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-850 shadow-sm">
          <h3 className="text-sm font-bold text-slate-850 dark:text-white mb-4">Recommended Career Distributions</h3>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={careerChartData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={9} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={9} tickLine={false} />
                <Tooltip />
                <Bar dataKey="Matches" fill="#0e87e3" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Assessment subject Averages */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-850 shadow-sm">
          <h3 className="text-sm font-bold text-slate-850 dark:text-white mb-4">Average Question Scores per Category (Max: 5)</h3>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectChartData}>
                <XAxis dataKey="subject" stroke="#64748b" fontSize={8} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={9} tickLine={false} />
                <Tooltip />
                <Bar dataKey="Average" fill="#319795" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tab controls */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-6 mb-6">
        <button onClick={() => setActiveSubTab('users')} className={subTabClass('users')}>Manage Candidates</button>
        <button onClick={() => setActiveSubTab('questions')} className={subTabClass('questions')}>Exam Questions</button>
        <button onClick={() => setActiveSubTab('courses')} className={subTabClass('courses')}>Course Recommendations</button>
        <button onClick={() => setActiveSubTab('jobs')} className={subTabClass('jobs')}>Job Match Listings</button>
      </div>

      {/* Tab 1: Users */}
      {activeSubTab === 'users' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-850 overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <th className="p-4">Email Address</th>
                <th className="p-4">Full Name</th>
                <th className="p-4">Academic college</th>
                <th className="p-4">Registration Date</th>
                <th className="p-4 text-right">Control</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b border-slate-100 dark:border-slate-800/80 hover:bg-slate-50/20 dark:hover:bg-slate-950/20 text-slate-700 dark:text-slate-300">
                  <td className="p-4 font-semibold">{u.email}</td>
                  <td className="p-4">{u.profile?.full_name || 'N/A'}</td>
                  <td className="p-4">{u.profile?.college || 'N/A'}</td>
                  <td className="p-4">{u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      disabled={u.is_admin}
                      className="p-1.5 hover:bg-rose-50 rounded-lg text-rose-500 disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Questions */}
      {activeSubTab === 'questions' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Question listings */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-bold text-slate-850 dark:text-white mb-2">Total Seeded Questions: {questions.length}</h3>
            <div className="max-h-[500px] overflow-y-auto space-y-3 pr-2">
              {questions.map((q) => (
                <div key={q.id} className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-bold px-2 py-0.5 bg-slate-100 text-slate-550 dark:bg-slate-800 rounded uppercase">{q.category}</span>
                    <h4 className="text-xs font-semibold text-slate-850 dark:text-white mt-2 leading-relaxed">{q.question_text}</h4>
                    <span className="text-[10px] font-bold text-emerald-500 mt-2 block">Correct: {q.correct_option}</span>
                  </div>
                  <button onClick={() => handleDeleteQuestion(q.id)} className="p-1.5 hover:bg-rose-50 text-rose-500 rounded-lg">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Add Question form */}
          <div>
            <form onSubmit={handleQSubmit(onQuestionSubmit)} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-850 space-y-4">
              <h3 className="text-sm font-bold text-slate-850 dark:text-white flex items-center space-x-1.5">
                <PlusCircle className="h-4.5 w-4.5 text-brand-500" />
                <span>Add Question Prompt</span>
              </h3>
              
              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Category</label>
                <input type="text" required {...regQ('category')} className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2 text-xs focus:outline-none dark:text-white" placeholder="Python, Web Development..." />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Question Text</label>
                <textarea rows="3" required {...regQ('question_text')} className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2 text-xs focus:outline-none dark:text-white" placeholder="What is..." />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] font-semibold text-slate-400 uppercase">Option A</label>
                  <input type="text" required {...regQ('option_a')} className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2 text-xs focus:outline-none dark:text-white" />
                </div>
                <div>
                  <label className="text-[9px] font-semibold text-slate-400 uppercase">Option B</label>
                  <input type="text" required {...regQ('option_b')} className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2 text-xs focus:outline-none dark:text-white" />
                </div>
                <div>
                  <label className="text-[9px] font-semibold text-slate-400 uppercase">Option C</label>
                  <input type="text" required {...regQ('option_c')} className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2 text-xs focus:outline-none dark:text-white" />
                </div>
                <div>
                  <label className="text-[9px] font-semibold text-slate-400 uppercase">Option D</label>
                  <input type="text" required {...regQ('option_d')} className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2 text-xs focus:outline-none dark:text-white" />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Correct Option (A, B, C, or D)</label>
                <select required {...regQ('correct_option')} className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2 text-xs focus:outline-none dark:text-white">
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
              </div>

              <button type="submit" className="w-full py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-semibold shadow-md">
                Save Question
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tab 3: Courses */}
      {activeSubTab === 'courses' && (
        <form onSubmit={handleCSubmit(onCourseSubmit)} className="max-w-2xl bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-850 space-y-4">
          <h3 className="text-base font-bold text-slate-850 dark:text-white">Create Course Recommendation Listing</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase">Title</label>
              <input type="text" required {...regC('title')} className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 text-xs focus:outline-none dark:text-white" placeholder="Python Crash Course" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase">Provider</label>
              <input type="text" required {...regC('provider')} className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 text-xs focus:outline-none dark:text-white" placeholder="Coursera, Udemy" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase">Link URL</label>
              <input type="url" required {...regC('url')} className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 text-xs focus:outline-none dark:text-white" placeholder="https://..." />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase">Duration</label>
              <input type="text" required {...regC('duration')} className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 text-xs focus:outline-none dark:text-white" placeholder="8 weeks, 12 hours" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase">Rating (Max: 5)</label>
              <input type="number" step="0.1" required {...regC('rating')} className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 text-xs focus:outline-none dark:text-white" placeholder="4.8" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase">Difficulty</label>
              <input type="text" required {...regC('difficulty')} className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 text-xs focus:outline-none dark:text-white" placeholder="Easy, Medium, Hard" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase">Career mapping Target</label>
              <select required {...regC('career_name')} className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 text-xs focus:outline-none dark:text-white">
                {[
                  'Software Engineer', 'Python Developer', 'Java Developer', 'Frontend Developer',
                  'Backend Developer', 'Full Stack Developer', 'AI Engineer', 'Machine Learning Engineer',
                  'Data Scientist', 'Cloud Engineer', 'DevOps Engineer', 'Cyber Security Analyst',
                  'Business Analyst', 'Database Administrator', 'QA Engineer', 'Embedded Engineer',
                  'IoT Engineer', 'Electronics Engineer', 'Project Manager', 'Product Manager'
                ].map(role => <option key={role} value={role}>{role}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase">Skills Acquired (Comma-separated)</label>
            <input type="text" required {...regC('required_skills')} className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 text-xs focus:outline-none dark:text-white" placeholder="Python, SQL, database tuning" />
          </div>

          <button type="submit" className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-semibold shadow-md">
            Save Course
          </button>
        </form>
      )}

      {/* Tab 4: Jobs */}
      {activeSubTab === 'jobs' && (
        <form onSubmit={handleJSubmit(onJobSubmit)} className="max-w-2xl bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-850 space-y-4">
          <h3 className="text-base font-bold text-slate-850 dark:text-white">Create Job Listing</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase">Company Name</label>
              <input type="text" required {...regJ('company')} className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 text-xs focus:outline-none dark:text-white" placeholder="Google, Vercel" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase">Role Name</label>
              <input type="text" required {...regJ('role')} className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 text-xs focus:outline-none dark:text-white" placeholder="Backend Engineer" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase">Location</label>
              <input type="text" required {...regJ('location')} className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 text-xs focus:outline-none dark:text-white" placeholder="Bangalore, India" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase">Salary Range</label>
              <input type="text" required {...regJ('salary')} className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 text-xs focus:outline-none dark:text-white" placeholder="$90,000 - $130,000" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase">Apply Link URL</label>
              <input type="url" required {...regJ('apply_link')} className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 text-xs focus:outline-none dark:text-white" placeholder="https://..." />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase">Target Career Mapping</label>
              <select required {...regJ('career_name')} className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 text-xs focus:outline-none dark:text-white">
                {[
                  'Software Engineer', 'Python Developer', 'Java Developer', 'Frontend Developer',
                  'Backend Developer', 'Full Stack Developer', 'AI Engineer', 'Machine Learning Engineer',
                  'Data Scientist', 'Cloud Engineer', 'DevOps Engineer', 'Cyber Security Analyst',
                  'Business Analyst', 'Database Administrator', 'QA Engineer', 'Embedded Engineer',
                  'IoT Engineer', 'Electronics Engineer', 'Project Manager', 'Product Manager'
                ].map(role => <option key={role} value={role}>{role}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase">Skills Required (Comma-separated)</label>
            <input type="text" required {...regJ('required_skills')} className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 text-xs focus:outline-none dark:text-white" placeholder="Python, FastAPI, SQL" />
          </div>

          <button type="submit" className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-semibold shadow-md">
            Save Job
          </button>
        </form>
      )}
    </div>
  );
};

export default AdminDashboard;
