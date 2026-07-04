import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, ShieldAlert, Award, ArrowRight, ArrowLeft, CheckSquare } from 'lucide-react';
import api from '../utils/api';

const QUESTIONS_PER_PAGE = 5;

const Assessment = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [answers, setAnswers] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await api.get('/api/assessment/questions');
        setQuestions(response.data);
        
        // Retrieve local draft answers if present
        const savedDraft = localStorage.getItem('assessment_draft');
        if (savedDraft) {
          setAnswers(JSON.parse(savedDraft));
        }
      } catch (err) {
        setError('Failed to fetch assessment questions. Make sure database is seeded.');
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleSelectOption = (questionId, option) => {
    const updated = { ...answers, [questionId]: option };
    setAnswers(updated);
    localStorage.setItem('assessment_draft', JSON.stringify(updated));
  };

  const handleSubmit = async () => {
    // Validate that all 50 questions have been answered
    const unansweredCount = questions.length - Object.keys(answers).length;
    if (unansweredCount > 0) {
      alert(`Please answer all questions before submitting. You have ${unansweredCount} remaining questions.`);
      return;
    }

    setSubmitting(true);
    try {
      const payload = Object.entries(answers).map(([qId, val]) => ({
        question_id: parseInt(qId, 10),
        selected_option: val
      }));
      
      await api.post('/api/assessment/submit', payload);
      
      // Clear drafts
      localStorage.removeItem('assessment_draft');
      navigate('/recommendations');
    } catch (err) {
      alert(err.response?.data?.detail || 'An error occurred during submission. Please try again.');
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

  if (error) {
    return (
      <div className="flex-grow flex items-center justify-center py-16 dark:bg-slate-950 text-rose-500">
        <span>{error}</span>
      </div>
    );
  }

  const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
  const startIndex = (currentPage - 1) * QUESTIONS_PER_PAGE;
  const pageQuestions = questions.slice(startIndex, startIndex + QUESTIONS_PER_PAGE);
  const completionPercentage = Math.round((Object.keys(answers).length / questions.length) * 100);

  return (
    <div className="flex-grow max-w-4xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8 dark:bg-slate-950 transition-colors duration-300">
      
      {/* Header Info */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
            <span>Career Fit Assessment</span>
          </h1>
          <span className="text-sm font-semibold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/30 px-3.5 py-1.5 rounded-full">
            {completionPercentage}% Answered
          </span>
        </div>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          This exam consists of 50 conceptual multiple-choice questions covering engineering coding basics, cloud setups, databases, logical thinking, and teamwork.
        </p>
        
        {/* Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full mt-4 overflow-hidden">
          <div className="bg-brand-500 h-2.5 rounded-full transition-all duration-300" style={{ width: `${completionPercentage}%` }}></div>
        </div>
      </div>

      {/* Questions block */}
      <div className="space-y-6">
        {pageQuestions.map((q, idx) => {
          const absoluteIndex = startIndex + idx + 1;
          const selectedOption = answers[q.id];

          return (
            <div key={q.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-6 rounded-3xl shadow-sm">
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-brand-50 dark:bg-brand-950/30 text-brand-600 dark:text-brand-400 text-xs font-bold flex items-center justify-center">
                  {absoluteIndex}
                </span>
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 mb-2">
                    {q.category}
                  </span>
                  <h3 className="text-base font-semibold text-slate-850 dark:text-white leading-relaxed">
                    {q.question_text}
                  </h3>
                </div>
              </div>

              {/* Options Grid */}
              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3 pl-10">
                {[
                  { key: 'A', text: q.option_a },
                  { key: 'B', text: q.option_b },
                  { key: 'C', text: q.option_c },
                  { key: 'D', text: q.option_d }
                ].map((opt) => {
                  const isSelected = selectedOption === opt.key;
                  return (
                    <button
                      key={opt.key}
                      onClick={() => handleSelectOption(q.id, opt.key)}
                      className={`text-left p-3.5 rounded-2xl border text-sm transition-all duration-150 ${
                        isSelected
                          ? 'border-brand-500 bg-brand-50/30 text-brand-700 font-medium dark:bg-brand-950/20 dark:text-brand-300'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 dark:border-slate-800 dark:hover:border-slate-700 dark:hover:bg-slate-900/50 text-slate-600 dark:text-slate-350'
                      }`}
                    >
                      <span className={`inline-block w-5 h-5 rounded-md text-[11px] font-bold text-center leading-5 mr-3 border ${
                        isSelected 
                          ? 'bg-brand-500 text-white border-brand-500' 
                          : 'bg-white border-slate-300 dark:bg-slate-950 dark:border-slate-700 text-slate-400'
                      }`}>
                        {opt.key}
                      </span>
                      <span>{opt.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination & Submissions */}
      <div className="mt-8 flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-6">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="flex items-center space-x-1 px-4 py-2 border border-slate-200 dark:border-slate-850 text-slate-500 hover:bg-slate-100 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed dark:hover:bg-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Previous</span>
        </button>

        <span className="text-sm font-medium text-slate-400">
          Page {currentPage} of {totalPages}
        </span>

        {currentPage < totalPages ? (
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className="flex items-center space-x-1 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-brand-500/10 transition-colors"
          >
            <span>Next</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center space-x-1 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-emerald-500/10 transition-colors disabled:opacity-50"
          >
            <CheckSquare className="h-4.5 w-4.5" />
            <span>{submitting ? 'Submitting Answers...' : 'Submit Answers'}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Assessment;
