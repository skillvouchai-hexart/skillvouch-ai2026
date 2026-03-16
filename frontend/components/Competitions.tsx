import React, { useState, useEffect } from 'react';
import { Competition } from '../types';
import { apiService } from '../services/apiService';
import { Trophy, ExternalLink, Calendar, Target, Zap, Clock, Search, Filter, Loader2, Sparkles, Medal, Globe, CheckCircle } from 'lucide-react';

interface CompetitionsProps {
  onBack: () => void;
}

export const Competitions: React.FC<CompetitionsProps> = ({ onBack }) => {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'HACKATHON' | 'CODING'>('ALL');

  useEffect(() => {
    fetchCompetitions();
  }, []);

  const fetchCompetitions = async () => {
    setLoading(true);
    try {
      const data = await apiService.getCompetitions();
      setCompetitions(data);
    } catch (err) {
      console.error("Failed to fetch competitions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const data = await apiService.syncCompetitions();
      setCompetitions(data);
    } catch (err) {
      console.error("Sync failed:", err);
    } finally {
      setSyncing(false);
    }
  };

  const filteredCompetitions = competitions.filter(comp => {
    if (activeFilter === 'ALL') return true;
    return comp.type.toUpperCase().includes(activeFilter);
  });

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-12 animate-fade-in text-slate-900 dark:text-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-4">
             <div className="p-4 bg-orange-500/20 rounded-[2rem] text-orange-500 border border-orange-500/20 shadow-2xl shadow-orange-500/10">
                <Trophy className="w-10 h-10" />
             </div>
             <h2 className="text-5xl font-black tracking-tighter">Challenges</h2>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-lg italic">Compete with the best. Win prizes. Level up your profile.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleSync} 
            disabled={syncing}
            className={`p-4 bg-orange-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition flex items-center gap-2 shadow-xl hover:bg-orange-700 disabled:opacity-50`}
          >
            {syncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {syncing ? 'Syncing...' : 'Sync with AI'}
          </button>
          <button onClick={onBack} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-black text-xs uppercase tracking-widest transition hover:scale-105 active:scale-95 shadow-xl">
            Back to Hub
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        {(['ALL', 'HACKATHON', 'CODING'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-8 py-3 rounded-2xl font-bold transition-all border ${
              activeFilter === filter 
              ? 'bg-orange-600 border-orange-600 text-white shadow-xl shadow-orange-600/20' 
              : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {filter.charAt(0) + filter.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 animate-pulse">
           <div className="relative">
              <div className="w-20 h-20 border-4 border-orange-500/10 border-t-orange-500 rounded-full animate-spin"></div>
              <Trophy className="absolute inset-0 m-auto w-8 h-8 text-orange-500 opacity-50" />
           </div>
           <p className="mt-6 text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Scanning Platforms...</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-8">
           {filteredCompetitions.map((comp) => (
              <div key={comp.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 rounded-[3rem] shadow-2xl hover:shadow-orange-500/5 hover:border-orange-500/30 transition-all group relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform" />
                 
                 <div className="flex justify-between items-start mb-8 relative z-10">
                    <div className="space-y-4">
                       <div className="flex items-center gap-2">
                          <span className="px-3 py-1 bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-lg text-[10px] font-black uppercase tracking-widest">{comp.type}</span>
                          <span className="text-slate-200 dark:text-slate-800">|</span>
                          <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                             <Globe className="w-3.5 h-3.5" />
                             {comp.platform}
                          </span>
                       </div>
                       <h3 className="text-3xl font-black leading-tight group-hover:text-orange-500 transition-colors">{comp.title}</h3>
                    </div>
                    {comp.prize && (
                       <div className="flex flex-col items-center p-4 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-2xl border border-emerald-500/20 animate-bounce-subtle">
                          <Medal className="w-6 h-6 mb-1" />
                          <span className="text-sm font-black tracking-tight">{comp.prize}</span>
                       </div>
                    )}
                 </div>

                 <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-10 line-clamp-3 relative z-10">
                    {comp.description || "Join this exciting coding challenge and showcase your talent to top recruiters. Practice, compete, and win spectacular rewards!"}
                 </p>

                 <div className="grid grid-cols-2 gap-6 mb-10 relative z-10">
                    <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-3xl border border-slate-100 dark:border-slate-800">
                       <Calendar className="w-6 h-6 text-orange-500" />
                       <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Deadline</span>
                          <span className="text-sm font-black">{comp.deadline ? new Date(comp.deadline).toLocaleDateString() : 'Active Now'}</span>
                       </div>
                    </div>
                    <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-3xl border border-slate-100 dark:border-slate-800">
                       <Zap className="w-6 h-6 text-indigo-500" />
                       <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Skill Req</span>
                          <span className="text-sm font-black italic">Open Entry</span>
                       </div>
                    </div>
                 </div>

                 <a 
                   href={comp.link}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2rem] font-black shadow-2xl flex items-center justify-center gap-3 transition-all group-hover:bg-orange-600 group-hover:text-white uppercase tracking-widest text-xs"
                 >
                    Register and Compete <ExternalLink className="w-4 h-4 ml-1" />
                 </a>
              </div>
           ))}
        </div>
      )}

      {/* Hero Stats */}
      <div className="grid sm:grid-cols-3 gap-6 pt-12">
         {[
           { label: 'Total Challenges', value: competitions.length.toString(), icon: Target, color: 'text-indigo-500' },
           { label: 'Prizes Claimed', value: '$250k+', icon: Trophy, color: 'text-orange-500' },
           { label: 'Active Coders', value: '1.2k', icon: Sparkles, color: 'text-emerald-500' },
         ].map((stat, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] flex items-center gap-6 shadow-xl">
               <div className={`p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 ${stat.color}`}>
                  <stat.icon className="w-8 h-8" />
               </div>
               <div>
                  <p className="text-4xl font-black">{stat.value}</p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
};

export default Competitions;
