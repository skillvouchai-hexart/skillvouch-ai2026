/**
 * cleanup-db.js – One-time script to remove test users and personal data.
 *
 * Usage:
 *   cd backend
 *   node cleanup-db.js
 *
 * This will permanently delete:
 *   - All users with email 'test@example.com'
 *   - All users named 'Nitin Kumar Reddy Meruva'
 *   - Orphaned exchange_requests, messages, and exchange_feedback for those users
 *
 * ⚠️  Run this ONCE against the production database, then delete this file.
 */

import { pool } from './db.js';

async function cleanupDatabase() {
    console.log('🧹 Starting database cleanup...\n');

    try {
        // 1. Find the users we're going to delete so we can log them
        const [testUsers] = await pool.execute(
            `SELECT id, name, email FROM users 
       WHERE email = 'test@example.com'
          OR name LIKE '%Nitin Kumar Reddy Meruva%'`
        );

        if (testUsers.length === 0) {
            console.log('✅ No matching users found – database is already clean.');
            process.exit(0);
        }

        console.log(`Found ${testUsers.length} user(s) to remove:`);
        testUsers.forEach(u => console.log(`  - [${u.id}] ${u.name} (${u.email})`));
        console.log('');

        const userIds = testUsers.map(u => u.id);
        const placeholders = userIds.map(() => '?').join(', ');

        // 2. Delete related exchange_feedback
        const [feedbackResult] = await pool.execute(
            `DELETE FROM exchange_feedback
       WHERE from_user_id IN (${placeholders})
          OR to_user_id   IN (${placeholders})`,
            [...userIds, ...userIds]
        );
        console.log(`🗑️  Deleted ${feedbackResult.affectedRows} feedback row(s)`);

        // 3. Delete related messages
        const [msgResult] = await pool.execute(
            `DELETE FROM messages
       WHERE sender_id   IN (${placeholders})
          OR receiver_id IN (${placeholders})`,
            [...userIds, ...userIds]
        );
        console.log(`🗑️  Deleted ${msgResult.affectedRows} message(s)`);

        // 4. Delete related exchange_requests
        const [reqResult] = await pool.execute(
            `DELETE FROM exchange_requests
       WHERE from_user_id IN (${placeholders})
          OR to_user_id   IN (${placeholders})`,
            [...userIds, ...userIds]
        );
        console.log(`🗑️  Deleted ${reqResult.affectedRows} exchange request(s)`);

        // 5. Delete related skill_quizzes
        const [quizResult] = await pool.execute(
            `DELETE FROM skill_quizzes WHERE user_id IN (${placeholders})`,
            userIds
        ).catch(() => [{ affectedRows: 0 }]); // table may not exist
        console.log(`🗑️  Deleted ${quizResult.affectedRows} quiz record(s)`);

        // 6. Finally, delete the users themselves
        const [userResult] = await pool.execute(
            `DELETE FROM users WHERE id IN (${placeholders})`,
            userIds
        );
        console.log(`🗑️  Deleted ${userResult.affectedRows} user(s)`);

        console.log('\n✅ Database cleanup complete!');
        console.log('⚠️  You can now delete this script (backend/cleanup-db.js).');

        process.exit(0);
    } catch (error) {
        console.error('\n❌ Cleanup failed:', error.message);
        console.error(error);
        process.exit(1);
    }
}

cleanupDatabase();
