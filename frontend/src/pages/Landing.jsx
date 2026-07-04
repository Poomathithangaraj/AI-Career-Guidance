import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, ShieldCheck, Cpu, Award, Milestone, LineChart, FileText, ArrowRight, Star, HelpCircle, Mail, Phone, MapPin } from 'lucide-react';

const Landing = () => {
  const token = localStorage.getItem('token');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <div className="flex-grow">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-20 pb-28 sm:pt-32 sm:pb-36 bg-gradient-to-b from-brand-50 to-white dark:from-slate-950 dark:to-slate-900 transition-colors duration-300">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/5 dark:bg-brand-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-500/5 dark:bg-teal-500/10 rounded-full blur-3xl pointer-events-none translate-y-1/3 -translate-x-1/4"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold bg-brand-100 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300 mb-6 border border-brand-200/50 dark:border-brand-900/30">
              ⚡ Powered by Advanced Heuristics
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight font-sans text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight"
          >
            Find Your Ideal Tech Path with our{' '}
            <span className="bg-gradient-to-r from-brand-600 to-teal-500 bg-clip-text text-transparent dark:from-brand-400 dark:to-teal-300">
              AI Career Guidance Agent
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed"
          >
            Evaluate your core programming, logic, and management competencies to generate month-by-month learning roadmaps and job matches.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4"
          >
            {token ? (
              <Link
                to="/dashboard"
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white rounded-2xl text-base font-medium shadow-xl shadow-brand-500/20 hover:shadow-brand-600/30 transition-all duration-200 hover:-translate-y-0.5"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white rounded-2xl text-base font-medium shadow-xl shadow-brand-500/20 hover:shadow-brand-600/30 transition-all duration-200 hover:-translate-y-0.5"
                >
                  <span>Start Free Assessment</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto flex items-center justify-center px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-2xl text-base font-medium transition-all duration-200 hover:border-slate-300 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800 dark:hover:bg-slate-800/80"
                >
                  Log In
                </Link>
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* 2. FEATURES SECTION */}
      <section className="py-24 bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
              Complete Career Navigation Suite
            </h2>
            <p className="mt-4 text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              Everything you need to analyze, learn, and apply in one integrated workspace.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {[
              { icon: Compass, title: '50-Q Core Assessment', desc: 'Evaluates 20 distinct technical and business disciplines including programming, cloud, logic, and leadership.', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
              { icon: Cpu, title: 'AI Match Engine', desc: 'Cross-analyzes scores, qualifications, and strengths to find the top 5 compatible technology tracks.', color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400' },
              { icon: LineChart, title: 'Skill Gap Matrix', desc: 'Contrasts your current skill levels with the industry expectations, offering personalized priority cues.', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
              { icon: Milestone, title: 'Structured Roadmaps', desc: 'Provides week-by-week actionable study goals, assignments, and mock interview preparations.', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
              { icon: FileText, title: 'Resume PDF Scan', desc: 'Parses uploaded resume templates to rank formatting structures and identify missing credentials.', color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400' },
              { icon: Award, title: 'Downloadable PDF Report', desc: 'Generates detailed PDF layouts summarizing assessment metrics, study tracks, and gap analyses.', color: 'bg-teal-500/10 text-teal-600 dark:text-teal-400' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="p-8 rounded-3xl border border-slate-100 dark:border-slate-800 dark:bg-slate-950/30 hover:shadow-xl hover:shadow-slate-100 dark:hover:shadow-none hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`p-3 rounded-2xl w-12 h-12 flex items-center justify-center ${feature.color}`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-xl font-bold text-slate-900 dark:text-white">{feature.title}</h3>
                <p className="mt-3 text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950/40 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
              How CareerCompass Works
            </h2>
            <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
              Four simple phases to build and land your dream tech career.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 dark:bg-slate-800 hidden md:block z-0"></div>
            {[
              { step: '01', title: 'Fill User Profile', desc: 'Log in and configure your academic parameters, college focus, and interest tags.' },
              { step: '02', title: 'Take Core Exam', desc: 'Attempt our 50 multiple choice questions spanning technical and logic matrices.' },
              { step: '03', title: 'Review Recommendations', desc: 'Examine compatibility matching indexes, skill gaps, and learning roadmaps.' },
              { step: '04', title: 'Analyze Resume & Apply', desc: 'Upload resumes, review optimization suggestions, check courses, and apply to matched jobs.' },
            ].map((step, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 relative z-10 hover:shadow-lg transition-shadow duration-300">
                <span className="text-4xl font-extrabold text-brand-500/20 dark:text-brand-500/10 block mb-4">{step.step}</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{step.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CAREER CATEGORIES */}
      <section className="py-24 bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
              20 Core Technology Roles
            </h2>
            <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
              We align capabilities across various roles, including:
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
            {[
              'Software Engineer', 'AI Engineer', 'Python Developer', 'DevOps Engineer', 'Data Scientist',
              'Cloud Engineer', 'Cyber Security Analyst', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
              'Java Developer', 'QA Engineer', 'Database Administrator', 'Business Analyst', 'Embedded Engineer',
              'IoT Engineer', 'Electronics Engineer', 'Project Manager', 'Product Manager', 'QA Engineer'
            ].map((role, i) => (
              <div key={i} className="p-4 text-center rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 font-medium text-sm text-slate-700 dark:text-slate-300 hover:border-brand-300 dark:hover:border-brand-800 transition-all duration-200">
                {role}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950/40 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
              Empowering Tech Careers
            </h2>
            <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
              Hear from graduates who secured roles using our platform.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { quote: "The assessment identified programming and IoT as my strengths. Following the 4-month roadmap helped me secure an Embedded firmware job.", author: "Arjun Mehta", role: "Embedded Engineer @ Bosch" },
              { quote: "The resume analysis highlighted that I was missing key cloud networking keywords. I updated my CV and landed interviews the following week.", author: "Sneha Roy", role: "DevOps Engineer @ AWS" },
              { quote: "An excellent suite. The 50-Q core assessment tested my Python and math knowledge thoroughly. Highly recommended for final-year students.", author: "David Vance", role: "AI Engineer @ DeepMind" }
            ].map((t, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-shadow duration-300">
                <div className="flex space-x-1 mb-4 text-amber-400">
                  {[...Array(5)].map((_, idx) => <Star key={idx} className="h-4 w-4 fill-current" />)}
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed italic">"{t.quote}"</p>
                <div className="mt-6 border-t border-slate-100 dark:border-slate-800 pt-4">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">{t.author}</h4>
                  <span className="text-slate-400 text-xs">{t.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FAQ */}
      <section className="py-24 bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            {[
              { q: 'Is the career assessment completely free?', a: 'Yes. Registered users can take the 50-question career assessment and generate matches at no cost.' },
              { q: 'How does the recommendation algorithm calculate matches?', a: 'It utilizes heuristic analysis, evaluating your category-wise scores from the 50-question exam, current skills, college background, and interest vectors.' },
              { q: 'What format do I need to upload my resume in?', a: 'The analyzer is specifically optimized to scan PDF formatted resumes containing text contents.' },
              { q: 'Can I re-take the assessment exam?', a: 'Yes. If you study and gain new skills, you can clear and re-submit your assessment answers to update your recommendations.' }
            ].map((faq, i) => (
              <div key={i} className="p-6 bg-slate-50 dark:bg-slate-950/20 rounded-2xl border border-slate-100 dark:border-slate-800">
                <h4 className="flex items-center space-x-2 font-bold text-slate-900 dark:text-white">
                  <HelpCircle className="h-5 w-5 text-brand-500 flex-shrink-0" />
                  <span>{faq.q}</span>
                </h4>
                <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm pl-7 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CONTACT SECTION */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Get in Touch</h2>
              <p className="mt-4 text-slate-600 dark:text-slate-400 leading-relaxed">
                Have questions about institutional integrations or academic partnership plans? Drop us a message, and our team will get back to you within 24 hours.
              </p>

              <div className="mt-8 space-y-4 text-slate-600 dark:text-slate-300">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-brand-500" />
                  <span>DeepMind Tech Square, Bangalore</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-brand-500" />
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-brand-500" />
                  <span>support@careercompass.ai</span>
                </div>
              </div>
            </div>

            <form className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4 shadow-lg shadow-slate-100/50 dark:shadow-none">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                <input type="text" className="mt-1 block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-slate-900 dark:text-white focus:border-brand-500 focus:outline-none text-sm transition-colors" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                <input type="email" className="mt-1 block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-slate-900 dark:text-white focus:border-brand-500 focus:outline-none text-sm transition-colors" placeholder="johndoe@email.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Your Message</label>
                <textarea rows="4" className="mt-1 block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-slate-900 dark:text-white focus:border-brand-500 focus:outline-none text-sm transition-colors" placeholder="How can we help you?"></textarea>
              </div>
              <button type="button" className="w-full py-3.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-sm font-medium shadow-md shadow-brand-500/25 transition-all duration-200">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
