// Pledge tally: POST /api/pledge → email with a signed link → GET /api/verify counts it once.
// Needs secrets RESEND_API_KEY, TURNSTILE_SECRET, HMAC_SECRET and the D1 binding DB.
// The count link carries only an HMAC of the email. The optional "remind me" link carries the email
// because the person is asking us to keep it (decision C3); it's stored only if they click that link.

export const COUNTIES = ['Ada', 'Adams', 'Bannock', 'Bear Lake', 'Benewah', 'Bingham', 'Blaine', 'Boise', 'Bonner', 'Bonneville', 'Boundary', 'Butte', 'Camas', 'Canyon', 'Caribou', 'Cassia', 'Clark', 'Clearwater', 'Custer', 'Elmore', 'Franklin', 'Fremont', 'Gem', 'Gooding', 'Idaho', 'Jefferson', 'Jerome', 'Kootenai', 'Latah', 'Lemhi', 'Lewis', 'Lincoln', 'Madison', 'Minidoka', 'Nez Perce', 'Oneida', 'Owyhee', 'Payette', 'Power', 'Shoshone', 'Teton', 'Twin Falls', 'Valley', 'Washington'];

const DAILY_LIMIT = 95; // Resend free tier is 100/day; keep a margin
const LINK_TTL_MS = 3 * 24 * 3600 * 1000;
const FROM = 'Is Idaho Purple? <count@isidahopurple.com>';
const REPLY_TO = 'contact@isidahopurple.com';
const SHOW_COUNT_AT = 100; // decision C5
const PER_EMAIL_PER_DAY = 2; // stops anyone flooding one inbox with confirmation emails

const enc = new TextEncoder();
const today = () => new Date().toISOString().slice(0, 10);
const b64url = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const b64urlText = (s) => b64url(enc.encode(s));
const fromB64urlText = (s) => new TextDecoder().decode(Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0)));

async function hmac(secret, data) {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return b64url(await crypto.subtle.sign('HMAC', key, enc.encode(data)));
}
async function sign(env, payload) {
  const body = b64urlText(JSON.stringify(payload));
  return `${body}.${await hmac(env.HMAC_SECRET, `link:${body}`)}`;
}
async function unsign(env, token) {
  const [body, sig] = String(token || '').split('.');
  if (!body || !sig) return null;
  const expected = await hmac(env.HMAC_SECRET, `link:${body}`);
  if (expected.length !== sig.length) return null;
  let diff = 0;
  for (let i = 0; i < sig.length; i++) diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  if (diff) return null;
  try {
    const p = JSON.parse(fromB64urlText(body));
    return p.x > Date.now() ? p : null;
  } catch {
    return null;
  }
}

function json(body, status = 200, extra = {}) {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...extra } });
}

export const pledgeOpen = (env) => Boolean(env.DB && env.RESEND_API_KEY && env.TURNSTILE_SECRET && env.HMAC_SECRET);

async function turnstileOk(env, token, ip) {
  const form = new FormData();
  form.append('secret', env.TURNSTILE_SECRET);
  form.append('response', token || '');
  if (ip) form.append('remoteip', ip);
  const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: form });
  const d = await r.json().catch(() => ({}));
  return d.success === true;
}

const EMAIL = {
  en: {
    subject: 'Confirm: count me in the experiment',
    body: (count, remind) => `<p>Thanks for joining the Is Idaho Purple? experiment.</p>
<p><a href="${count}" style="display:inline-block;padding:12px 20px;background:#5b2d8e;color:#fff;border-radius:999px;text-decoration:none;font-weight:bold">Count me in</a></p>
<p>Want 2 or 3 short reminders before the deadlines (Oct 23 and Nov 3)? Use this link instead, and we'll keep your email until Nov 4, then delete it:<br><a href="${remind}">Count me in and remind me</a></p>
<p>If you didn't ask for this, ignore this email. Nothing is saved unless you click.</p>
<p style="color:#666;font-size:13px">Made and paid for by Ronald Baird, Idaho. Not authorized by any candidate or candidate's committee. No donations accepted. https://isidahopurple.com/privacy</p>`,
    text: (count, remind) => `Thanks for joining the Is Idaho Purple? experiment.\n\nCount me in: ${count}\n\nCount me in and send 2-3 deadline reminders (we keep your email until Nov 4): ${remind}\n\nIf you didn't ask for this, ignore this email. Nothing is saved unless you click.\n\nMade and paid for by Ronald Baird, Idaho. Not authorized by any candidate or candidate's committee. No donations accepted.`,
  },
  es: {
    subject: 'Confirme: cuenten conmigo en el experimento',
    body: (count, remind) => `<p>Gracias por unirse al experimento ¿Es Idaho morado?</p>
<p><a href="${count}" style="display:inline-block;padding:12px 20px;background:#5b2d8e;color:#fff;border-radius:999px;text-decoration:none;font-weight:bold">Cuenten conmigo</a></p>
<p>¿Quiere 2 o 3 recordatorios breves antes de las fechas límite (23 de octubre y 3 de noviembre)? Use este enlace; guardaremos su correo hasta el 4 de noviembre y luego lo borraremos:<br><a href="${remind}">Cuenten conmigo y recuérdenme</a></p>
<p>Si usted no lo pidió, ignore este correo. No se guarda nada a menos que haga clic.</p>
<p style="color:#666;font-size:13px">Hecho y pagado por Ronald Baird, Idaho. No autorizado por ningún candidato ni comité de candidato. No se aceptan donaciones. https://isidahopurple.com/es/privacy</p>`,
    text: (count, remind) => `Gracias por unirse al experimento ¿Es Idaho morado?\n\nCuenten conmigo: ${count}\n\nCuenten conmigo y envíenme 2-3 recordatorios (guardamos su correo hasta el 4 de noviembre): ${remind}\n\nSi usted no lo pidió, ignore este correo.\n\nHecho y pagado por Ronald Baird, Idaho. No autorizado por ningún candidato ni comité de candidato. No se aceptan donaciones.`,
  },
};

