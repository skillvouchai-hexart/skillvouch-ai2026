import dotenv from 'dotenv';
dotenv.config();

import { ChatMistralAI } from '@langchain/mistralai';
import { PromptTemplate } from '@langchain/core/prompts';

const mistral = new ChatMistralAI({
  model: 'mistral-small',
  temperature: 0.4,
  apiKey: process.env.MISTRAL_API_KEY,
});

// Skill Suggestion Prompt
const skillSuggestionPrompt = PromptTemplate.fromTemplate(`
Suggest 5 relevant skills based on user's current skills and goals.

Current skills: [{currentSkills}]
Goals: [{currentGoals}]

Return ONLY valid JSON in this exact format:
{{
  "skills": ["skill1", "skill2", "skill3", "skill4", "skill5"]
}}

Requirements:
- Suggest in-demand skills that complement current skills
- Consider the user's goals when making suggestions
- Do not include skills the user already knows
- Do not include any markdown formatting or explanations
- Return only the JSON object
- Focus on programming and technology skills
- Include modern, relevant technologies
`);

// Roadmap Generation Prompt
const roadmapPrompt = PromptTemplate.fromTemplate(`
Generate a 6-step learning roadmap for {skill}. 

Return ONLY valid JSON in this exact format (no markdown, no comments):
{{
  "roadmap": [
    {{
      "step": 1,
      "title": "Step Title",
      "description": "Step Description",
      "duration": "1-2 weeks",
      "resources": ["Resource 1", "Resource 2", "Resource 3"]
    }}
  ]
}}

Requirements:
- Create a progression from beginner to advanced
- Include practical projects and realistic timeframes
- Each step should have exactly 3 learning resources
- Do not include any markdown formatting or explanations using backticks or otherwise.
- Return only the raw JSON string.
- Focus on practical learning outcomes
- Include hands-on projects and exercises
`);

export const suggestSkills = async (currentSkills = [], currentGoals = []) => {
  try {
    const formattedPrompt = await skillSuggestionPrompt.format({
      currentSkills: currentSkills.join(', '),
      currentGoals: currentGoals.join(', ')
    });

    const response = await mistral.invoke(formattedPrompt);
    const content = response.content;

    const cleanContent = content.replace(/```json\n?|```/g, '').trim();
    const data = JSON.parse(cleanContent);

    if (!data.skills || !Array.isArray(data.skills)) {
      throw new Error('Invalid skills response structure');
    }

    if (data.skills.length !== 5) {
      throw new Error(`Expected 5 skills, got ${data.skills.length}`);
    }

    return data.skills;
  } catch (error) {
    console.error('Skill suggestion error:', error);
    throw new Error(`Failed to suggest skills: ${error.message}`);
  }
};

export const generateRoadmap = async (skill) => {
  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    try {
      console.log(`Generating roadmap for ${skill} (Attempt ${attempts + 1})...`);
      const formattedPrompt = await roadmapPrompt.format({ skill });

      const response = await mistral.invoke(formattedPrompt);
      const content = response.content;

      const cleanContent = content.replace(/```json\n?|```/g, '').trim();

      let data;
      try {
        data = JSON.parse(cleanContent);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.error('Raw Content:', content);
        throw new Error('Invalid JSON format');
      }

      if (!data.roadmap || !Array.isArray(data.roadmap)) {
        throw new Error('Invalid roadmap response structure');
      }

      if (data.roadmap.length < 4) { // Allow slightly fewer steps if needed, but aim for 6
        throw new Error(`Expected at least 4 roadmap steps, got ${data.roadmap.length}`);
      }

      // Validate each step
      data.roadmap.forEach((step, index) => {
        if (!step.title || typeof step.title !== 'string') {
          throw new Error(`Step ${index + 1}: Invalid title`);
        }
        if (!step.description || typeof step.description !== 'string') {
          throw new Error(`Step ${index + 1}: Invalid description`);
        }
        if (!step.duration || typeof step.duration !== 'string') {
          throw new Error(`Step ${index + 1}: Invalid duration`);
        }
        if (!Array.isArray(step.resources)) {
          // Auto-fix if resources is missing or not array
          step.resources = ["Official Documentation", "Online Tutorial", "Practice Exercise"];
        }
      });

      return data.roadmap;
    } catch (error) {
      console.error(`Roadmap generation error (Attempt ${attempts + 1}):`, error.message);
      attempts++;
      if (attempts >= maxAttempts) {
        throw new Error(`Failed to generate roadmap after ${maxAttempts} attempts: ${error.message}`);
      }
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
};

// Match Analysis Prompt
const matchAnalysisPrompt = PromptTemplate.fromTemplate(`
Analyze the compatibility between two users for a skill exchange.

User 1:
- Skills Known: {user1Skills}
- Skills to Learn: {user1Goals}
- Bio: {user1Bio}

User 2:
- Skills Known: {user2Skills}
- Skills to Learn: {user2Goals}
- Bio: {user2Bio}

Return ONLY valid JSON in this exact format:
{{
  "score": number (0-100),
  "reasoning": "string explaining why they match or don't match",
  "commonInterests": ["interest 1", "interest 2", "interest 3"]
}}

Requirements:
- High score if one user knows what the other wants to learn
- Consider shared interests from bio
- Be encouraging but realistic
- Return only the JSON object
`);

export const analyzeMatch = async (user1, user2) => {
  try {
    const formattedPrompt = await matchAnalysisPrompt.format({
      user1Skills: (user1.skillsKnown || []).map(s => typeof s === 'string' ? s : s.name).join(', '),
      user1Goals: (user1.skillsToLearn || []).join(', '),
      user1Bio: user1.bio || '',
      user2Skills: (user2.skillsKnown || []).map(s => typeof s === 'string' ? s : s.name).join(', '),
      user2Goals: (user2.skillsToLearn || []).join(', '),
      user2Bio: user2.bio || ''
    });

    const response = await mistral.invoke(formattedPrompt);
    const content = response.content;

    const cleanContent = content.replace(/```json\n?|```/g, '').trim();
    const data = JSON.parse(cleanContent);

    return {
      score: typeof data.score === 'number' ? data.score : 50,
      reasoning: data.reasoning || 'Match analysis unavailable',
      commonInterests: Array.isArray(data.commonInterests) ? data.commonInterests : []
    };
  } catch (error) {
    console.error('Match analysis error:', error);
    // Return fallback instead of throwing to keep UI working
    return {
      score: 0,
      reasoning: 'AI analysis failed. Please try again.',
      commonInterests: []
    };
  }
};
