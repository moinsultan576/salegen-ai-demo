// Send WhatsApp text to the owner via CallMeBot (free, personal use). Splits long texts.
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function sendWhatsApp(text) {
  const key = process.env.CALLMEBOT_APIKEY;
  if (!key) return { ok: false, reason: 'CALLMEBOT_APIKEY not set' };
  const phone = (process.env.CALLMEBOT_PHONE || '966546904384').replace(/\D/g, '');
  const parts = [];
  let cur = '';
  for (const line of String(text).split('\n')) {
    if ((cur + '\n' + line).length > 1400) { parts.push(cur); cur = line; } else cur = cur ? cur + '\n' + line : line;
  }
  if (cur) parts.push(cur);
  let ok = true;
  for (let i = 0; i < parts.length; i++) {
    const body = parts.length > 1 ? `(${i + 1}/${parts.length})\n` + parts[i] : parts[i];
    try {
      const r = await fetch('https://api.callmebot.com/whatsapp.php?phone=' + phone + '&text=' + encodeURIComponent(body) + '&apikey=' + encodeURIComponent(key));
      ok = ok && r.ok;
    } catch (e) { ok = false; }
    if (i < parts.length - 1) await sleep(2500);
  }
  return { ok, parts: parts.length };
}
module.exports = { sendWhatsApp };