async function sendEmail(env, to, lang, link, remindLink) {
  const m = EMAIL[lang] || EMAIL.en;
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({ from: FROM, to: [to], reply_to: REPLY_TO, subject: m.subject, html: m.body(link, remindLink), text: m.text(link, remindLink) }),
  });
  return r.ok;
}

// Returns true if under today's budget and records the send.
async function takeBudget(env) {
  const day = today();
  const row = await env.DB.prepare('INSERT INTO send_log (day, sent) VALUES (?1, 1) ON CONFLICT(day) DO UPDATE SET sent = sent + 1 WHERE sent < ?2 RETURNING sent').bind(day, DAILY_LIMIT).first();
  return Boolean(row);
}

export async function pledge(request, env) {
  if (!pledgeOpen(env)) return json({ error: 'not_open' }, 503);
  const b = await request.json().catch(() => null);
  if (!b) return json({ error: 'bad_request' }, 400);
  const email = String(b.email || '').trim().toLowerCase();
  const county = COUNTIES.find((c) => c === b.county);
  const ld = Number.isInteger(Number(b.ld)) && Number(b.ld) >= 1 && Number(b.ld) <= 35 ? Number(b.ld) : null;
  const lang = b.lang === 'es' ? 'es' : 'en';
  const door = String(b.door || new URL(request.url).hostname).slice(0, 64);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return json({ error: 'bad_email' }, 400);
  if (!county) return json({ error: 'bad_county' }, 400);
  if (!(await turnstileOk(env, b.turnstile, request.headers.get('cf-connecting-ip')))) return json({ error: 'bot_check' }, 400);

  const h = await hmac(env.HMAC_SECRET, `email:${email}`);
  const already = await env.DB.prepare('SELECT 1 FROM pledges WHERE email_hmac = ?1').bind(h).first();
  if (already) return json({ status: 'already' });
  const sends = await env.DB.prepare('INSERT INTO email_sends (h, day, n) VALUES (?1, ?2, 1) ON CONFLICT(h, day) DO UPDATE SET n = n + 1 WHERE n < ?3 RETURNING n')
    .bind(h, today(), PER_EMAIL_PER_DAY).first();
  if (!sends) return json({ status: 'limit' });

  const base = { h, c: county, l: ld, g: lang, d: door, x: Date.now() + LINK_TTL_MS };
  const origin = new URL(request.url).origin;
  const link = `${origin}/api/verify?t=${await sign(env, base)}`;
  const remindLink = `${origin}/api/verify?t=${await sign(env, { ...base, e: email })}`;

  if (await takeBudget(env)) {
    if (await sendEmail(env, email, lang, link, remindLink)) return json({ status: 'sent' });
  }
  await env.DB.prepare('INSERT INTO outbox (email, link, remind_link, lang, created) VALUES (?1, ?2, ?3, ?4, ?5)').bind(email, link, remindLink, lang, today()).run();
  return json({ status: 'queued' });
}

export async function verify(url, env) {
  const p = pledgeOpen(env) ? await unsign(env, url.searchParams.get('t')) : null;
  const lang = p?.g === 'es' ? 'es' : 'en';
  const thanks = lang === 'es' ? '/es/thanks' : '/thanks';
  if (!p) return Response.redirect(`${url.origin}${thanks}?status=expired`, 303);
  const day = today();
  const stmts = [env.DB.prepare('INSERT OR IGNORE INTO pledges (email_hmac, county, ld, door, lang, day) VALUES (?1, ?2, ?3, ?4, ?5, ?6)').bind(p.h, p.c, p.l, p.d, lang, day)];
  if (p.e) stmts.push(env.DB.prepare('INSERT OR IGNORE INTO reminders (email, lang, day) VALUES (?1, ?2, ?3)').bind(p.e, lang, day));
  const [res] = await env.DB.batch(stmts);
  const status = res.meta.changes ? 'counted' : 'already';
  return Response.redirect(`${url.origin}${thanks}?status=${status}${p.e ? '&remind=1' : ''}`, 303);
}

export async function tally(request, env, ctx) {
  if (!env.DB) return json({ open: false });
  const cache = caches.default;
  const key = new Request(new URL('/api/tally', request.url).href);
  const hit = await cache.match(key);
  if (hit) return hit;
  const total = (await env.DB.prepare('SELECT COUNT(*) AS n FROM pledges').first())?.n ?? 0;
  const counties = (await env.DB.prepare('SELECT county, COUNT(*) AS n FROM pledges GROUP BY county ORDER BY n DESC').all()).results;
  const body = total >= SHOW_COUNT_AT ? { open: pledgeOpen(env), total, counties, show: true } : { open: pledgeOpen(env), show: false, goal: SHOW_COUNT_AT };
  const res = json(body, 200, { 'cache-control': 'public, max-age=60' });
  ctx.waitUntil(cache.put(key, res.clone()));
  return res;
}

// Cron: send queued verification emails within today's budget.
export async function drainOutbox(env) {
  if (!pledgeOpen(env)) return;
  const rows = (await env.DB.prepare('SELECT * FROM outbox ORDER BY id LIMIT ?1').bind(DAILY_LIMIT).all()).results;
  for (const r of rows) {
    if (!(await takeBudget(env))) break;
    if (await sendEmail(env, r.email, r.lang, r.link, r.remind_link)) await env.DB.prepare('DELETE FROM outbox WHERE id = ?1').bind(r.id).run();
  }
}
