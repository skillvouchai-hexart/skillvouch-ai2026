import dotenv from 'dotenv';
dotenv.config();
import { ChatMistralAI } from '@langchain/mistralai';
import { PromptTemplate } from '@langchain/core/prompts';

let mistralClient = null;

const getMistralClient = () => {
  if (!mistralClient) {
    if (!process.env.MISTRAL_API_KEY) {
      throw new Error('MISTRAL_API_KEY is not defined in environment variables');
    }
    mistralClient = new ChatMistralAI({
      model: 'mistral-small-latest',
      temperature: 0.4,
      apiKey: process.env.MISTRAL_API_KEY,
    });
  }
  return mistralClient;
};

const interviewSetupPrompt = PromptTemplate.fromTemplate(`
You are an expert technical and HR interviewer.
Analyze the candidate's resume content provided below and generate:
1. 4 Technical Interview Questions: Deeply tailored to the specific skills, frameworks, and projects mentioned.
2. 4 HR/Behavioral Questions: Tailored to the candidate's experience, career path, or background.
3. Extract the top 3-5 technical skills detected.

Resume Content: {resumeText}

Format the output EXCLUSIVELY as JSON:
{{
  "techQuestions": ["Question 1", "Question 2", "Question 3", "Question 4"],
  "hrQuestions": ["Question 1", "Question 2", "Question 3", "Question 4"],
  "detectedSkills": ["Skill1", "Skill2", "Skill3"]
}}
IMPORTANT: Return ONLY the JSON object.
`);

export const setupInterview = async (resumeText) => {
  try {
    const formattedPrompt = await interviewSetupPrompt.format({
      resumeText: resumeText.slice(0, 4000)
    });

    const response = await getMistralClient().invoke(formattedPrompt);
    const content = response.content;

    // Robust JSON parsing
    let cleanContent = content.trim();
    if (cleanContent.startsWith('```json')) {
      cleanContent = cleanContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanContent.startsWith('```')) {
      cleanContent = cleanContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    let data;
    try {
      data = JSON.parse(cleanContent);
    } catch (parseError) {
      const firstBrace = cleanContent.indexOf('{');
      const lastBrace = cleanContent.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        try {
          data = JSON.parse(cleanContent.substring(firstBrace, lastBrace + 1));
        } catch (e) { throw parseError; }
      } else {
        throw parseError;
      }
    }

    return data;
  } catch (error) {
    console.error('Interview Setup Error:', error);
    throw new Error(`Failed to setup interview: ${error.message}`);
  }
};
