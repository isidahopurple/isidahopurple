// Deadline reminders for people who chose "Count me in and remind me" in the verification email.
// The daily cron (9 a.m. Boise) sends each reminder on its day, finishing the next day if the
// free email limit runs out. Every email has a one-click unsubscribe. All addresses are deleted Nov 4.
import { sign, unsign, takeBudget, today } from './pledge.js';

const FROM = 'Is Idaho Purple? <count@isidahopurple.com>';
const SITE = 'https://isidahopurple.com';
const DELETE_ON = '2026-11-04';

const FOOT = {
  en: (unsub) => `\n\n---\nYou're getting this because you asked for reminders when you joined the Is Idaho Purple? experiment. We delete your email address on Nov 4.\nStop reminders: ${unsub}\n\nMade and paid for by Ronald Baird, Idaho. Not authorized by any candidate or candidate's committee. No donations accepted.`,
  es: (unsub) => `\n\n---\nRecibe esto porque pidió recordatorios al unirse al experimento ¿Es Idaho morado? Borraremos su correo el 4 de noviembre.\nDejar de recibir recordatorios: ${unsub}\n\nHecho y pagado por Ronald Baird, Idaho. No autorizado por ningún candidato ni comité de candidato. No se aceptan donaciones.`,
};

// Keep every date and rule here in step with data/idaho/election.yaml.
export const REMINDERS = [
  {
    key: 'early-voting',
    day: '2026-10-19',
    en: {
      subject: 'Early voting starts today in Ada County',
      text: `A quick reminder from Is Idaho Purple?\n\n- Early voting in Ada County runs Oct 19 to Oct 30, weekdays 8 a.m. to 5 p.m. Other counties set their own dates: check VoteIdaho.\n- Voting by mail? Mail your ballot by Tue Oct 27. After that, use a drop box. It must arrive by 8 p.m. Nov 3.\n- Not registered, or want a mail ballot? The deadline is Fri Oct 23, 5 p.m.\n\nOfficial links, in one place: ${SITE}/vote`,
    },
    es: {
      subject: 'Hoy empieza la votación anticipada en el condado de Ada',
      text: `Un recordatorio rápido de ¿Es Idaho morado?\n\n- La votación anticipada en el condado de Ada es del 19 al 30 de octubre, de lunes a viernes, de 8 a.m. a 5 p.m. Otros condados fijan sus propias fechas: consulte VoteIdaho.\n- ¿Vota por correo? Envíe su boleta a más tardar el martes 27 de octubre. Después, use un buzón de boletas. Debe llegar antes de las 8 p.m. del 3 de noviembre.\n- ¿No está registrado o quiere una boleta por correo? La fecha límite es el viernes 23 de octubre, 5 p.m.\n\nEnlaces oficiales, en un solo lugar: ${SITE}/es/vote`,
    },
  },
  {
    key: 'deadline',
    day: '2026-10-22',
    en: {
      subject: 'Deadline tomorrow, 5 p.m.: register or request a mail ballot',
      text: `Tomorrow, Fri Oct 23 at 5 p.m., is Idaho's deadline to register and to request an absentee (mail) ballot.\n\n- Check or register: ${SITE}/\n- Miss it? You can still register in person when you vote early or on Election Day. Bring a photo ID and proof of your address.\n- Already have your mail ballot? Mail it by Tue Oct 27, or use a drop box.`,
    },
    es: {
      subject: 'Fecha límite mañana, 5 p.m.: regístrese o pida su boleta por correo',
      text: `Mañana, viernes 23 de octubre a las 5 p.m., es la fecha límite en Idaho para registrarse y para pedir una boleta de voto ausente (por correo).\n\n- Revise su registro o regístrese: ${SITE}/es/\n- ¿Se le pasó? Todavía puede registrarse en persona cuando vote de forma anticipada o el Día de las Elecciones. Lleve una identificación con foto y un comprobante de domicilio.\n- ¿Ya tiene su boleta por correo? Envíela a más tardar el martes 27 de octubre, o use un buzón de boletas.`,
    },
  },
  {
    key: 'election-eve',
    day: '2026-11-02',
    en: {
      subject: 'Tomorrow is Election Day',
      text: `Tomorrow, Tue Nov 3, is Election Day. Polls are open 8 a.m. to 8 p.m.\n\n- Find your polling place: ${SITE}/\n- Still have a mail ballot? Don't mail it now. Take it to a drop box or your county elections office by 8 p.m. tomorrow.\n- Bring a photo ID if you vote in person.\n\nThen we'll all find out: is Idaho purple?`,
    },
    es: {
      subject: 'Mañana es el Día de las Elecciones',
      text: `Mañana, martes 3 de noviembre, es el Día de las Elecciones. Los lugares de votación abren de 8 a.m. a 8 p.m.\n\n- Encuentre su lugar de votación: ${SITE}/es/\n- ¿Todavía tiene su boleta por correo? No la envíe ahora. Llévela a un buzón de boletas o a la oficina de elecciones de su condado antes de las 8 p.m. de mañana.\n- Si vota en persona, lleve una identificación con foto.\n\nY entonces todos sabremos: ¿es Idaho morado?`,
    },
  },
];

