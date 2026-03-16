import React, { useState, useEffect } from 'react';
import { View, User } from '../types';
import {
  LayoutDashboard,
  Users,
  Map,
  UserCircle,
  LogOut,
  MessageSquare,
  Sun,
  Moon,
  Briefcase,
  Lightbulb,
  Trophy,
  BookOpen,
  Mic,
  FileText,
  Mail
} from 'lucide-react';
import { Logo, SkillVouchBrand } from './Logo';
import { useTheme } from '../ThemeContext';

interface LayoutProps {
  currentView: View;
  onNavigate: (view: View) => void;
  user: User;
  onLogout: () => void;
  unreadCount: number;
  children: React.ReactNode;
}

export default function Layout({ 
  currentView, 
  onNavigate, 
  user, 
  onLogout, 
  unreadCount,
  children 
}: LayoutProps) {
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on navigation
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [currentView]);

  const NavItem = ({ view, icon: Icon, label }: { view: View, icon: any, label: string }) => {
    const isActive = currentView === view;
    return (
      <button
        onClick={() => onNavigate(view)}
        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
          isActive 
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
        <span className="font-semibold text-sm">{label}</span>
        {view === View.MESSAGES && unreadCount > 0 && (
          <span className="ml-auto bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-72 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 transition-colors duration-300">
        <div className="p-6">
          <div className="flex items-center">
            <SkillVouchBrand className="h-10" />
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto pt-4">
          <div className="mb-2 px-4 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Main Menu</div>
          <NavItem view={View.DASHBOARD} icon={LayoutDashboard} label="Dashboard" />
          <NavItem view={View.MY_SKILLS} icon={BookOpen} label="My Skills" />
          <NavItem view={View.FIND_PEERS} icon={Users} label="Find Peers" />
          <NavItem view={View.ROADMAP} icon={Map} label="Learning Path" />
          <NavItem view={View.MESSAGES} icon={MessageSquare} label="Messages" />
          <NavItem view={View.CAREER_SERVICES} icon={Briefcase} label="Career Services" />
          <NavItem view={View.QUERIES} icon={Mail} label="Queries" />
          <NavItem view={View.PROFILE} icon={UserCircle} label="Profile" />
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
          <div className="mb-2 px-4 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Settings</div>
          
          <button 
            onClick={toggleTheme}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            <span className="font-semibold text-sm">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
          </button>

          <button 
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all duration-200 mt-4 group"
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 z-50">
        <div className="flex items-center">
          <SkillVouchBrand className="h-8" />
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-slate-500 dark:text-slate-400"
        >
          <div className="w-6 h-5 flex flex-col justify-between">
            <span className={`h-0.5 bg-current rounded-full transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`h-0.5 bg-current rounded-full transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`h-0.5 bg-current rounded-full transition-transform duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </div>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-40 transition-opacity duration-300" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Mobile Sidebar */}
      <aside className={`lg:hidden fixed top-0 left-0 h-screen w-72 bg-white dark:bg-slate-900 z-50 transition-transform duration-300 shadow-2xl ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-3 text-indigo-500">
            <Logo className="w-10 h-10" />
            <span className="text-xl font-bold text-slate-900 dark:text-white">SkillVouch</span>
          </div>
        </div>
        <nav className="p-4 space-y-2 overflow-y-auto">
          <NavItem view={View.DASHBOARD} icon={LayoutDashboard} label="Dashboard" />
          <NavItem view={View.MY_SKILLS} icon={BookOpen} label="My Skills" />
          <NavItem view={View.FIND_PEERS} icon={Users} label="Find Peers" />
          <NavItem view={View.ROADMAP} icon={Map} label="Learning Path" />
          <NavItem view={View.MESSAGES} icon={MessageSquare} label="Messages" />
          <NavItem view={View.CAREER_SERVICES} icon={Briefcase} label="Career Services" />
          <NavItem view={View.QUERIES} icon={Mail} label="Queries" />
          <NavItem view={View.PROFILE} icon={UserCircle} label="Profile" />
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
          <button onClick={onLogout} className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-rose-500">
            <LogOut className="w-5 h-5" />
            <span className="font-semibold text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 pt-16 lg:pt-0 relative overflow-y-auto scroll-smooth">
        {/* Top bar for desktop with user info */}
        <header className="hidden lg:flex h-20 items-center justify-between px-8 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
             {currentView === View.DASHBOARD && 'Welcome back, ' + user.name.split(' ')[0] + '! 👋'}
             {currentView !== View.DASHBOARD && currentView.charAt(0).toUpperCase() + currentView.slice(1).toLowerCase().replace('_', ' ')}
          </h2>
        </header>

        {/* Content Wrapper */}
        <div className="flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}