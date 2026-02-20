
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

async function seedUser() {
    try {
        console.log('Seeding test user...');

        // Check if user exists
        const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', ['test@example.com']);

        if (rows.length > 0) {
            console.log('Test user already exists:', rows[0].email);
        } else {
            const userId = 'user_' + Date.now();
            const testUser = {
                id: userId,
                name: 'Test User',
                email: 'test@example.com',
                password: 'password', // Plaintext for demo/test
                avatar: `https://ui-avatars.com/api/?background=random&name=Test+User`,
                bio: 'I am a test user.',
                skills_known: JSON.stringify([]),
                skills_to_learn: JSON.stringify([]),
                rating: 5.0
            };

            await pool.execute(
                `INSERT INTO users (id, name, email, password, avatar, bio, skills_known, skills_to_learn, rating)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [testUser.id, testUser.name, testUser.email, testUser.password, testUser.avatar, testUser.bio, testUser.skills_known, testUser.skills_to_learn, testUser.rating]
            );
            console.log('Test user created successfully!');
            console.log(`Email: ${testUser.email}`);
            console.log(`Password: ${testUser.password}`);
        }

        // Verify retrieval
        const [verifyRows] = await pool.execute('SELECT * FROM users LIMIT 1');
        console.log('Verification: Found', verifyRows.length, 'users in database.');

        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
}

seedUser();
