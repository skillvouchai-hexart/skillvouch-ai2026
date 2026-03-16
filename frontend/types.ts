export interface Skill {
  id: string;
  name: string;
  verified: boolean;
  level?: string; // Beginner, Intermediate, Advanced
  score?: number; // 0-100
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Added for auth simulation
  avatar: string; // URL or Base64 string
  skillsKnown: Skill[];
  skillsToLearn: string[];
  bio: string;
  discordLink?: string;
  rating: number; // 1-5
  languages?: string[]; // Languages user speaks
  preferredLanguage?: string; // Preferred language for communication
  availability?: string[]; // Available time slots
  
  // VConnectU Career Fields
  firstName?: string;
  lastName?: string;
  dob?: string;
  address?: string;
  qualification?: 'TENTH' | 'TWELFTH' | 'UG' | 'PG';
  tenthSchool?: string;
  tenthPercent?: number;
  twelfthSchool?: string;
  twelfthCollege?: string;
  twelfthPercent?: number;
  ugCollege?: string;
  ugUniversity?: string;
  ugPercent?: number;
  pgCollege?: string;
  pgUniversity?: string;
  pgPercent?: number;
  marksheet10thUrl?: string;
  marksheet12thUrl?: string;
  resumeUrl?: string;
  highestQualMarksheetUrl?: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  salary?: string;
  sector?: string;
  role?: string;
  type: string; is_verified?: number;
  category: 'Private' | 'Government';
  minQualification: 'TENTH' | 'TWELFTH' | 'UG' | 'PG';
  requiredSkills?: string;
  deadline?: number;
  selectionProcess?: string;
  examDate?: number;
  examMode?: string;
  link?: string;
  source?: 'Naukri' | 'Indeed' | 'World AI' | 'VConnectU';
  isNotification?: boolean;
  isVerified?: boolean;
  verificationDetails?: {
    confidenceScore: number;
    trustSignals: string[];
    lastChecked: string;
  };
  verificationReasons?: string[];
  createdAt: number;
}

export interface Idea {
  id: string;
  title: string;
  problem: string;
  solution: string;
  technologies: string;
  impact: string;
  contactEmail: string;
  contactPhone: string;
  userId: string;
  userName?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Competition {
  id: string;
  title: string;
  platform: string;
  description?: string;
  link: string;
  prize?: string;
  deadline?: number;
  startDate?: number;
  type: string; is_verified?: number;
  createdAt: number;
  updatedAt: number;
}

export interface ResearchPaper {
  id: string;
  title: string;
  publisher: string;
  conference?: string;
  description?: string;
  link: string;
  deadline?: number;
  topic?: string;
  createdAt: number;
  updatedAt: number;
}

export interface ResumeAnalysis {
  ats_score: number;
  keyword_match_score: number;
  skills_score: number;
  experience_score: number;
  education_score: number;
  formatting_score: number;
  missing_keywords: string[];
  weak_sections: string[];
  formatting_issues: string[];
  suggestions: string[];
  improved_bullet_points: string[];
}

export interface InterviewData {
  techQuestions: string[];
  hrQuestions: string[];
  detectedSkills: string[];
}

export interface QuizQuestion {
  question: string;
  codeSnippet?: string; // Optional code block for the user to analyze
  options: string[];
  correctAnswerIndex: number; // 0-3
}

export interface QuizResult {
  passed: boolean;
  score: number;
  badgeEarned?: string;
}

export interface RoadmapItem {
  step: number;
  title: string;
  description: string;
  duration: string;
  resources: string[];
}

export interface MatchRecommendation {
  user: User;
  matchScore: number; // 0-100
  reasoning: string;
  commonInterests: string[];
}

export interface ExchangeRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  offeredSkill: string;
  requestedSkill: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  createdAt: number;
  completedAt?: number;
}

export interface ExchangeFeedback {
  id: string;
  requestId: string;
  fromUserId: string;
  toUserId: string;
  stars: number; // 1-5
  comment?: string;
  createdAt: number;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: number;
  read: boolean;
}

export enum View {
  LANDING = 'LANDING',
  LOGIN = 'LOGIN',
  SIGNUP = 'SIGNUP',
  DASHBOARD = 'DASHBOARD',
  MY_SKILLS = 'MY_SKILLS',
  FIND_PEERS = 'FIND_PEERS',
  ROADMAP = 'ROADMAP',
  PROFILE = 'PROFILE',
  MESSAGES = 'MESSAGES',
  CAREER_SERVICES = 'CAREER_SERVICES',
  RESUME_ANALYZER = 'RESUME_ANALYZER',
  MOCK_INTERVIEW = 'MOCK_INTERVIEW',
  JOB_BOARD = 'JOB_BOARD',
  IDEA_FEED = 'IDEA_FEED',
  COMPETITIONS = 'COMPETITIONS',
  RESEARCH_PAPERS = 'RESEARCH_PAPERS',
  QUERIES = 'QUERIES'
}