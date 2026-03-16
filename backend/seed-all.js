import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { competitionsService } from './services/competitionsService.js';
import { researchService } from './services/researchService.js';
import { ideaService } from './services/ideaService.js';
dotenv.config();

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'skillvouch',
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0
});

async function q(sql, params) {
  const [results] = await pool.execute(sql, params);
  return results;
}

async function seed() {
  try {
    // 1. Reseed Competitions
    console.log('--- Reseeding Competitions ---');
    await q('DELETE FROM competitions');
    const compData = competitionsService.getSeedData();
    for (const comp of compData) {
      await q(
        'INSERT INTO competitions (id, title, platform, description, link, prize, deadline, type, is_verified, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [comp.id, comp.title, comp.platform, comp.description || '', comp.link, comp.prize || '', comp.deadline || null, comp.type, 1, Date.now(), Date.now()]
      );
    }
    console.log(`Seeded ${compData.length} competitions`);

    // 2. Reseed Research Papers
    console.log('--- Reseeding Research Papers ---');
    await q('DELETE FROM research_papers');
    const paperData = researchService.getIEEESeedData();
    for (const paper of paperData) {
      await q(
        'INSERT INTO research_papers (id, title, publisher, conference, description, link, deadline, topic, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [paper.id, paper.title, paper.publisher, paper.conference || '', paper.description || '', paper.link, paper.deadline || null, paper.topic || '', Date.now(), Date.now()]
      );
    }
    console.log(`Seeded ${paperData.length} research papers`);

    // 3. Reseed Ideas
    console.log('--- Reseeding Ideas ---');
    await q('DELETE FROM ideas');
    const targetUserId = '41535aa1-dac4-45f1-ad42-9a925d472acd';
    const ideaData = ideaService.getSeedData(targetUserId);
    for (const idea of ideaData) {
      await q(
        'INSERT INTO ideas (id, title, problem, solution, technologies, impact, contact_email, contact_phone, user_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [idea.id, idea.title, idea.problem, idea.solution, idea.technologies, idea.impact, idea.contact_email, idea.contact_phone, idea.user_id, Date.now(), Date.now()]
      );
    }
    console.log(`Seeded ${ideaData.length} ideas`);

    // Verify counts
    const [comps] = await pool.execute('SELECT count(*) as c FROM competitions');
    const [papers] = await pool.execute('SELECT count(*) as c FROM research_papers');
    const [ideas] = await pool.execute('SELECT count(*) as c FROM ideas');
    const [jobs] = await pool.execute('SELECT count(*) as c FROM jobs');

    console.log('\n=== Final Counts on Production DB ===');
    console.log(`Competitions: ${comps[0].c}`);
    console.log(`Research Papers: ${papers[0].c}`);
    console.log(`Ideas: ${ideas[0].c}`);
    console.log(`Jobs: ${jobs[0].c}`);
    console.log('All done!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
