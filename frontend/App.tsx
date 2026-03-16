import React, { useState, useEffect, Suspense, lazy } from 'react';
import { View, User, Skill } from './types';
import { apiService as dbService } from './services/apiService';
import { ThemeProvider } from './ThemeContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { 
  Mail, 
  Lock, 
  User as UserIcon, 
  AlertCircle, 
  CheckCircle2, 
  Loader2 
} from 'lucide-react';
import Layout from './components/Layout';
import { Logo } from './components/Logo';
import { ChatBot } from './components/ChatBot';

// Initial User State
const INITIAL_USER: User = {
  id: 'temp',
  name: 'Guest',
  email: '',
  avatar: 'https://ui-avatars.com/api/?background=6366f1&color=fff&name=Guest',
  skillsKnown: [],
  skillsToLearn: [],
  bio: 'Standard User',
  rating: 5
};

// Lazy components with retry
const lazyWithRetry = (componentImport: any) => {
  return lazy(async () => {
    try {
      return await componentImport();
    } catch (error) {
      console.error('Initial load failed, retrying...', error);
      return componentImport();
    }
  });
};

const Dashboard = lazyWithRetry(() => import('./components/Dashboard').then(module => ({ default: module.Dashboard })));
const SkillList = lazyWithRetry(() => import('./components/SkillList').then(module => ({ default: module.SkillList })));
const MatchFinder = lazyWithRetry(() => import('./components/MatchFinder').then(module => ({ default: module.MatchFinder })));
const RoadmapView = lazyWithRetry(() => import('./components/RoadmapView').then(module => ({ default: module.RoadmapView })));
const ChatView = lazyWithRetry(() => import('./components/ChatView').then(module => ({ default: module.ChatView })));
const LandingPage = lazyWithRetry(() => import('./components/LandingPage').then(module => ({ default: module.LandingPage })));
const ProfileView = lazyWithRetry(() => import('./components/ProfileView').then(module => ({ default: module.ProfileView })));
const ResumeAnalyzer = lazyWithRetry(() => import('@/components/ResumeAnalyzer'));
const MockInterview = lazyWithRetry(() => import('@/components/MockInterview'));
const JobBoard = lazyWithRetry(() => import('@/components/JobBoard'));
const IdeaFeed = lazyWithRetry(() => import('@/components/IdeaFeed'));
const Competitions = lazyWithRetry(() => import('@/components/Competitions'));
const ResearchPapers = lazyWithRetry(() => import('@/components/ResearchPapers'));
const CareerServices = lazyWithRetry(() => import('@/components/CareerServices'));
const QueriesView = lazyWithRetry(() => import('./components/QueriesView'));

