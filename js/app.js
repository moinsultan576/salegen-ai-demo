/* ================= SaleGen AI — Live Demo App ================= */
(function () {
'use strict';
const T = window.I18N;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const store = {
  get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
  del(k) { try { localStorage.removeItem(k); } catch (e) {} }
};
let LANG = store.get('sg_lang') || 'en';
if (!T[LANG]) LANG = 'en';
function t(k, v) {
  let s = T[LANG][k]; if (s === undefined) s = T.en[k]; if (s === undefined) return k;
  if (v && typeof s === 'string') for (const x in v) s = s.split('{' + x + '}').join(v[x]);
  return s;
}
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = n => Math.round(n).toLocaleString('en-US');
const sar = v => LANG === 'en' ? 'SAR ' + fmt(v) : fmt(v) + (LANG === 'ar' ? ' ر.س' : ' ریال');
const NOW = () => Date.now();
const MIN = 60000, HR = 3600000, DAY = 86400000;
const OWNER = { email: 'moinseoagency@gmail.com', phone: '+966 54 690 4384', wa: '966546904384' };

/* ---------------- icons ---------------- */
const P = {
  home: '<path d="m3 10 9-7 9 7v10a2 2 0 0 1-2 2h-4v-7H9v7H5a2 2 0 0 1-2-2z"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  funnel: '<path d="M22 3H2l8 9.46V19l4 2v-8.54z"/>',
  layers: '<path d="m12 2 10 5-10 5L2 7z"/><path d="m2 17 10 5 10-5M2 12l10 5 10-5"/>',
  deals: '<circle cx="12" cy="8" r="6"/><path d="M15.5 13 17 22l-5-3-5 3 1.5-9"/>',
  wa: '<path d="M3 21l1.7-5A9 9 0 1 1 8 19.3z"/><path d="M9 9.5c.3 2.2 2.3 4.2 4.5 4.5l1-1.2 1.8.8-.4 1.6c-3.6.2-7-3.2-6.8-6.8l1.6-.4.8 1.8z"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
  checksq: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
  cal: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  calchk: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M9 16l2 2 4-4"/>',
  report: '<circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4-4h4M15 21v-4M19 21v-8"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
  moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  chev: '<path d="m6 9 6 6 6-6"/>', chevL: '<path d="m15 18-6-6 6-6"/>', chevR: '<path d="m9 18 6-6-6-6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  list: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M8 9h9M8 13h9M8 17h5"/>',
  dots: '<circle cx="5" cy="12" r="1.6" fill="currentColor"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/><circle cx="19" cy="12" r="1.6" fill="currentColor"/>',
  send: '<path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/>',
  clip: '<path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/>',
  smile: '<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>',
  edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8"/>',
  zap: '<path d="M13 2 3 14h9l-1 8 10-12h-9z"/>',
  history: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>',
  book: '<rect x="4" y="3" width="16" height="18" rx="3"/><path d="M9 3v6l2-1.5L13 9V3"/>',
  msg: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  chat: '<rect x="3" y="4" width="18" height="15" rx="3"/><path d="M8 10h.01M12 10h.01M16 10h.01"/>',
  trend: '<path d="m22 7-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/>',
  up: '<path d="M12 19V5M5 12l7-7 7 7"/>',
  target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9.5 12.5 11 14l3.5-3.5"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  trash: '<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  play: '<path d="M7 4l13 8-13 8z" fill="currentColor"/>',
  arrow: '<path d="M5 12h14M13 5l7 7-7 7"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  check2: '<path d="M18 6 7 17l-5-5"/><path d="m22 10-7.5 7.5L13 16"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
  bars: '<path d="M12 20V10M18 20V4M6 20v-4"/>',
  user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  usercheck: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="m16 11 2 2 4-4"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
  refresh: '<path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5"/>',
  insta: '<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
  spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
  store: '<path d="M3 9l1.5-5h15L21 9M3 9v11h18V9M3 9h18M9 20v-6h6v6"/>'
};
const ic = (n, c) => `<svg class="i ${c || ''}" viewBox="0 0 24 24">${P[n] || ''}</svg>`;
const WA = '<svg viewBox="0 0 24 24" fill="#fff"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.1-1.2l-.4-.2z"/></svg>';
const LI = '<svg viewBox="0 0 24 24" fill="#fff"><path d="M6.9 8.5H3.6V20h3.3zM5.2 3a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8zM20.4 13.4c0-3.1-1.7-5.1-4.4-5.1a3.8 3.8 0 0 0-3.4 1.9V8.5H9.4V20h3.3v-5.7c0-1.5.3-3 2.2-3s1.9 1.8 1.9 3.1V20h3.3z"/></svg>';
const LOGO = '<svg viewBox="0 0 48 48"><defs><linearGradient id="lgA" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8af57e"/><stop offset="1" stop-color="#12a04a"/></linearGradient></defs><path d="M24 3 42 13.5v21L24 45 6 34.5v-21z" fill="url(#lgA)"/><path d="M24 3 42 13.5 24 24 6 13.5z" fill="#c9f9a6" opacity=".45"/><path d="M31.5 17.5H22a4.2 4.2 0 0 0 0 8.4h4a4.2 4.2 0 0 1 0 8.4h-9.5" stroke="#04301a" stroke-width="3.8" fill="none" stroke-linecap="round"/></svg>';
const BOT = '<svg viewBox="0 0 64 64"><defs><radialGradient id="bg1"><stop offset="0" stop-color="#3ddc7e" stop-opacity=".45"/><stop offset="1" stop-color="#3ddc7e" stop-opacity="0"/></radialGradient></defs><circle cx="32" cy="30" r="30" fill="url(#bg1)"/><rect x="11" y="24" width="5" height="12" rx="2.5" fill="#3ddc7e"/><rect x="48" y="24" width="5" height="12" rx="2.5" fill="#3ddc7e"/><circle cx="32" cy="29" r="18" fill="#eef4f1"/><rect x="18" y="19" width="28" height="19" rx="9.5" fill="#0a1914"/><circle cx="26" cy="28" r="3.6" fill="#3ddc7e"/><circle cx="38" cy="28" r="3.6" fill="#3ddc7e"/><path d="M27.5 33.5q4.5 2.6 9 0" stroke="#3ddc7e" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M23 48h18l-2.5 10h-13z" fill="#eef4f1"/><circle cx="32" cy="53" r="2.2" fill="#3ddc7e"/></svg>';

/* ---------------- seed data ---------------- */
const SEED_LEADS = [
  ['l1','Ahmed Al-Shehri','أحمد الشهري','احمد الشہری','re_web','riyadh','new',5,'whatsapp','meta',24000,92,1],
  ['l2','Sara Khan','سارة خان','سارہ خان','ecom','jeddah','new',12,'linkedin','li',9500,74,0],
  ['l3','Bilal Ahmed','بلال أحمد','بلال احمد','rest','dammam','new',28,'facebook','meta',7800,61,0],
  ['l4','Noura Al-Otaibi','نورة العتيبي','نورہ العتیبی','clinic','riyadh','new',45,'website','web',15000,58,0],
  ['l5','Fatima Noor','فاطمة نور','فاطمہ نور','salon','jeddah','contacted',60,'instagram','meta',6500,70,0],
  ['l6','Usman Tariq','عثمان طارق','عثمان طارق','logi','riyadh','contacted',120,'whatsapp','wa',21000,81,1],
  ['l7','Maryam Ali','مريم علي','مریم علی','edu','jeddah','contacted',180,'website','web',12000,66,0],
  ['l8','Faisal Al-Harbi','فيصل الحربي','فیصل الحربی','car','riyadh','contacted',300,'facebook','meta',9000,55,0],
  ['l9','Khalid Al-Qahtani','خالد القحطاني','خالد القحطانی','cons','riyadh','qualified',240,'linkedin','li',38000,88,1],
  ['l10','Ayesha Malik','عائشة مالك','عائشہ ملک','fit','jeddah','qualified',300,'instagram','meta',8500,79,1],
  ['l11','Hassan Raza','حسن رضا','حسن رضا','it','dammam','qualified',1440,'website','web',16500,83,1],
  ['l12','Reem Al-Dosari','ريم الدوسري','ریم الدوسری','int','khobar','qualified',1600,'referral','wa',19000,77,1],
  ['l13','Omar Farooq','عمر فاروق','عمر فاروق','manu','riyadh','proposal',1440,'email','li',45000,90,1],
  ['l14','Zainab Fatima','زينب فاطمة','زینب فاطمہ','re','jeddah','proposal',1500,'whatsapp','meta',28000,86,1],
  ['l15','Ali Raza','علي رضا','علی رضا','dm','dammam','proposal',2880,'linkedin','li',14000,80,1],
  ['l16','Saad Al-Mutairi','سعد المطيري','سعد المطیری','hotel','makkah','proposal',3000,'email','wa',32000,84,1],
  ['l17','Rehman Dental','عيادة رحمن للأسنان','رحمان ڈینٹل','dental','jeddah','won',2880,'website','web',12500,95,1],
  ['l18','EduBridge','إيدو بريدج','ایجو برج','edu2','riyadh','won',4320,'linkedin','li',18500,93,1],
  ['l19','Future Homes','فيوتشر هومز','فیوچر ہومز','re','jeddah','won',4320,'whatsapp','meta',26000,96,1],
  ['l20','Al Noor Pharmacy','صيدلية النور','النور فارمیسی','pharm','riyadh','won',5760,'facebook','meta',8800,90,1]
];
const LIVE_POOL = [
  ['Majed Al-Zahrani','ماجد الزهراني','ماجد الزہرانی','cafe','jeddah','whatsapp','wa',6800],
  ['Hira Siddiqui','حراء صديقي','حرا صدیقی','salon','riyadh','instagram','meta',5400],
  ['Nasser Al-Ghamdi','ناصر الغامدي','ناصر الغامدی','auto','dammam','facebook','meta',9200],
  ['Lina Haddad','لينا حداد','لینا حداد','clinic','riyadh','website','web',17500],
  ['Imran Sheikh','عمران شيخ','عمران شیخ','ecom','jeddah','linkedin','li',11000]
];
const STAGES = ['new', 'contacted', 'qualified', 'proposal', 'won'];
const BASE_COL = { new: 642, contacted: 486, qualified: 328, proposal: 164, won: 86 };
const OCT = new Date(2026, 9, 1).getTime();

function phoneFor(i) { const n = String(1234567 + i * 7919).slice(-7); return '+966 5' + (i % 9) + ' ' + n.slice(0, 3) + ' ' + n.slice(3); }
function emailFor(name) { return name.toLowerCase().replace(/[^a-z ]/g, '').trim().replace(/\s+/g, '.') + '@example.com'; }

function seed() {
  const now = NOW();
  const leads = SEED_LEADS.map((r, i) => ({
    id: r[0], name: r[1], names: { ar: r[2], ur: r[3] }, ind: r[4], city: r[5], stage: r[6], ts: now - r[7] * MIN,
    src: r[8], camp: r[9], value: r[10], score: r[11], q: !!r[12], email: emailFor(r[1]), phone: phoneFor(i),
    created: i === 0 ? now - 5 * DAY : now - (((i * 37) % 27) + 2) * DAY, seed: true, seedWon: r[6] === 'won'
  }));
  leads[0].phone = '+966 50 123 4567'; leads[0].email = 'ahmed@example.com';
  const c = (id, lead, ch, mins, msgs, extra) => Object.assign({ id, lead, ch, ts: now - mins * MIN, msgs: msgs.map((m, j) => Object.assign({ ts: now - mins * MIN - (msgs.length - j) * 2 * MIN }, m)) }, extra || {});
  const convos = [
    c('c1', 'l1', 'whatsapp', 2, [{ d: 'in', k: 'm_a1' }, { d: 'out', k: 'm_a2', ai: 1 }, { d: 'in', k: 'm_a3' }, { d: 'out', k: 'm_a4', ai: 1 }], { preview: 'p_a', unread: true }),
    c('c2', 'l2', 'linkedin', 15, [{ d: 'in', k: 'm_sara' }]),
    c('c3', 'l6', 'avatar', 60, [{ d: 'in', k: 'm_usman' }]),
    c('c4', 'l5', 'instagram', 120, [{ d: 'in', k: 'm_fatima' }]),
    c('c5', 'l15', 'linkedin2', 180, [{ d: 'out', k: 'r_price', ai: 1 }, { d: 'in', k: 'm_ali' }]),
    c('c6', 'l9', 'whatsapp', 300, [{ d: 'in', k: 'm_khalid' }]),
    c('c7', 'l10', 'instagram', 420, [{ d: 'in', k: 'm_ayesha' }]),
    c('c8', 'l13', 'email', 1440, [{ d: 'in', k: 'm_omar' }]),
    c('c9', 'l14', 'whatsapp', 1500, [{ d: 'in', k: 'm_zainab' }])
  ];
  const d0 = new Date(); d0.setHours(0, 0, 0, 0); const day = n => d0.getTime() + n * DAY;
  const meetings = [
    { id: 'm1', k: 'mt_1', ts: day(0) + 11 * HR }, { id: 'm2', k: 'mt_2', ts: day(1) + 14 * HR },
    { id: 'm3', k: 'mt_3', ts: day(2) + 10 * HR }, { id: 'm4', k: 'mt_4', ts: day(3) + 12.5 * HR },
    { id: 'm5', k: 'mt_5', ts: day(7) + 16 * HR }, { id: 'm6', k: 'mt_6', ts: day(-1) + 9.5 * HR },
    { id: 'm7', k: 'mt_6', ts: day(6) + 9.5 * HR }, { id: 'm8', k: 'mt_4', ts: day(-4) + 13 * HR }, { id: 'm9', k: 'mt_3', ts: day(10) + 15 * HR }
  ];
  const tasks = [
    { id: 't1', k: 'tk_1', p: 'high', due: day(0), done: false, lead: 'l9' }, { id: 't2', k: 'tk_2', p: 'high', due: day(0), done: false, lead: 'l13' },
    { id: 't3', k: 'tk_3', p: 'med', due: day(1), done: false, lead: 'l2' }, { id: 't4', k: 'tk_4', p: 'med', due: day(1), done: false, lead: 'l5' },
    { id: 't5', k: 'tk_5', p: 'low', due: day(3), done: false }, { id: 't6', k: 'tk_6', p: 'low', due: day(-1), done: true }
  ];
  const campaigns = [
    { id: 'e1', k: 'e1', st: 'active', sent: 4820, open: 62, click: 18, rep: 214 }, { id: 'e2', k: 'e2', st: 'active', sent: 1260, open: 71, click: 24, rep: 96 },
    { id: 'e3', k: 'e3', st: 'draft', sent: 0, open: 0, click: 0, rep: 0 }, { id: 'e4', k: 'e4', st: 'paused', sent: 980, open: 44, click: 9, rep: 31 },
    { id: 'e5', k: 'e5', st: 'active', sent: 3150, open: 39, click: 12, rep: 77 }
  ];
  const notifs = [
    { k: 'n_4', ic: 'wa', c: 'g-green', ts: now - 5 * MIN, read: false }, { k: 'n_1', ic: 'usercheck', c: 'g-blue', ts: now - 4 * HR, read: false },
    { k: 'n_2', ic: 'calchk', c: 'g-purple', ts: now - 6 * HR, read: false }, { k: 'n_3', ic: 'deals', c: 'g-orange', ts: now - 3 * DAY, read: true },
    { k: 'n_5', ic: 'mail', c: 'g-teal', ts: now - 4 * DAY, read: true }
  ];
  const kb = [{ id: 'k1', k: 'kb1', ic: 'store' }, { id: 'k2', k: 'kb2', ic: 'zap' }, { id: 'k3', k: 'kb3', ic: 'clock' }, { id: 'k4', k: 'kb4', ic: 'msg' }];
  const autos = [
    { id: 'a1', k: 'a1', on: true, runs: 1842, ic: 'wa' }, { id: 'a2', k: 'a2', on: true, runs: 936, ic: 'refresh' }, { id: 'a3', k: 'a3', on: true, runs: 2486, ic: 'target' },
    { id: 'a4', k: 'a4', on: true, runs: 412, ic: 'bell' }, { id: 'a5', k: 'a5', on: true, runs: 2486, ic: 'link' }, { id: 'a6', k: 'a6', on: false, runs: 58, ic: 'user' }
  ];
  return { v: 3, seededAt: now, leads, convos, meetings, tasks, campaigns, notifs, kb, autos, live: 0, theme: 'dark',
    prefs: { n1: true, n2: true, n3: false, agName: 'Sara', tone: 'tone1', hours: true, hand: true }, integ: { wa: true, meta: true, gmail: true, hub: false, li: false } };
}
let S = store.get('sg_state');
if (!S || S.v !== 3 || NOW() - S.seededAt > 12 * HR) { S = seed(); }
S.convos.forEach(c => { c.pending = false; });
const save = () => store.set('sg_state', S);
save();

/* ---------------- ui state ---------------- */
const ui = { range: 'oct', view: 'kanban', camp: 'all', dd: null, kmenu: null, q: '', lq: '', lstage: 'all', tf: 'all', cal: null,
  chat: 'c1', ctab: 'all', cq: '', sim: 'customer', typing: null, side: false };

/* ---------------- helpers ---------------- */
const lead = id => S.leads.find(l => l.id === id);
const nm = l => (l.names && l.names[LANG]) || l.name;
const ind = l => l.ind ? t('ind_' + l.ind) : (l.biz || '');
const city = l => t('city_' + l.city);
const RTF = {};
function rtf(n, unit) {
  try { const loc = LANG === 'ar' ? 'ar-u-nu-latn' : LANG === 'ur' ? 'ur-u-nu-latn' : 'en'; RTF[loc] = RTF[loc] || new Intl.RelativeTimeFormat(loc, { numeric: 'auto' }); return RTF[loc].format(-n, unit); } catch (e) { return null; }
}
function ago(ts, short) {
  if (!short && LANG !== 'en') { const d = Math.max(0, NOW() - ts), m = Math.floor(d / MIN), h = Math.floor(d / HR), dd = Math.floor(d / DAY); const r = m < 1 ? null : m < 60 ? rtf(m, 'minute') : h < 24 ? rtf(h, 'hour') : rtf(dd, 'day'); if (m < 1) return t('t_now'); if (r) return r; }
  const d = Math.max(0, NOW() - ts), m = Math.floor(d / MIN), h = Math.floor(d / HR), dd = Math.floor(d / DAY);
  const p = short ? 's_' : 't_';
  if (m < 1) return short ? t('s_min', { n: 1 }) : t('t_now');
  if (m < 60) return t(p + 'min', { n: m });
  if (h < 24) return h === 1 ? t(p + 'hr1') : t(p + 'hr', { n: h });
  return dd === 1 ? t(p + 'day1') : t(p + 'day', { n: dd });
}
function fdate(ts) {
  const d = new Date(ts), M = t('months')[d.getMonth()];
  return LANG === 'en' ? `${M.slice(0, 3)} ${d.getDate()}, ${d.getFullYear()}` : `${d.getDate()} ${M} ${d.getFullYear()}`;
}
function ftime(ts) {
  const d = new Date(ts); let h = d.getHours(); const m = String(d.getMinutes()).padStart(2, '0'); const pm = h >= 12; h = h % 12 || 12;
  const ap = LANG === 'en' ? (pm ? 'PM' : 'AM') : LANG === 'ar' ? (pm ? 'م' : 'ص') : (pm ? 'شام' : 'صبح');
  return `${h}:${m} ${ap}`;
}
function fdue(ts) {
  const d0 = new Date(); d0.setHours(0, 0, 0, 0); const diff = Math.round((ts - d0.getTime()) / DAY);
  return diff === 0 ? t('today') : diff === 1 ? t('tomorrow') : fdate(ts);
}
const GR = ['#22c55e,#15803d', '#60a5fa,#2563eb', '#f472b6,#db2777', '#fbbf24,#d97706', '#a78bfa,#7c3aed', '#2dd4bf,#0f766e', '#fb7185,#e11d48', '#38bdf8,#0369a1'];
function av(l, size) {
  const name = typeof l === 'string' ? l : l.name;
  let h = 0; for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const ini = name.replace(/^(Al|El)\s/i, '').split(/[\s-]+/).filter(w => w && !/^al$/i.test(w)).slice(0, 2).map(w => w[0]).join('').toUpperCase();
  return `<span class="av ${size || ''}" style="background:linear-gradient(135deg,${GR[h % GR.length]})">${esc(ini)}</span>`;
}
function langSw() {
  return `<div class="langsw">${['en', 'ar', 'ur'].map(l => `<button class="${l === LANG ? 'on' : ''}" data-act="lang" data-v="${l}">${l === 'en' ? 'EN' : l === 'ar' ? 'عربي' : 'اردو'}</button>`).join('')}</div>`;
}
function toast(msg, icon, cls) {
  const el = document.createElement('div'); el.className = 'toast';
  el.innerHTML = `<span class="ic ${cls || 'g-green'}">${icon === 'wa' ? WA.replace('<svg', '<svg width="18" height="18"') : ic(icon || 'check')}</span><div>${msg}</div>`;
  $('#toasts').appendChild(el); setTimeout(() => { el.style.transition = '.3s'; el.style.opacity = 0; setTimeout(() => el.remove(), 300); }, 3800);
}
function notify(k, vars, icn, cls) { S.notifs.unshift({ text: t(k, vars), ic: icn, c: cls, ts: NOW(), read: false }); }
function modal(title, body, foot, wide) {
  if (!$('#modal').innerHTML) lastFocus = document.activeElement;
  $('#modal').innerHTML = `<div class="ov" data-act="ovclose"><div role="dialog" aria-modal="true" aria-label="${esc(String(title).replace(/<[^>]*>/g, ''))}" class="modal ${wide ? 'wide' : ''} ${(isApp() && S.theme === 'light') || location.hash.startsWith('#/agent') ? 'light' : ''}"><div class="modal-h"><h3>${title}</h3><button class="ibtn" data-act="close" aria-label="${t('close')}">${ic('x')}</button></div><div class="modal-b">${body}</div>${foot ? `<div class="modal-f">${foot}</div>` : ''}</div></div>`;
  const f = $('#modal input:not([type=hidden])'); if (f) setTimeout(() => f.focus(), 50);
}
let lastFocus = null;
const closeModal = () => { if (!$('#modal').innerHTML) return; $('#modal').innerHTML = ''; if (lastFocus && document.body.contains(lastFocus)) try { lastFocus.focus(); } catch (er) {} lastFocus = null; };
const isApp = () => location.hash.startsWith('#/app');
const route = () => location.hash.replace(/^#\/?/, '').split('/');

/* ---------------- metrics ---------------- */
const RANGES = { oct: { v: [2486, 1624, 826, 186, 124800], d: [32, 28, 45, 38, 52] }, sep: { v: [2104, 1381, 612, 148, 98400], d: [24, 19, 31, 27, 36] }, q: { v: [6410, 4120, 2056, 472, 318600], d: [41, 36, 52, 44, 61] } };
function metrics() {
  const r = RANGES[ui.range];
  const seedQ = SEED_LEADS.filter(x => ['qualified', 'proposal', 'won'].includes(x[6])).length;
  const added = Math.max(0, S.leads.filter(l => !l.seed).length);
  const q = S.leads.filter(l => ['qualified', 'proposal', 'won'].includes(l.stage)).length - seedQ;
  const won = S.leads.filter(l => l.stage === 'won');
  const wonNew = won.filter(l => !l.seedWon), wonLost = S.leads.filter(l => l.seedWon && l.stage !== 'won');
  const meet = S.meetings.filter(m => m.added).length;
  const rev = wonNew.reduce((a, l) => a + (+l.value || 0), 0) - wonLost.reduce((a, l) => a + (+l.value || 0), 0);
  return { v: [r.v[0] + added, r.v[1] + q, r.v[2] + meet, r.v[3] + wonNew.length - wonLost.length, r.v[4] + rev], d: r.d };
}
const colCount = s => BASE_COL[s] - SEED_LEADS.filter(x => x[6] === s).length + S.leads.filter(l => l.stage === s).length;

/* ================= LANDING ================= */
function landing() {
  const feats = [['f1', 'g-orange', 'target'], ['f2', 'g-blue', 'usercheck'], ['f3', 'g-green', 'refresh'], ['f4', 'g-teal', 'calchk'], ['f5', 'g-purple', 'layers'], ['f6', 'g-red', 'bars'], ['f7', 'g-blue', 'globe'], ['f8', 'g-red', 'deals']];
  const FL = { p1f: ['#/agent/chat', '#/agent/settings', '#/app/leads', '#/app/pipeline', null], p2f: ['#/agent/history', '#/agent/settings', '#/app/leads', '#/app/calendar', '#/app/reports'], p3f: ['#/agent/history', '#/agent/kb', '#/app/leads', '#/app/email', null] };
  const plan = (n, price, f, pop) => `<div class="plan ${pop ? 'pop' : ''}">${pop ? `<span class="tag">${t('popular')}</span>` : ''}<h3>${t(n)}</h3><div class="price">${LANG === 'en' ? 'SAR ' + price : price}<small> ${LANG === 'en' ? '' : (LANG === 'ar' ? 'ريال' : 'ریال')}${t('mo')}</small></div><ul>${t(f).split('|').map((x, i) => FL[f][i] ? `<li><a class="fl" href="${FL[f][i]}" title="${t('tryDemo')}">${ic('check')}<span>${x}</span><em>${t('tryDemo')} ↗</em></a></li>` : `<li>${ic('check')}<span>${x}</span></li>`).join('')}</ul><a class="btn ${pop ? 'btn-lime' : ''}" href="#/login">${t('choose')}</a></div>`;
  const CSI = { 1: ['home', 'g-green'], 2: ['calchk', 'g-blue'], 3: ['book', 'g-purple'] };
  const cs = n => `<div class="case"><span class="ex">${t('csEx')}</span><div class="k"><span class="csi ${CSI[n][1]}">${ic(CSI[n][0])}</span><div><b>${t('cs' + n + 'n')}</b><div style="color:#64748b;font-size:13px">${t('cs' + n + 'i')}</div></div></div><div class="big">${t('cs' + n + 'm')}</div><p>${t('cs' + n + 'd')}</p></div>`;
  const bars = (h, line) => `<svg class="bars" viewBox="0 0 200 70" preserveAspectRatio="none"><defs><linearGradient id="bgr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5df08d"/><stop offset="1" stop-color="#1a7a43"/></linearGradient></defs>${h.map((v, i) => `<rect x="${70 + i * 22}" y="${70 - v}" width="14" height="${v}" rx="2" fill="url(#bgr)"/>`).join('')}${line ? '<path d="M2 66 C40 60 60 58 90 50 S140 30 190 6" stroke="#7ff79f" stroke-width="2.5" fill="none"/><path d="M180 4l12-2-4 11" stroke="#7ff79f" stroke-width="2.5" fill="none"/>' : '<path d="M2 66 L60 62" stroke="#3a8f5c" stroke-width="2" fill="none"/>'}</svg>`;
  return `<div class="lp" id="top">
  <header class="lp-hero hero">
    <nav class="nav"><a class="logo" href="#/">${LOGO}SaleGen AI</a>
      <div class="nav-links"><a data-act="scroll" data-to="top">${t('home')}</a><a data-act="scroll" data-to="features">${t('features')}</a><a data-act="scroll" data-to="how">${t('how')}</a><a data-act="scroll" data-to="pricing">${t('pricing')}</a><a data-act="scroll" data-to="cases">${t('cases')}</a><a data-act="scroll" data-to="contact">${t('contact')}</a></div>
      <div class="nav-right">${langSw()}<a class="btn btn-lime" href="#/login">${t('getStarted')} ${ic('arrow', 'flip')}</a></div></nav>
    <div class="hero-in">
      <div class="hero-copy">
        <span class="pill"><span class="dot">${ic('zap')}</span>${t('badge')}</span>
        <h1>${t('hx1')}<br>${t('hx2')}<br>${t('hx3')}<span class="g">${t('hx4')}</span></h1>
        <p class="sub">${t('sub')}</p>
        <div class="hero-cta"><a class="btn btn-lime" href="#/login">${t('freeDemo')} ${ic('arrow', 'flip')}</a><button class="btn btn-ghost" data-act="video"><span class="pc">${ic('play')}</span>${t('watchVideo')}</button></div>
        <div class="ticks">${['tk1', 'tk2', 'tk3', 'tk4'].map(k => `<span><i class="tick">${ic('check')}</i>${t(k)}</span>`).join('')}</div>
      </div>
      <div class="hero-art" dir="ltr">
        <svg class="h-chart" viewBox="0 0 400 300" aria-hidden="true"><defs><linearGradient id="hcg" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#3ddc7e" stop-opacity="0"/><stop offset="1" stop-color="#5dfb95"/></linearGradient></defs><path d="M10 270 L90 210 L150 236 L230 150 L280 172 L370 50" stroke="url(#hcg)" stroke-width="14" fill="none" stroke-linejoin="round" stroke-linecap="round"/><path d="M335 44 L378 40 L372 84" stroke="#5dfb95" stroke-width="14" fill="none" stroke-linejoin="round" stroke-linecap="round"/></svg>
        <img class="h-person" src="assets/person.webp" alt="AI sales consultant" width="957" height="1000" fetchpriority="high">
        <img class="h-robot" src="assets/robot.svg" alt="" width="320" height="440">
        <div class="ficon fi-wa">${WA}</div>
        <div class="ficon fi-li">${LI}</div>
        <div class="ficon fi-ml">${ic('mail')}</div>
        <div class="fcard fc1" dir="${t('dir')}"><span class="ic" style="background:#22c55e">${WA.replace('<svg', '<svg width="28" height="28"')}</span><div><div class="t">${t('fcNew')}</div><div class="d">${t('fcNewMsg')}</div></div><span class="now">${t('now')}</span></div>
        <div class="fcard fc2" dir="${t('dir')}"><span class="ic" style="background:#0b1a14;border-radius:50%;width:50px;height:50px">${BOT.replace('<svg', '<svg width="46" height="46"')}</span><div><div class="t">${t('fcAi')}</div><div class="d" style="white-space:pre-line">${t('fcAiMsg')}</div></div><span class="now">${t('now')}</span></div>
        <div class="fcard fc3" dir="${t('dir')}"><span class="ic" style="background:linear-gradient(135deg,#8b5cf6,#6d28d9);color:#fff">${ic('calchk')}</span><div><div class="t">${t('fcMeet')}</div><div class="d">${t('fcMeetMsg')}</div></div><span class="now">${t('hAgo')}</span></div>
      </div>
    </div>
  </header>
  <section class="stats">
    ${[['<5s', 'st1', '#dcfce7', '#16a34a', 'zap'], [t('sv2'), 'st2', '#ffedd5', '#ea580c', 'trend'], ['3', 'st3', '#dbeafe', '#2563eb', 'globe'], ['24/7', 'st4', '#ede9fe', '#7c3aed', 'clock']].map(s => `<div class="stat"><span class="si" style="background:${s[2]};color:${s[3]}">${ic(s[4])}</span><div><b><bdi>${s[0]}</bdi></b><span>${t(s[1])}</span></div></div>`).join('')}
  </section>
  <section class="sec" id="features"><span class="eyebrow">${t('solEy')}</span><h2>${t('solT1')}<br>${t('solT2')}</h2><p class="lead">${t('solLead')}</p>
    <div class="grid4">${feats.map(f => `<div class="fcardx"><span class="ic ${f[1]}">${ic(f[2])}</span><h3>${t(f[0] + 't')}</h3><p>${t(f[0] + 'd')}</p></div>`).join('')}</div></section>
  <div style="padding:0 2vw"><div class="band"><div><h3>${t('bandT')}</h3><p>${t('bandP')}</p><a class="btn btn-lime btn-sm" href="#/login">${t('bandBtn')} ${ic('arrow', 'flip')}</a></div>
    <div class="band-cards"><div class="bc"><b>24/7</b><small>${t('b1')}</small>${bars([14, 22, 30, 42, 56], 1)}</div><div class="bc"><b>&lt;5s</b><small>${t('b2')}</small>${bars([10, 18, 26, 36, 58])}</div><div class="bc"><b>3</b><small>${t('b3')}</small>${bars([8, 14, 24, 34, 54])}</div></div></div></div>
  <section class="sec" id="how"><span class="eyebrow">${t('howEy')}</span><h2>${t('howT')}</h2><p class="lead">${t('howLead')}</p>
    <div class="steps">${[1, 2, 3, 4].map(n => `<div class="step"><span class="n">${n}</span><h3>${t('h' + n + 't')}</h3><p>${t('h' + n + 'd')}</p></div>`).join('')}</div></section>
  <section class="sec" id="pricing"><span class="eyebrow">${t('prEy')}</span><h2>${t('prT')}</h2><p class="lead">${t('prLead')}</p>
    <div class="plans">${plan('p1', '499', 'p1f')}${plan('p2', '999', 'p2f', 1)}${plan('p3', '1,499', 'p3f')}</div><small class="note">${t('prNote')}</small><small class="note fee">${t('prFee', { link: `<a href="https://wa.me/${OWNER.wa}?text=${encodeURIComponent(t('waConsult'))}" target="_blank" rel="noopener">${t('prFeeLink')}</a>` })}</small></section>
  <section class="sec" id="cases"><span class="eyebrow">${t('csEy')}</span><h2>${t('csT')}</h2><p class="lead">${t('csLead')}</p><div class="cases">${cs(1)}${cs(2)}${cs(3)}</div><small class="note">${t('csNote')}</small></section>
  <section class="sec" id="contact"><div class="contact"><div><span class="eyebrow" style="margin:0 0 12px">${t('ctEy')}</span><h2>${t('ctT')}</h2><p class="lead">${t('ctLead')}</p>
      <div class="cline"><span class="ic">${ic('phone')}</span><a dir="ltr" href="https://wa.me/${OWNER.wa}" target="_blank" rel="noopener">${OWNER.phone}</a></div><div class="cline"><span class="ic">${ic('mail')}</span><a href="mailto:${OWNER.email}">${OWNER.email}</a></div><div class="cline"><span class="ic">${ic('pin')}</span>${t('ctCity')}</div><div class="cline"><span class="ic">${ic('clock')}</span>${t('ctHours')}</div></div>
    <form class="form" id="cform" data-form="contact"><input class="inp" name="name" required placeholder="${t('ctName')}"><input class="inp" name="co" placeholder="${t('ctCo')}"><input class="inp" name="email" type="email" placeholder="${t('ctEmail')}"><input class="inp" name="phone" required placeholder="${t('ctPhone')}"><textarea class="inp full" name="msg" rows="4" placeholder="${t('ctMsg')}"></textarea><button class="btn btn-lime full" type="submit">${t('ctSend')} ${ic('send', 'flip')}</button></form></div></section>
  <footer class="ft"><div class="ft-in"><div><a class="logo" href="#/">${LOGO}SaleGen AI</a><small>${t('ftTag')}</small></div>${langSw()}<small>${t('ftRights')}<br>${t('ftCredit')}</small></div></footer>
  <a class="wa-float" href="https://wa.me/${OWNER.wa}?text=${encodeURIComponent(t('waHello'))}" target="_blank" rel="noopener" aria-label="WhatsApp">${WA}</a>
  </div>`;
}

/* ================= LOGIN ================= */
function login() {
  return `<div class="login"><div class="login-l"><a class="logo" href="#/">${LOGO}SaleGen AI</a><h2>${t('lgLeftT')}</h2><p>${t('lgLeftP')}</p><div style="max-width:420px">${BOT.replace('<svg', '<svg width="180" height="180"')}</div></div>
  <div class="login-r"><form class="lbox" data-form="login"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px"><a href="#/" style="color:#8fa79b;font-size:13px;display:flex;gap:6px;align-items:center">${ic('chevL', 'flip')}${t('lgBack')}</a>${langSw()}</div>
    <h3>${t('lgT')}</h3><p class="m">${t('lgS')}</p>
    <label>${t('lgEmail')}</label><input class="inp" name="email" value="moin.sultan@salegen.ai" dir="ltr"><label>${t('lgPass')}</label><input class="inp" name="pass" type="password" value="demo1234" dir="ltr">
    <button class="btn btn-lime" style="width:100%;margin-top:20px;padding:14px" type="submit">${t('lgBtn')} ${ic('arrow', 'flip')}</button>
    <div class="demo-cred"><b>${t('lgDemo')}:</b> <span dir="ltr">moin.sultan@salegen.ai / demo1234</span><br>${t('lgNote')}</div></form></div></div>`;
}

/* ================= APP SHELL ================= */
const NAV = [['dashboard', 'home'], ['leads', 'users'], ['pipeline', 'funnel'], ['deals', 'deals'], ['whatsapp', 'wa'], ['emailc', 'mail'], ['tasks', 'checksq'], ['calendar', 'cal'], ['reports', 'report'], ['settings', 'gear']];
function shell(page, content) {
  const unread = S.notifs.filter(n => !n.read).length;
  const pend = S.tasks.filter(x => !x.done).length;
  const rangeLbl = rangeLabel(ui.range);
  const qq = ui.q.trim().toLowerCase();
  return `<div class="app ${S.theme === 'light' ? 'light' : ''}">
  <aside class="side ${ui.side ? 'open' : ''}"><a class="logo" href="#/">${LOGO}SaleGen AI</a>
    <nav class="snav">${NAV.map(([k, i]) => `<a href="${k === 'whatsapp' ? '#/agent/chat' : '#/app/' + (k === 'emailc' ? 'email' : k)}" class="${page === k || (k === 'emailc' && page === 'email') ? 'on' : ''}">${ic(i)}${t(k)}${k === 'tasks' && pend ? `<span class="cnt">${pend}</span>` : ''}</a>`).join('')}</nav>
    <a class="agent-box" href="#/agent/chat"><span class="bot">${BOT}</span><div><b>${t('agentBox')}</b><small>${t('agentStatus')}</small></div></a>
  </aside>
  <div class="main">
    <header class="top">
      <button class="ibtn menu-btn" data-act="side" aria-label="Menu">${ic('menu')}</button>
      <div class="search" data-dd="1">${ic('search')}<input id="gsearch" data-in="gsearch" aria-label="${t('searchPh')}" placeholder="${t('searchPh')}" value="${esc(ui.q)}" autocomplete="off"><div id="sres">${qq ? searchRes(qq) : ''}</div></div>
            <div style="position:relative" data-dd="1"><button class="dr" data-act="dd" data-v="range">${ic('cal')}<span dir="auto">${rangeLbl}</span>${ic('chev')}</button>
        ${ui.dd === 'range' ? `<div class="dd">${['oct', 'sep', 'q'].map(r => `<button data-act="range" data-v="${r}">${ic(ui.range === r ? 'check' : 'cal')}${rangeLabel(r)}</button>`).join('')}</div>` : ''}</div>
      ${langSw()}
      <button class="ibtn" data-act="theme" aria-label="${S.theme === 'light' ? t('themeDark') : t('themeLight')}" title="${S.theme === 'light' ? t('themeDark') : t('themeLight')}">${ic(S.theme === 'light' ? 'moon' : 'sun')}</button>
      <div style="position:relative" data-dd="1"><button class="ibtn" data-act="dd" data-v="notif" aria-label="${t('notifications')}" aria-expanded="${ui.dd === 'notif'}">${ic('bell')}${unread ? `<span class="badge">${unread}</span>` : ''}</button>
        ${ui.dd === 'notif' ? `<div class="dd notif"><div style="display:flex;justify-content:space-between;align-items:center;padding:8px 12px"><b>${t('notifications')}</b><button style="width:auto;padding:4px 8px;color:#4ade80;font-size:12.5px" data-act="readall">${t('markRead')}</button></div>${S.notifs.slice(0, 8).map(n => `<div class="n" style="${n.read ? 'opacity:.6' : ''}"><span class="ic ${n.c}">${n.ic === 'wa' ? WA.replace('<svg', '<svg width="16" height="16"') : ic(n.ic)}</span><div>${n.k ? t(n.k) : esc(n.text)}<small>${ago(n.ts)}</small></div></div>`).join('')}</div>` : ''}</div>
      <div style="position:relative" data-dd="1"><button class="user" data-act="dd" data-v="user" aria-label="${t('profile')}" aria-expanded="${ui.dd === 'user'}"><img class="av" src="assets/avatar.webp" alt="Moin Sultan" width="44" height="44"><span class="ut" style="text-align:start"><b>Moin Sultan</b><small>${t('role')}</small></span>${ic('chev')}</button>
        ${ui.dd === 'user' ? `<div class="dd"><div style="padding:8px 12px"><span class="demo-pill">${t('demoMode')}</span></div><a href="#/app/settings">${ic('user')}${t('profile')}</a><a href="#/agent/chat">${BOT.replace('<svg', '<svg width="18" height="18"')}${t('agentBox')}</a><div class="sep"></div><a href="#/">${ic('logout', 'flip')}${t('logout')}</a></div>` : ''}</div>
    </header>
    <div class="content">${content}</div>
  </div></div>`;
}
function searchRes(q) {
  const r = S.leads.filter(l => (l.name + ' ' + nm(l) + ' ' + ind(l) + ' ' + city(l) + ' ' + (l.email || '')).toLowerCase().includes(q)).slice(0, 6);
  return `<div class="sres">${r.length ? r.map(l => `<a data-act="lead" data-id="${l.id}">${av(l, 'xs')}<div><b>${esc(nm(l))}</b><div style="font-size:12px;color:var(--muted)">${ind(l)} · ${t('b_' + l.stage)}</div></div></a>`).join('') : `<div style="padding:12px 14px;color:var(--muted)">${t('noResults')}</div>`}</div>`;
}
const head = (title, sub, right) => `<div class="ph"><div><h1>${title}</h1><p>${sub}</p></div><div style="display:flex;gap:10px;flex-wrap:wrap">${right || ''}</div></div>`;

/* ---------- dashboard ---------- */
function kcard(l) {
  return `<div class="kcard" draggable="true" data-id="${l.id}" data-act="lead" role="button" tabindex="0" aria-label="${esc(nm(l))} — ${t('b_' + l.stage)}">${av(l, 'sm')}<div style="min-width:0"><div class="nm">${esc(nm(l))}</div><div class="sub">${esc(ind(l))}<br>${city(l)} - ${ago(l.ts)}</div><span class="chip c-${l.stage}">${t('b_' + l.stage)}</span></div>
  <button class="more" data-act="kmenu" data-id="${l.id}" aria-label="${t('moveTo')}" aria-haspopup="menu">${ic('dots')}</button>
  ${ui.kmenu === l.id ? `<div class="dd kmenu" style="position:fixed;top:${ui.kpos.y}px;left:${ui.kpos.x}px;right:auto"><button data-act="lead" data-id="${l.id}">${ic('edit')}${t('leadDetails')}</button>${S.convos.some(c => c.lead === l.id) ? `<button data-act="openchat" data-id="${l.id}">${ic('msg')}${t('openChat')}</button>` : ''}<div class="sep"></div>${STAGES.filter(s => s !== l.stage).map(s => `<button data-act="move" data-id="${l.id}" data-v="${s}">${ic('arrow', 'flip')}${t('moveTo')}: ${t('stg_' + s)}</button>`).join('')}<div class="sep"></div><button data-act="dellead" data-id="${l.id}" style="color:#ef4444">${ic('trash')}${t('del')}</button></div>` : ''}</div>`;
}
function kanban(full) {
  const ls = S.leads.filter(l => ui.camp === 'all' || l.camp === ui.camp);
  return `<div class="kanban">${STAGES.map(s => `<div class="kcol kc-${s}"><div class="kcol-h"><span>${t('stg_' + s)}</span><span>${fmt(colCount(s))}</span></div><div class="kbody ${full ? 'full' : ''}" data-stage="${s}">${ls.filter(l => l.stage === s).sort((a, b) => b.ts - a.ts).map(kcard).join('')}</div></div>`).join('')}</div>`;
}
function leadRows(ls) {
  return ls.map(l => `<tr class="click" data-act="lead" data-id="${l.id}" tabindex="0"><td><div class="who">${av(l, 'sm')}<div><b>${esc(nm(l))}</b><small dir="ltr">${esc(l.phone || '')}</small></div></div></td><td>${esc(ind(l))}</td><td>${city(l)}</td><td>${t('src_' + l.src)}</td><td><span class="chip c-${l.stage}" style="margin:0">${t('b_' + l.stage)}</span></td><td style="white-space:nowrap">${sar(l.value || 0)}</td><td><div style="display:flex;gap:8px;align-items:center;min-width:90px"><div class="bar" style="flex:1"><i style="width:${l.score}%"></i></div>${l.score}</div></td><td style="color:var(--muted);white-space:nowrap">${ago(l.ts)}</td></tr>`).join('');
}
const leadHead = () => `<tr><th>${t('colLead')}</th><th>${t('colBiz')}</th><th>${t('colCity')}</th><th>${t('colSrc')}</th><th>${t('colStage')}</th><th>${t('colVal')}</th><th>${t('colScore')}</th><th>${t('colAdded')}</th></tr>`;
function areaChart(vals, labels, h) {
  const W = 600, H = h || 220, pad = 34, max = Math.max(...vals) * 1.15;
  const x = i => pad + i * (W - pad - 10) / (vals.length - 1), y = v => H - 26 - (v / max) * (H - 46);
  const pts = vals.map((v, i) => [x(i), y(v)]);
  const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" style="color:var(--muted)"><defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#22c55e" stop-opacity=".35"/><stop offset="1" stop-color="#22c55e" stop-opacity="0"/></linearGradient></defs>
  ${[0, 1, 2, 3].map(g => { const yy = 20 + g * (H - 46) / 3; return `<line x1="${pad}" x2="${W - 10}" y1="${yy}" y2="${yy}" stroke="currentColor" stroke-opacity=".15" stroke-dasharray="3 4"/><text x="${pad - 6}" y="${yy + 4}" font-size="11" text-anchor="end" fill="currentColor">${Math.round(max * (1 - g / 3) / 1000)}k</text>`; }).join('')}
  <path d="${d} L${x(vals.length - 1)} ${H - 26} L${pad} ${H - 26} Z" fill="url(#ag)"/><path d="${d}" fill="none" stroke="#22c55e" stroke-width="3" stroke-linejoin="round"/>
  ${pts.map((p, i) => `<circle cx="${p[0]}" cy="${p[1]}" r="${i === pts.length - 1 ? 5 : 3.5}" fill="#0b1914" stroke="#4ade80" stroke-width="2.5"/><text x="${p[0]}" y="${H - 6}" font-size="11.5" text-anchor="middle" fill="currentColor">${labels[i]}</text>`).join('')}</svg>`;
}
function rangeLabel(r) {
  const n = new Date(), y = n.getFullYear(), m = n.getMonth();
  let a, b;
  if (r === 'oct') { a = new Date(y, m, 1); b = new Date(y, m + 1, 0); }
  else if (r === 'sep') { a = new Date(y, m - 1, 1); b = new Date(y, m, 0); }
  else { b = new Date(y, m, n.getDate()); a = new Date(b.getTime() - 89 * DAY); }
  return fdate(a.getTime()) + ' - ' + fdate(b.getTime());
}
function revSeries() { const m = metrics(); const ml = t('months'); const cm = new Date().getMonth(); return { v: [68400, 74900, 81200, 92600, 98400, m.v[4] * (ui.range === 'oct' ? 1 : 124800 / RANGES[ui.range].v[4])], l: [5, 4, 3, 2, 1, 0].map(k => { const i = (cm - k + 12) % 12; return LANG === 'en' ? ml[i].slice(0, 3) : ml[i]; }) }; }
function dashboard() {
  const m = metrics();
  const K = [['k1', 'g-green', 'users'], ['k2', 'g-blue', 'usercheck'], ['k3', 'g-purple', 'calchk'], ['k4', 'g-orange', 'deals'], ['k5', 'g-green', 'shield']];
  const ls = S.leads.filter(l => ui.camp === 'all' || l.camp === ui.camp);
  const rs = revSeries();
  const up = S.meetings.filter(x => x.ts > NOW() - HR).sort((a, b) => a.ts - b.ts).slice(0, 4);
  const act = S.convos.slice().sort((a, b) => b.ts - a.ts).slice(0, 4);
  return head(t('dashboard'), t('dashSub'), `<select class="sel" data-ch="range">${[['oct', 'thisMonth'], ['sep', 'lastMonth'], ['q', 'last90']].map(o => `<option value="${o[0]}" ${ui.range === o[0] ? 'selected' : ''}>${t(o[1])}</option>`).join('')}</select>`) +
  `<div class="kpis">${K.map((k, i) => `<div class="kpi"><span class="ki ${k[1]}">${ic(k[2])}</span><div><div class="l">${t(k[0])}</div><div class="v">${i === 4 ? (LANG === 'en' ? `<small class="cur">SAR</small> ${fmt(m.v[i])}` : `${fmt(m.v[i])} <small class="cur">${LANG === 'ar' ? 'ر.س' : 'ریال'}</small>`) : fmt(m.v[i])}</div><div class="d">${ic('up')}+${m.d[i]}%</div></div></div>`).join('')}</div>
  <div class="card"><div class="card-h"><h2>${ic('funnel')}${t('salesPipeline')}<small style="font-size:13px;font-weight:500;color:var(--muted);margin-inline-start:6px">${(() => { const act = STAGES.reduce((a, st) => a + colCount(st), 0); return t('archived', { a: fmt(act), b: fmt(Math.max(0, m.v[0] - act)) }); })()}</small></h2>
    <select class="sel" data-ch="camp"><option value="all">${t('allCampaigns')}</option>${['meta', 'wa', 'web', 'li'].map(c => `<option value="${c}" ${ui.camp === c ? 'selected' : ''}>${t('cmp_' + c)}</option>`).join('')}</select>
    <div class="seg"><button class="${ui.view === 'kanban' ? 'on' : ''}" data-act="view" data-v="kanban">${ic('grid')}${t('kanban')}</button><button class="${ui.view === 'list' ? 'on' : ''}" data-act="view" data-v="list">${ic('list')}${t('list')}</button></div>
    <button class="btn btn-lime" data-act="newlead">${ic('plus')}${t('addLead')}</button></div>
    ${ui.view === 'kanban' ? kanban() : `<div class="tw"><table class="tbl"><thead>${leadHead()}</thead><tbody>${leadRows(ls.sort((a, b) => b.ts - a.ts))}</tbody></table></div>`}</div>
  <div class="grid3" style="margin-top:16px">
    <div class="card"><div class="card-h"><h2 style="font-size:17px">${ic('trend')}${t('revenue')}</h2></div>${areaChart(rs.v, rs.l, 230)}</div>
    <div class="card"><div class="card-h"><h2 style="font-size:17px">${ic('calchk')}${t('calendar')}</h2><a href="#/app/calendar" style="font-size:13px;color:#4ade80">${t('viewAll')}</a></div>${up.map(x => `<div class="row"><span class="ki g-purple" style="width:38px;height:38px;border-radius:10px;display:grid;place-items:center;color:#fff">${ic('cal')}</span><div class="grow"><b style="font-size:14px">${x.k ? t(x.k) : esc(x.title)}</b><small>${fdue(new Date(x.ts).setHours(0, 0, 0, 0))} · ${ftime(x.ts)}</small></div></div>`).join('')}</div>
    <div class="card"><div class="card-h"><h2 style="font-size:17px">${BOT.replace('<svg', '<svg width="26" height="26"')}${t('agentBox')}</h2><a href="#/agent/chat" style="font-size:13px;color:#4ade80">${t('viewAll')}</a></div>${act.map(c => { const l = lead(c.lead); const lm = c.msgs[c.msgs.length - 1]; return `<a class="row" href="#/agent/chat/${c.id}">${av(l, 'sm')}<div class="grow" style="min-width:0"><b style="font-size:14px">${esc(nm(l))}</b><small style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(msgText(lm))}</small></div><small>${ago(c.ts, 1)}</small></a>`; }).join('')}</div>
  </div>`;
}
function pipelinePage() {
  return head(t('pipeline'), t('dashSub'), `<select class="sel" data-ch="camp"><option value="all">${t('allCampaigns')}</option>${['meta', 'wa', 'web', 'li'].map(c => `<option value="${c}" ${ui.camp === c ? 'selected' : ''}>${t('cmp_' + c)}</option>`).join('')}</select><button class="btn btn-lime" data-act="newlead">${ic('plus')}${t('addLead')}</button>`) + `<div class="card">${kanban(1)}</div>`;
}
function leadsPage() {
  return head(t('leads'), t('leadsSub'), `<button class="btn btn-lime" data-act="newlead">${ic('plus')}${t('addLead')}</button>`) +
  `<div class="card"><div class="toolbar"><input class="inp2" data-in="lsearch" placeholder="${t('searchPh')}" value="${esc(ui.lq)}"><select class="sel" data-ch="lstage"><option value="all">${t('allStages')}</option>${STAGES.map(s => `<option value="${s}" ${ui.lstage === s ? 'selected' : ''}>${t('stg_' + s)}</option>`).join('')}</select><span style="margin-inline-start:auto;color:var(--muted);font-size:13.5px" id="lcount"></span></div>
  <div class="tw"><table class="tbl"><thead>${leadHead()}</thead><tbody id="lbody"></tbody></table></div></div>`;
}
function fillLeads() {
  const q = ui.lq.trim().toLowerCase();
  const ls = S.leads.filter(l => (ui.lstage === 'all' || l.stage === ui.lstage) && (!q || (l.name + ' ' + nm(l) + ' ' + ind(l) + ' ' + city(l)).toLowerCase().includes(q))).sort((a, b) => b.ts - a.ts);
  const b = $('#lbody'); if (b) b.innerHTML = leadRows(ls);
  const c = $('#lcount'); if (c) c.textContent = `${ls.length} / ${fmt(metrics().v[0])}`;
}
function dealsPage() {
  const open = S.leads.filter(l => ['qualified', 'proposal'].includes(l.stage)), won = S.leads.filter(l => l.stage === 'won');
  const ov = open.reduce((a, l) => a + (+l.value || 0), 0), m = metrics();
  const wr = Math.round(colCount('won') / (colCount('won') + colCount('proposal')) * 100);
  const avg = won.length ? won.reduce((a, l) => a + (+l.value || 0), 0) / won.length : 0;
  const row = (l, w) => `<tr class="click" data-act="lead" data-id="${l.id}" tabindex="0"><td><div class="who">${av(l, 'sm')}<div><b>${esc(nm(l))}</b><small>${esc(ind(l))}</small></div></div></td><td><span class="chip c-${l.stage}" style="margin:0">${t('b_' + l.stage)}</span></td><td style="white-space:nowrap">${sar(l.value || 0)}</td><td>${w ? '100%' : (l.stage === 'proposal' ? '70%' : '40%')}</td><td style="white-space:nowrap">${fdate(w ? l.ts : l.ts + (l.stage === 'proposal' ? 9 : 21) * DAY)}</td></tr>`;
  const th = `<tr><th>${t('colDeal')}</th><th>${t('colStage')}</th><th>${t('colVal')}</th><th>${t('colProb')}</th><th>${t('colExp')}</th></tr>`;
  return head(t('deals'), t('dealsSub'), `<button class="btn btn-lime" data-act="newlead">${ic('plus')}${t('addLead')}</button>`) +
  `<div class="mini"><div class="card"><span>${t('openVal')}</span><b>${sar(ov)}</b></div><div class="card"><span>${t('wonVal')}</span><b style="color:#4ade80">${sar(m.v[4])}</b></div><div class="card"><span>${t('winRate')}</span><b>${wr}%</b></div><div class="card"><span>${t('avgDeal')}</span><b>${sar(avg)}</b></div></div>
  <div class="grid2"><div class="card"><div class="card-h"><h2 style="font-size:18px">${ic('target')}${t('openDeals')}</h2></div><div class="tw"><table class="tbl"><thead>${th}</thead><tbody>${open.sort((a, b) => b.value - a.value).map(l => row(l)).join('')}</tbody></table></div></div>
  <div class="card"><div class="card-h"><h2 style="font-size:18px">${ic('deals')}${t('wonDeals')}</h2></div>${won.sort((a, b) => b.ts - a.ts).map(l => `<div class="row click" data-act="lead" data-id="${l.id}" style="cursor:pointer">${av(l, 'sm')}<div class="grow"><b style="font-size:14px">${esc(nm(l))}</b><small>${esc(ind(l))} · ${city(l)}</small></div><b style="color:#4ade80;white-space:nowrap">${sar(l.value)}</b></div>`).join('')}</div></div>`;
}
function emailPage() {
  return head(t('emailc'), t('emailSub'), `<button class="btn btn-lime" data-act="newcamp">${ic('plus')}${t('newCamp')}</button>`) +
  `<div class="mini">${[[t('colSent'), fmt(S.campaigns.reduce((a, c) => a + c.sent, 0))], [t('colOpen'), '54%'], [t('colClick'), '16%'], [t('colReplies'), fmt(S.campaigns.reduce((a, c) => a + c.rep, 0))]].map(x => `<div class="card"><span>${x[0]}</span><b>${x[1]}</b></div>`).join('')}</div>
  <div class="card tw"><table class="tbl"><thead><tr><th>${t('colCamp')}</th><th>${t('colStatus')}</th><th>${t('colSent')}</th><th>${t('colOpen')}</th><th>${t('colClick')}</th><th>${t('colReplies')}</th><th></th></tr></thead><tbody>
  ${S.campaigns.map(c => `<tr><td><div class="who"><span class="ki g-teal" style="width:38px;height:38px;border-radius:10px;display:grid;place-items:center;color:#fff">${ic('mail')}</span><b>${c.k ? t(c.k) : esc(c.name)}</b></div></td><td><span class="status s-${c.st}">${t('st_' + c.st)}</span></td><td>${fmt(c.sent)}</td><td><div style="display:flex;gap:8px;align-items:center;min-width:110px"><div class="bar" style="flex:1"><i style="width:${c.open}%"></i></div>${c.open}%</div></td><td>${c.click}%</td><td>${fmt(c.rep)}</td><td>${c.st !== 'draft' ? `<button class="btn btn-soft btn-sm" data-act="camptoggle" data-id="${c.id}">${c.st === 'active' ? t('pause') : t('resume')}</button>` : `<button class="btn btn-soft btn-sm" data-act="camptoggle" data-id="${c.id}">${ic('send', 'flip')}</button>`}</td></tr>`).join('')}
  </tbody></table></div>`;
}
function tasksPage() {
  const ts = S.tasks.filter(x => ui.tf === 'all' || (ui.tf === 'done' ? x.done : !x.done)).sort((a, b) => a.done - b.done || a.due - b.due);
  return head(t('tasks'), t('tasksSub'), `<button class="btn btn-lime" data-act="newtask">${ic('plus')}${t('addTask')}</button>`) +
  `<div class="card"><div class="seg" style="margin-bottom:8px">${[['all', 'fAll'], ['pend', 'fPend'], ['done', 'fDone']].map(f => `<button class="${ui.tf === f[0] ? 'on' : ''}" data-act="tf" data-v="${f[0]}">${t(f[1])}</button>`).join('')}</div>
  <div class="tasks">${ts.map(x => { const l = x.lead && lead(x.lead); return `<div class="t ${x.done ? 'done' : ''}"><button class="cbx ${x.done ? 'on' : ''}" data-act="tdone" data-id="${x.id}" role="checkbox" aria-checked="${x.done}" aria-label="${esc(x.k ? t(x.k) : x.title)}">${x.done ? ic('check') : ''}</button><div style="flex:1"><div class="tt" style="font-weight:600">${x.k ? t(x.k) : esc(x.title)}</div><small style="color:var(--muted)">${ic('clock')} ${fdue(x.due)}${l ? ' · ' + esc(nm(l)) : ''}</small></div><span class="prio p-${x.p}">${t('pr_' + x.p)}</span><button class="ibtn" data-act="tdel" data-id="${x.id}" aria-label="${t('del')}" style="width:34px;height:34px;color:var(--muted)">${ic('trash')}</button></div>`; }).join('')}</div></div>`;
}
function calendarPage() {
  if (!ui.cal) { const d = new Date(); ui.cal = [d.getFullYear(), d.getMonth()]; }
  const [Y, M] = ui.cal, first = new Date(Y, M, 1), start = new Date(Y, M, 1 - first.getDay());
  const today = new Date(); today.setHours(0, 0, 0, 0);
  let cells = '';
  for (let i = 0; i < 42; i++) {
    const d = new Date(start.getTime()); d.setDate(start.getDate() + i);
    const evs = S.meetings.filter(m => { const md = new Date(m.ts); return md.getFullYear() === d.getFullYear() && md.getMonth() === d.getMonth() && md.getDate() === d.getDate(); }).sort((a, b) => a.ts - b.ts);
    cells += `<div class="day ${d.getMonth() !== M ? 'o' : ''} ${d.getTime() === today.getTime() ? 'today' : ''}" data-act="dayclick" data-v="${d.getTime()}" role="button" tabindex="0" aria-label="${fdate(d.getTime())}"><span class="dn">${d.getDate()}</span>${evs.slice(0, 3).map(e => `<span class="ev ${e.added ? 'g' : ''}" title="${esc(e.k ? t(e.k) : e.title)}">${ftime(e.ts).replace(/:00/, '')} ${esc(e.k ? t(e.k) : e.title)}</span>`).join('')}${evs.length > 3 ? `<span style="font-size:11px;color:var(--muted)">+${evs.length - 3}</span>` : ''}</div>`;
  }
  return head(t('calendar'), t('calSub'), `<button class="btn btn-lime" data-act="newmeet">${ic('plus')}${t('newMeet')}</button>`) +
  `<div class="card"><div class="card-h"><h2>${t('months')[M]} ${Y}</h2><button class="ibtn" data-act="calnav" data-v="-1" aria-label="Previous month">${ic('chevL', 'flip')}</button><button class="btn btn-soft btn-sm" data-act="calnav" data-v="0">${t('today')}</button><button class="ibtn" data-act="calnav" data-v="1" aria-label="Next month">${ic('chevR', 'flip')}</button></div>
  <div class="cal">${t('wd').map(w => `<div class="dh">${w}</div>`).join('')}${cells}</div></div>`;
}
function donut(data) {
  const tot = data.reduce((a, d) => a + d[1], 0); let off = 0; const C = 2 * Math.PI * 60;
  return `<svg viewBox="0 0 160 160" style="width:180px;height:180px;flex-shrink:0">${data.map(d => { const len = d[1] / tot * C; const s = `<circle cx="80" cy="80" r="60" fill="none" stroke="${d[2]}" stroke-width="22" stroke-dasharray="${len} ${C - len}" stroke-dashoffset="${-off}" transform="rotate(-90 80 80)"/>`; off += len; return s; }).join('')}<text x="80" y="78" text-anchor="middle" font-size="22" font-weight="700" fill="currentColor">${fmt(metrics().v[0])}</text><text x="80" y="98" text-anchor="middle" font-size="11" fill="currentColor" opacity=".6">${t('leads')}</text></svg>`;
}
function reportsPage() {
  const rs = revSeries();
  const src = [['src_whatsapp', 38, '#22c55e'], ['src_website', 22, '#3b82f6'], ['src_facebook', 18, '#6366f1'], ['src_linkedin', 12, '#0ea5e9'], ['src_instagram', 7, '#ec4899'], ['src_referral', 3, '#f59e0b']];
  const fun = STAGES.map(s => [s, colCount(s)]), fmax = fun[0][1];
  const inds = [['ind_re', 31], ['ind_clinic', 18], ['ind_ecom', 14], ['ind_rest', 12], ['ind_edu2', 10], ['ind_salon', 8]];
  return head(t('reports'), t('repSub'), `<button class="btn btn-soft" data-act="export">${ic('download')}${t('exportPdf')}</button>`) +
  `<div class="grid2"><div class="card"><div class="card-h"><h2 style="font-size:18px">${ic('trend')}${t('revenue')}</h2></div>${areaChart(rs.v, rs.l, 260)}</div>
   <div class="card"><div class="card-h"><h2 style="font-size:18px">${ic('globe')}${t('bySource')}</h2></div><div style="display:flex;gap:20px;align-items:center;flex-wrap:wrap">${donut(src)}<div style="flex:1;min-width:140px">${src.map(s => `<div style="display:flex;justify-content:space-between;padding:5px 0;font-size:14px"><span><i style="display:inline-block;width:10px;height:10px;border-radius:3px;background:${s[2]};margin-inline-end:8px"></i>${t(s[0])}</span><b>${s[1]}%</b></div>`).join('')}</div></div></div></div>
  <div class="grid2" style="margin-top:16px"><div class="card"><div class="card-h"><h2 style="font-size:18px">${ic('funnel')}${t('funnel')}</h2></div>${fun.map((f, i) => `<div style="margin:10px 0"><div style="display:flex;justify-content:space-between;font-size:14px;margin-bottom:6px"><span>${t('stg_' + f[0])}</span><b>${fmt(f[1])} <small style="color:var(--muted);font-weight:500">${i ? Math.round(f[1] / fun[i - 1][1] * 100) + '%' : ''}</small></b></div><div class="bar" style="height:12px"><i style="width:${f[1] / fmax * 100}%;background:linear-gradient(90deg,${['#3b82f6', '#14b8a6', '#f59e0b', '#8b5cf6', '#22c55e'][i]},${['#60a5fa', '#5eead4', '#fbbf24', '#a78bfa', '#86efac'][i]})"></i></div></div>`).join('')}</div>
   <div class="card"><div class="card-h"><h2 style="font-size:18px">${ic('bars')}${t('topInd')}</h2></div>${inds.map(x => `<div style="margin:10px 0"><div style="display:flex;justify-content:space-between;font-size:14px;margin-bottom:6px"><span>${t(x[0])}</span><b>${x[1]}%</b></div><div class="bar" style="height:10px"><i style="width:${x[1] * 3}%"></i></div></div>`).join('')}</div></div>`;
}
function settingsPage() {
  const tg = (k, on) => `<button class="toggle ${on ? 'on' : ''}" data-act="pref" data-v="${k}" role="switch" aria-checked="${!!on}" aria-label="${t(k)}"></button>`;
  const integ = [['wa', 'WhatsApp Business', '#22c55e', WA], ['meta', 'Meta Ads', '#2563eb', ic('globe')], ['gmail', 'Gmail', '#ef4444', ic('mail')], ['hub', 'HubSpot', '#f97316', ic('layers')], ['li', 'LinkedIn', '#0a66c2', LI]];
  return head(t('settings'), t('setSub')) + `<div class="grid2"><div style="display:flex;flex-direction:column;gap:16px">
    <div class="card"><div class="card-h"><h2 style="font-size:18px">${ic('user')}${t('profileT')}</h2></div><div style="display:flex;gap:16px;align-items:center;margin-bottom:16px"><img class="av" src="assets/avatar.webp" alt="Moin Sultan" width="44" height="44"><div><b style="font-size:18px">Moin Sultan</b><div style="color:var(--muted)">${t('role')} · moin.sultan@salegen.ai</div></div></div>
      <div class="fgrid"><div class="fld"><label>${t('fullname')}</label><input value="Moin Sultan"></div><div class="fld"><label>${t('email')}</label><input value="moin.sultan@salegen.ai" dir="ltr"></div></div><button class="btn btn-lime btn-sm" data-act="savedtoast">${t('saveCh')}</button></div>
    <div class="card"><div class="card-h"><h2 style="font-size:18px">${ic('globe')}${t('language')} & ${t('appearance')}</h2></div><div class="row"><div class="grow">${t('language')}</div>${langSw()}</div><div class="row"><div class="grow">${t('appearance')}</div><div class="seg"><button class="${S.theme !== 'light' ? 'on' : ''}" data-act="settheme" data-v="dark">${ic('moon')}${t('dark')}</button><button class="${S.theme === 'light' ? 'on' : ''}" data-act="settheme" data-v="light">${ic('sun')}${t('light')}</button></div></div></div>
    <div class="card"><div class="card-h"><h2 style="font-size:18px">${ic('bell')}${t('notifT')}</h2></div>${['n1', 'n2', 'n3'].map(k => `<div class="row"><div class="grow">${t(k)}</div>${tg(k, S.prefs[k])}</div>`).join('')}</div></div>
    <div style="display:flex;flex-direction:column;gap:16px"><div class="card"><div class="card-h"><h2 style="font-size:18px">${ic('link')}${t('integ')}</h2></div><div style="display:flex;flex-direction:column;gap:10px">${integ.map(x => `<div class="integ"><span class="ic" style="background:${x[2]}">${x[3].replace('<svg', '<svg width="20" height="20"')}</span><b style="flex:1">${x[1]}</b>${S.integ[x[0]] ? `<span class="status s-active">${ic('check')} ${t('connected')}</span>` : `<button class="btn btn-soft btn-sm" data-act="integ" data-v="${x[0]}">${t('connect')}</button>`}</div>`).join('')}</div></div>
    <div class="card"><div class="card-h"><h2 style="font-size:18px">${ic('refresh')}${t('resetT')}</h2></div><p style="color:var(--muted);margin-bottom:14px">${t('resetD')}</p><button class="btn btn-danger" data-act="reset">${ic('refresh')}${t('resetB')}</button></div></div></div>`;
}

/* ================= AGENT CONSOLE ================= */
const ANAV = [['chat', 'chat', 'ag_chat'], ['history', 'history', 'ag_hist'], ['kb', 'book', 'ag_kb'], ['automations', 'gear', 'ag_auto'], ['settings', 'gear', 'ag_set']];
function agentShell(page, content) {
  return `<div class="agent"><aside class="aside"><div class="ab">${BOT}<span>${t('agentBox')}</span></div>
    ${ANAV.map(a => `<a href="#/agent/${a[0]}" class="${page === a[0] ? 'on' : ''}">${a[0] === 'automations' ? ic('spark') : ic(a[1])}${t(a[2])}</a>`).join('')}
    <a class="back" href="#/app/dashboard">${ic('chevL', 'flip')}${t('ag_back')}</a></aside>
    <div class="amain"><div class="atop">${langSw()}<a href="#/app/dashboard" style="display:flex;gap:8px;align-items:center;font-weight:600;font-size:14px">${LOGO.replace('<svg', '<svg width="26" height="26"')}SaleGen AI</a></div>${content}</div></div>`;
}
function chIcon(c) {
  const l = lead(c.lead);
  if (c.ch === 'avatar') return `<span class="chn" style="padding:0">${av(l)}<span class="sb" style="background:#22c55e">${WA}</span></span>`;
  const map = { whatsapp: ['#22c55e', WA], linkedin: ['#0a66c2', LI], linkedin2: ['#6d5ce7', LI], instagram: ['#e2373f', ic('insta')], email: ['#f97316', ic('mail')] }[c.ch];
  return `<span class="chn" style="background:${map[0]}">${map[1]}</span>`;
}
function msgText(m) { return m.k ? t(m.k) : m.text; }
function convPreview(c) { const lm = c.msgs[c.msgs.length - 1]; return c.preview && c.msgs.length === 4 && c.id === 'c1' ? t(c.preview) : msgText(lm); }
function clistHtml() {
  const q = ui.cq.trim().toLowerCase();
  const cs = S.convos.filter(c => { const l = lead(c.lead); if (q && !(l.name + ' ' + nm(l) + ' ' + ind(l)).toLowerCase().includes(q)) return false;
    if (ui.ctab === 'unread') return c.unread; if (ui.ctab === 'qual') return l.q || ['qualified', 'proposal'].includes(l.stage); if (ui.ctab === 'closed') return l.stage === 'won'; return true; }).sort((a, b) => b.ts - a.ts);
  return cs.map(c => { const l = lead(c.lead); return `<div class="citem ${ui.chat === c.id ? 'on' : ''}" data-act="conv" data-id="${c.id}" role="button" tabindex="0" aria-current="${ui.chat === c.id}">${chIcon(c)}<div style="min-width:0"><b>${esc(nm(l))}</b><div class="co">${esc(ind(l))}</div><div class="lm">${esc(convPreview(c))}</div></div><span class="tm">${ftime(c.ts).replace(/ (AM|PM|ص|م|صبح|شام)$/, '')}</span>${c.unread ? '<span class="ud"></span>' : ''}<span class="ago">${ago(c.ts, 1)}</span></div>`; }).join('') || `<div style="padding:20px;color:#8a9b92;text-align:center">${t('noResults')}</div>`;
}
function chatPage(cid) {
  if (cid && S.convos.some(c => c.id === cid)) ui.chat = cid;
  let c = S.convos.find(x => x.id === ui.chat) || S.convos[0]; ui.chat = c.id;
  const l = lead(c.lead);
  const intent = l.score >= 85 ? ['t-hi', 'hiIntent'] : l.score >= 70 ? ['t-hi', 'warm'] : ['t-lo', 'newS'];
  const qual = l.q || ['qualified', 'proposal', 'won'].includes(l.stage);
  const msgs = c.msgs.map(m => m.d === 'sys' ? `<div class="msg sys">${esc(m.k ? t(m.k, m.v) : m.text)}</div>` :
    `<div class="msg ${m.d}" ${m.lang ? `dir="${T[m.lang].dir}"` : ''}>${m.d === 'out' && m.ai ? `<div class="ai">${BOT.replace('<svg', '<svg width="13" height="13"')}${t('aiTag')}${m.llm ? `<span class="ai-live">${t('liveAI')}</span>` : ''}</div><br>` : ''}${m.file ? `<div style="display:flex;gap:10px;align-items:center;background:#fff;border-radius:10px;padding:10px 12px;margin-bottom:6px"><span style="width:36px;height:36px;border-radius:8px;background:#fee2e2;color:#dc2626;display:grid;place-items:center">${ic('file')}</span><div><b style="font-size:13px">${esc(m.file)}</b><div style="font-size:11.5px;color:#6b7d74">PDF · 412 KB</div></div></div>` : ''}${m.file && msgText(m) === m.file ? '' : esc(msgText(m))}<span class="mt">${ftime(m.ts)}${m.d === 'out' ? ic('check2') : ''}</span></div>`).join('');
  return agentShell('chat', `<div class="chat3">
  <div class="cpanel clp"><div class="clist-h"><h3>${t('convs')} (${S.convos.length + 15})</h3><div class="csearch">${ic('search')}<input data-in="csearch" placeholder="${t('searchConv')}" value="${esc(ui.cq)}"></div>
    <div class="ctabs">${[['all', 'tab_all'], ['unread', 'tab_unread'], ['qual', 'tab_qual'], ['closed', 'tab_closed']].map(x => `<button class="${ui.ctab === x[0] ? 'on' : ''}" data-act="ctab" data-v="${x[0]}">${t(x[1])}</button>`).join('')}</div></div>
    <div class="clist" id="clist">${clistHtml()}</div></div>
  <div class="cpanel chp"><div class="chat-h"><button class="ibtn ld-tg" data-act="ldtoggle" aria-label="${t('leadDetails')}" style="width:36px;height:36px;color:#16803d;background:#e3f7e8">${ic('user')}</button>${av(l)}<div style="flex:1;min-width:0"><b>${esc(nm(l))}</b><small>${esc(ind(l))} • ${city(l)}</small></div><span class="tagp ${intent[0]}">${t(intent[1])}</span>${qual ? `<span class="tagp t-q">${t('qualified')}</span>` : ''}<button class="ibtn" data-act="lead" data-id="${l.id}" aria-label="${t('leadDetails')}" style="width:34px;height:34px">${ic('dots')}</button></div>
    <div class="msgs" id="msgs">${msgs}${ui.typing === c.id ? '<div class="typing"><i></i><i></i><i></i></div>' : ''}</div>
    <div class="sugg">${['sug1', 'sug2', 'sug3', 'sug4'].map(k => `<button data-act="sugg" data-v="${k}">${t(k)}</button>`).join('')}</div>
    <div class="sim"><button class="${ui.sim === 'customer' ? 'on' : ''}" data-act="sim" data-v="customer">${ic('user')} ${t('simC')}</button><button class="${ui.sim === 'agent' ? 'on' : ''}" data-act="sim" data-v="agent">${ic('msg')} ${t('simA')}</button><span>${ui.sim === 'customer' ? t('simHint') : t('simHintA')}</span></div>
    <form class="compose" data-form="send"><div class="box"><span style="width:20px;height:20px;border-radius:50%;border:2px solid #c5d2cb"></span><input id="compose" name="m" aria-label="${t('typeMsg')}" placeholder="${t('typeMsg')}" autocomplete="off"><button type="button" class="circ" data-act="attach" aria-label="Attach">${ic('clip')}</button><button type="button" class="circ" data-act="emoji" aria-label="Emoji">${ic('smile')}</button></div><button class="send" type="submit" aria-label="Send">${ic('send', 'flip')}</button></form></div>
  ${ui.ld ? '<div class="ld-ov" data-act="ldtoggle"></div>' : ''}<div class="cpanel ldp ${ui.ld ? 'open' : ''}"><div class="ld"><div class="ld-h"><b>${t('leadDetails')}</b><button class="ibtn ld-x" data-act="ldtoggle" aria-label="${t('close')}" style="width:32px;height:32px">${ic('x')}</button><button class="edit" data-act="lead" data-id="${l.id}">${ic('edit')}${t('edit')}</button></div>
    <div class="ld-p">${av(l)}<div style="min-width:0"><b>${esc(nm(l))}</b><small dir="ltr" style="text-align:start">${esc(l.email || '')}</small><small dir="ltr" style="text-align:start">${esc(l.phone || '')}</small></div></div>
    <div class="kv"><span>${t('source')}</span><b>${t('src_' + l.src)}</b><span>${t('industry')}</span><b>${esc(ind(l).replace(/ - .*/, ''))}</b><span>${t('location')}</span><b>${city(l)}</b><span>${t('status')}</span><b><span class="tagp ${qual ? 't-q' : 't-lo'}" style="padding:3px 10px;font-size:12px">${qual ? t('qualified') : t('b_' + l.stage)}</span></b><span>${t('score')}</span><b>${l.score}/100</b><span>${t('created')}</span><b>${fdate(l.created)}</b></div>
    <div class="qa"><h4>${t('quick')}</h4><button class="pri" data-act="qa-meet">${ic('calchk')}${t('bookMeet')}</button><button data-act="qa-prop">${ic('file')}${t('sendProp')}</button><button data-act="qa-pipe">${ic('layers')}${t('addPipe')}</button><button data-act="qa-task">${ic('checksq')}${t('createTask')}</button></div></div></div>
  </div>`);
}
function historyPage() {
  const rows = S.convos.slice().sort((a, b) => b.ts - a.ts).map(c => { const l = lead(c.lead); return `<tr class="click" data-act="conv" data-id="${c.id}" data-go="1"><td><div class="who">${av(l, 'sm')}<div><b>${esc(nm(l))}</b><small>${esc(ind(l))}</small></div></div></td><td>${chIcon(c).replace('class="chn"', 'class="chn" style="width:32px;height:32px"')}</td><td>${c.msgs.filter(m => m.d !== 'sys').length}</td><td>${l.score}/100</td><td><span class="chip c-${l.stage}" style="margin:0">${t('b_' + l.stage)}</span></td><td style="color:#6b7d74">${ago(c.ts)}</td></tr>`; }).join('');
  return agentShell('history', `<div class="apage">${head(t('ag_hist'), t('histSub'))}<div class="card tw"><table class="tbl"><thead><tr><th>${t('colLead')}</th><th>${t('colChannel')}</th><th>${t('colMsgs')}</th><th>${t('colScore')}</th><th>${t('colStage')}</th><th>${t('colLast')}</th></tr></thead><tbody>${rows}</tbody></table></div></div>`);
}
function kbPage() {
  return agentShell('kb', `<div class="apage">${head(t('ag_kb'), t('kbSub'), `<button class="btn btn-green" data-act="newkb">${ic('plus')}${t('kbAdd')}</button>`)}<div class="kb">${S.kb.map(k => `<div class="card"><h4><span style="width:34px;height:34px;border-radius:9px;background:#e3f7e8;color:#16803d;display:grid;place-items:center">${ic(k.ic || 'book')}</span>${k.k ? t(k.k + 't') : esc(k.title)}</h4><p>${k.k ? t(k.k + 'd') : esc(k.text)}</p></div>`).join('')}</div></div>`);
}
function autoPage() {
  return agentShell('automations', `<div class="apage">${head(t('ag_auto'), t('autoSub'))}<div class="kb">${S.autos.map(a => `<div class="card" style="display:flex;gap:14px;align-items:flex-start"><span style="width:44px;height:44px;border-radius:12px;background:${a.on ? 'linear-gradient(135deg,#34d27a,#16a34a)' : '#cbd5e1'};color:#fff;display:grid;place-items:center;flex-shrink:0">${a.ic === 'wa' ? WA.replace('<svg', '<svg width="22" height="22"') : ic(a.ic)}</span><div style="flex:1"><h4 style="margin-bottom:4px">${t(a.k + 't')}</h4><p>${t(a.k + 'd')}</p><div class="flow"><span>${t('fl_trig')}</span>${ic('arrow', 'flip')}<span>${t('fl_act')}</span><span style="margin-inline-start:auto;background:none;border:0;color:#16803d;font-weight:600">${t('runs', { n: fmt(a.runs) })}</span></div></div><button class="toggle ${a.on ? 'on' : ''}" data-act="auto" data-id="${a.id}" role="switch" aria-checked="${a.on}" aria-label="${t(a.k + 't')}"></button></div>`).join('')}</div></div>`);
}
function agentSettings() {
  const p = S.prefs;
  return agentShell('settings', `<div class="apage">${head(t('ag_set'), t('autoSub'))}<div class="card" style="max-width:720px">
    <div class="fgrid"><div class="fld"><label>${t('agName')}</label><input id="agname" value="${esc(p.agName)}"></div><div class="fld"><label>${t('agTone')}</label><select id="agtone"><option value="tone1" ${p.tone === 'tone1' ? 'selected' : ''}>${t('tone1')}</option><option value="tone2" ${p.tone === 'tone2' ? 'selected' : ''}>${t('tone2')}</option></select></div></div>
    <div class="row"><div class="grow"><b>${t('agLangs')}</b><small>English · العربية · اردو</small></div>${langSw()}</div>
    <div class="row"><div class="grow"><b>${t('agHours')}</b></div><button class="toggle ${p.hours ? 'on' : ''}" data-act="pref" data-v="hours"></button></div>
    <div class="row"><div class="grow"><b>${t('agHand')}</b></div><button class="toggle ${p.hand ? 'on' : ''}" data-act="pref" data-v="hand"></button></div>
    <button class="btn btn-green" style="margin-top:12px" data-act="saveagent">${t('saveCh')}</button></div></div>`);
}

/* ================= AI ENGINE ================= */
function detectLang(s) { if (/[؀-ۿ]/.test(s)) return /[ٹڈڑںےۓہکگیھ]/.test(s) ? 'ur' : 'ar'; return /[a-z]/i.test(s) ? 'en' : LANG; }
function tl(lang, k, v) { const o = LANG; LANG = lang; const s = t(k, v); LANG = o; return s; }
function aiReply(c, text) {
  const l = lead(c.lead), lg = detectLang(text), s = text.toLowerCase();
  const name = (l.names && l.names[lg]) || l.name.split(' ')[0];
  const has = re => re.test(s);
  let k = 'r_default', v = { name }, effect = null;
  if (has(/(book|call|meeting|schedule|tomorrow|appointment|موعد|مكالمة|اجتماع|احجز|غدا|غداً|میٹنگ|کال|بک|اپائنٹمنٹ)/)) { k = 'r_meet'; effect = 'meet'; }
  else if (has(/(demo|trial|عرض تجريبي|تجريبي|تجربة|ڈیمو|ٹرائل)/)) k = 'r_demo';
  else if (has(/(proposal|quotation|quote|عرض السعر|عرض سعر|پروپوزل|کوٹیشن)/)) { k = 'r_prop'; effect = 'prop'; }
  else if (has(/(starter|basic|الأساسية|اسٹارٹر)/)) k = 'r_starter';
  else if (has(/(professional|\bpro\b|الاحترافية|پروفیشنل)/)) k = 'r_pro';
  else if (has(/(price|pricing|cost|package|plan|how much|fee|سعر|أسعار|الأسعار|اسعار|باقة|باقات|كم|قیمت|قیمتیں|پیکج|پلان|ریٹ|فیس)/)) k = 'r_price';
  else if (has(/(arabic|urdu|english|language|العربية|عربي|لغة|اللغة|عربی|اردو|زبان)/)) k = 'r_lang';
  else if (has(/(erp|integrat|connect|api|crm|ربط|تكامل|نظام|جڑ|انٹیگریشن|سسٹم)/)) k = 'r_integ';
  else if (has(/(where|location|office|address|أين|وين|مكتب|موقع|العنوان|کہاں|دفتر|پتہ)/)) k = 'r_where';
  else if (has(/(thank|thanks|شكر|مشكور|شکریہ|👍)/)) k = 'r_thanks';
  else if (has(/^(yes|ok|okay|sure|great|نعم|ايوه|تمام|طيب|جی|ہاں|ٹھیک|اوکے)/)) k = 'r_yes';
  else if (has(/^(hi|hello|hey|salam|assalam|aoa|السلام|مرحبا|اهلا|أهلا|هلا|ہیلو|سلام)/)) k = 'r_greet';
  if (effect === 'meet') { const d = new Date(); d.setDate(d.getDate() + 1); d.setHours(11, 0, 0, 0); v.d = fdateL(d.getTime(), lg) + ' · ' + ftimeL(d.getTime(), lg); bookMeeting(l, d.getTime(), null, true); }
  if (effect === 'prop') { v.name = (l.names && l.names[lg]) || l.name; }
  return { text: tl(lg, k, v), lang: lg, effect };
}
const fdateL = (ts, lg) => { const o = LANG; LANG = lg; const s = fdate(ts); LANG = o; return s; };
const ftimeL = (ts, lg) => { const o = LANG; LANG = lg; const s = ftime(ts); LANG = o; return s; };
let aiRemote = location.protocol.startsWith('http');
async function remoteAI(c, text) {
  if (!aiRemote) return null;
  const l = lead(c.lead), lg = detectLang(text);
  const messages = c.msgs.filter(m => m.d !== 'sys').slice(-14).map(m => ({ role: m.d === 'in' ? 'user' : 'assistant', content: m.file ? '[PDF proposal sent]' : msgText(m) }));
  const kb = S.kb.map(k => (k.k ? tl('en', k.k + 't') : k.title) + ':\n' + (k.k ? tl('en', k.k + 'd') : k.text)).join('\n\n');
  const ctl = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timer = setTimeout(() => ctl && ctl.abort(), 22000);
  try {
    const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: ctl ? ctl.signal : undefined,
      body: JSON.stringify({ messages, lang: lg, kb, agent: { name: S.prefs.agName, tone: S.prefs.tone }, lead: { name: l.name, industry: l.ind ? tl('en', 'ind_' + l.ind) : (l.biz || ''), city: tl('en', 'city_' + l.city), stage: l.stage, channel: c.ch.replace(/\d/, '') } }) });
    if (res.status === 503 || res.status === 404 || res.status === 405) { aiRemote = false; return null; }
    if (!res.ok) return null;
    const j = await res.json();
    if (!j || !j.reply) return null;
    let effect = null;
    if (j.action === 'book_meeting') {
      const d = new Date(); d.setDate(d.getDate() + (j.meeting ? j.meeting.day_offset : 1));
      const [hh, mm] = (j.meeting ? j.meeting.time : '11:00').split(':').map(Number); d.setHours(hh || 11, mm || 0, 0, 0);
      bookMeeting(l, d.getTime(), null, true); effect = 'meet';
    } else if (j.action === 'send_proposal') effect = 'prop';
    return { text: j.reply, lang: lg, effect, delta: j.score_delta, llm: true };
  } catch (e) { return null; } finally { clearTimeout(timer); }
}
function runAI(c, text) {
  ui.typing = c.id; render();
  const started = NOW(), minDelay = 900 + Math.min(1400, text.length * 20);
  remoteAI(c, text).catch(() => null).then(r => r || aiReply(c, text)).then(r => setTimeout(() => applyAI(c, r), Math.max(0, minDelay - (NOW() - started))));
}
function applyAI(c, r) {
    const l = lead(c.lead);
    ui.typing = null;
    c.msgs.push({ d: 'out', text: r.text, lang: r.lang !== LANG ? r.lang : null, ai: 1, llm: r.llm ? 1 : 0, ts: NOW() }); c.ts = NOW();
    const before = l.score; l.score = Math.min(99, l.score + (r.delta != null ? Math.max(1, r.delta) : (r.effect ? 6 : 3))); l.ts = NOW();
    if (l.stage === 'new') l.stage = 'contacted';
    if (r.effect === 'prop') { c.msgs.push({ d: 'out', text: tl(r.lang, 'propFile', { name: l.name.replace(/\s+/g, '_') }), file: tl(r.lang, 'propFile', { name: l.name.replace(/\s+/g, '_') }), ts: NOW() }); c.msgs.push({ d: 'sys', k: 'sys_prop', ts: NOW() }); l.stage = 'proposal'; }
    if (!l.q && l.score >= 80 && before < 80) { l.q = true; c.msgs.push({ d: 'sys', k: 'sys_q', v: { s: l.score }, ts: NOW() }); if (['new', 'contacted'].includes(l.stage)) l.stage = 'qualified'; }
    save(); render();
}
function bookMeeting(l, ts, title, viaAI) {
  S.meetings.push({ id: 'm' + NOW(), title: title || (t('bookMeet') + ' – ' + l.name), ts, added: true, lead: l.id });
  const c = S.convos.find(x => x.lead === l.id);
  const d = fdate(ts) + ' · ' + ftime(ts);
  if (c) c.msgs.push({ d: 'sys', k: 'sys_meet', v: { d }, ts: NOW() + 1 });
  notify('tMeet', { d }, 'calchk', 'g-purple');
  toast(t('tMeet', { d }), 'calchk', 'g-purple');
  if (['new', 'contacted'].includes(l.stage)) l.stage = 'qualified';
  save();
}

/* ================= MODALS ================= */
function leadModal(id) {
  const l = id ? lead(id) : null;
  const inds = Object.keys(T.en).filter(k => k.startsWith('ind_')).map(k => k.slice(4));
  const f = (n, lab, val, type) => `<div class="fld"><label>${lab}</label><input name="${n}" value="${esc(val == null ? '' : val)}" ${type ? `type="${type}"` : ''} ${n === 'phone' || n === 'email' ? 'dir="ltr"' : ''}></div>`;
  const sel = (n, lab, opts, val) => `<div class="fld"><label>${lab}</label><select name="${n}">${opts.map(o => `<option value="${o[0]}" ${o[0] === val ? 'selected' : ''}>${o[1]}</option>`).join('')}</select></div>`;
  const conv = l && S.convos.find(c => c.lead === l.id);
  const body = `<form id="mf" data-form="lead" data-id="${l ? l.id : ''}">${l ? `<div style="display:flex;gap:14px;align-items:center;margin-bottom:16px">${av(l)}<div style="flex:1"><b style="font-size:17px">${esc(nm(l))}</b><div style="color:var(--muted);font-size:13px">${t('score')}: <b style="color:#4ade80">${l.score}/100</b> · ${t('created')}: ${fdate(l.created)}</div></div>${conv ? `<a class="btn btn-soft btn-sm" href="#/agent/chat/${conv.id}">${ic('msg')}${t('openChat')}</a>` : ''}</div>` : ''}
    <div class="fgrid">${f('name', t('name'), l ? nm(l) : '')}${sel('ind', t('business'), inds.map(i => [i, t('ind_' + i)]), l ? l.ind : 're')}
    ${f('phone', t('phone'), l ? l.phone : '+966 5')}${f('email', t('email'), l ? l.email : '', 'email')}
    ${sel('city', t('city'), ['riyadh', 'jeddah', 'dammam', 'khobar', 'makkah'].map(c => [c, t('city_' + c)]), l ? l.city : 'riyadh')}${sel('src', t('source'), ['whatsapp', 'website', 'facebook', 'instagram', 'linkedin', 'email', 'referral'].map(s => [s, t('src_' + s)]), l ? l.src : 'whatsapp')}
    ${sel('camp', t('campaign'), ['meta', 'wa', 'web', 'li'].map(c => [c, t('cmp_' + c)]), l ? l.camp : 'meta')}${f('value', t('value'), l ? l.value : 10000, 'number')}
    ${sel('stage', t('stage'), STAGES.map(s => [s, t('stg_' + s)]), l ? l.stage : 'new')}</div></form>`;
  modal(l ? t('editLead') : t('addLead'), body, `${l ? `<button class="btn btn-danger" data-act="dellead" data-id="${l.id}" style="margin-inline-end:auto">${ic('trash')}${t('del')}</button>` : ''}<button class="btn btn-soft" data-act="close">${t('cancel')}</button><button class="btn btn-lime" data-act="submit">${t('save')}</button>`);
}
function taskModal(leadId) {
  const l = leadId && lead(leadId);
  const d = new Date(); d.setDate(d.getDate() + 1);
  modal(t('addTask'), `<form id="mf" data-form="task" data-lead="${leadId || ''}"><div class="fld"><label>${t('taskTitle')}</label><input name="title" required value="${l ? esc(t('tk_3').split(' ').slice(0, 2).join(' ') + ' – ' + nm(l)) : ''}"></div><div class="fgrid"><div class="fld"><label>${t('due')}</label><input name="due" type="date" value="${d.toISOString().slice(0, 10)}"></div><div class="fld"><label>${t('prio')}</label><select name="p"><option value="high">${t('pr_high')}</option><option value="med" selected>${t('pr_med')}</option><option value="low">${t('pr_low')}</option></select></div></div></form>`,
    `<button class="btn btn-soft" data-act="close">${t('cancel')}</button><button class="btn btn-lime" data-act="submit">${t('save')}</button>`);
}
function meetModal(leadId, dayTs) {
  const l = leadId && lead(leadId);
  const d = dayTs ? new Date(+dayTs) : new Date(NOW() + DAY);
  const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  modal(t('newMeet'), `<form id="mf" data-form="meet" data-lead="${leadId || ''}"><div class="fld"><label>${t('mTitle')}</label><input name="title" required value="${l ? esc(t('bookMeet') + ' – ' + nm(l)) : ''}"></div><div class="fgrid"><div class="fld"><label>${t('mDate')}</label><input name="date" type="date" value="${ds}"></div><div class="fld"><label>${t('mTime')}</label><input name="time" type="time" value="11:00"></div></div><div class="fld"><label>${t('mWith')}</label><select name="lead">${S.leads.map(x => `<option value="${x.id}" ${x.id === leadId ? 'selected' : ''}>${esc(nm(x))}</option>`).join('')}</select></div></form>`,
    `<button class="btn btn-soft" data-act="close">${t('cancel')}</button><button class="btn btn-lime" data-act="submit">${t('save')}</button>`);
}
function videoModal() {
  const steps = [['in', t('fcNewMsg')], ['out', t('r_greet', { name: 'Ahmed' })], ['in', t('m_a3')], ['out', t('r_price')], ['in', t('sug3')], ['sys', t('fcMeet') + ' ✅']];
  modal(t('video') + ' — SaleGen AI', `<div style="background:#0b1914;border-radius:14px;padding:16px;display:flex;flex-direction:column;gap:10px;min-height:380px" id="vchat"></div>`, '', true);
  const box = $('#vchat'); let i = 0;
  const step = () => {
    if (!box || !document.body.contains(box)) return;
    if (i >= steps.length) { setTimeout(() => { if (document.body.contains(box)) { box.innerHTML = ''; i = 0; step(); } }, 2600); return; }
    const [d, txt] = steps[i++];
    if (d === 'out') { const ty = document.createElement('div'); ty.className = 'typing'; ty.innerHTML = '<i></i><i></i><i></i>'; box.appendChild(ty); setTimeout(() => { ty.remove(); add(d, txt); }, 900); }
    else add(d, txt);
  };
  const add = (d, txt) => { const m = document.createElement('div'); m.className = 'msg ' + d; m.textContent = txt; box.appendChild(m); box.scrollTop = 1e6; setTimeout(step, d === 'out' ? 1600 : 900); };
  setTimeout(step, 400);
}

/* ================= RENDER ================= */
function render() {
  const r = route();
  document.documentElement.lang = LANG; document.documentElement.dir = t('dir');
  let html;
  if (r[0] === 'login') html = login();
  else if (r[0] === 'app') {
    const p = r[1] || 'dashboard';
    const pages = { dashboard, leads: leadsPage, pipeline: pipelinePage, deals: dealsPage, email: emailPage, tasks: tasksPage, calendar: calendarPage, reports: reportsPage, settings: settingsPage };
    html = shell(p, (pages[p] || dashboard)());
  } else if (r[0] === 'agent') {
    const p = r[1] || 'chat';
    html = p === 'history' ? historyPage() : p === 'kb' ? kbPage() : p === 'automations' ? autoPage() : p === 'settings' ? agentSettings() : chatPage(r[2]);
  } else html = landing();
  document.title = r[0] === 'app' || r[0] === 'agent' ? 'SaleGen AI — CRM' : 'SaleGen AI — Your 24/7 AI Sales Agent';
  const gs = document.activeElement && document.activeElement.id;
  $('#root').innerHTML = html;
  afterRender(gs);
}
function afterRender(focusId) {
  const m = $('#msgs'); if (m) m.scrollTop = m.scrollHeight;
  if (focusId === 'gsearch' || focusId === 'compose') { const el = $('#' + focusId); if (el) { el.focus(); const v = el.value; el.value = ''; el.value = v; } }
  if ($('#lbody')) fillLeads();
  // drag & drop
  $$('.kcard').forEach(c => {
    c.addEventListener('dragstart', e => { e.dataTransfer.setData('text/plain', c.dataset.id); c.classList.add('drag'); });
    c.addEventListener('dragend', () => c.classList.remove('drag'));
  });
  $$('.kbody').forEach(b => {
    b.addEventListener('dragover', e => { e.preventDefault(); b.classList.add('over'); });
    b.addEventListener('dragleave', () => b.classList.remove('over'));
    b.addEventListener('drop', e => { e.preventDefault(); b.classList.remove('over'); const id = e.dataTransfer.getData('text/plain'); if (id) moveLead(id, b.dataset.stage); });
  });
  $$('.kcard').forEach(c => c.addEventListener('touchstart', touchStart, { passive: true }));
  // auto reply when opening an unanswered conversation
  const r = route();
  if (r[0] === 'agent' && (!r[1] || r[1] === 'chat')) {
    const c = S.convos.find(x => x.id === ui.chat);
    if (c && c.unread) { c.unread = false; save(); }
    const last = c && c.msgs.filter(x => x.d !== 'sys').slice(-1)[0];
    if (c && last && last.d === 'in' && ui.typing !== c.id && !c.pending) { c.pending = true; setTimeout(() => { c.pending = false; if (ui.chat === c.id) runAI(c, msgText(last)); }, 700); }
  }
}
let tdrag = null;
function touchStart(e) {
  const card = e.currentTarget, t0 = e.touches[0];
  if (e.target.closest('.more')) return;
  const st = { x: t0.clientX, y: t0.clientY };
  const timer = setTimeout(() => {
    const r = card.getBoundingClientRect();
    const g = card.cloneNode(true); g.className = 'kcard kghost'; g.style.width = r.width + 'px';
    g.style.left = (st.x - r.width / 2) + 'px'; g.style.top = (st.y - 30) + 'px';
    document.body.appendChild(g); card.classList.add('drag');
    if (navigator.vibrate) try { navigator.vibrate(30); } catch (er) {}
    tdrag = { id: card.dataset.id, g, card, over: null, w: r.width };
  }, 320);
  const move = ev => {
    const p = ev.touches[0];
    if (!tdrag) { if (Math.abs(p.clientX - st.x) > 8 || Math.abs(p.clientY - st.y) > 8) cleanup(); return; }
    ev.preventDefault();
    tdrag.g.style.left = (p.clientX - tdrag.w / 2) + 'px'; tdrag.g.style.top = (p.clientY - 30) + 'px';
    tdrag.g.style.display = 'none'; const el = document.elementFromPoint(p.clientX, p.clientY); tdrag.g.style.display = '';
    const kb = el && el.closest('.kbody');
    if (tdrag.over && tdrag.over !== kb) tdrag.over.classList.remove('over');
    if (kb) kb.classList.add('over'); tdrag.over = kb;
    const k = document.querySelector('.kanban'); if (k) { const kr = k.getBoundingClientRect(); if (p.clientX > kr.right - 40) k.scrollLeft += 12; else if (p.clientX < kr.left + 40) k.scrollLeft -= 12; }
  };
  const end = () => {
    if (tdrag) { const d = tdrag; tdrag.g.remove(); d.card.classList.remove('drag'); if (d.over) d.over.classList.remove('over'); tdrag = null; cleanup(); suppressClick = true; setTimeout(() => suppressClick = false, 400); if (d.over) moveLead(d.id, d.over.dataset.stage); return; }
    cleanup();
  };
  function cleanup() { clearTimeout(timer); card.removeEventListener('touchmove', move); card.removeEventListener('touchend', end); card.removeEventListener('touchcancel', end); }
  card.addEventListener('touchmove', move, { passive: false });
  card.addEventListener('touchend', end); card.addEventListener('touchcancel', end);
}
let suppressClick = false;
function moveLead(id, stage) {
  const l = lead(id); if (!l || l.stage === stage) return;
  const was = l.stage; l.stage = stage; l.ts = NOW(); ui.kmenu = null;
  if (stage === 'won' && was !== 'won') { toast(t('tWon', { v: fmt(l.value || 0) }), 'deals', 'g-orange'); notify('tWon', { v: fmt(l.value || 0) }, 'deals', 'g-orange'); }
  else toast(t('tMoved', { name: esc(nm(l)), stage: t('stg_' + stage) }), 'arrow', 'g-blue');
  if (['qualified', 'proposal', 'won'].includes(stage)) l.q = true;
  save(); render();
}

/* ================= EVENTS ================= */
document.addEventListener('click', e => {
  if (suppressClick) { e.preventDefault(); return; }
  const a = e.target.closest('[data-act]');
  const inDD = e.target.closest('[data-dd], .dd, .kmenu, .more');
  let rer = false;
  if (!inDD && (ui.dd || ui.kmenu)) { ui.dd = null; ui.kmenu = null; rer = true; }
  if (!e.target.closest('.search') && ui.q) { const sr = $('#sres'); if (sr) sr.innerHTML = ''; }
  if (!a) { if (rer) render(); return; }
  const act = a.dataset.act, id = a.dataset.id, v = a.dataset.v;
  if (act !== 'lead' && act !== 'ovclose' && a.tagName === 'A' && a.getAttribute('href')) return;
  switch (act) {
    case 'lang': LANG = v; store.set('sg_lang', v); render(); return;
    case 'scroll': { const el = document.getElementById(a.dataset.to); if (el) el.scrollIntoView({ behavior: 'smooth' }); return; }
    case 'video': videoModal(); return;
    case 'close': closeModal(); return;
    case 'ovclose': if (e.target === a) closeModal(); return;
    case 'side': ui.side = !ui.side; render(); return;
    case 'dd': e.stopPropagation(); ui.dd = ui.dd === v ? null : v; ui.kmenu = null; render(); return;
    case 'range': ui.range = v; ui.dd = null; render(); return;
    case 'theme': S.theme = S.theme === 'light' ? 'dark' : 'light'; save(); render(); return;
    case 'settheme': S.theme = v; save(); render(); return;
    case 'readall': S.notifs.forEach(n => n.read = true); save(); render(); return;
    case 'view': ui.view = v; render(); return;
    case 'kmenu': { e.stopPropagation(); const rc = a.getBoundingClientRect(); ui.kpos = { x: Math.max(8, Math.min(window.innerWidth - 240, t('dir') === 'rtl' ? rc.left : rc.right - 230)), y: Math.min(window.innerHeight - 330, rc.bottom + 4) }; ui.kmenu = ui.kmenu === id ? null : id; render(); return; }
    case 'move': moveLead(id, v); return;
    case 'lead': { ui.kmenu = null; ui.dd = null; ui.q = ''; if (rer) render(); leadModal(id); return; }
    case 'newlead': leadModal(null); return;
    case 'dellead': { const l = lead(id); S.leads = S.leads.filter(x => x.id !== id); S.convos = S.convos.filter(c => c.lead !== id); if (ui.chat && !S.convos.some(c => c.id === ui.chat)) ui.chat = S.convos[0] && S.convos[0].id; save(); closeModal(); ui.kmenu = null; toast(t('tDeleted'), 'trash', 'g-red'); render(); return; }
    case 'openchat': { const c = S.convos.find(x => x.lead === id); if (c) location.hash = '#/agent/chat/' + c.id; return; }
    case 'submit': { const f = $('#mf'); if (f) f.requestSubmit ? f.requestSubmit() : f.dispatchEvent(new Event('submit', { cancelable: true })); return; }
    case 'tf': ui.tf = v; render(); return;
    case 'tdone': { const x = S.tasks.find(y => y.id === id); x.done = !x.done; save(); render(); return; }
    case 'tdel': S.tasks = S.tasks.filter(y => y.id !== id); save(); render(); return;
    case 'newtask': taskModal(); return;
    case 'newmeet': meetModal(); return;
    case 'dayclick': meetModal(null, v); return;
    case 'calnav': { if (v === '0') { const d = new Date(); ui.cal = [d.getFullYear(), d.getMonth()]; } else { const d = new Date(ui.cal[0], ui.cal[1] + +v, 1); ui.cal = [d.getFullYear(), d.getMonth()]; } render(); return; }
    case 'camptoggle': { const c = S.campaigns.find(y => y.id === id); if (c.st === 'draft') { c.st = 'active'; c.sent = 1240; c.open = 0; } else c.st = c.st === 'active' ? 'paused' : 'active'; save(); toast(t('tSaved')); render(); return; }
    case 'newcamp': modal(t('newCamp'), `<form id="mf" data-form="camp"><div class="fld"><label>${t('cName')}</label><input name="name" required></div><div class="fld"><label>${t('cSubj')}</label><input name="subj"></div><div class="fld"><label>${t('cAud')}</label><select name="aud"><option>${t('aud1')}</option><option>${t('aud2')}</option><option>${t('aud3')}</option></select></div></form>`, `<button class="btn btn-soft" data-act="close">${t('cancel')}</button><button class="btn btn-lime" data-act="submit">${t('save')}</button>`); return;
    case 'export': toast(t('tExport'), 'download'); setTimeout(() => { try { window.print(); } catch (er) {} }, 600); return;
    case 'pref': S.prefs[v] = !S.prefs[v]; save(); render(); return;
    case 'integ': S.integ[v] = true; save(); toast(t('connected') + ' ✓', 'link'); render(); return;
    case 'savedtoast': toast(t('tSaved')); return;
    case 'saveagent': { const n = $('#agname'), tn = $('#agtone'); if (n) S.prefs.agName = n.value; if (tn) S.prefs.tone = tn.value; save(); toast(t('tSaved')); return; }
    case 'reset': store.del('sg_state'); S = seed(); save(); ui.chat = 'c1'; toast(t('tReset'), 'refresh'); render(); return;
    case 'auto': { const x = S.autos.find(y => y.id === id); x.on = !x.on; save(); render(); return; }
    case 'newkb': modal(t('kbAdd'), `<form id="mf" data-form="kb"><div class="fld"><label>${t('kbTitle')}</label><input name="title" required></div><div class="fld"><label>${t('kbContent')}</label><textarea name="text" rows="5"></textarea></div></form>`, `<button class="btn btn-soft" data-act="close">${t('cancel')}</button><button class="btn btn-green" data-act="submit">${t('save')}</button>`); return;
    case 'conv': ui.chat = id; ui.side = false; ui.ld = false; if (a.dataset.go || !location.hash.startsWith('#/agent/chat')) { location.hash = '#/agent/chat/' + id; } else { try { history.replaceState(null, '', '#/agent/chat/' + id); } catch (er) {} render(); } return;
    case 'ctab': ui.ctab = v; render(); return;
    case 'ldtoggle': ui.ld = !ui.ld; render(); return;
    case 'sim': ui.sim = v; render(); setTimeout(() => { const c = $('#compose'); if (c) c.focus(); }, 0); return;
    case 'sugg': sendMsg(t(v)); return;
    case 'attach': case 'emoji': { const c = $('#compose'); if (c) { if (act === 'emoji') c.value += '😊'; c.focus(); } return; }
    case 'qa-meet': { const c = S.convos.find(x => x.id === ui.chat); meetModal(c.lead); return; }
    case 'qa-task': { const c = S.convos.find(x => x.id === ui.chat); taskModal(c.lead); return; }
    case 'qa-prop': { const c = S.convos.find(x => x.id === ui.chat), l = lead(c.lead); const fn = t('propFile', { name: l.name.replace(/\s+/g, '_') }); c.msgs.push({ d: 'out', text: t('r_prop', { name: nm(l) }), file: fn, ts: NOW() }, { d: 'sys', k: 'sys_prop', ts: NOW() }); c.ts = NOW(); l.stage = 'proposal'; l.q = true; l.ts = NOW(); save(); toast(t('tProp', { name: esc(nm(l)) }), 'file', 'g-blue'); render(); return; }
    case 'qa-pipe': { const c = S.convos.find(x => x.id === ui.chat), l = lead(c.lead); if (['new', 'contacted'].includes(l.stage)) l.stage = 'qualified'; l.q = true; l.ts = NOW(); c.msgs.push({ d: 'sys', k: 'sys_pipe', ts: NOW() }); save(); toast(t('tPipe', { name: esc(nm(l)) }), 'layers', 'g-blue'); render(); return; }
  }
  if (rer) render();
});
document.addEventListener('change', e => {
  const c = e.target.dataset.ch; if (!c) return;
  if (c === 'range') ui.range = e.target.value; if (c === 'camp') ui.camp = e.target.value; if (c === 'lstage') { ui.lstage = e.target.value; fillLeads(); return; }
  render();
});
document.addEventListener('input', e => {
  const k = e.target.dataset.in; if (!k) return;
  if (k === 'gsearch') { ui.q = e.target.value; const q = ui.q.trim().toLowerCase(); $('#sres').innerHTML = q ? searchRes(q) : ''; }
  if (k === 'lsearch') { ui.lq = e.target.value; fillLeads(); }
  if (k === 'csearch') { ui.cq = e.target.value; $('#clist').innerHTML = clistHtml(); }
});
document.addEventListener('keydown', e => {
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-act][tabindex]') && !/INPUT|TEXTAREA|SELECT|BUTTON|A/.test(e.target.tagName)) { e.preventDefault(); e.target.click(); return; }
  if (e.key === 'Tab' && $('#modal .modal')) { const f = $$('#modal .modal button, #modal .modal a[href], #modal .modal input, #modal .modal select, #modal .modal textarea').filter(x => !x.disabled); if (f.length) { const a = f[0], z = f[f.length - 1]; if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); } } }
  if (e.key === 'Escape') { closeModal(); if (ui.dd || ui.kmenu) { ui.dd = ui.kmenu = null; render(); } } });
function sendMsg(text) {
  text = (text || '').trim(); if (!text) return;
  const c = S.convos.find(x => x.id === ui.chat); if (!c) return;
  const lg = detectLang(text);
  if (ui.sim === 'customer') { c.msgs.push({ d: 'in', text, lang: lg !== LANG ? lg : null, ts: NOW() }); c.ts = NOW(); save(); runAI(c, text); }
  else { c.msgs.push({ d: 'out', text, ts: NOW() }); c.ts = NOW(); const l = lead(c.lead); if (l.stage === 'new') l.stage = 'contacted'; save(); render(); }
  setTimeout(() => { const el = $('#compose'); if (el) el.focus(); }, 0);
}
document.addEventListener('submit', e => {
  const f = e.target, k = f.dataset.form; if (!k) return; e.preventDefault();
  const D = Object.fromEntries(new FormData(f).entries());
  if (k === 'login') { location.hash = '#/app/dashboard'; return; }
  if (k === 'send') { sendMsg(D.m); return; }
  if (k === 'contact') {
    const id = 'l' + NOW();
    S.leads.push({ id, name: D.name, ind: null, biz: D.co || t('src_website'), city: 'riyadh', stage: 'new', ts: NOW(), src: 'website', camp: 'web', value: 10000, score: 64, q: false, email: D.email, phone: D.phone, created: NOW() });
    S.convos.push({ id: 'c' + NOW(), lead: id, ch: 'email', ts: NOW(), unread: true, msgs: [{ d: 'in', text: D.msg || t('ctMsg'), ts: NOW() }] });
    notify('tLive', { src: t('src_website'), name: D.name }, 'users', 'g-green'); save();
    const btn = f.querySelector('button[type=submit]'); if (btn) btn.disabled = true;
    const waText = `${t('ctWaIntro')}\n${t('ctName')}: ${D.name}\n${t('ctCo')}: ${D.co || '-'}\n${t('ctPhone')}: ${D.phone}\n${t('ctEmail')}: ${D.email || '-'}\n${D.msg || ''}`;
    let finished = false;
    const fin = ok => { if (finished) return; finished = true; done(ok); };
    const done = ok => {
      if (btn) btn.disabled = false; f.reset();
      modal(t('ctThanksT'), `<p style="margin-bottom:16px;line-height:1.6">${ok ? t('ctThanksMail') : t('ctThanksNoMail')}</p><a class="btn btn-green" style="width:100%" href="https://wa.me/${OWNER.wa}?text=${encodeURIComponent(waText)}" target="_blank" rel="noopener">${WA.replace('<svg', '<svg width="20" height="20"')}${t('ctWa')}</a>`, `<button class="btn btn-soft" data-act="close">${t('close')}</button>`);
    };
    try {
      fetch('https://formsubmit.co/ajax/' + OWNER.email, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ _subject: 'New demo request — SaleGen AI portfolio', _template: 'table', _captcha: 'false', name: D.name, company: D.co, phone: D.phone, email: D.email, message: D.msg, language: LANG }) })
        .then(r => r.json()).then(j => fin(!!j && (j.success === true || j.success === 'true'))).catch(() => fin(false));
      setTimeout(() => fin(true), 4000); // FormSubmit can be slow; the request keeps sending in the background
    } catch (er) { done(false); }
    return;
  }
  if (k === 'lead') {
    const id = f.dataset.id; const l = id ? lead(id) : null;
    if (!D.name || !D.name.trim()) { f.querySelector('[name=name]').focus(); return; }
    if (l) {
      const was = l.stage;
      if (D.name !== nm(l)) { l.name = D.name; l.names = null; }
      Object.assign(l, { ind: D.ind, phone: D.phone, email: D.email, city: D.city, src: D.src, camp: D.camp, value: +D.value || 0, stage: D.stage, ts: NOW() });
      if (D.stage === 'won' && was !== 'won') toast(t('tWon', { v: fmt(l.value) }), 'deals', 'g-orange'); else toast(t('tSaved'));
    } else {
      S.leads.push({ id: 'l' + NOW(), name: D.name, ind: D.ind, city: D.city, stage: D.stage, ts: NOW(), src: D.src, camp: D.camp, value: +D.value || 0, score: 55 + Math.floor(Math.random() * 30), q: false, email: D.email, phone: D.phone, created: NOW() });
      toast(t('tLeadAdded'), 'plus');
    }
    save(); closeModal(); render(); return;
  }
  if (k === 'task') { S.tasks.push({ id: 't' + NOW(), title: D.title, p: D.p, due: new Date(D.due + 'T00:00').getTime(), done: false, lead: f.dataset.lead || null }); const c = f.dataset.lead && S.convos.find(x => x.lead === f.dataset.lead); if (c) c.msgs.push({ d: 'sys', k: 'sys_task', ts: NOW() }); save(); closeModal(); toast(t('tTask'), 'checksq'); render(); return; }
  if (k === 'meet') { const l = lead(D.lead); const ts = new Date(D.date + 'T' + (D.time || '11:00')).getTime(); bookMeeting(l, ts, D.title); closeModal(); render(); return; }
  if (k === 'camp') { S.campaigns.unshift({ id: 'e' + NOW(), name: D.name, st: 'draft', sent: 0, open: 0, click: 0, rep: 0 }); save(); closeModal(); toast(t('tCamp'), 'mail'); render(); return; }
  if (k === 'kb') { S.kb.push({ id: 'k' + NOW(), title: D.title, text: D.text, ic: 'book' }); save(); closeModal(); toast(t('tSaved')); render(); return; }
});
window.addEventListener('hashchange', () => { ui.side = false; ui.dd = null; ui.kmenu = null; closeModal(); render(); window.scrollTo(0, 0); });

/* live incoming leads while browsing the CRM */
setInterval(() => {
  if (!(isApp() || location.hash.startsWith('#/agent'))) return;
  if (S.live >= LIVE_POOL.length || $('#modal').innerHTML || ui.typing || ui.dd || ui.kmenu || (document.activeElement && /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName))) return;
  const p = LIVE_POOL[S.live++], id = 'lv' + NOW();
  S.leads.push({ id, name: p[0], names: { ar: p[1], ur: p[2] }, ind: p[3], city: p[4], stage: 'new', ts: NOW(), src: p[5], camp: p[6], value: p[7], score: 60 + S.live * 4, q: false, email: emailFor(p[0]), phone: phoneFor(40 + S.live), created: NOW() });
  if (['whatsapp', 'instagram', 'linkedin'].includes(p[5])) S.convos.push({ id: 'cv' + NOW(), lead: id, ch: p[5], ts: NOW(), unread: true, msgs: [{ d: 'in', k: 'm_live', ts: NOW() }] });
  notify('tLive', { src: t('src_' + p[5]), name: p[0] }, 'users', 'g-green');
  save(); render();
  toast(t('tLive', { src: t('src_' + p[5]), name: esc((LANG !== 'en' && p[LANG === 'ar' ? 1 : 2]) || p[0]) }), p[5] === 'whatsapp' ? 'wa' : 'users', 'g-green');
}, 30000);

render();
})();
