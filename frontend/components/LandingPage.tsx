import React from 'react';
import { View } from '../types';
import { Users, Map, CheckCircle2, ArrowRight, Sun, Moon } from 'lucide-react';
import { Logo } from './Logo';
import { useTheme } from '../ThemeContext';

interface LandingPageProps {
  onNavigate: (view: View) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500/30 overflow-x-hidden transition-colors duration-300">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-slate-200/60 dark:border-white/5 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate(View.LANDING)}>
            <Logo className="w-10 h-10 shadow-lg" />
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">SkillVouch AI</span>
          </div>
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200 shadow-sm"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark'
                ? <Sun className="w-5 h-5 text-amber-400" />
                : <Moon className="w-5 h-5 text-indigo-500" />
              }
            </button>
            <button
              onClick={() => onNavigate(View.LOGIN)}
              className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium transition-colors px-4 py-2"
            >
              Login
            </button>
            <button
              onClick={() => onNavigate(View.SIGNUP)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-full font-medium transition-all transform hover:scale-105 shadow-lg shadow-indigo-500/25"
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 md:w-96 md:h-96 bg-purple-500/20 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 md:w-96 md:h-96 bg-indigo-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 rounded-full px-4 py-1.5 mb-8 animate-[fade-in-up_1s_ease-out]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">AI-Powered Skill Verification Live</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-700 to-indigo-500 dark:from-white dark:via-indigo-100 dark:to-indigo-400 pb-2 animate-[fade-in-up_1s_ease-out_0.2s_both]">
            SkillVouch AI
          </h1>

          <p className="text-2xl md:text-3xl font-medium text-indigo-600 dark:text-indigo-400 mb-8 animate-[fade-in-up_1s_ease-out_0.3s_both]">
            Connect • Learn • Grow
          </p>

          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-[fade-in-up_1s_ease-out_0.4s_both]">
            SkillVouch AI connects you with the perfect learning partners.
            Verify your expertise with Gemini, generate custom roadmaps, and trade skills in real-time.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 animate-[fade-in-up_1s_ease-out_0.6s_both]">
            <button
              onClick={() => onNavigate(View.SIGNUP)}
              className="w-full sm:w-auto bg-indigo-600 dark:bg-white text-white dark:text-slate-950 px-8 py-4 rounded-full font-bold text-lg hover:bg-indigo-700 dark:hover:bg-indigo-50 transition-all transform hover:-translate-y-1 flex items-center justify-center shadow-lg shadow-indigo-500/25"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
            <button
              onClick={() => onNavigate(View.LOGIN)}
              className="w-full sm:w-auto bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white px-8 py-4 rounded-full font-bold text-lg transition-all backdrop-blur-sm"
            >
              Existing User?
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/30 border-t border-slate-200 dark:border-white/5 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Why SkillVouch AI?</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">We use advanced AI to ensure you learn faster and connect with the right people.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Users}
              title="Smart Matching"
              desc="Our Gemini-powered algorithm finds peers who have the skills you need and want the skills you offer."
              delay={0}
            />
            <FeatureCard
              icon={Map}
              title="AI Roadmaps"
              desc="Generate personalized learning paths for any skill, complete with resources and time estimates."
              delay={100}
            />
            <FeatureCard
              icon={CheckCircle2}
              title="Skill Verification"
              desc="Prove your expertise with AI-generated quizzes and earn verified badges to stand out."
              delay={200}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 dark:border-white/5 bg-white dark:bg-slate-950 text-center transition-colors duration-300">
        <p className="text-slate-400 dark:text-slate-500 text-sm">© 2024 SkillVouch AI. Powered by Google Gemini.</p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, desc, delay }: any) => (
  <div
    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl hover:border-indigo-400 dark:hover:border-indigo-500/30 transition-all group hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:-translate-y-1 shadow-sm hover:shadow-md"
  >
    <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
      <Icon className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
    </div>
    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{title}</h3>
    <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
  </div>
);