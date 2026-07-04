import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Compass, Menu, X, Sun, Moon, LogOut, User as UserIcon, LayoutDashboard, FileSpreadsheet, FileSearch, ShieldAlert, Settings } from 'lucide-react';
import { useTheme } from './ThemeProvider';

const Navbar = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    setMobileMenuOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const links = token ? [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Assessment', path: '/assessment', icon: FileSpreadsheet },
    { name: 'Resume Scan', path: '/resume', icon: FileSearch },
    { name: 'Profile', path: '/profile', icon: UserIcon },
    { name: 'Settings', path: '/settings', icon: Settings },
  ] : [];

  if (token && isAdmin) {
    links.push({ name: 'Admin Panel', path: '/admin', icon: ShieldAlert });
  }

  return (
    <nav className="sticky top-0 z-50 glass-panel shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to={token ? "/dashboard" : "/"} className="flex items-center space-x-2 group">
              <div className="p-2 bg-brand-500 rounded-xl text-white group-hover:scale-105 transition-transform duration-200 shadow-md shadow-brand-500/20">
                <Compass className="h-6 w-6" />
              </div>
              <span className="font-sans font-bold text-xl tracking-tight bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent dark:from-brand-400 dark:to-brand-200">
                CareerCompass
              </span>
            </Link>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center space-x-1">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive(link.path)
                      ? 'bg-brand-500 text-white shadow-md shadow-brand-500/10'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Action Group */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Dark Mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-brand-600" />}
            </button>

            {token ? (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-sm font-medium transition-all duration-200 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 dark:text-rose-400"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-sm font-medium dark:text-slate-300 dark:hover:bg-slate-800 transition-colors duration-200"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-sm font-medium shadow-md shadow-brand-500/25 transition-all duration-200 hover:-translate-y-0.5"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              {darkMode ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-t border-slate-100 dark:border-slate-800/80 px-2 pt-2 pb-4 space-y-1 transition-all duration-300">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium ${
                  isActive(link.path)
                    ? 'bg-brand-500 text-white'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{link.name}</span>
              </Link>
            );
          })}
          
          {token ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 text-left rounded-xl text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/20 text-base font-medium transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
          ) : (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col space-y-2 px-4">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 shadow-md shadow-brand-500/20 transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
