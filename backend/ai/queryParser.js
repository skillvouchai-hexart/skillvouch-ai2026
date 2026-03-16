import fetch from 'node-fetch';

const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY || 'WCDEgp3sS6bERPYNBvhYvzFyT5UzVkdZ';
const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';

/**
 * Parses a raw user job search query into structured search terms using Mistral AI.
 * Example input: "remote Python jobs for freshers in London"
 * @param {string} queryRaw - The raw search string from the user.
 * @returns {Promise<Object>} An object containing structured expanded terms.
 */
export async function parseJobSearchQuery(queryRaw) {
  if (!queryRaw || queryRaw.trim().length === 0) {
    return { titles: [], skills: [], location: null, isRemote: null, experience: null };
  }

  const prompt = `
    You are an expert AI search engine parser for a global job board.
    Extract and expand the following user search query into specific metadata fields.
    
    User Query: "${queryRaw}"
    
    Instructions:
    1. Extract the core job titles and provide 2-3 highly relevant synonyms or closely related titles (e.g. "ML Engineer" -> ["Machine Learning", "AI Engineer", "Data Scientist"]).
    2. Extract any specific skills mentioned or strongly implied by the role (e.g. "React dev" -> ["React", "JavaScript", "Frontend"]).
    3. Extract the location if mentioned.
    4. Detect if the user wants "remote" work (true/false/null).
    5. Detect the experience level requested ("Entry-level", "Mid-level", "Senior", "Executive", or null).
    
    Respond STRICTLY with valid JSON. Do NOT include markdown blocks like \`\`\`json.
    Format your response EXACTLY like this:
    {
      "titles": ["List", "Of", "Expanded", "Titles"],
      "skills": ["List", "Of", "Skills"],
      "location": "City/Country or null",
      "isRemote": true,
      "experience": "Entry-level"
    }
  `;

  try {
    const response = await fetch(MISTRAL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MISTRAL_API_KEY}`
      },
      body: JSON.stringify({
        model: 'mistral-large-latest',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      throw new Error(`Mistral API Error: ${response.status}`);
    }

    const data = await response.json();
    let content = data.choices[0].message.content.trim();
    if (content.startsWith('\`\`\`json')) {
      content = content.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
    }
    
    const parsed = JSON.parse(content);
    return {
      titles: Array.isArray(parsed.titles) ? parsed.titles : [],
      skills: Array.isArray(parsed.skills) ? parsed.skills : [],
      location: typeof parsed.location === 'string' ? parsed.location : null,
      isRemote: typeof parsed.isRemote === 'boolean' ? parsed.isRemote : null,
      experience: typeof parsed.experience === 'string' ? parsed.experience : null
    };
  } catch (error) {
    console.error("Mistral Query Parsing Error:", error.message);
    // Fallback if Mistral fails
    return {
      titles: [queryRaw.trim()],
      skills: [],
      location: null,
      isRemote: null,
      experience: null
    };
  }
}

