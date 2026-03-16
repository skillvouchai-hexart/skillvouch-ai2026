import React, { useState } from 'react';
import { 
  FileText, 
  Video, 
  Search, 
  Lightbulb, 
  Trophy, 
  BookOpen, 
  BarChart, 
  Compass, 
  ArrowRight, 
  ShieldCheck,
  TrendingUp,
  Target
} from 'lucide-react';
import { User } from '../types';
import { apiService } from '../services/apiService';
import { Logo, SkillVouchBrand, VConnectULogo } from './Logo';

interface CareerServicesProps {
  user: User;
  onNavigate: (view: string) => void;
}

export const CareerServices: React.FC<CareerServicesProps> = ({ user, onNavigate }) => {
  const tools = [
    {
      id: 'RESUME_ANALYZER',
      title: 'AI Resume Analyzer',
      description: 'ATS optimization and scoring powered by VConnectU intelligence.',
      icon: FileText,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      border: 'hover:border-emerald-500/30'
    },
    {
      id: 'MOCK_INTERVIEW',
      title: 'Mock Interview',
      description: 'Real-time AI behavioral coaching with VConnectU feedback nodes.',
      icon: Video,
      color: 'text-indigo-500',
      bg: 'bg-indigo-500/10',
      border: 'hover:border-indigo-500/30'
    },
    {
      id: 'JOB_BOARD',
      title: 'Global Job Board',
      description: 'Curated opportunities across tech and non-tech sectors.',
      icon: Search,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      border: 'hover:border-blue-500/30'
    },
    {
      id: 'IDEA_FEED',
      title: 'Project Sandbox',
      description: 'Collaborate on innovative ideas and valid research topics.',
      icon: Lightbulb,
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10',
      border: 'hover:border-yellow-500/30'
    },
    {
      id: 'COMPETITIONS',
      title: 'Success Hub',
      description: 'Latest hackathons, challenges, and global competitions.',
      icon: Trophy,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
      border: 'hover:border-purple-500/30'
    },
    {
      id: 'RESEARCH_PAPERS',
      title: 'Insight Repository',
      description: 'Access to top-tier research papers and journals.',
      icon: BookOpen,
      color: 'text-pink-500',
      bg: 'bg-pink-500/10',
      border: 'hover:border-pink-500/30'
    }
  ];


  return (
    <div className="max-w-7xl mx-auto space-y-16 animate-fade-in pb-20">
      {/* Hero Section */}
      <div className="relative rounded-[3rem] overflow-hidden bg-slate-900 p-12 lg:p-20 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <div className="flex flex-wrap items-center gap-8 mb-4">
              <div className="flex items-center gap-4 px-6 py-2 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors group">
                <SkillVouchBrand className="h-10" />
                <div className="h-6 w-px bg-white/10"></div>
                <VConnectULogo className="h-10" />
              </div>
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-emerald-500/10 rounded-full border border-emerald-500/20 backdrop-blur-md">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-100">Official Joint Suite</span>
              </div>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black tracking-tight leading-tight">
              Elevate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">Career Lifecycle</span>
            </h1>
            <p className="text-indigo-100/70 text-xl font-medium max-w-2xl mx-auto lg:mx-0">
              Access premium tools and analytics designed by VConnectU to help you navigate, optimize, and excel in your professional journey.
            </p>
          </div>
          <div className="hidden lg:block w-[400px]">
            <div className="grid grid-cols-2 gap-4">
              {[FileText, Video, Search, Trophy].map((Icon, idx) => (
                <div key={idx} className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl flex items-center justify-center transition-transform hover:scale-105">
                  <Icon className="w-12 h-12 text-indigo-400 opacity-60" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-1">
            <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Professional Toolkit</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium">End-to-end solutions for every career milestone.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => onNavigate(tool.id)}
              className={`group relative bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 transition-all duration-500 text-left hover:shadow-2xl ${tool.border} hover:-translate-y-2`}
            >
              <div className={`w-16 h-16 rounded-3xl ${tool.bg} ${tool.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-lg shadow-current/10`}>
                <tool.icon className="w-8 h-8" />
              </div>
              <div className="space-y-3">
                <h4 className="text-xl font-black text-slate-900 dark:text-white tracking-tight group-hover:text-indigo-500 transition-colors">
                  {tool.title}
                </h4>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">
                  {tool.description}
                </p>
              </div>
              <div className="mt-8 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-indigo-500 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all">
                Launch Tool <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Unified Progress Section */}
      <div className="relative rounded-[3rem] bg-indigo-900 p-12 lg:p-20 text-center text-white overflow-hidden shadow-2xl">
         <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
         <div className="relative z-10 space-y-6">
            <h3 className="text-3xl font-black mb-4 flex items-center justify-center gap-3">
               <Target className="w-10 h-10 text-emerald-400" />
               Unified Career Profile
            </h3>
            <p className="text-lg opacity-80 max-w-2xl mx-auto font-medium">
               Your SkillVouch badges, peer ratings, and verified skills are automatically synced with VConnectU analytics to provide better job matching and interview preparation.
            </p>
            <div className="flex flex-wrap justify-center gap-12 pt-10">
               <div className="flex flex-col items-center">
                  <span className="text-4xl font-black text-emerald-400">100%</span>
                  <span className="text-xs font-bold uppercase tracking-widest opacity-60">Data Sync</span>
               </div>
               <div className="w-px h-16 bg-white/10 hidden sm:block" />
               <div className="flex flex-col items-center">
                  <span className="text-4xl font-black text-blue-400">Mistral</span>
                  <span className="text-xs font-bold uppercase tracking-widest opacity-60">AI Core</span>
               </div>
               <div className="w-px h-16 bg-white/10 hidden sm:block" />
               <div className="flex flex-col items-center">
                  <span className="text-4xl font-black text-purple-400">ATS+</span>
                  <span className="text-xs font-bold uppercase tracking-widest opacity-60">Ready</span>
               </div>
            </div>
         </div>
      </div>


      <div className="flex flex-col items-center justify-center space-y-6 pt-10 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-12">
             <div className="group cursor-pointer">
               <SkillVouchBrand className="h-12 scale-110" />
             </div>
             <div className="h-12 w-px bg-slate-200 dark:bg-slate-700"></div>
             <div className="group cursor-pointer">
               <VConnectULogo className="h-12 scale-110" />
             </div>
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 text-center max-w-lg">
            This module is a collaborative integration between SkillVouch and VConnectU. <br />
            All rights reserved © 2026.
          </p>
      </div>
    </div>
  );
};

export default CareerServices;
