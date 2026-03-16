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

const resumeAnalysisPrompt = PromptTemplate.fromTemplate(`
You are the AI Resume Analyzer. 
You are NOT a general AI assistant. You behave like a strict Applicant Tracking System used by large companies.

Analyze the candidate resume against the provided job description.

Job Description: {jobDescription}
Resume Content: {resumeText}
File Type: {fileType}

### STRICT RULES & EVALUATION CRITERIA:

1. **Weighted Scoring**:
   - Keyword Match with Job Description: 35%
   - Skills Coverage: 20%
   - Relevant Work Experience: 20%
   - Education and Certifications: 10%
   - ATS Formatting Compatibility: 15%

2. **Structure Audit**: Verify Summary, Skills, Experience, Education, Projects, Certifications.
3. **Formatting Audit**: Detect symbols/patterns indicating tables ("|", "+--"), multi-column layouts, images, icons, or graphics.
4. **Experience Audit**: Compare titles, tech stacks, impact, and quantifiable achievements.
5. **Missing Keywords**: Identify terms in JD but missing in Resume.
6. **Bullet Point Quality**: Detect weak phrases like "worked on", "helped team", "responsible for".
7. **Improved Suggestions**: Provide measurable, X-Y-Z formula style bullet point replacements.
8. **Penalties**: Strict penalties for missing sections, generic skills (e.g., "Microsoft Office"), short content, or lack of metrics.

### SCORING SCALE:
- 0–30: Poor | 31–50: Weak | 51–70: Average | 71–85: Good | 86–100: Excellent

### OUTPUT STRUCTURE:
Return results ONLY in valid JSON format:
{{
 "ats_score": number,
 "keyword_match_score": number,
 "skills_score": number,
 "experience_score": number,
 "education_score": number,
 "formatting_score": number,
 "missing_keywords": [],
 "weak_sections": [],
 "formatting_issues": [],
 "suggestions": [],
 "improved_bullet_points": []
}}
Do not add explanations outside the JSON.
`);

export const analyzeResume = async (resumeText, fileType = 'PDF', jobDescription = 'N/A') => {
  try {
    const formattedPrompt = await resumeAnalysisPrompt.format({
      resumeText: resumeText.slice(0, 4000),
      fileType: fileType,
      jobDescription: jobDescription || 'N/A'
    });

    console.log('Mistral request: sending resume analysis prompt...');
    const response = await getMistralClient().invoke(formattedPrompt);
    const content = response.content;
    console.log('Mistral response received');

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
      console.warn('Mistral response parsing failed, attempting fuzzy match...', parseError.message);
      const firstBrace = cleanContent.indexOf('{');
      const lastBrace = cleanContent.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        try {
          data = JSON.parse(cleanContent.substring(firstBrace, lastBrace + 1));
        } catch (e) { 
          console.error('Fuzzy parse also failed. Content:', cleanContent);
          throw parseError; 
        }
      } else {
        console.error('No JSON braces found in response. Content:', cleanContent);
        throw parseError;
      }
    }

    return data;
  } catch (error) {
    console.error('Resume Analysis AI Error:', error);
    throw new Error(`AI Analysis failed: ${error.message}`);
  }
};