const nextDay = (d) => new Date(Date.parse(`${d}T12:00:00Z`) + 86400000).toISOString().slice(0, 10);

async function send(env, to, lang, r) {
  const m = r[lang] || r.en;
  const unsub = `${SITE}/api/unsubscribe?t=${await sign(env, { u: to, x: Date.parse('2026-11-10') })}`;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      from: FROM, to: [to], reply_to: 'contact@isidahopurple.com', subject: m.subject,
      text: m.text + FOOT[lang === 'es' ? 'es' : 'en'](unsub),
      headers: { 'List-Unsubscribe': `<${unsub}>` },
    }),
  });
  return res.ok ? 'sent' : res.status === 422 || res.status === 400 ? 'invalid' : 'retry';
}

// Runs from the daily cron. `day` can be overridden for testing.
export async function sendReminders(env, day = today()) {
  if (!env.DB || !env.RESEND_API_KEY) return;
  if (day >= DELETE_ON) {
    // Privacy promise: no email addresses after the election.
    await env.DB.batch(['reminders', 'reminder_sent', 'outbox', 'email_sends'].map((t) => env.DB.prepare(`DELETE FROM ${t}`)));
    return;
  }
  const due = REMINDERS.filter((r) => day === r.day || day === nextDay(r.day));
  for (const r of due) {
    const rows = (await env.DB.prepare(
      'SELECT email, lang FROM reminders WHERE email NOT IN (SELECT email FROM reminder_sent WHERE reminder = ?1)',
    ).bind(r.key).all()).results;
    for (const row of rows) {
      if (!(await takeBudget(env))) return; // out of today's free emails; the rest go tomorrow
      const result = await send(env, row.email, row.lang, r);
      if (result === 'retry') continue;
      await env.DB.prepare('INSERT OR IGNORE INTO reminder_sent (email, reminder) VALUES (?1, ?2)').bind(row.email, r.key).run();
      if (result === 'invalid') await env.DB.prepare('DELETE FROM reminders WHERE email = ?1').bind(row.email).run();
    }
  }
}

// GET /api/unsubscribe?t=... → removes the address from reminders.
export async function unsubscribe(url, env) {
  const p = env.HMAC_SECRET ? await unsign(env, url.searchParams.get('t')) : null;
  if (p?.u) await env.DB.batch([
    env.DB.prepare('DELETE FROM reminders WHERE email = ?1').bind(p.u),
    env.DB.prepare('DELETE FROM reminder_sent WHERE email = ?1').bind(p.u),
  ]);
  return Response.redirect(`${url.origin}/thanks?status=${p?.u ? 'unsubscribed' : 'expired'}`, 303);
}
