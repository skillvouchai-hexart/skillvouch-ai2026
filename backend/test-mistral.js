
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

const API_KEY = process.env.MISTRAL_API_KEY;

if (!API_KEY) {
    console.error('❌ MISTRAL_API_KEY is not defined in .env file');
    process.exit(1);
}

console.log('✅ Found MISTRAL_API_KEY:', API_KEY.substring(0, 5) + '...');

async function testMistral() {
    console.log('🔄 Testing Mistral API connection...');
    try {
        const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: 'mistral-small',
                messages: [
                    { role: 'user', content: 'Say "Mistral is working!" if you can hear me.' }
                ],
                max_tokens: 50
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        console.log('✅ Mistral API Response:', data.choices[0].message.content);
        console.log('🎉 Mistral AI is configured and working correctly!');

    } catch (error) {
        console.error('❌ Mistral API Test Failed:', error.message);
    }
}

testMistral();
