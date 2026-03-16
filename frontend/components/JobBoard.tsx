import React, { useState, useEffect } from 'react';
import { User, Job } from '../types';
import { apiService } from '../services/apiService';
import { 
  MapPin, 
  Building, 
  DollarSign, 
  Search, 
  Briefcase,
  ExternalLink,
  ChevronRight,
  X,
  Loader2
} from 'lucide-react';

interface JobBoardProps {
  user: User;
  onBack: () => void;
}

const JobBoard: React.FC<JobBoardProps> = ({ user, onBack }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  
  const [redirecting, setRedirecting] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const fetchUnifiedJobs = async (q = '', l = '') => {
    q ? setSearching(true) : setLoading(true);
    try {
      const data = await apiService.getJobs(q, l, '', '', '', false);
      setJobs(data);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  useEffect(() => {
    fetchUnifiedJobs();
  }, [user]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUnifiedJobs(searchQuery, locationQuery);
  };

  const handleExternalRedirect = (job: Job) => {
    if (!job.link) return;
    setRedirecting(job.id);
    setTimeout(() => {
      window.open(job.link, '_blank', 'noopener,noreferrer');
      setRedirecting(null);
    }, 1000);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 animate-fade-in">
      {/* Simple Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-indigo-600" />
            AI Job Board
          </h1>
          <p className="text-slate-500 mt-2">Discover and apply directly on company websites.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={onBack} 
            className="px-6 py-2.5 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Job title or keywords..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex-1 relative">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Location (e.g. Remote, Bangalore)"
            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
          />
        </div>
        <button 
          type="submit"
          disabled={searching}
          className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition flex items-center justify-center min-w-[120px]"
        >
          {searching ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search'}
        </button>
      </form>

      {/* Main Content Area */}
      <div>
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20 text-slate-500 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
             <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
             <p>No jobs found. Try different keywords.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {jobs.map(job => (
              <div 
                key={job.id} 
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer flex justify-between items-center group/jobcard"
                onClick={() => setSelectedJob(job)}
              >
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover/jobcard:text-indigo-600 transition-colors">
                    {job.title}
                  </h3>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1.5 font-medium"><Building className="w-4 h-4" /> {job.company}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {job.location || 'Remote'}</span>
                    <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4" /> {job.salary || 'Not specified'}</span>
                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-medium text-slate-600 dark:text-slate-300">
                      {job.type || 'Full-time'}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-slate-400 group-hover/jobcard:text-indigo-600" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Simple Detail Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-3xl max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{selectedJob.title}</h2>
                <div className="flex gap-4 text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1"><Building className="w-4 h-4" /> {selectedJob.company}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {selectedJob.location || 'Remote'}</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedJob(null)}
                className="p-2 bg-slate-100 text-slate-500 rounded-full hover:bg-rose-100 hover:text-rose-600 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Job Description</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{selectedJob.description}</p>
              </div>
              
              {selectedJob.requiredSkills && typeof selectedJob.requiredSkills === 'string' && (
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.requiredSkills.split(',').map((skill, i) => (
                      <span key={i} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-8 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button 
                  onClick={() => handleExternalRedirect(selectedJob)}
                  className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition flex items-center gap-2"
                >
                  {redirecting === selectedJob.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <ExternalLink className="w-5 h-5" />}
                  {redirecting === selectedJob.id ? 'Redirecting...' : 'Apply on Company Website'}
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobBoard;
