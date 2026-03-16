import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'skillvouch',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function query(sql, params) {
  const [results] = await pool.execute(sql, params);
  return results;
}

const generateId = () => 'job_' + Date.now() + Math.random().toString(36).substring(2, 9);

const seedJobs = [
  {
    title: 'Software Engineer, Early Career',
    company: 'Google',
    location: 'Bangalore, India',
    salary: '₹24,000,000/yr',
    type: 'Full-time',
    description: 'Google is and always will be an engineering company. We hire people with a broad set of technical skills who are ready to take on some of technology\'s greatest challenges.',
    required_skills: 'C++, Java, Python, Data Structures',
    link: 'https://careers.google.com/jobs/results/'
  },
  {
    title: 'Cloud Support Associate',
    company: 'Amazon Web Services (AWS)',
    location: 'Remote, India',
    salary: '₹12,00,000/yr',
    type: 'Full-time',
    description: 'Do you want to play a key role in the future of the cloud? AWS is looking for Cloud Support Associates to help our customers with Linux/Networking problems.',
    required_skills: 'Linux, Networking, AWS Essentials, Troubleshooting',
    link: 'https://amazon.jobs/'
  },
  {
    title: 'Software Engineering Intern',
    company: 'Microsoft',
    location: 'Hyderabad, India',
    salary: 'Paid Internship',
    type: 'Internship',
    description: 'Empower every person and every organization on the planet to achieve more. Join our internship program to work on impactful projects with global reach.',
    required_skills: 'C#, C++, Problem Solving, Algorithms',
    link: 'https://careers.microsoft.com/'
  },
  {
    title: 'Data Scientist II',
    company: 'Meta',
    location: 'London, UK (Hybrid)',
    salary: '£90,000/yr',
    type: 'Full-time',
    description: 'At Meta, we are developing the future of connection. You will work on analyzing vast social networks to improve our core algorithms.',
    required_skills: 'SQL, Python, R, Machine Learning, Statistics',
    link: 'https://www.metacareers.com/'
  },
  {
    title: 'Hardware Engineering Intern',
    company: 'Apple',
    location: 'Cupertino, CA',
    salary: '$8,000/mo',
    type: 'Internship',
    description: 'Join the team building the world\'s most iconic devices. You will work alongside top hardware engineers on next-generation architectures.',
    required_skills: 'Electrical Engineering, Verilog, Digital Design, C',
    link: 'https://jobs.apple.com/'
  }
];

async function seed() {
  console.log('Clearing existing jobs...');
  try {
    await query('DELETE FROM jobs');

    console.log('Starting MNC job seeder...');
    for (const job of seedJobs) {
      const id = generateId();
      const hashInput = `${job.title}|${job.company}|${job.location}`.toLowerCase().replace(/\s+/g, '');
      const jobHash = Buffer.from(hashInput).toString('base64').slice(0, 32);

      await query(
        `INSERT IGNORE INTO jobs 
         (id, title, description, company, location, salary, type, category, required_skills, link, created_at, is_verified, sector, role, experience_level, is_remote, job_hash) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id, job.title, job.description, job.company, job.location, job.salary, job.type, 
          'Private', job.required_skills, job.link, Date.now(), 
          1, 'Technology', 'Engineering', job.type === 'Internship' ? 'Entry-level' : 'Mid-level', job.location.includes('Remote') ? 1 : 0, jobHash
        ]
      );
      console.log(`Seeded: ${job.title} at ${job.company}`);
    }
    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
