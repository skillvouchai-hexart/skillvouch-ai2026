import dotenv from 'dotenv';
dotenv.config();

import { ChatMistralAI } from '@langchain/mistralai';
import { PromptTemplate } from '@langchain/core/prompts';
import { generateSkillAssessmentQuiz } from './skillAssessmentEngine.js';

let mistralClient = null;

const getMistralClient = () => {
  if (!mistralClient) {
    if (!process.env.MISTRAL_API_KEY) {
      throw new Error('MISTRAL_API_KEY is not defined in environment variables');
    }
    mistralClient = new ChatMistralAI({
      model: 'mistral-small',
      temperature: 0.4,
      apiKey: process.env.MISTRAL_API_KEY,
    });
  }
  return mistralClient;
};

// Quiz cache for faster responses
const quizCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const getCacheKey = (skill, difficulty, count) => `${skill}-${difficulty}-${count}`;

const getCachedQuiz = (skill, difficulty, count) => {
  const key = getCacheKey(skill, difficulty, count);
  const cached = quizCache.get(key);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log(`Cache hit for ${skill} (${difficulty}) - returning cached quiz`);
    return cached.questions;
  }

  return null;
};

const setCachedQuiz = (skill, difficulty, count, questions) => {
  const key = getCacheKey(skill, difficulty, count);
  quizCache.set(key, {
    questions,
    timestamp: Date.now()
  });

  // Clean old cache entries periodically
  if (quizCache.size > 100) {
    const now = Date.now();
    for (const [cacheKey, cached] of quizCache.entries()) {
      if (now - cached.timestamp > CACHE_TTL) {
        quizCache.delete(cacheKey);
      }
    }
  }
};

