import React, { useState } from 'react';
import { User, InterviewData } from '../types';
import { apiService } from '../services/apiService';
import { Mic, Video, Send, Loader2, Sparkles, CheckCircle, MessageSquare, AlertCircle } from 'lucide-react';

interface MockInterviewProps {
  user: User;
  onBack: () => void;
}

export const MockInterview: React.FC<MockInterviewProps> = ({ user, onBack }) => {
  const [state, setState] = useState<'SETUP' | 'INTERVIEWING' | 'SUMMARY'>('SETUP');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [interviewData, setInterviewData] = useState<InterviewData | null>(null);
  const [currentQuestions, setCurrentQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');

  const handleStart = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLoading(true);
      setError(null);
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("resume", file);

      try {
        const data = await apiService.setupInterview(formData);
        setInterviewData(data);
        const allQuestions = [...data.techQuestions, ...data.hrQuestions];
        setCurrentQuestions(allQuestions);
        setState('INTERVIEWING');
      } catch (err: any) {
        setError(err.message || "Failed to start interview");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleNext = () => {
    setAnswers([...answers, currentAnswer]);
    setCurrentAnswer('');
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setState('SUMMARY');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">AI Mock Interview</h2>
          <p className="text-slate-500 dark:text-slate-400">Real-time simulation powered by Mistral AI</p>
        </div>
        <button onClick={onBack} className="text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">
          Back to Dashboard
        </button>
      </div>

      {state === 'SETUP' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center shadow-xl">
          <div className="w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-purple-500 border border-purple-500/20">
            <Mic className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Prepare for Success</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
            Upload your resume to generate a tailored interview simulation with technical and behavioral questions.
          </p>
          
          <div className="relative inline-block">
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={handleStart}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={loading}
            />
            <button className={`px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-bold transition-all shadow-xl shadow-purple-600/20 flex items-center gap-3 ${loading ? 'opacity-50' : ''}`}>
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              Start AI Mock Interview
            </button>
          </div>
          
          {error && (
            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-500 flex items-center justify-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}
        </div>
      )}

      {state === 'INTERVIEWING' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                Question {currentQuestionIndex + 1} of {currentQuestions.length}
              </span>
              <div className="flex gap-2">
                <Video className="w-5 h-5 text-slate-400" />
                <Mic className="w-5 h-5 text-purple-500 animate-pulse" />
              </div>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white leading-relaxed mb-8">
              "{currentQuestions[currentQuestionIndex]}"
            </h3>
            
            <textarea
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Your answer here..."
              className="w-full h-40 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 transition-all font-medium"
            />
            
            <div className="flex justify-end mt-6">
              <button 
                onClick={handleNext}
                disabled={!currentAnswer.trim()}
                className="px-8 py-3 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-slate-100 disabled:opacity-30 transition-all flex items-center gap-2"
              >
                {currentQuestionIndex === currentQuestions.length - 1 ? 'Finish Interview' : 'Next Question'}
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {state === 'SUMMARY' && (
        <div className="space-y-8 animate-slide-up">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl p-10 text-white text-center shadow-2xl">
            <CheckCircle className="w-16 h-16 mx-auto mb-6 opacity-80" />
            <h3 className="text-3xl font-black mb-2">Interview Completed!</h3>
            <p className="font-medium opacity-90">Great job practicing. Consistency is the key to mastering your career path.</p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl">
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Review Your Session</h4>
            <div className="space-y-6">
              {currentQuestions.map((q, i) => (
                <div key={i} className="border-b border-slate-100 dark:border-slate-800 pb-6 last:border-0">
                  <p className="text-sm font-bold text-purple-500 mb-2">Q: {q}</p>
                  <p className="text-slate-600 dark:text-slate-300 italic">" {answers[i] || "N/A"} "</p>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={() => setState('SETUP')}
            className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            Start Another Practice Session
          </button>
        </div>
      )}
    </div>
  );
};
export default MockInterview;
