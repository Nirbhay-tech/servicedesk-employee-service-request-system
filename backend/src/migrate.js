require('dotenv').config();
const fs = require('node:fs'); const path = require('node:path'); const { pool } = require('./db');
(async () => { try { const sql = fs.readFileSync(path.join(__dirname, '../migrations/001_init.sql'), 'utf8'); await pool.query(sql); console.log('Database migration completed.'); } catch (e) { console.error('Migration failed:', e.message); process.exitCode = 1; } finally { await pool.end(); } })();
