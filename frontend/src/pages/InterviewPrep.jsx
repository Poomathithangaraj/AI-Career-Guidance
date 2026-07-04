import React, { useState } from 'react';
import { Compass, HelpCircle, AlertCircle, Sparkles, BookOpen, Send, Award } from 'lucide-react';

const QUESTIONS_DB = {
  technical: [
    { id: 1, q: "What is the difference between a process and a thread in operating systems?", keyPoints: "Processes get independent memory space; threads share resources of parent process. Thread context switching is faster." },
    { id: 2, q: "Explain how a hash map resolves collisons internally.", keyPoints: "Using chaining (linked list / balanced trees at slots) or open addressing (linear probing, quadratic probing, double hashing)." }
  ],
  hr: [
    { id: 1, q: "Why do you want to join our organization specifically?", keyPoints: "Connect target company products or work cultures to your own career objectives. Detail a recent project they completed." },
    { id: 2, q: "What are your salary expectations for this role?", keyPoints: "Cite standard market ranges for similar experience. Emphasize flexibility and focus on overall development packages." }
  ],
  behavioral: [
    { id: 1, q: "Describe a situation where you had a conflict with a team member and how you resolved it.", keyPoints: "Use the STAR method: Situation, Task, Action, Result. Emphasize active listening, neutral communication, and consensus." },
    { id: 2, q: "Tell me about a time you made a major mistake and how you fixed it.", keyPoints: "Describe ownership, immediate reporting/mitigation steps, analysis of the root cause, and systemic checks added to prevent repeat." }
  ],
  coding: [
    { id: 1, q: "Write a function to check if a given string is a palindrome, ignoring non-alphanumeric characters.", keyPoints: "Use two-pointers (left and right), skipping non-alphanumeric indices, comparing letters lowercased." },
    { id: 2, q: "Write a function to find the maximum subarray sum (Kadane's Algorithm).", keyPoints: "Iterate array tracking current_sum (max of current index or sum+current index) and global_max. Linear O(n) runtime complexity." }
  ]
};

const InterviewPrep = () => {
  const [activeCategory, setActiveCategory] = useState('technical');
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  const [loading, setLoading] = useState(false);

  const handleTextChange = (qId, value) => {
    setAnswers({ ...answers, [qId]: value });
  };

  const handleGenerateFeedback = (qId, questionText, keyPoints) => {
    const userAnswer = answers[qId] || '';
    if (!userAnswer.trim()) {
      alert('Please type in your answer response first before submitting.');
      return;
    }

    setLoading(true);
    // Simulate parsing and scoring
    setTimeout(() => {
      const wordsCount = userAnswer.split(/\s+/).length;
      let score = 5;
      let review = "";
      
      if (wordsCount < 10) {
        score = 4;
        review = "Your response is extremely brief. Try detailing the technical steps and providing contextual examples.";
      } else if (wordsCount > 40) {
        score = 9;
        review = "Excellent detail! You structured the explanation cleanly and covered the vital points.";
      } else {
        score = 7;
        review = "Good core details. You can improve by explaining quantitative outcomes and linking steps clearly.";
      }

      setFeedback({
        ...feedback,
        [qId]: {
          score,
          review,
          keyPoints
        }
      });
      setLoading(false);
    }, 800);
  };

  const catClass = (cat) => `w-full text-left px-4 py-3 rounded-2xl border text-sm font-semibold transition-all ${
    activeCategory === cat
      ? 'border-brand-500 bg-brand-50/10 text-brand-600 dark:bg-brand-950/20 dark:text-brand-400'
      : 'border-slate-100 hover:border-slate-200 dark:border-slate-850 dark:hover:border-slate-800 text-slate-500 dark:text-slate-450'
  }`;

  const currentQuestions = QUESTIONS_DB[activeCategory];

  return (
    <div className="flex-grow max-w-6xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8 dark:bg-slate-950 transition-colors duration-300">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Mock Interview Preparation</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Formulate your answers for core technical, behavioral, and coding prompts, and trigger AI feedback.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Categories selector */}
        <div className="space-y-2.5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1 px-1">Interview categories</span>
          <button onClick={() => { setActiveCategory('technical'); setFeedback({}); }} className={catClass('technical')}>Technical Questions</button>
          <button onClick={() => { setActiveCategory('hr'); setFeedback({}); }} className={catClass('hr')}>HR Questions</button>
          <button onClick={() => { setActiveCategory('behavioral'); setFeedback({}); }} className={catClass('behavioral')}>Behavioral (STAR Method)</button>
          <button onClick={() => { setActiveCategory('coding'); setFeedback({}); }} className={catClass('coding')}>Coding Prompts</button>
        </div>

        {/* Action Panel */}
        <div className="lg:col-span-3 space-y-6">
          
          {currentQuestions.map((q) => {
            const hasFeedback = !!feedback[q.id];
            const feedbackDetail = feedback[q.id];
            
            return (
              <div key={q.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-850 shadow-sm">
                
                {/* Question */}
                <div className="flex items-start space-x-3 mb-4">
                  <span className="p-1.5 bg-brand-50 dark:bg-brand-950/30 rounded-lg text-brand-500"><HelpCircle className="h-4.5 w-4.5" /></span>
                  <h3 className="text-sm font-bold text-slate-850 dark:text-white leading-relaxed">{q.q}</h3>
                </div>

                {/* Answer Area */}
                <textarea
                  rows="4"
                  value={answers[q.id] || ''}
                  onChange={(e) => handleTextChange(q.id, e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 px-4 py-3 text-xs focus:border-brand-500 focus:outline-none dark:text-white leading-relaxed"
                  placeholder="Type in your mock answer response here..."
                />

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => handleGenerateFeedback(q.id, q.q, q.keyPoints)}
                    className="flex items-center space-x-1 px-4.5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-semibold transition-colors"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Get Evaluated</span>
                  </button>
                </div>

                {/* Feedback Dialog */}
                {hasFeedback && (
                  <div className="mt-6 p-5 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-850 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-brand-600 dark:text-brand-400 flex items-center space-x-1.5">
                        <Award className="h-4 w-4" />
                        <span>AI Response Review</span>
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 bg-brand-100 text-brand-800 dark:bg-brand-950/30 dark:text-brand-300 rounded">
                        Score: {feedbackDetail.score}/10
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic">
                      "{feedbackDetail.review}"
                    </p>

                    <div className="border-t border-slate-200/50 dark:border-slate-800 pt-3">
                      <h4 className="text-xs font-bold text-slate-700 dark:text-slate-350">Key Points to Cover:</h4>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{feedbackDetail.keyPoints}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default InterviewPrep;
