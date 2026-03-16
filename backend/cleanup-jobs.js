import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

const mncCompanies = ['Google', 'Amazon Web Services (AWS)', 'Microsoft', 'Meta', 'Apple'];

async function cleanup() {
  const [rows] = await pool.execute('SELECT id, company FROM jobs');
  console.log('Total jobs in DB:', rows.length);

  const toDelete = rows.filter(r => !mncCompanies.includes(r.company)).map(r => r.id);
  console.log('Non-MNC jobs to delete:', toDelete.length);

  if (toDelete.length > 0) {
    const placeholders = toDelete.map(() => '?').join(',');
    await pool.execute('DELETE FROM jobs WHERE id IN (' + placeholders + ')', toDelete);
    console.log('Deleted', toDelete.length, 'non-MNC jobs');
  }

  const [remaining] = await pool.execute('SELECT company, title FROM jobs');
  console.log('Remaining jobs:');
  remaining.forEach(j => console.log('  -', j.company, ':', j.title));
  process.exit(0);
}

cleanup();
