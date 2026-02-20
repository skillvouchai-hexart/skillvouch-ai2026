
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

async function migrate() {
    try {
        console.log('Adding missing columns to users table...');

        const connection = await pool.getConnection();

        try {
            // Check if columns exist first to avoid errors
            const [columns] = await connection.query(`SHOW COLUMNS FROM users LIKE 'learning_hours'`);

            if (columns.length === 0) {
                console.log('Adding learning_hours column...');
                await connection.query(`ALTER TABLE users ADD COLUMN learning_hours INT DEFAULT 0`);
            } else {
                console.log('learning_hours column already exists.');
            }

            const [columns2] = await connection.query(`SHOW COLUMNS FROM users LIKE 'weekly_activity'`);
            if (columns2.length === 0) {
                console.log('Adding weekly_activity column...');
                await connection.query(`ALTER TABLE users ADD COLUMN weekly_activity INT DEFAULT 0`);
            } else {
                console.log('weekly_activity column already exists.');
            }

            console.log('Migration completed successfully!');
        } finally {
            connection.release();
        }

        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
