import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Compass, Mail, Lock, ShieldAlert, ArrowRight, Eye, EyeOff } from 'lucide-react';
import api from '../utils/api';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isExpired = searchParams.get('expired') === 'true';
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  // Forgot password simulation
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMsg, setForgotMsg] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/api/auth/login', data);
      const { access_token } = response.data;
      
      // Store token
      localStorage.setItem('token', access_token);
      
      // Extract admin status from token payload
      const payload = JSON.parse(atob(access_token.split('.')[1]));
      localStorage.setItem('isAdmin', payload.is_admin === true ? 'true' : 'false');
      
      // Redirect
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Incorrect email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setForgotMsg('');
    if (!forgotEmail) return;
    setForgotLoading(true);
    try {
      const res = await api.post('/api/auth/forgot-password', { email: forgotEmail });
      setForgotMsg(res.data.message);
    } catch (err) {
      setForgotMsg('An error occurred. Please try again.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center py-16 px-4 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-3xl shadow-xl shadow-slate-100/50 dark:shadow-none">
        
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-4">
            <div className="p-2.5 bg-brand-500 rounded-xl text-white shadow-md shadow-brand-500/20">
              <Compass className="h-6 w-6" />
            </div>
            <span className="font-sans font-bold text-xl dark:text-white">CareerCompass</span>
          </Link>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Sign In to Your Account</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Welcome back! Continue navigating your path.</p>
        </div>

        {/* Expired warning */}
        {isExpired && (
          <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-2xl flex items-start space-x-2.5 text-amber-800 dark:text-amber-300 text-xs">
            <ShieldAlert className="h-4.5 w-4.5 flex-shrink-0" />
            <span>Your session has expired. Please log in again to continue accessing dashboard services.</span>
          </div>
        )}

        {/* API Error alerts */}
        {error && (
          <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 rounded-2xl flex items-start space-x-2.5 text-rose-800 dark:text-rose-400 text-xs">
            <ShieldAlert className="h-4.5 w-4.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        {!forgotOpen ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email Address</label>
              <div className="mt-1 relative">
                <input
                  type="email"
                  {...register('email', { required: 'Email address is required' })}
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 pl-10 pr-4 py-3 text-sm focus:border-brand-500 focus:outline-none dark:text-white"
                  placeholder="name@email.com"
                />
                <Mail className="h-5 w-5 text-slate-400 absolute left-3 top-3.5" />
              </div>
              {errors.email && <span className="text-rose-500 text-xs mt-1 block">{errors.email.message}</span>}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Password</label>
                <button
                  type="button"
                  onClick={() => setForgotOpen(true)}
                  className="text-xs text-brand-600 hover:text-brand-500 dark:text-brand-400"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="mt-1 relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', { required: 'Password is required' })}
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 pl-10 pr-10 py-3 text-sm focus:border-brand-500 focus:outline-none dark:text-white"
                  placeholder="••••••••"
                />
                <Lock className="h-5 w-5 text-slate-400 absolute left-3 top-3.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <span className="text-rose-500 text-xs mt-1 block">{errors.password.message}</span>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 py-3.5 bg-brand-500 hover:bg-brand-600 text-white rounded-2xl text-sm font-medium shadow-md shadow-brand-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
            >
              {loading ? (
                <span>Signing In...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-4.5 w-4.5" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* Forgot Password Dialog */
          <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Reset Password Request</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Enter your registered email address below, and we will dispatch a reset code.
            </p>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email Address</label>
              <div className="mt-1 relative">
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 pl-10 pr-4 py-3 text-sm focus:border-brand-500 focus:outline-none dark:text-white"
                  placeholder="name@email.com"
                />
                <Mail className="h-5 w-5 text-slate-400 absolute left-3 top-3.5" />
              </div>
            </div>

            {forgotMsg && (
              <div className="p-3 bg-brand-50 dark:bg-brand-950/20 border border-brand-200 dark:border-brand-900/30 rounded-xl text-brand-800 dark:text-brand-300 text-xs">
                {forgotMsg}
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => { setForgotOpen(false); setForgotMsg(''); }}
                className="w-1/2 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-850"
              >
                Back to Sign In
              </button>
              <button
                type="submit"
                disabled={forgotLoading}
                className="w-1/2 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-2xl text-sm font-medium disabled:opacity-50"
              >
                {forgotLoading ? 'Sending...' : 'Request Code'}
              </button>
            </div>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-600 hover:text-brand-500 dark:text-brand-400 font-medium">
              Register Free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
