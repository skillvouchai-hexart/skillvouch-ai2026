
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env relative to this file
dotenv.config({ path: path.resolve(__dirname, '.env') });

console.log('Environment loaded:');
console.log('DB Host:', process.env.MYSQL_HOST);
console.log('DB User:', process.env.MYSQL_USER);
console.log('DB Database:', process.env.MYSQL_DATABASE);

async function testConnection() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
            port: process.env.MYSQL_PORT || 3306
        });

        console.log('Successfully connected to the database!');
        await connection.end();
    } catch (error) {
        console.error('Failed to connect to the database:', error);
    }
}

testConnection();