export default function App() {
  const suspenseFallback = (
    <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
      <Loader2 className="animate-spin h-8 w-8 text-indigo-500" />
    </div>
  );
  const [currentView, setCurrentView] = useState<View>(View.LANDING);
  const [user, setUser] = useState<User>(INITIAL_USER);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingSession, setLoadingSession] = useState(true);
  const [isChatBotOpen, setIsChatBotOpen] = useState(false);
  const [notification, setNotification] = useState<{ message: string, type: 'success' } | null>(null);
  const [selectedChatUserId, setSelectedChatUserId] = useState<string | undefined>(undefined);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const sessionUser = dbService.getCurrentSession();
      if (sessionUser) {
        setUser(sessionUser);
        setCurrentView(View.DASHBOARD);
        try {
          const freshUser = await dbService.getUserById(sessionUser.id);
          if (freshUser) {
            setUser(freshUser);
            dbService.setSession(freshUser);
          }
        } catch {}
      }
      setLoadingSession(false);
    };
    checkSession();
  }, []);

  useEffect(() => {
    let interval: any;
    if (user.id !== 'temp') {
      const fetchUnread = async () => {
        try {
          const count = await dbService.getUnreadCount(user.id);
          setUnreadCount(count);
        } catch (error) {
          console.error('Failed to fetch unread count:', error);
        }
      };
      fetchUnread();
      interval = setInterval(fetchUnread, 5000);
    }
    return () => clearInterval(interval);
  }, [user.id]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleUpdateUser = (updatedUser: User) => setUser(updatedUser);

  const handleLogout = async () => {
    await dbService.logout();
    setUser(INITIAL_USER);
    setEmail('');
    setPassword('');
    setCurrentView(View.LANDING);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsSubmitting(true);
    try {
      const loggedInUser = await dbService.login(email, password);
      setUser(loggedInUser);
      setCurrentView(View.DASHBOARD);
      setNotification({ message: `Welcome back, ${loggedInUser.name.split(' ')[0]}!`, type: 'success' });
    } catch (err: any) {
      setAuthError(err.message || 'Invalid email or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!fullName || !email || !password || !confirmPassword) {
      setAuthError('Please fill in all required fields.');
      return;
    }
    if (password !== confirmPassword) {
      setAuthError('Passwords do not match.');
      return;
    }
    setIsSubmitting(true);
    try {
      await dbService.signup(fullName, email, password);
      setCurrentView(View.LOGIN);
      setNotification({ message: 'Account created successfully! Please log in.', type: 'success' });
      setPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setAuthError(err.message || 'Signup failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const navigateToView = (view: View, params?: any) => {
    if (view !== View.MESSAGES) setSelectedChatUserId(undefined);
    setCurrentView(view);
  };

  const renderView = () => {
    if (loadingSession) {
      return (
        <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
          <Loader2 className="animate-spin h-12 w-12 text-indigo-500" />
        </div>
      );
    }

    const getView = () => {
      switch (currentView) {
        case View.DASHBOARD:
          return (
            <Suspense fallback={suspenseFallback}>
              <Dashboard user={user} onNavigateToProfile={(userId) => { setSelectedChatUserId(userId); setCurrentView(View.MESSAGES); }} onNavigate={navigateToView} />
            </Suspense>
          );
        case View.MY_SKILLS:
          return (
            <Suspense fallback={suspenseFallback}>
              <SkillList user={user} onUpdateUser={handleUpdateUser} />
            </Suspense>
          );
        case View.FIND_PEERS:
          return (
            <Suspense fallback={suspenseFallback}>
              <MatchFinder currentUser={user} onMessageUser={(userId) => { setSelectedChatUserId(userId); setCurrentView(View.MESSAGES); }} />
            </Suspense>
          );
        case View.ROADMAP:
          return (
            <Suspense fallback={suspenseFallback}>
              <RoadmapView />
            </Suspense>
          );
        case View.MESSAGES:
          return (
            <Suspense fallback={suspenseFallback}>
              <ChatView currentUser={user} initialChatUserId={selectedChatUserId} />
            </Suspense>
          );
        case View.PROFILE:
          return (
            <Suspense fallback={suspenseFallback}>
              <ProfileView user={user} onUpdateUser={handleUpdateUser} />
            </Suspense>
          );
        case View.CAREER_SERVICES:
          return (
            <Suspense fallback={suspenseFallback}>
              <CareerServices onNavigate={navigateToView} user={user} />
            </Suspense>
          );
        case View.QUERIES:
          return (
            <Suspense fallback={suspenseFallback}>
              <QueriesView user={user} />
            </Suspense>
          );
        case View.RESUME_ANALYZER:
          return (
            <Suspense fallback={suspenseFallback}>
              <ResumeAnalyzer user={user} onBack={() => setCurrentView(View.CAREER_SERVICES)} />
            </Suspense>
          );
        case View.MOCK_INTERVIEW:
          return (
            <Suspense fallback={suspenseFallback}>
              <MockInterview user={user} onBack={() => setCurrentView(View.CAREER_SERVICES)} />
            </Suspense>
          );
        case View.JOB_BOARD:
          return (
            <Suspense fallback={suspenseFallback}>
              <JobBoard user={user} onBack={() => setCurrentView(View.CAREER_SERVICES)} />
            </Suspense>
          );
        case View.IDEA_FEED:
          return (
            <Suspense fallback={suspenseFallback}>
              <IdeaFeed user={user} onBack={() => setCurrentView(View.CAREER_SERVICES)} />
            </Suspense>
          );
        case View.COMPETITIONS:
          return (
            <Suspense fallback={suspenseFallback}>
              <Competitions onBack={() => setCurrentView(View.CAREER_SERVICES)} />
            </Suspense>
          );
        case View.RESEARCH_PAPERS:
          return (
            <Suspense fallback={suspenseFallback}>
              <ResearchPapers onBack={() => setCurrentView(View.CAREER_SERVICES)} />
            </Suspense>
          );
        default:
          return (
            <Suspense fallback={suspenseFallback}>
              <Dashboard user={user} onNavigateToProfile={() => { }} onNavigate={navigateToView} />
            </Suspense>
          );
      }
    };

    return <ErrorBoundary>{getView()}</ErrorBoundary>;
  };

  const NotificationToast = () => (
    notification ? (
      <div className="fixed top-6 right-6 z-[100] animate-[slideIn_0.3s_ease-out]">
        <div className="bg-emerald-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3 border border-emerald-500 backdrop-blur-md bg-opacity-95">
          <div className="bg-white/20 p-1.5 rounded-full">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <p className="font-semibold text-sm">{notification.message}</p>
        </div>
      </div>
    ) : null
  );

  if ((currentView === View.LANDING || currentView === View.LOGIN || currentView === View.SIGNUP) && user.id === 'temp' && !loadingSession) {
    if (currentView === View.LANDING) {
      return (
        <ThemeProvider>
          <NotificationToast />
          <Suspense fallback={suspenseFallback}>
            <LandingPage onNavigate={setCurrentView} />
          </Suspense>
        </ThemeProvider>
      );
    }
    
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
          <NotificationToast />
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl shadow-2xl relative z-10 animate-fade-in">
            <button onClick={() => setCurrentView(View.LANDING)} className="text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-white mb-4 text-sm flex items-center transition-colors">
              ← Back to Home
            </button>
            <div className="flex flex-col items-center justify-center mb-6 text-indigo-500">
              <Logo className="w-24 h-24 mb-2 shadow-2xl" />
            </div>
            <h1 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-2">{currentView === View.LOGIN ? 'Welcome Back' : 'Create Account'}</h1>
            <p className="text-center text-slate-500 dark:text-slate-400 mb-8">{currentView === View.LOGIN ? 'Connect • Learn • Grow' : 'Join the community'}</p>

            <form onSubmit={currentView === View.LOGIN ? handleLogin : handleSignup} className="space-y-4">
              {currentView === View.SIGNUP && (
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3.5 w-5 h-5 text-slate-400 dark:text-slate-500" />
                  <input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg pl-10 pr-4 py-3 text-slate-900 dark:text-white outline-none focus:border-indigo-500 transition-colors" />
                </div>
              )}
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-400 dark:text-slate-500" />
                <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg pl-10 pr-4 py-3 text-slate-900 dark:text-white outline-none focus:border-indigo-500 transition-colors" />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400 dark:text-slate-500" />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg pl-10 pr-4 py-3 text-slate-900 dark:text-white outline-none focus:border-indigo-500 transition-colors" />
              </div>
              {currentView === View.SIGNUP && (
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400 dark:text-slate-500" />
                  <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg pl-10 pr-4 py-3 text-slate-900 dark:text-white outline-none focus:border-indigo-500 transition-colors" />
                </div>
              )}
              {authError && <div className="text-red-500 text-sm p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-900/20">{authError}</div>}
              <button disabled={isSubmitting} type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50">{isSubmitting ? (currentView === View.LOGIN ? 'Logging in...' : 'Signing up...') : (currentView === View.LOGIN ? 'Login' : 'Sign Up')}</button>
            </form>

            <div className="mt-6 text-center">
              <button onClick={() => { setAuthError(''); setCurrentView(currentView === View.LOGIN ? View.SIGNUP : View.LOGIN); }} className="text-indigo-500 hover:text-indigo-600 font-medium transition-colors">
                {currentView === View.LOGIN ? "Don't have an account? Sign up" : "Already have an account? Login"}
              </button>
            </div>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <NotificationToast />
      <Layout currentView={currentView} onNavigate={navigateToView} user={user} onLogout={handleLogout} unreadCount={unreadCount}>
        {renderView()}
      </Layout>
      <ChatBot isOpen={isChatBotOpen} onToggle={() => setIsChatBotOpen(!isChatBotOpen)} />
    </ThemeProvider>
  );
}