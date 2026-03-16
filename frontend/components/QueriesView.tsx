import React, { useState } from 'react';
import { Mail, Send, CheckCircle, Loader2 } from 'lucide-react';
import { User } from '../types';
import { apiService } from '../services/apiService';

interface QueriesViewProps {
  user: User;
}

export const QueriesView: React.FC<QueriesViewProps> = ({ user }) => {
  const [query, setQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleQuerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSubmitting(true);
    try {
      await apiService.submitQuery({
        userId: user.id as string,
        email: user.email,
        userName: user.name,
        query: query
      });
      setSubmitted(true);
      setQuery('');
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Failed to submit query:', error);
      alert('Failed to submit query. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-12 animate-fade-in">
      <div className="relative rounded-[3rem] bg-indigo-600 p-8 lg:p-16 overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent)]"></div>
        
        <div className="relative z-10 flex flex-col gap-12">
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/20 rounded-full border border-white/20 backdrop-blur-md">
              <Mail className="w-5 h-5 text-indigo-200" />
              <span className="text-xs font-black uppercase tracking-[0.2em] text-white">Direct Advisory Channel</span>
            </div>
            <h3 className="text-3xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Got Specific Questions? <br />
              <span className="opacity-60">We've Got Answers.</span>
            </h3>
            <p className="text-indigo-100/80 text-lg font-medium max-w-2xl">
              If our AI tools don't cover your specific need, reach out directly. Your query will be sent to <span className="text-white font-bold underline decoration-indigo-300">skillvouchai@gmail.com</span> and addressed by our expert board.
            </p>
          </div>

          <div className="w-full">
            <div className="bg-white rounded-[2.5rem] p-8 lg:p-10 shadow-2xl relative">
              {submitted ? (
                <div className="py-12 text-center space-y-6 animate-scale-in">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-2xl font-black text-slate-900">Query Sent!</h4>
                    <p className="text-slate-500 font-medium">Our team at skillvouchai@gmail.com will get back to you shortly.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleQuerySubmit} className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 block px-2">How can we help today?</label>
                    <textarea
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="e.g. Can I get a personalized feedback on my recent mock interview #1024?"
                      className="w-full h-40 bg-slate-50 border-2 border-slate-100 rounded-3xl p-6 text-slate-900 font-medium placeholder:text-slate-400 focus:border-indigo-500 focus:ring-0 transition-all outline-none resize-none"
                      required
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-3xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-200 active:scale-[0.98]"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <>
                        Send Inquiry <Send className="w-5 h-5" />
                      </>
                    )}
                  </button>
                  <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Managed by SkillVouch + VConnectU Collaboration
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueriesView;
