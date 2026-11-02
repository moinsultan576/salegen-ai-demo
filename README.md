# SaleGen AI — Live Demo (AI Sales Agent + CRM)

Interactive portfolio demo: landing page, CRM dashboard, and AI Sales Agent chat.
Languages: English / Arabic / Urdu (with full RTL support).

## Pages
- `/#/` — Landing page
- `/#/login` — Demo login (credentials pre-filled)
- `/#/app/dashboard` — CRM (Leads, Pipeline, Deals, Email, Tasks, Calendar, Reports, Settings)
- `/#/agent/chat` — AI Sales Agent console (live AI replies)

Pure HTML/CSS/JS with no build step, plus one Vercel serverless function (`api/chat.js`) for real AI replies. Data is stored in the visitor's browser (localStorage) and resets automatically after 12 hours.

## Deploy on Vercel
1. Create a new GitHub repo (e.g. `salegen-ai-demo`) and upload all files in this folder.
2. On vercel.com, choose Add New → Project, then import the repo.
3. Framework Preset: **Other**. Leave the build command empty. Click Deploy.

## Contact form (important — one-time activation)
The "Request Demo" form sends leads to **moinseoagency@gmail.com** via FormSubmit.co (free, no account).
After deploying, submit the form once yourself. FormSubmit will email you an **activation link**. Click it once, and every future request will arrive in your inbox.
Visitors also get a "Send on WhatsApp" button that opens a chat with +966 54 690 4384 with their details pre-filled.

## After deploying
- In `index.html`, replace `assets/og.jpg` in the `og:image` tag with the full URL (e.g. `https://your-project.vercel.app/assets/og.jpg`) so WhatsApp/LinkedIn show a preview image.
- In Vercel → Project → Analytics, click Enable to see visitor stats.

## Real AI replies — FREE setup (recommended: Google Gemini)
The chat works without any key (built-in replies). For real AI answers:

**Option A — Google Gemini (free, no credit card)**
1. Go to https://aistudio.google.com → sign in with Gmail → **Get API key** → **Create API key**.
2. Vercel → your project → **Settings → Environment Variables** → add `GEMINI_API_KEY` = your key.
3. **Deployments → ⋯ → Redeploy**.

**Option B — Groq (free, no credit card)** — also a good backup
1. https://console.groq.com → sign up → **API Keys → Create API Key**.
2. Add `GROQ_API_KEY` in Vercel the same way and redeploy.

Tip: add BOTH keys. If Gemini hits its free limit, the agent automatically uses Groq.
Paid alternatives (optional): `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`.
Optional model overrides: `GEMINI_MODEL`, `GROQ_MODEL`.

The AI uses the **Knowledge Base** page as its facts, replies in the customer's language (EN/AR/UR), and can book meetings or send proposals.
Protection: max 25 messages per visitor per 10 minutes, input length limits, and a role-locked system prompt. If every provider fails, the demo falls back to built-in replies.
Note: free-tier prompts may be used by the provider to improve their models — fine for a public demo, don't use free keys for confidential client data.

## Tests
```
cd tests
npm install
npx playwright install chromium
npm test
```

## WhatsApp alerts for new leads (free, optional)
Get a WhatsApp message on your own number whenever someone starts a demo or sends the contact form.
1. On your phone open https://www.callmebot.com/blog/free-api-whatsapp-messages/ and save the CallMeBot number shown there.
2. Send it this WhatsApp message: `I allow callmebot to send me messages` — it replies with your API key.
3. Vercel → Settings → Environment Variables → add `CALLMEBOT_APIKEY` = that key (optional `CALLMEBOT_PHONE` = 966546904384).
4. Redeploy. Email alerts keep working as before.

## Daily WhatsApp report at 9 PM (Saudi time)
Every night at 21:00 (Asia/Riyadh) you get a WhatsApp summary: new demo visitors, contact requests, every AI chat and an AI-written summary with hot leads.
Needs (one time):
1. Vercel → project → **Storage** → Create → **Upstash for Redis** (free) → connect to this project. Vercel adds the database keys automatically.
2. `CALLMEBOT_APIKEY` set (see WhatsApp alerts above).
3. Optional: add `CRON_SECRET` (any long random text) to run the report manually: `/api/daily-report?key=YOUR_SECRET&dry=1` shows a preview without sending.
Chats are kept for 8 days, then deleted automatically. Visitors are told on the demo form that their details and demo chats are shared with you.
