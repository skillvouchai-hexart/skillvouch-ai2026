import React, { useState, useEffect } from 'react';
import { User, Idea } from '../types';
import { apiService } from '../services/apiService';
import { Lightbulb, Send, MessageCircle, ExternalLink, Search, Plus, X, Loader2, Sparkles, TrendingUp, Users } from 'lucide-react';

interface IdeaFeedProps {
  user: User;
  onBack: () => void;
}

export const IdeaFeed: React.FC<IdeaFeedProps> = ({ user, onBack }) => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSubmit, setShowSubmit] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Submission Form State
  const [title, setTitle] = useState('');
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');
  const [tech, setTech] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    setLoading(true);
    try {
      const data = await apiService.getIdeas();
      setIdeas(data);
    } catch (err) {
      console.error("Failed to fetch ideas:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiService.postIdea({
        title,
        problem,
        solution,
        technologies: tech,
        impact: "Social / Technical", // Default
        contactEmail: user.email,
        contactPhone: "N/A", // Placeholder
        userId: user.id
      });
      setShowSubmit(false);
      resetForm();
      fetchIdeas();
    } catch (err) {
      console.error("Failed to post idea:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setProblem('');
    setSolution('');
    setTech('');
  };

  const filteredIdeas = ideas.filter(idea => 
    idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    idea.technologies.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-10 animate-fade-in text-slate-900 dark:text-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="p-3 bg-yellow-500/20 rounded-2xl text-yellow-500 border border-yellow-500/30">
                <Lightbulb className="w-8 h-8" />
             </div>
             <h2 className="text-4xl font-black tracking-tight">Idea Feed</h2>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Pitch your vision, find collaborators, and build the future.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button 
            onClick={() => setShowSubmit(true)}
            className="flex-1 md:flex-none px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold transition shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" /> Post Idea
          </button>
          <button onClick={onBack} className="flex-1 md:flex-none px-6 py-3 bg-slate-100 dark:bg-slate-800 rounded-2xl font-bold transition hover:bg-slate-200 dark:hover:bg-slate-700">
            Back
          </button>
        </div>
      </div>

      <div className="relative">
         <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
         <input 
            type="text"
            placeholder="Search ideas, technologies, or problems..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-16 pr-8 py-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] text-lg font-medium shadow-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
         />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 animate-pulse">
           <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
           <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Curating Innovation...</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
           {filteredIdeas.map((idea) => (
              <div key={idea.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform" />
                 
                 <div className="flex justify-between items-start mb-6">
                    <div className="space-y-1">
                       <h3 className="text-2xl font-black">{idea.title}</h3>
                       <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                          <Users className="w-3.5 h-3.5" />
                          <span>Posted by {idea.userName || 'Innovator'}</span>
                          <span>•</span>
                          <span>{new Date(idea.createdAt).toLocaleDateString()}</span>
                       </div>
                    </div>
                    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500">
                       <Lightbulb className="w-5 h-5" />
                    </div>
                 </div>

                 <div className="space-y-6 mb-8">
                    <div>
                       <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-2">The Problem</h4>
                       <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed line-clamp-3">{idea.problem}</p>
                    </div>
                    <div>
                       <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-2">The Solution</h4>
                       <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed line-clamp-3">{idea.solution}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                       {idea.technologies.split(',').map((tech, i) => (
                          <span key={i} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-xs font-bold border border-slate-200/50 dark:border-slate-700/50">
                             {tech.trim()}
                          </span>
                       ))}
                    </div>
                 </div>

                 <div className="flex gap-3 mt-auto">
                    <a 
                      href={`mailto:${idea.contactEmail}`}
                      className="flex-1 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-center hover:bg-indigo-500 transition-all flex items-center justify-center gap-2"
                    >
                       <MessageCircle className="w-4 h-4" /> Connect
                    </a>
                    <button className="px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-2xl hover:bg-slate-200 transition-all">
                       <ExternalLink className="w-4 h-4" />
                    </button>
                 </div>
              </div>
           ))}
        </div>
      )}

      {/* Submit Idea Modal */}
      {showSubmit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
           <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl relative">
              <button 
                onClick={() => setShowSubmit(false)}
                className="absolute top-8 right-8 p-2 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <form onSubmit={handleSubmit} className="p-10 space-y-8">
                 <div className="space-y-2">
                    <h3 className="text-3xl font-black flex items-center gap-3">
                       <Sparkles className="w-8 h-8 text-indigo-500" />
                       Pitch Your Idea
                    </h3>
                    <p className="text-slate-500 font-medium">Share your vision with the community.</p>
                 </div>

                 <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Title</label>
                       <input 
                          required
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="e.g. AI-Powered Waste Management"
                          className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                       />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">The Problem</label>
                          <textarea 
                             required
                             value={problem}
                             onChange={(e) => setProblem(e.target.value)}
                             className="w-full h-32 p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">The Solution</label>
                          <textarea 
                             required
                             value={solution}
                             onChange={(e) => setSolution(e.target.value)}
                             className="w-full h-32 p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                          />
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Tech Stack (comma separated)</label>
                       <input 
                          required
                          value={tech}
                          onChange={(e) => setTech(e.target.value)}
                          placeholder="React, Node.js, TensorFlow..."
                          className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                       />
                    </div>
                 </div>

                 <button 
                   disabled={submitting}
                   type="submit"
                   className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
                 >
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    Pitch My Idea
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default IdeaFeed;