// Enhanced skill domain detection
const detectSkillDomain = (skillName) => {
  const lowerSkill = skillName.toLowerCase();

  // Exact matching first - prioritize specific skill names over partial matches
  const exactMatches = {
    cooking: ['cooking', 'culinary arts', 'food preparation', 'meal preparation'],
    baking: ['baking', 'pastry', 'bread making', 'cake decorating'],
    accounting: ['accounting', 'bookkeeping', 'financial accounting', 'managerial accounting', 'cost accounting', 'tax accounting'],
    finance: ['finance', 'financial analysis', 'investment', 'portfolio management'],
    marketing: ['marketing', 'digital marketing', 'content marketing', 'social media marketing'],
    javascript: ['javascript', 'js', 'ecmascript'],
    python: ['python', 'python programming'],
    java: ['java', 'java programming'],
    react: ['react', 'reactjs', 'react.js'],
    yoga: ['yoga', 'yoga practice', 'meditation'],
    spanish: ['spanish', 'spanish language', 'español'],
    carpentry: ['carpentry', 'woodworking'],
    basketball: ['basketball', 'b-ball']
  };

  // Check exact matches first
  for (const [domain, skills] of Object.entries(exactMatches)) {
    if (skills.includes(lowerSkill)) {
      return domain;
    }
  }

  // Then check partial matches with higher specificity
  const domains = {
    cooking: ['chef', 'food', 'recipe', 'kitchen', 'grilling', 'frying', 'roasting', 'sous vide', 'fermentation', 'canning', 'preserving', 'meal', 'cook', 'culinary'],
    accounting: ['account', 'bookkeep', 'ledger', 'financial statement', 'balance sheet', 'income statement', 'cash flow', 'audit', 'tax', 'costing', 'budgeting'],
    technical: ['programming', 'coding', 'software', 'development', 'algorithm', 'data', 'system', 'network', 'security', 'database', 'api', 'frontend', 'backend', 'fullstack', 'web development', 'mobile development'],
    creative: ['design', 'art', 'music', 'writing', 'content', 'creative', 'visual', 'media', 'photography', 'video', 'illustration', 'graphic', 'ui', 'ux', 'animation', 'drawing', 'painting', 'sculpture', 'filmmaking'],
    business: ['management', 'sales', 'strategy', 'leadership', 'project', 'business', 'entrepreneurship', 'economics', 'consulting', 'negotiation', 'public speaking', 'presentation'],
    science: ['research', 'analysis', 'experiment', 'theory', 'scientific', 'study', 'method', 'biology', 'chemistry', 'physics', 'mathematics', 'statistics', 'psychology', 'sociology', 'anthropology'],
    language: ['language', 'translation', 'linguistics', 'grammar', 'writing', 'speaking', 'listening', 'reading'],
    health: ['fitness', 'meditation', 'nutrition', 'diet', 'exercise', 'health', 'wellness', 'personal training', 'physical therapy', 'massage', 'mental health'],
    education: ['teaching', 'tutoring', 'education', 'learning', 'academic', 'curriculum', 'pedagogy', 'instruction', 'training', 'coaching'],
    trades: ['plumbing', 'electrical', 'welding', 'mechanic', 'automotive', 'construction', 'repair', 'maintenance', 'handyman', 'craftsmanship', 'woodworking'],
    sports: ['football', 'soccer', 'tennis', 'golf', 'swimming', 'running', 'cycling', 'baseball', 'hockey', 'volleyball', 'athletics', 'fitness training']
  };

  // Find domain with most matching keywords (longest match wins)
  let bestDomain = 'general';
  let bestScore = 0;

  for (const [domain, keywords] of Object.entries(domains)) {
    let score = 0;
    for (const keyword of keywords) {
      if (lowerSkill.includes(keyword)) {
        score += keyword.length; // Longer keywords get higher scores
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestDomain = domain;
    }
  }

  return bestDomain;
};

// Domain-specific prompt templates
const domainPrompts = {
  cooking: {
    expert: `Generate 5 EXPERT-LEVEL multiple-choice questions about "{skill}" ONLY. Focus exclusively on CULINARY and CUISINE topics: advanced cooking techniques, international cuisines, flavor profiles, ingredient pairing, food science, professional kitchen operations, culinary arts, regional specialties, cooking methods, food chemistry, and gastronomy. DO NOT include programming, technology, or unrelated topics. Each question must test deep culinary knowledge that only experienced chefs or culinary experts would know.`,
    advanced: `Generate 5 ADVANCED-LEVEL multiple-choice questions about "{skill}" ONLY. Focus exclusively on CULINARY and CUISINE topics: complex cooking techniques, recipe development, flavor pairing, international cuisines, kitchen management, food safety, cooking methods, ingredient selection, culinary traditions, and troubleshooting culinary problems. DO NOT include programming, technology, or unrelated topics.`,
    intermediate: `Generate 5 INTERMEDIATE-LEVEL multiple-choice questions about "{skill}" ONLY. Focus exclusively on CULINARY and CUISINE topics: fundamental cooking techniques, basic recipes, kitchen tools, cooking temperatures, food preparation, common cooking methods, ingredient handling, basic food safety, and introductory culinary concepts. DO NOT include programming, technology, or unrelated topics.`
  },
  accounting: {
    expert: `Generate 5 EXPERT-LEVEL multiple-choice questions about "{skill}" ONLY. Focus exclusively on accounting topics: advanced financial reporting, IFRS/GAAP standards, complex tax planning, forensic accounting, audit procedures, cost accounting systems, financial statement analysis, and regulatory compliance. DO NOT include cooking, programming, or unrelated topics. Each question must test deep accounting knowledge that only CPAs or senior accountants would know.`,
    advanced: `Generate 5 ADVANCED-LEVEL multiple-choice questions about "{skill}" ONLY. Focus exclusively on accounting topics: managerial accounting, cost analysis, budgeting, financial statement preparation, tax compliance, internal controls, audit procedures, and accounting software. DO NOT include cooking, programming, or unrelated topics.`,
    intermediate: `Generate 5 INTERMEDIATE-LEVEL multiple-choice questions about "{skill}" ONLY. Focus exclusively on accounting topics: basic bookkeeping, debits/credits, financial statements, payroll, accounts payable/receivable, basic tax concepts, and accounting principles. DO NOT include cooking, programming, or unrelated topics.`
  },
  technical: {
    expert: `Generate 5 EXPERT-LEVEL multiple-choice questions about "{skill}" ONLY. Focus exclusively on technical/programming topics: advanced concepts, performance optimization, security, architecture, best practices, system design, and complex problem-solving. Include code snippets or technical scenarios. DO NOT include cooking, accounting, or non-technical topics.`,
    advanced: `Generate 5 ADVANCED-LEVEL multiple-choice questions about "{skill}" ONLY. Focus exclusively on technical/programming topics: intermediate to advanced concepts, practical implementation, problem-solving, real-world applications, and development patterns. Include relevant code examples. DO NOT include cooking, accounting, or non-technical topics.`,
    intermediate: `Generate 5 INTERMEDIATE-LEVEL multiple-choice questions about "{skill}" ONLY. Focus exclusively on technical/programming topics: core concepts, basic implementation, common patterns, fundamental knowledge, and introductory programming concepts. Include simple code examples. DO NOT include cooking, accounting, or non-technical topics.`
  },
  general: {
    expert: `Generate 5 EXPERT-LEVEL multiple-choice questions about "{skill}". Focus on advanced knowledge, professional expertise, complex problem-solving, and industry best practices. Include challenging scenarios that test deep understanding.`,
    advanced: `Generate 5 ADVANCED-LEVEL multiple-choice questions about "{skill}". Focus on intermediate knowledge, practical applications, and solid understanding of core concepts. Include realistic scenarios.`,
    intermediate: `Generate 5 INTERMEDIATE-LEVEL multiple-choice questions about "{skill}". Focus on fundamental knowledge, basic concepts, and essential understanding. Include clear examples.`
  }
};

const createDomainSpecificPrompt = (skill, difficulty, count) => {
  const domain = detectSkillDomain(skill);
  const basePrompt = domainPrompts[domain]?.[difficulty] || domainPrompts.general[difficulty];

  return basePrompt + `

CRITICAL REQUIREMENTS:
1. Generate exactly ${count} questions about "${skill}"
2. Each question must have 4 options (A, B, C, D)
3. Include exactly 1 correct answer per question
4. Questions must be specific to ${skill}, not generic
5. Include relevant context, scenarios, or examples where appropriate
6. CRITICAL: For technical skills, INCLUDE CODE SNIPPETS in a 'codeSnippet' field
7. CRITICAL: For code-based questions, INCLUDE EXPECTED OUTPUT in an 'expectedOutput' field
8. Ensure questions test actual knowledge, not trivia
9. Make questions challenging but fair for ${difficulty} level

FORMAT REQUIREMENTS:
- Return valid JSON array
- Each question object must have: question, options (array of 4 strings), correctAnswerIndex (0-3)
- Optional: codeSnippet field for context, examples, or scenarios

Generate questions that demonstrate expertise in creating assessments for ${skill}.`;
};

const quizPrompt = PromptTemplate.fromTemplate(`Generate exactly {count} multiple-choice questions about {skill} at {difficulty} level.

Requirements:
- Each question must have exactly 4 options
- Only ONE correct answer per question
- Return valid JSON array with question objects
- Each object must have: question, options (array of 4 strings), correctAnswerIndex (0-3)
- Questions must be relevant to {skill}
- Difficulty: {difficulty}

Generate {count} questions:`);

// Validation helper function for scenario-based questions
function validateAndRepairQuestion(question, index) {
  try {
    // Handle new scenario-based format
    if (question.scenario && question.question_type) {
      // Convert scenario-based format to frontend format
      const fullQuestion = question.scenario + '\n\n' + question.question;
      const options = question.options || [];
      const correctAnswer = question.correctAnswer || '';

      // Find correct answer index
      let correctAnswerIndex = 0;
      if (correctAnswer.startsWith('Option ')) {
        const optionLetter = correctAnswer.split(' ')[1];
        correctAnswerIndex = optionLetter.charCodeAt(0) - 'A'.charCodeAt(0);
      }

      // Ensure correctAnswerIndex is valid
      correctAnswerIndex = Math.max(0, Math.min(3, correctAnswerIndex));

      return {
        question: fullQuestion,
        codeSnippet: '', // Scenario is embedded in question
        options: options,
        correctAnswerIndex: correctAnswerIndex
      };
    }

    // Fallback for old format
    const normalizedQuestion = {
      question: question.question?.trim() || '',
      codeSnippet: question.codeSnippet?.trim() || '',
      options: (question.options || []).map(opt => opt.trim()).filter(opt => opt.length > 0),
      correctAnswerIndex: typeof question.correctAnswerIndex === 'number' ? question.correctAnswerIndex : parseInt(question.correctAnswerIndex) || 0
    };

    // Validate basic structure
    if (!normalizedQuestion.question) {
      throw new Error(`Question ${index + 1}: Empty question text`);
    }

    if (normalizedQuestion.options.length !== 4) {
      throw new Error(`Question ${index + 1}: Must have exactly 4 options`);
    }

    // Validate correctAnswerIndex
    if (normalizedQuestion.correctAnswerIndex < 0 || normalizedQuestion.correctAnswerIndex > 3) {
      console.warn(`Question ${index + 1}: Invalid correctAnswerIndex, defaulting to 0`);
      normalizedQuestion.correctAnswerIndex = 0;
    }

    // Ensure all options are unique
    const uniqueOptions = [...new Set(normalizedQuestion.options)];
    if (uniqueOptions.length !== normalizedQuestion.options.length) {
      console.warn(`Question ${index + 1}: Duplicate options detected`);
    }

    return normalizedQuestion;
  } catch (error) {
    console.error(`Error validating question ${index + 1}:`, error);

    // Return a safe default question
    return {
      question: `Question ${index + 1}: What is the correct approach for this scenario?`,
      codeSnippet: '',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswerIndex: 0
    };
  }
}

// Find closest match for auto-repair
function findClosestMatch(target, options) {
  const targetLower = target.toLowerCase();

  // Exact match (case-insensitive)
  const exactMatch = options.find(opt => opt.toLowerCase() === targetLower);
  if (exactMatch) return exactMatch;

  // Contains match
  const containsMatch = options.find(opt =>
    opt.toLowerCase().includes(targetLower) || targetLower.includes(opt.toLowerCase())
  );
  if (containsMatch) return containsMatch;

  // Levenshtein distance for fuzzy matching
  let bestMatch = null;
  let bestScore = Infinity;

  for (const option of options) {
    const score = levenshteinDistance(targetLower, option.toLowerCase());
    if (score < bestScore && score <= 3) { // Allow max 3 character differences
      bestScore = score;
      bestMatch = option;
    }
  }

  return bestMatch;
}

// Simple Levenshtein distance implementation
function levenshteinDistance(str1, str2) {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator
      );
    }
  }

  return matrix[str2.length][str1.length];
}

