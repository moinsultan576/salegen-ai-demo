// WhatsApp alert to the site owner when someone starts a demo or sends the contact form.
// Free service: CallMeBot (https://www.callmebot.com/blog/free-api-whatsapp-messages/)
// Vercel → Settings → Environment Variables:
//   CALLMEBOT_APIKEY = the key CallMeBot sends you on WhatsApp
//   CALLMEBOT_PHONE  = your number with country code, no + (optional, default 966546904384)
// Without CALLMEBOT_APIKEY this endpoint does nothing (email alerts keep working).

const hits = new Map();
const clip = (s, n) => String(s == null ? '' : s).replace(/[\r\n]+/g, ' ').trim().slice(0, n);

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ ok: false });
  const key = process.env.CALLMEBOT_APIKEY;
  if (!key) return res.status(200).json({ ok: false, reason: 'not configured' });

  const ip = String(req.headers['x-forwarded-for'] || 'x').split(',')[0].trim();
  const now = Date.now(); const arr = (hits.get(ip) || []).filter(t => now - t < 10 * 60 * 1000); arr.push(now); hits.set(ip, arr);
  if (arr.length > 5) return res.status(429).json({ ok: false });

  let b = req.body; if (typeof b === 'string') { try { b = JSON.parse(b); } catch (e) { b = {}; } }
  b = b || {};
  const name = clip(b.name, 60), email = clip(b.email, 80);
  if (name.length < 2) return res.status(400).json({ ok: false });

  const title = b.type === 'contact' ? '📩 New demo request (contact form)' : '🚀 New demo visitor';
  const lines = [
    `*${title} — SaleGen AI*`,
    `👤 ${name}`,
    email && `✉️ ${email}`,
    clip(b.company, 60) && `🏢 ${clip(b.company, 60)}`,
    clip(b.phone, 25) && `📱 ${clip(b.phone, 25)}`,
    clip(b.message, 300) && `💬 ${clip(b.message, 300)}`,
    `🌐 ${clip(b.lang, 5) || 'en'}`
  ].filter(Boolean);

  const phone = (process.env.CALLMEBOT_PHONE || '966546904384').replace(/\D/g, '');
  const url = 'https://api.callmebot.com/whatsapp.php?phone=' + phone + '&text=' + encodeURIComponent(lines.join('\n')) + '&apikey=' + encodeURIComponent(key);
  try {
    const r = await fetch(url);
    return res.status(200).json({ ok: r.ok });
  } catch (e) {
    console.error('callmebot', e.message);
    return res.status(200).json({ ok: false });
  }
};
