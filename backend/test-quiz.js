
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, 'backend/.env') });

import { generateSkillAssessmentQuiz } from './ai/skillAssessmentEngine.js';

async function testQuiz() {
    try {
        const skill = 'JavaScript';
        const level = 'intermediate';

        console.log(`Generating quiz for ${skill} (${level})...`);

        // Test the assessment engine directly
        const quiz = await generateSkillAssessmentQuiz(skill, level, 10);

        console.log('Quiz generated successfully!');
        console.log(`Total questions: ${quiz.questions.length}`);

        // Check for code snippets and expected output
        const questionsWithCode = quiz.questions.filter(q => q.codeSnippet && q.codeSnippet.length > 0);
        const questionsWithOutput = quiz.questions.filter(q => q.expectedOutput && q.expectedOutput.length > 0);

        console.log(`Questions with code snippets: ${questionsWithCode.length}`);
        console.log(`Questions with expected output: ${questionsWithOutput.length}`);

        if (questionsWithCode.length > 0) {
            console.log('\n--- Sample Question with Code ---');
            const sample = questionsWithCode[0];
            console.log('Q:', sample.question);
            console.log('Code:', sample.codeSnippet.substring(0, 100) + '...');
            if (sample.expectedOutput) {
                console.log('Expected Output:', sample.expectedOutput);
            } else {
                console.warn('⚠️ Missing expected output!');
            }
        } else {
            console.warn('⚠️ No code snippets found in generated quiz!');
        }

        process.exit(0);
    } catch (error) {
        console.error('Quiz test failed:', error);
        process.exit(1);
    }
}

testQuiz();
