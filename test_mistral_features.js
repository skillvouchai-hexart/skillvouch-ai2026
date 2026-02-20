
// Native fetch is available in Node.js 18+

const BASE_URL = 'http://localhost:3000/api';

async function testQuizGeneration() {
    console.log('Testing Quiz Generation...');
    try {
        const response = await fetch(`${BASE_URL}/quiz/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ skill: 'JavaScript', difficulty: 'beginner' })
        });
        const data = await response.json();
        if (response.ok) {
            console.log('✅ Quiz Generation Success');
            console.log(`Generated ${data.questions?.length} questions.`);

            const questionsWithSnippets = data.questions.filter(q => q.codeSnippet && q.codeSnippet.length > 0);
            console.log(`Questions with code snippets: ${questionsWithSnippets.length}/${data.questions.length}`);

            if (questionsWithSnippets.length > 0) {
                console.log('Sample Code Snippet:', questionsWithSnippets[0].codeSnippet.substring(0, 50) + '...');
            } else {
                console.warn('⚠️ No code snippets found in generated quiz.');
            }
        } else {
            console.error('❌ Quiz Generation Failed:', data);
        }
    } catch (error) {
        console.error('❌ Quiz Generation Error:', error.message);
    }
    console.log('---');
}

async function testSkillSuggestion() {
    console.log('Testing Skill Suggestion...');
    try {
        const response = await fetch(`${BASE_URL}/skills/suggest`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ currentSkills: ['HTML', 'CSS'], currentGoals: ['Become Frontend Dev'] })
        });
        const data = await response.json();
        if (response.ok) {
            console.log('✅ Skill Suggestion Success');
            console.log('Suggested Skills:', data.skills);
        } else {
            console.error('❌ Skill Suggestion Failed:', data);
        }
    } catch (error) {
        console.error('❌ Skill Suggestion Error:', error.message);
    }
    console.log('---');
}

async function testRoadmapGeneration() {
    console.log('Testing Roadmap Generation...');
    try {
        const response = await fetch(`${BASE_URL}/roadmap/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ skillName: 'React' })
        });
        const data = await response.json();
        if (response.ok) {
            console.log('✅ Roadmap Generation Success');
            console.log(`Generated ${data.roadmap?.length} steps.`);
        } else {
            console.error('❌ Roadmap Generation Failed:', data);
        }
    } catch (error) {
        console.error('❌ Roadmap Generation Error:', error.message);
    }
    console.log('---');
}

async function runTests() {
    await testQuizGeneration();
    await testSkillSuggestion();
    await testRoadmapGeneration();
}

runTests();
