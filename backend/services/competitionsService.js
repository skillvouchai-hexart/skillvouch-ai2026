import fetch from 'node-fetch';

/**
 * Service to handle real-time discovery and verification of competitions using AI.
 */
export const competitionsService = {
    /**
     * Categorizes and verifies competition data using Mistral AI.
     */
    verifyCompetition: async (compData) => {
        const mistralApiKey = process.env.MISTRAL_API_KEY;
        if (!mistralApiKey) return { ...compData, is_verified: 0 };

        const prompt = `As an AI Competition Auditor, verify the following competition details.
        
        Details:
        - Title: ${compData.title}
        - Platform: ${compData.platform}
        - Prize: ${compData.prize}
        - Description: ${compData.description}
        
        Criteria for Verification (is_verified = 1):
        1. Platform is well-known (Devpost, Unstop, LeetCode, HackerRank, MLH, Kaggle, etc.)
        2. Prize details are clear/realistic.
        3. Description indicates a legitimate organized challenge.
        
        Return ONLY valid JSON:
        {
            "is_verified": 1 or 0,
            "reason": "short explanation"
        }`;

        try {
            const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${mistralApiKey}`
                },
                body: JSON.stringify({
                    model: 'mistral-small',
                    messages: [{ role: 'user', content: prompt }],
                    temperature: 0.1
                })
            });

            if (!response.ok) return { ...compData, is_verified: 0 };

            const data = await response.json();
            const content = data.choices[0]?.message?.content;
            const parsed = JSON.parse(content.replace(/```json\n?|```/g, '').trim());

            return {
                ...compData,
                is_verified: parsed.is_verified || 0,
                verification_reason: parsed.reason
            };
        } catch (error) {
            console.error('AI Verification Error:', error);
            return { ...compData, is_verified: 0 };
        }
    },

    /**
     * Seeds the database with real-world competitions discovered recently.
     * In a production app, this would be a web scraper results processor.
     */
    getSeedData: () => [
        {
            id: 'unstop-coding-2026',
            title: 'Coding Challenge - 2026',
            platform: 'Unstop',
            description: 'Online programming hackathon focusing on DSA and algorithms.',
            link: 'https://unstop.com',
            prize: 'Certificates & Rewards',
            type: 'CODING',
            deadline: new Date('2026-03-25').getTime()
        },
        {
            id: 'kalinga-hacks-2026',
            title: 'KU Hackathon 2026',
            platform: 'Unstop',
            description: 'A 48-hour hackathon for building innovative web and mobile solutions.',
            link: 'https://unstop.com',
            prize: '₹50,000',
            type: 'HACKATHON',
            deadline: new Date('2026-04-10').getTime()
        },
        {
            id: 'leetcode-weekly-493',
            title: 'LeetCode Weekly Contest 493',
            platform: 'LeetCode',
            description: 'Weekly competitive programming contest.',
            link: 'https://leetcode.com/contest',
            prize: 'Ranking Points',
            type: 'CODING',
            deadline: new Date('2026-03-21').getTime()
        },
        {
            id: 'gemini-live-2026',
            title: 'Gemini Live Agent Challenge',
            platform: 'Devpost',
            description: 'Build sophisticated agentic AI workflows using Google Gemini.',
            link: 'https://devpost.com',
            prize: '$80,000',
            type: 'HACKATHON',
            deadline: new Date('2026-03-16').getTime()
        }
    ]
};
