import React from 'react';
import { Compass, Mail, Phone, MapPin, Github, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 dark:bg-slate-950 border-t border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Bio */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-brand-500 rounded-xl text-white">
                <Compass className="h-5 w-5" />
              </div>
              <span className="font-sans font-bold text-lg text-white">CareerCompass</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Empowering students and professionals to navigate their career trajectory using data-driven, state-of-the-art AI analysis.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-brand-400 transition-colors duration-150"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="hover:text-brand-400 transition-colors duration-150"><Linkedin className="h-5 w-5" /></a>
              <a href="#" className="hover:text-brand-400 transition-colors duration-150"><Github className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Core Modules */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">Features</h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors duration-150">Career Assessments</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-150">AI Career Matching</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-150">Resume Scoring Scanner</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-150">Personal Roadmaps</a></li>
            </ul>
          </div>

          {/* Platforms */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">Recommendations</h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors duration-150">Curated Courses</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-150">Job Postings Match</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-150">Interview Prep Q&A</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-150">PDF Analytics Reports</a></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">Contact Info</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center space-x-2.5">
                <MapPin className="h-4 w-4 text-brand-500 flex-shrink-0" />
                <span>DeepMind Tech Square, Bangalore</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="h-4 w-4 text-brand-500 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className="h-4 w-4 text-brand-500 flex-shrink-0" />
                <span>support@careercompass.ai</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} CareerCompass. All rights reserved. Professional AI Career Advisor.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
