import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Route guards
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Public pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

// Protected pages
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Assessment from './pages/Assessment';
import Recommendations from './pages/Recommendations';
import SkillGap from './pages/SkillGap';
import Roadmap from './pages/Roadmap';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import Courses from './pages/Courses';
import Jobs from './pages/Jobs';
import InterviewPrep from './pages/InterviewPrep';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import AdminDashboard from './pages/AdminDashboard';

const App = () => {
  const token = localStorage.getItem('token');

  return (
    <ThemeProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          {/* Header */}
          <Navbar />
          
          {/* Main Context */}
          <main className="flex-grow flex flex-col">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={!token ? <Login /> : <Navigate to="/dashboard" />} />
              <Route path="/register" element={!token ? <Register /> : <Navigate to="/dashboard" />} />
              
              {/* Protected candidate pathways */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/assessment" element={<Assessment />} />
                <Route path="/recommendations" element={<Recommendations />} />
                <Route path="/gap" element={<SkillGap />} />
                <Route path="/roadmap" element={<Roadmap />} />
                <Route path="/resume" element={<ResumeAnalyzer />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/interview" element={<InterviewPrep />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<Settings />} />
              </Route>

              {/* Protected administrative operations */}
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminDashboard />} />
              </Route>

              {/* fallback 404 page */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
