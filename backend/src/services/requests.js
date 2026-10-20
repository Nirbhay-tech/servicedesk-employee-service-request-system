const { pool } = require('../db');
const slaHours = { low: 72, medium: 48, high: 24, urgent: 4 };
function requestNumber() { return `SR-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2,6).toUpperCase()}`; }
async function createRequest(userId, data) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const due = new Date(Date.now() + slaHours[data.priority] * 3600000);
    const result = await client.query(`INSERT INTO requests(request_number,requester_id,category,title,description,priority,sla_due_at) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *`, [requestNumber(), userId, data.category, data.title, data.description, data.priority, due]);
    const row = result.rows[0];
    await client.query('INSERT INTO request_activity(request_id,actor_id,action,details) VALUES($1,$2,$3,$4)', [row.id,userId,'created',JSON.stringify({status:row.status,priority:row.priority,category:row.category})]);
    await client.query('COMMIT'); return row;
  } catch(e) { await client.query('ROLLBACK'); throw e; } finally { client.release(); }
}
module.exports = { createRequest, slaHours };
