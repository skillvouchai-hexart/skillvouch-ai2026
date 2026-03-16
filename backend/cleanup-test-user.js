
import { query } from './db.js';

async function cleanup() {
    console.log('--- Cleaning up ALL test data ---');
    const emails = ['test@example.com', 'other@example.com'];

    try {
        for (const email of emails) {
            const users = await query('SELECT id FROM users WHERE email = ?', [email]);
            if (users.length === 0) continue;
            const userId = users[0].id;

            console.log(`Cleaning data for ${email} (${userId})...`);
            await query('DELETE FROM quiz_attempts WHERE user_id = ?', [userId]);
            await query('DELETE FROM skill_quizzes WHERE user_id = ?', [userId]);
            await query('DELETE FROM exchange_feedback WHERE from_user_id = ? OR to_user_id = ?', [userId, userId]);
            await query('DELETE FROM exchange_requests WHERE from_user_id = ? OR to_user_id = ?', [userId, userId]);
            await query('DELETE FROM messages WHERE sender_id = ? OR receiver_id = ?', [userId, userId]);
            await query('DELETE FROM users WHERE id = ?', [userId]);
        }

        console.log('✅ Cleanup completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Cleanup failed:', error.message);
        process.exit(1);
    }
}

cleanup();
