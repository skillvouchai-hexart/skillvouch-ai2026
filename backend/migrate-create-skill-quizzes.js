
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
        console.log('Creating skill_quizzes table...');

        const connection = await pool.getConnection();

        try {
            await connection.query(`
        CREATE TABLE IF NOT EXISTS skill_quizzes (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id VARCHAR(64) NOT NULL,
          skill_name VARCHAR(255) NOT NULL,
          difficulty VARCHAR(50) NOT NULL,
          questions JSON NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          UNIQUE KEY unique_user_skill (user_id, skill_name, difficulty),
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `);
            console.log('skill_quizzes table created successfully!');
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
