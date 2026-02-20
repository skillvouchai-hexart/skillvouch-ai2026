// All AI calls are routed through the backend to keep API keys secure.
// This service calls the backend /api/learning/* endpoints.

const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : 'https://skillvouch-ai2026.onrender.com/api';

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
    // Fallback suggestions
    return ['React', 'Node.js', 'TypeScript', 'Docker', 'AWS'];
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
    // Fallback roadmap
    return [
      {
        step: 1,
        title: `Getting Started with ${skill}`,
        description: `Learn the fundamentals and basic concepts of ${skill}`,
        duration: '1-2 weeks',
        resources: ['Official documentation', 'Beginner tutorials', 'Practice exercises']
      },
      {
        step: 2,
        title: `Core ${skill} Concepts`,
        description: `Deep dive into essential concepts and principles`,
        duration: '2-3 weeks',
        resources: ['Video courses', 'Hands-on projects', 'Community forums']
      },
      {
        step: 3,
        title: `Practical Application`,
        description: `Apply your knowledge through real-world projects`,
        duration: '3-4 weeks',
        resources: ['Project templates', 'Code repositories', 'Mentorship programs']
      },
      {
        step: 4,
        title: `Advanced Techniques`,
        description: `Master advanced concepts and best practices`,
        duration: '4-6 weeks',
        resources: ['Advanced documentation', 'Expert tutorials', 'Case studies']
      },
      {
        step: 5,
        title: `Specialization`,
        description: `Focus on specific areas of expertise within ${skill}`,
        duration: '6-8 weeks',
        resources: ['Specialized courses', 'Research papers', 'Professional workshops']
      },
      {
        step: 6,
        title: `Mastery & Portfolio`,
        description: `Build a comprehensive portfolio and contribute to the community`,
        duration: '8-12 weeks',
        resources: ['Portfolio projects', 'Open source contributions', 'Speaking opportunities']
      }
    ];
  }
};
