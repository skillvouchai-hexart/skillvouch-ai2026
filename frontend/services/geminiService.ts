import { QuizQuestion, RoadmapItem, User, MatchRecommendation } from "../types";

// Helper to make API calls to backend
const apiCall = async <T>(endpoint: string, body: any): Promise<T> => {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API call to ${endpoint} failed: ${response.status} ${response.statusText} - ${errorText}`);
  }

  return response.json();
};

// 1. Generate Quiz
export const generateQuiz = async (skillName: string, difficulty: 'expert' | 'advanced' | 'intermediate' = 'expert'): Promise<QuizQuestion[]> => {
  try {
    // Call backend API instead of Google GenAI
    // The backend endpoint is /api/quiz/generate (singular) based on server.js AI-only endpoint works best for "just give me questions"
    // OR /api/quizzes/generate (plural) which saves to DB.
    // Let's use /api/quizzes/generate to align with persistent quizzes if possible, 
    // but the type signature here returns QuizQuestion[], not { quizId, questions }.
    // So we'll unwrap the response.

    // Note: server.js /api/quizzes/generate returns { quizId, questions }

    const response = await apiCall<{ quizId: string, questions: QuizQuestion[] }>('/api/quizzes/generate', {
      skillName,
      difficulty,
      count: 5 // Default to 5 questions
    });

    return response.questions;
  } catch (error) {
    console.error("Quiz generation failed:", error);
    // Return empty array or throw? Original service returned empty array on failure or fallback.
    // We should probably rely on backend fallback.
    return [];
  }
};

// 2. Generate Learning Roadmap
export const generateRoadmap = async (skillName: string): Promise<RoadmapItem[]> => {
  try {
    const response = await apiCall<{ roadmap: RoadmapItem[] }>('/api/roadmap/generate', {
      skillName
    });
    return response.roadmap;
  } catch (error) {
    console.error("Error generating roadmap:", error);
    throw error;
  }
};

// 3. Analyze Match Compatibility
export const analyzeMatch = async (user1: User, user2: User): Promise<{ score: number; reasoning: string; commonInterests: string[] }> => {
  try {
    return await apiCall<{ score: number; reasoning: string; commonInterests: string[] }>('/api/match/analyze', {
      user1,
      user2
    });
  } catch (error) {
    console.error("Error analyzing match:", error);
    return { score: 50, reasoning: "AI analysis unavailable.", commonInterests: [] };
  }
};

// 4. Suggest Skills
export const suggestSkills = async (currentSkills: string[], currentGoals: string[] = []): Promise<string[]> => {
  try {
    // Backend now returns { skills: string[] }
    const response = await apiCall<{ skills: string[] }>('/api/skills/suggest', {
      currentSkills,
      currentGoals
    });
    return response.skills;
  } catch (error) {
    console.error("Error suggesting skills:", error);
    return [];
  }
};