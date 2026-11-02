// Tiny Upstash Redis REST client (no dependencies).
// Works with the env vars Vercel adds when you connect "Upstash for Redis" (Storage tab):
//   KV_REST_API_URL + KV_REST_API_TOKEN   or   UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN
const URL_ = () => process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = () => process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

const enabled = () => !!(URL_() && TOKEN());

async function cmd(...args) {
  if (!enabled()) return null;
  const r = await fetch(URL_(), { method: 'POST', headers: { Authorization: 'Bearer ' + TOKEN(), 'Content-Type': 'application/json' }, body: JSON.stringify(args) });
  if (!r.ok) throw new Error('redis ' + r.status);
  const j = await r.json();
  return j.result;
}

// Day key in Saudi time (UTC+3) so the 9 PM report covers the local day.
const dayKey = (d = new Date()) => new Date(d.getTime() + 3 * 3600 * 1000).toISOString().slice(0, 10);

async function log(list, obj) {
  if (!enabled()) return;
  const key = list + ':' + dayKey();
  try { await cmd('RPUSH', key, JSON.stringify(obj)); await cmd('EXPIRE', key, 60 * 60 * 24 * 8); } catch (e) { console.error('store', e.message); }
}

async function read(list, day) {
  const res = await cmd('LRANGE', list + ':' + day, 0, -1);
  return (res || []).map(s => { try { return JSON.parse(s); } catch (e) { return null; } }).filter(Boolean);
}

module.exports = { enabled, cmd, log, read, dayKey };
