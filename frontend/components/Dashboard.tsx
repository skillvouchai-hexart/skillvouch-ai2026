import React, { useState, useEffect } from 'react';
import { User, View } from '../types';
import { dbService } from '../services/dbService';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Award, Clock, Users, Activity, Sparkles, ArrowRight, AlertTriangle, CheckCircle, BookOpen, TrendingUp, Target, RefreshCw } from 'lucide-react';
import { suggestSkills } from '../services/mistralService';

interface DashboardProps {
  user: User;
  onNavigateToProfile: (userId: string) => void;
  onNavigate: (view: View) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onNavigateToProfile, onNavigate }) => {
  const [recommendedPeers, setRecommendedPeers] = useState<User[]>([]);
  const [activeConnectionCount, setActiveConnectionCount] = useState(0);
  const [successfulExchangesCount, setSuccessfulExchangesCount] = useState(0);
  const [feedbackStats, setFeedbackStats] = useState<{ avgStars: number; count: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [skillRecommendations, setSkillRecommendations] = useState<{skills: string[], recommendations?: Record<string, string>, categories?: Record<string, string>}>({skills: []});

  const verifiedSkills = user.skillsKnown.filter(s => s.verified).length;

  // Profile Completion Logic
  const missingBio = !user.bio || user.bio.length < 20;
  const missingSkills = user.skillsKnown.length === 0;
  const missingGoals = user.skillsToLearn.length === 0;
  const isProfileIncomplete = missingBio || missingSkills || missingGoals;

  const fetchSkillRecommendations = async () => {
    if (user.skillsKnown.length === 0 && user.skillsToLearn.length === 0) return;
    
    try {
      const known = user.skillsKnown.map(s => s.name);
      const goals = user.skillsToLearn;
      const result = await suggestSkills(known, goals);
      setSkillRecommendations(result);
    } catch (e) {
      console.error('Failed to fetch skill recommendations:', e);
    }
  };

  useEffect(() => {
    const loadDashboardData = async () => {
        setLoading(true);
        // 1. Fetch Conversations Count
        const convs = await dbService.getConversations(user.id);
        setActiveConnectionCount(convs.length);

        // 2. Fetch Exchanges Count
        const requests = await dbService.getRequestsForUser(user.id);
        const completed = requests.filter(r => r.status === 'completed').length;
        setSuccessfulExchangesCount(completed);

        // 2b. Fetch Feedback Stats
        try {
            const stats = await dbService.getFeedbackStats(user.id);
            setFeedbackStats(stats);
        } catch {
            setFeedbackStats(null);
        }

        // 3. Fetch Recommendations
        const allUsers = await dbService.getUsers();
        const potentialPeers = allUsers.filter(u => u.id !== user.id);
        const scores = [];
        
        for (const peer of potentialPeers) {
             let score = 0;
             // Simple local heuristic
             // 1. Skill Match
             const matchingSkills = peer.skillsKnown.filter(s => user.skillsToLearn.some(learnSkill => learnSkill.toLowerCase() === s.name.toLowerCase()));
             if (matchingSkills.length > 0) {
                 score += 20; // Base score for a match
                 const hasVerifiedMatch = matchingSkills.some(s => s.verified);
                 if (hasVerifiedMatch) {
                     score += 20; // Bonus for having a verified skill I want
                 }
             }
             
             // 2. Bio Keyword Match
             const myKeywords = user.bio.toLowerCase().split(/\s+/).filter(w => w.length > 3);
             const peerKeywords = peer.bio.toLowerCase().split(/\s+/);
             const common = myKeywords.filter(k => peerKeywords.includes(k));
             if (common.length > 0) score += 10;
             
             // 3. Rating
             score += peer.rating * 5;

             scores.push({ user: peer, score });
        }
        
        // Sort and take top 2
        scores.sort((a, b) => b.score - a.score);
        setRecommendedPeers(scores.slice(0, 2).map(s => s.user));
        
        // 4. Fetch Skill Recommendations
        await fetchSkillRecommendations();
        
        setLoading(false);
    };
    
    if (user.id !== 'temp') {
        loadDashboardData();
    }
  }, [user]);

  const statCards = [
    { label: 'Verified Skills', value: verifiedSkills, icon: Award, color: 'text-yellow-500 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-400/10' },
    { label: 'Active Connections', value: activeConnectionCount, icon: Users, color: 'text-green-500 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-400/10' },
    { label: 'Successful Exchanges', value: successfulExchangesCount, icon: CheckCircle, color: 'text-emerald-500 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-400/10' },
    { label: 'Profile Rating', value: (feedbackStats?.count ? feedbackStats.avgStars : user.rating).toFixed(1), icon: Activity, color: 'text-purple-500 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-400/10' },
  ];

  const verificationData = [
    { name: 'Verified', value: user.skillsKnown.filter(s => s.verified).length },
    { name: 'Unverified', value: user.skillsKnown.filter(s => !s.verified).length },
  ];

  // Filter out zero values
  const cleanVerificationData = verificationData.filter(d => d.value > 0);
  const COLORS = ['#10b981', '#64748b']; // Emerald for Verified, Slate for Unverified

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-fade-in pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Dashboard
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">
            Welcome back, <span className="text-indigo-500 dark:text-indigo-400 font-bold">{user.name.split(' ')[0]}</span>. Track your progress and findings.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2 bg-white dark:bg-slate-900 px-5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
               <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse ring-4 ring-emerald-500/20"></div>
               <span className="text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">VConnectU Node Active</span>
          </div>
        </div>
      </div>

       {/* Profile Completion Alert */}
       {isProfileIncomplete && (
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-900 dark:from-indigo-900/60 dark:to-slate-900 rounded-[2.5rem] p-10 relative overflow-hidden shadow-2xl shadow-indigo-500/20 group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="flex flex-col lg:flex-row items-center justify-between gap-10 relative z-10">
                <div className="flex-1 text-center lg:text-left space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-indigo-100 text-xs font-black uppercase tracking-[0.2em] backdrop-blur-md">
                        <Sparkles className="w-4 h-4 text-indigo-300" />
                        AI Profile Optimization
                    </div>
                    <h3 className="text-3xl font-black text-white tracking-tight">
                        Unlock Your Full Potential
                    </h3>
                    <p className="text-indigo-100/80 text-lg font-medium max-w-xl">
                        VConnectU's matching engine requires a complete profile for 100% accurate peer matching and career roadmap generation.
                    </p>
                    <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                        {missingBio && (
                             <span className="text-[10px] font-black uppercase tracking-widest bg-white/10 text-white px-3 py-1.5 rounded-full border border-white/20 backdrop-blur-sm">Bio Required</span>
                        )}
                         {missingSkills && (
                             <span className="text-[10px] font-black uppercase tracking-widest bg-white/10 text-white px-3 py-1.5 rounded-full border border-white/20 backdrop-blur-sm">Skills Missing</span>
                        )}
                        {missingGoals && (
                             <span className="text-[10px] font-black uppercase tracking-widest bg-white/10 text-white px-3 py-1.5 rounded-full border border-white/20 backdrop-blur-sm">Goals Needed</span>
                        )}
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                         onClick={() => onNavigate(View.PROFILE)}
                         className="bg-white text-indigo-900 hover:bg-indigo-50 px-8 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all shadow-xl shadow-black/10 active:scale-95 flex items-center justify-center gap-2"
                    >
                        Optimize Profile <ArrowRight className="w-4 h-4" />
                    </button>
                    {(missingSkills || missingGoals) && (
                        <button 
                            onClick={() => onNavigate(View.MY_SKILLS)}
                            className="bg-indigo-500/20 hover:bg-indigo-500/30 text-white px-8 py-4 rounded-2xl text-sm font-black uppercase tracking-widest border border-white/20 backdrop-blur-sm transition-all flex items-center justify-center"
                        >
                            Update Skills
                        </button>
                    )}
                </div>
            </div>
        </div>
      )}

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <div key={idx} className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-[2rem] hover:shadow-2xl hover:border-indigo-500/20 transition-all duration-500 relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-32 h-32 ${stat.bg} opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700`} />
            
            <div className="relative z-10">
              <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} w-fit mb-6 shadow-lg shadow-current/10 group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{stat.value}</span>
                <p className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* VConnectU Analytics Section */}
        <div className="lg:col-span-2 space-y-8">
           {/* Detailed Progress Chart */}
           <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/30 dark:shadow-none space-y-8">
              <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                      <Activity className="w-6 h-6 text-indigo-500" />
                      Learning Velocity
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Analytics provided by VConnectU Core</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                    <TrendingUp className="w-6 h-6 text-emerald-500" />
                  </div>
              </div>

              <div className="h-[300px] w-full">
                {user.skillsKnown.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={user.skillsKnown.slice(0, 6).map(s => ({ name: s.name, score: s.score || (s.verified ? 70 : 30) }))}>
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} />
                            <YAxis hide />
                            <Tooltip 
                              cursor={{fill: 'transparent'}}
                              contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', background: '#1e293b', color: '#fff'}}
                            />
                            <Bar dataKey="score" fill="url(#barGrad)" radius={[10, 10, 0, 0]} />
                            <defs>
                              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#6366f1" />
                                <stop offset="100%" stopColor="#818cf8" />
                              </linearGradient>
                            </defs>
                        </BarChart>
                    </ResponsiveContainer>
                 ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 bg-slate-50/50 dark:bg-slate-800/20 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                        <Activity className="w-12 h-12 mb-4 opacity-10 animate-pulse" />
                        <p className="font-bold uppercase tracking-widest text-xs opacity-40">No behavioral data found</p>
                    </div>
                 )}
              </div>
           </div>

           {/* Skill Recommendations */}
           {skillRecommendations.skills.length > 0 && (
              <div className="bg-gradient-to-br from-indigo-50 to-white dark:from-slate-900 dark:to-slate-800/50 border border-indigo-100 dark:border-slate-800 p-8 rounded-[2.5rem] space-y-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8">
                    <Sparkles className="w-10 h-10 text-indigo-500/10" />
                  </div>
                  
                  <div className="flex justify-between items-center relative z-10">
                       <div className="space-y-1">
                         <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                           <Target className="w-6 h-6 text-indigo-600" />
                           Pathfinder Engine
                         </h3>
                         <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">AI-driven skill gap analysis</p>
                       </div>
                       <button
                           onClick={fetchSkillRecommendations}
                           className="p-4 bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-slate-100 dark:border-slate-700"
                       >
                           <RefreshCw className="w-5 h-5" />
                       </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                      {skillRecommendations.skills.slice(0, 4).map((skill, idx) => (
                          <div 
                            key={idx} 
                            onClick={() => onNavigate(View.MY_SKILLS)}
                            className="bg-white/80 dark:bg-slate-950/40 p-6 rounded-3xl border border-white dark:border-slate-800/50 hover:border-indigo-500/30 transition-all cursor-pointer shadow-sm group backdrop-blur-sm"
                          >
                              <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-4">
                                      <div className="bg-indigo-500/10 p-3 rounded-2xl text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                                          <TrendingUp className="w-6 h-6" />
                                      </div>
                                      <div>
                                          <p className="font-bold text-slate-900 dark:text-white text-lg">{skill}</p>
                                          {skillRecommendations.categories?.[skill] && (
                                              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">
                                                  {skillRecommendations.categories[skill]}
                                              </span>
                                          )}
                                      </div>
                                  </div>
                                  <ArrowRight className="w-5 h-5 text-indigo-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                              </div>
                              {skillRecommendations.recommendations?.[skill] && (
                                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 leading-relaxed font-medium">
                                      {skillRecommendations.recommendations[skill]}
                                  </p>
                              )}
                          </div>
                      ))}
                  </div>
              </div>
           )}
        </div>

        {/* Sidebar Analytics */}
        <div className="space-y-8">
           {/* Verification Distribution */}
           <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/30 dark:shadow-none">
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-8">Asset Breakdown</h3>
              <div className="h-64 relative">
                {user.skillsKnown.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={cleanVerificationData}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={90}
                                paddingAngle={8}
                                dataKey="value"
                                stroke="none"
                            >
                                {cleanVerificationData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip 
                               contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', background: '#1e293b', color: '#fff'}}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                 ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400">
                        <Users className="w-12 h-12 mb-4 opacity-10" />
                        <p className="font-bold uppercase tracking-widest text-[10px] opacity-40 text-center">No assets to visualize</p>
                    </div>
                 )}
                 {user.skillsKnown.length > 0 && (
                   <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-3xl font-black text-slate-900 dark:text-white">{user.skillsKnown.length}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Skills</span>
                   </div>
                 )}
              </div>
              
              <div className="mt-8 space-y-3">
                 {cleanVerificationData.map((d, i) => (
                   <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-3">
                         <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[i % COLORS.length]}} />
                         <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{d.name}</span>
                      </div>
                      <span className="text-sm font-black text-slate-900 dark:text-white">{d.value}</span>
                   </div>
                 ))}
              </div>
           </div>

           {/* Recommended Peers Sidebar */}
           {recommendedPeers.length > 0 && (
              <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white space-y-8 shadow-2xl overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                  
                  <div className="space-y-1 relative z-10">
                    <h3 className="text-xl font-black tracking-tight">Top Connections</h3>
                    <p className="text-indigo-200/60 text-xs font-bold uppercase tracking-widest">Matched by SkillVouch</p>
                  </div>

                  <div className="space-y-4 relative z-10">
                      {recommendedPeers.map(peer => (
                          <div 
                            key={peer.id} 
                            onClick={() => onNavigateToProfile(peer.id)}
                            className="bg-white/5 hover:bg-white/10 p-5 rounded-3xl border border-white/5 transition-all cursor-pointer group"
                          >
                              <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-4">
                                      <div className="relative">
                                        <img src={peer.avatar} className="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-500 group-hover:scale-110 transition-transform" alt={peer.name} />
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full"></div>
                                      </div>
                                      <div>
                                          <p className="font-bold text-white text-base">{peer.name}</p>
                                          <div className="flex items-center gap-1.5 mt-1">
                                              {peer.skillsKnown
                                                  .filter(s => s.verified && user.skillsToLearn.includes(s.name))
                                                  .slice(0, 1)
                                                  .map((skill, idx) => (
                                                      <span key={idx} className="text-[10px] font-black uppercase tracking-widest text-indigo-400">
                                                          Expert: {skill.name}
                                                      </span>
                                                  ))}
                                          </div>
                                      </div>
                                  </div>
                                  <ArrowRight className="w-5 h-5 text-indigo-500 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                              </div>
                          </div>
                      ))}
                  </div>
                  
                  <button 
                    onClick={() => onNavigate(View.FIND_PEERS)}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[1.5rem] text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-900/40 relative z-10"
                  >
                    View All Peers
                  </button>
              </div>
           )}
        </div>
      </div>
    </div>
  );
};
