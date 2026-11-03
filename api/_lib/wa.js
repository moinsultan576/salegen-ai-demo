// Send WhatsApp text to the owner. Two providers, whichever is configured:
//  1) GREEN-API (free Developer plan, links a WhatsApp number by QR):
//       GREENAPI_ID_INSTANCE, GREENAPI_TOKEN, optional GREENAPI_URL (default https://api.green-api.com)
//  2) CallMeBot (free, personal use): CALLMEBOT_APIKEY
// Owner number: OWNER_WHATSAPP (or CALLMEBOT_PHONE), default 966546904384. Long texts are split.
const sleep = ms => new Promise(r => setTimeout(r, ms));

function provider() {
  if (process.env.GREENAPI_ID_INSTANCE && process.env.GREENAPI_TOKEN) return 'greenapi';
  if (process.env.CALLMEBOT_APIKEY) return 'callmebot';
  return null;
}

async function sendPart(p, phone, body) {
  if (p === 'greenapi') {
    const base = (process.env.GREENAPI_URL || 'https://api.green-api.com').replace(/\/+$/, '');
    const id = String(process.env.GREENAPI_ID_INSTANCE).trim();
    const r = await fetch(`${base}/waInstance${id}/sendMessage/${String(process.env.GREENAPI_TOKEN).trim()}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chatId: phone + '@c.us', message: body })
    });
    return r.ok;
  }
  const r = await fetch('https://api.callmebot.com/whatsapp.php?phone=' + phone + '&text=' + encodeURIComponent(body) + '&apikey=' + encodeURIComponent(process.env.CALLMEBOT_APIKEY));
  return r.ok;
}

async function sendWhatsApp(text) {
  const p = provider();
  if (!p) return { ok: false, reason: 'No WhatsApp provider configured (GREENAPI_* or CALLMEBOT_APIKEY)' };
  const phone = (process.env.OWNER_WHATSAPP || process.env.CALLMEBOT_PHONE || '966546904384').replace(/\D/g, '');
  const parts = [];
  let cur = '';
  for (const line of String(text).split('\n')) {
    if ((cur + '\n' + line).length > 1400) { parts.push(cur); cur = line; } else cur = cur ? cur + '\n' + line : line;
  }
  if (cur) parts.push(cur);
  let ok = true;
  for (let i = 0; i < parts.length; i++) {
    const body = parts.length > 1 ? `(${i + 1}/${parts.length})\n` + parts[i] : parts[i];
    try { ok = (await sendPart(p, phone, body)) && ok; } catch (e) { ok = false; }
    if (i < parts.length - 1) await sleep(2500);
  }
  return { ok, parts: parts.length, provider: p };
}
module.exports = { sendWhatsApp, provider };