export const generateQuiz = async (
  skill,
  difficulty,
  count = 10
) => {
  const startTime = Date.now();

  try {
    // Check cache first
    const cachedQuestions = getCachedQuiz(skill, difficulty, count);
    if (cachedQuestions) {
      console.log(`Quiz generated in ${Date.now() - startTime}ms (cached)`);
      return cachedQuestions;
    }

    console.log(`Using unified skill assessment engine for ${skill} (${difficulty})`);
    const assessmentQuiz = await generateSkillAssessmentQuiz(skill, difficulty, count);

    // Convert assessment quiz format to frontend format
    const questions = assessmentQuiz.questions.map(q => {
      // Convert options object to array
      const optionsArray = [q.options.A, q.options.B, q.options.C, q.options.D];

      // Find correct answer index
      const correctAnswerIndex = q.correctAnswer.charCodeAt(0) - 'A'.charCodeAt(0);

      return {
        question: q.question,
        codeSnippet: q.codeSnippet || '', 
        expectedOutput: q.expectedOutput || '', 
        options: optionsArray,
        correctAnswerIndex: correctAnswerIndex
      };
    });

    // Cache the results
    setCachedQuiz(skill, difficulty, count, questions);

    const generationTime = Date.now() - startTime;
    console.log(`Unified quiz generated in ${generationTime}ms`);
    return questions;

  } catch (error) {
    console.error('Quiz generation error:', error);
    throw new Error(`Failed to generate quiz: ${error.message}`);
  }
};
