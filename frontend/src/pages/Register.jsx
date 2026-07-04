import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Compass, Mail, Lock, ShieldAlert, CheckCircle, ArrowRight } from 'lucide-react';
import api from '../utils/api';

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);
    try {
      await api.post('/api/auth/register', {
        email: data.email,
        password: data.password
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Email might already be taken.');
    } finally {
      setLoading(false);
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
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Create Your Account</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Join free today and build your tech career blueprint.</p>
        </div>

        {/* Success Alert */}
        {success && (
          <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 rounded-2xl flex items-start space-x-2.5 text-emerald-800 dark:text-emerald-400 text-xs">
            <CheckCircle className="h-4.5 w-4.5 flex-shrink-0" />
            <span>Registration successful! Redirecting you to the login screen...</span>
          </div>
        )}

        {/* API Error alerts */}
        {error && (
          <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 rounded-2xl flex items-start space-x-2.5 text-rose-800 dark:text-rose-400 text-xs">
            <ShieldAlert className="h-4.5 w-4.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Register Form */}
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
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Password</label>
            <div className="mt-1 relative">
              <input
                type="password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters long' }
                })}
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 pl-10 pr-4 py-3 text-sm focus:border-brand-500 focus:outline-none dark:text-white"
                placeholder="Min. 6 characters"
              />
              <Lock className="h-5 w-5 text-slate-400 absolute left-3 top-3.5" />
            </div>
            {errors.password && <span className="text-rose-500 text-xs mt-1 block">{errors.password.message}</span>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Confirm Password</label>
            <div className="mt-1 relative">
              <input
                type="password"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (val) => val === watch('password') || 'Passwords do not match'
                })}
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 pl-10 pr-4 py-3 text-sm focus:border-brand-500 focus:outline-none dark:text-white"
                placeholder="Repeat password"
              />
              <Lock className="h-5 w-5 text-slate-400 absolute left-3 top-3.5" />
            </div>
            {errors.confirmPassword && <span className="text-rose-500 text-xs mt-1 block">{errors.confirmPassword.message}</span>}
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full flex items-center justify-center space-x-2 py-3.5 bg-brand-500 hover:bg-brand-600 text-white rounded-2xl text-sm font-medium shadow-md shadow-brand-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
          >
            {loading ? (
              <span>Creating Account...</span>
            ) : (
              <>
                <span>Sign Up</span>
                <ArrowRight className="h-4.5 w-4.5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-600 hover:text-brand-500 dark:text-brand-400 font-medium">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
