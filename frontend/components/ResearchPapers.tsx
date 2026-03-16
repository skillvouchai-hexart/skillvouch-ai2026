import React, { useState, useEffect } from 'react';
import { ResearchPaper } from '../types';
import { apiService } from '../services/apiService';
import { BookOpen, ExternalLink, Calendar, Search, Filter, Loader2, Sparkles, Building, Globe, Send, Quote } from 'lucide-react';

interface ResearchPapersProps {
  onBack: () => void;
}

export const ResearchPapers: React.FC<ResearchPapersProps> = ({ onBack }) => {
  const [papers, setPapers] = useState<ResearchPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchPapers();
  }, []);

  const fetchPapers = async () => {
    setLoading(true);
    try {
      const data = await apiService.getResearchPapers();
      setPapers(data);
    } catch (err) {
      console.error("Failed to fetch papers:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPapers = papers.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.topic?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-12 animate-fade-in text-slate-900 dark:text-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-4">
             <div className="p-4 bg-pink-500/20 rounded-3xl text-pink-500 border border-pink-500/20">
                <BookOpen className="w-10 h-10" />
             </div>
             <h2 className="text-5xl font-black tracking-tight">Journal Hub</h2>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-lg leading-relaxed max-w-xl">
             Explore academic research, conference publications, and technical whitepapers across the global tech community.
          </p>
        </div>
        <button onClick={onBack} className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest transition hover:scale-105 shadow-2xl">
          Back
        </button>
      </div>

      <div className="relative group">
         <div className="absolute inset-y-0 left-8 flex items-center pointer-events-none">
            <Search className="w-6 h-6 text-slate-400 group-focus-within:text-pink-500 transition-colors" />
         </div>
         <input 
            type="text"
            placeholder="Search by title, topic, or publisher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-20 pr-10 py-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] text-xl font-medium shadow-2xl outline-none focus:ring-4 focus:ring-pink-500/10 transition-all"
         />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32">
           <Loader2 className="w-16 h-16 text-pink-500 animate-spin mb-6" />
           <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-[10px]">Syncing academic records...</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
           {filteredPapers.map((paper) => (
              <div key={paper.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 rounded-[3rem] shadow-2xl hover:shadow-pink-500/5 hover:-translate-y-2 transition-all group flex flex-col">
                 <div className="flex items-center gap-2 mb-6">
                    <span className="px-3 py-1 bg-pink-500/10 text-pink-600 dark:text-pink-400 rounded-lg text-[10px] font-black uppercase tracking-widest">
                       {paper.topic || 'General Tech'}
                    </span>
                    <span className="text-slate-200 dark:text-slate-800">|</span>
                    <div className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       <Building className="w-3.5 h-3.5" />
                       {paper.publisher}
                    </div>
                 </div>

                 <h3 className="text-2xl font-black mb-6 leading-tight group-hover:text-pink-500 transition-colors">
                    "{paper.title}"
                 </h3>

                 <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8 line-clamp-4 italic">
                    {paper.description || "Abstract: This research paper investigates the recent advancements in software engineering and professional development platforms, focusing on AI-driven career path optimization."}
                 </p>

                 <div className="mt-auto space-y-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                       <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Published {paper.deadline ? new Date(paper.deadline).toLocaleDateString() : 'Recent'}
                       </div>
                       <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4" />
                          {paper.conference || 'Open Access'}
                       </div>
                    </div>
                    
                    <div className="flex gap-4">
                       <a 
                         href={paper.link}
                         target="_blank"
                         rel="noopener noreferrer"
                         className="flex-1 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-center shadow-xl hover:bg-pink-600 group-hover:bg-pink-600 group-hover:text-white transition-all uppercase tracking-widest text-[10px] flex items-center justify-center gap-2"
                       >
                          Access Full Paper <ExternalLink className="w-4 h-4" />
                       </a>
                       <button className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl hover:bg-pink-500/20 transition-all text-slate-400 hover:text-pink-500">
                          <Quote className="w-5 h-5" />
                       </button>
                    </div>
                 </div>
              </div>
           ))}
        </div>
      )}

      {/* Hero Tip */}
      <div className="bg-gradient-to-r from-pink-600/10 to-purple-600/10 rounded-[3rem] p-12 border border-pink-500/10 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl" />
         <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
            <div className="p-6 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl">
               <Sparkles className="w-12 h-12 text-pink-500 animate-pulse" />
            </div>
            <div className="space-y-2 flex-1">
               <h3 className="text-2xl font-black">Publish Your Work</h3>
               <p className="text-slate-500 dark:text-slate-400 font-medium">Have a research paper you want to share with the SkillVouch community? Submit your work for peer review and get showcased in our global hub.</p>
            </div>
            <button className="px-10 py-5 bg-pink-600 text-white rounded-3xl font-black shadow-2xl shadow-pink-600/20 hover:scale-105 active:scale-95 transition-all uppercase tracking-widest text-xs">
               Submit Paper
            </button>
         </div>
      </div>
    </div>
  );
};

export default ResearchPapers;
