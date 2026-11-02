// Instant WhatsApp alert to the site owner (CallMeBot) + log for the daily report.
// Env: CALLMEBOT_APIKEY (required for WhatsApp), CALLMEBOT_PHONE (optional, default 966546904384)
const { sendWhatsApp } = require('./_lib/wa');
const store = require('./_lib/store');

const hits = new Map();
const clip = (s, n) => String(s == null ? '' : s).replace(/[\r\n]+/g, ' ').trim().slice(0, n);

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ ok: false });

  const ip = String(req.headers['x-forwarded-for'] || 'x').split(',')[0].trim();
  const now = Date.now(); const arr = (hits.get(ip) || []).filter(t => now - t < 10 * 60 * 1000); arr.push(now); hits.set(ip, arr);
  if (arr.length > 5) return res.status(429).json({ ok: false });

  let b = req.body; if (typeof b === 'string') { try { b = JSON.parse(b); } catch (e) { b = {}; } }
  b = b || {};
  const v = { type: b.type === 'contact' ? 'contact' : 'demo', name: clip(b.name, 60), email: clip(b.email, 80), company: clip(b.company, 60), phone: clip(b.phone, 25), message: clip(b.message, 300), lang: clip(b.lang, 5) || 'en', ts: now };
  if (v.name.length < 2) return res.status(400).json({ ok: false });

  await store.log('visitors', v);

  const title = v.type === 'contact' ? '📩 New demo request (contact form)' : '🚀 New demo visitor';
  const text = [`*${title} — SaleGen AI*`, `👤 ${v.name}`, v.email && `✉️ ${v.email}`, v.company && `🏢 ${v.company}`, v.phone && `📱 ${v.phone}`, v.message && `💬 ${v.message}`, `🌐 ${v.lang}`].filter(Boolean).join('\n');
  const r = await sendWhatsApp(text);
  return res.status(200).json({ ok: r.ok });
};
