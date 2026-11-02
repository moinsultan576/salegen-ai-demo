// Daily WhatsApp report at 9 PM Saudi time (Vercel Cron, see vercel.json).
// Needs: Upstash Redis connected (Storage tab) + CALLMEBOT_APIKEY. Uses GEMINI_API_KEY / GROQ_API_KEY for the AI summary.
// Manual run: GET /api/daily-report?key=<CRON_SECRET>   (&day=YYYY-MM-DD optional, &dry=1 to preview without sending)
const store = require('./_lib/store');
const { sendWhatsApp } = require('./_lib/wa');

async function summarize(transcript) {
  const prompt = `You are writing a short daily sales report for the owner of an AI sales-agent demo website. Write in simple Roman Urdu (Urdu written in English letters) with English business words.
Give: 1) 3-6 bullet points on what visitors asked about and what the AI answered, 2) which visitors look like HOT leads (asked prices, demo, meeting, proposal) and why, 3) one suggested follow-up action per hot lead. Max 900 characters. No markdown headings, use • bullets.

TRANSCRIPTS:
${transcript.slice(0, 12000)}`;
  try {
    if (process.env.GEMINI_API_KEY) {
      for (const model of ['gemini-3.5-flash', 'gemini-flash-latest', 'gemini-2.5-flash-lite']) {
        const r = await fetch('https://generativelanguage.googleapis.com/v1beta/models/' + model + ':generateContent', { method: 'POST', headers: { 'content-type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY },
          body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { maxOutputTokens: 1200, temperature: 0.4 } }) });
        if (!r.ok) continue;
        const j = await r.json();
        const t = (j.candidates?.[0]?.content?.parts || []).filter(p => !p.thought).map(p => p.text || '').join('').trim();
        if (t) return t;
      }
    }
    if (process.env.GROQ_API_KEY) {
      const r = await fetch('https://api.groq.com/openai/v1/chat/completions', { method: 'POST', headers: { 'content-type': 'application/json', authorization: 'Bearer ' + process.env.GROQ_API_KEY },
        body: JSON.stringify({ model: process.env.GROQ_MODEL || 'openai/gpt-oss-120b', max_tokens: 900, messages: [{ role: 'user', content: prompt }] }) });
      if (r.ok) { const j = await r.json(); const t = j.choices?.[0]?.message?.content; if (t) return t.trim(); }
    }
  } catch (e) { console.error('summary', e.message); }
  return '';
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  const isCron = /vercel-cron/i.test(req.headers['user-agent'] || '');
  const secret = process.env.CRON_SECRET;
  const auth = (req.headers.authorization || '') === 'Bearer ' + secret || (req.query && req.query.key && req.query.key === secret);
  if (!isCron && !(secret && auth)) return res.status(401).json({ ok: false });
  if (!store.enabled()) return res.status(200).json({ ok: false, reason: 'Upstash Redis not connected' });

  const day = (req.query && /^\d{4}-\d{2}-\d{2}$/.test(req.query.day || '') && req.query.day) || store.dayKey();
  const visitors = await store.read('visitors', day);
  const chats = await store.read('chats', day);

  const demo = visitors.filter(v => v.type === 'demo'), contact = visitors.filter(v => v.type === 'contact');
  const byVisitor = {};
  for (const c of chats) { const k = (c.v && (c.v.email || c.v.name)) || 'anonymous'; (byVisitor[k] = byVisitor[k] || { v: c.v || {}, msgs: [] }).msgs.push(c); }
  const convs = Object.values(byVisitor);

  const lines = [`📊 *SaleGen AI — Daily report (${day})*`, '',
    `🚀 New demo visitors: *${demo.length}*`, `📩 Contact requests: *${contact.length}*`, `💬 AI chats: *${chats.length}* messages from *${convs.length}* visitor(s)`];
  if (visitors.length) {
    lines.push('', '*Visitors:*');
    visitors.slice(0, 15).forEach(v => lines.push(`• ${v.name}${v.company ? ' (' + v.company + ')' : ''} — ${v.email || '-'}${v.phone ? ' — ' + v.phone : ''}${v.type === 'contact' ? ' 📩' : ''}`));
    if (visitors.length > 15) lines.push(`… +${visitors.length - 15} more`);
  }
  if (convs.length) {
    const transcript = convs.map(c => `VISITOR: ${c.v.name || 'unknown'} (${c.v.company || ''}, ${c.v.email || ''})\n` + c.msgs.map(m => `- [${m.lead || ''}] customer: ${m.q}\n  AI: ${m.a || '(no reply)'}${m.action && m.action !== 'none' ? ' [' + m.action + ']' : ''}`).join('\n')).join('\n\n');
    const sum = await summarize(transcript);
    lines.push('', '*Chats:*');
    convs.slice(0, 10).forEach(c => { const last = c.msgs[c.msgs.length - 1]; lines.push(`• ${c.v.name || 'Visitor'}: ${c.msgs.length} msg — last: "${String(last.q).slice(0, 70)}"`); });
    if (sum) lines.push('', '🤖 *AI summary:*', sum);
  }
  if (!visitors.length && !chats.length) lines.push('', 'Aaj koi naya visitor ya chat nahi aayi.');
  const text = lines.join('\n');

  if (req.query && req.query.dry) return res.status(200).json({ ok: true, dry: true, text });
  const r = await sendWhatsApp(text);
  return res.status(200).json({ ok: r.ok, parts: r.parts, reason: r.reason });
};
