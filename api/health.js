// Setup check (no visitor data): is storage connected, is WhatsApp configured, is an AI key present?
const store = require('./_lib/store');
module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  let redis = false, chatsToday = null;
  try { redis = (await store.cmd('PING')) === 'PONG'; if (redis) chatsToday = await store.cmd('LLEN', 'chats:' + store.dayKey()); } catch (e) {}
  res.status(200).json({ redis, chatsToday, whatsapp: !!process.env.CALLMEBOT_APIKEY, ai: !!(process.env.GEMINI_API_KEY || process.env.GROQ_API_KEY), cronSecret: !!process.env.CRON_SECRET });
};
