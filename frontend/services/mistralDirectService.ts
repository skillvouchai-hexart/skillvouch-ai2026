// All AI calls are routed through the backend to keep API keys secure.
// This service calls the backend /api/learning/* endpoints.

const API_BASE = '/api';

// Skill Suggestion – calls backend which calls Mistral securely
export const suggestSkillsDirect = async (currentSkills: string[], currentGoals: string[] = []): Promise<string[]> => {
  try {
    const response = await fetch(`${API_BASE}/learning/suggest-skills`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentSkills, goals: currentGoals })
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Backend returns { skills: [{name, reason, demand, timeToLearn}] }
    if (data.skills && Array.isArray(data.skills)) {
      return data.skills.map((s: any) => (typeof s === 'string' ? s : s.name));
    }

    throw new Error('Invalid response format');
  } catch (error) {
    console.error('Skill suggestion error:', error);
    throw error;
  }
};

// Roadmap Generation – calls backend which calls Mistral securely
export const generateRoadmapDirect = async (skill: string): Promise<any[]> => {
  try {
    const response = await fetch(`${API_BASE}/learning/roadmap`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skill })
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.roadmap && Array.isArray(data.roadmap)) {
      return data.roadmap;
    }

    throw new Error('Invalid response format');
  } catch (error) {
    console.error('Roadmap generation error:', error);
    throw error;
  }
};
