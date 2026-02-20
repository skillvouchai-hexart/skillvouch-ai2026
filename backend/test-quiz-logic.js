
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

        const fs = await import('fs/promises');
        const path = await import('path');
        const outputPath = path.resolve('backend/generated-quiz-sample.json');
        await fs.writeFile(outputPath, JSON.stringify(quiz, null, 2));
        console.log(`\nFull quiz saved to: ${outputPath}`);

        process.exit(0);
    } catch (error) {
        console.error('Quiz test failed:', error);
        process.exit(1);
    }
}

testQuiz();
