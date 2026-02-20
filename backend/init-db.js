
import mysql from 'mysql2/promise';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { pool } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

async function initDB() {
    try {
        console.log('Reading schema file...');
        const schemaPath = path.join(__dirname, 'sql', 'schema.sql');
        const schema = await fs.readFile(schemaPath, 'utf8');

        // Split by semicolon and filter empty statements
        const queries = schema
            .split(';')
            .map(q => q.trim())
            .filter(q => q.length > 0);

        console.log(`Found ${queries.length} queries to execute.`);

        const connection = await pool.getConnection();

        try {
            for (const query of queries) {
                console.log(`Executing query: ${query.substring(0, 50)}...`);
                await connection.query(query);
            }
            console.log('Database initialization completed successfully!');
        } finally {
            connection.release();
        }

        process.exit(0);
    } catch (error) {
        console.error('Database initialization failed:', error);
        process.exit(1);
    }
}

initDB();
