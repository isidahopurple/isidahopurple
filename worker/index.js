// Worker in front of the static site. Only /api/* runs code; every other path is a static asset.
// Privacy: nothing here logs or stores addresses. See /privacy.
import { pledge, verify, tally, drainOutbox } from './pledge.js';
import { sendReminders, unsubscribe } from './reminders.js';

const CENSUS = 'https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress';
const STATE_FIPS = '16'; // Idaho

function json(body, status = 200, extra = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...extra },
  });
}

const CENSUS_COORDS = 'https://geocoding.geo.census.gov/geocoder/geographies/coordinates';
const NOMINATIM = 'https://nominatim.openstreetmap.org/search';
const UA = 'isidahopurple.com district lookup (contact@isidahopurple.com)';
const censusParams = (q) => { q.searchParams.set('benchmark', 'Public_AR_Current'); q.searchParams.set('vintage', 'Current_Current'); q.searchParams.set('format', 'json'); return q; };

// Census geographies object → our answer, or an error code.
function fromGeographies(g, matched, approx) {
  const pick = (re) => Object.entries(g || {}).find(([k]) => re.test(k))?.[1]?.[0];
  if (pick(/^States$/)?.STATE !== STATE_FIPS) return { error: 'not_idaho' };
  const upper = pick(/Legislative Districts - Upper/);
  const county = pick(/^Counties$/);
  const cd = pick(/Congressional Districts/);
  return { matched, approx, county: county?.BASENAME ?? null, ld: upper ? Number(upper.BASENAME) : null, cd: cd ? Number(cd.BASENAME) : null };
}

// The OpenStreetMap backup can match loosely ("Idaho Falls" → "Post Falls"). Accept its answer only
// if every place word the person typed appears in what it found.
const IGNORE = new Set(['id', 'idaho', 'usa', 'us', 'n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw', 'north', 'south', 'east', 'west',
  'st', 'street', 'ave', 'avenue', 'rd', 'road', 'dr', 'drive', 'ln', 'lane', 'way', 'blvd', 'boulevard', 'ct', 'court', 'pl', 'place',
  'cir', 'circle', 'hwy', 'highway', 'pkwy', 'parkway', 'ter', 'terrace', 'trl', 'trail', 'loop', 'apt', 'unit', 'ste', 'suite', 'the', 'of', 'and']);
const norm = (t) => ` ${t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/idaho (falls|city)/g, 'idaho$1').replace(/[^a-z0-9]+/g, ' ')} `;
function placeWordsMatch(query, found) {
  const f = norm(found);
  const words = norm(query).trim().split(' ').filter((w) => w.length > 1 && !/^\d+$/.test(w) && !IGNORE.has(w));
  return words.every((w) => f.includes(` ${w} `) || f.includes(` ${w}s `) || f.includes(` ${w.replace(/s$/, '')} `));
}

async function byCoords(lat, lon, matched, approx) {
  const q = censusParams(new URL(CENSUS_COORDS));
  q.searchParams.set('x', String(lon));
  q.searchParams.set('y', String(lat));
  const r = await fetch(q);
  if (!r.ok) return { error: 'lookup_unavailable' };
  return fromGeographies((await r.json())?.result?.geographies, matched, approx);
}

// GET /api/district?address=... or ?lat=..&lon=.. → { county, ld, cd, matched, approx }.
// 1) US Census address match. 2) If Census doesn't know the address (common for new homes),
// OpenStreetMap's free geocoder finds the spot and Census names its districts. Nothing is stored.
async function district(url) {
  try {
    const lat = Number(url.searchParams.get('lat'));
    const lon = Number(url.searchParams.get('lon'));
    if (url.searchParams.has('lat')) {
      if (!(lat > 41.9 && lat < 49.1 && lon > -117.3 && lon < -110.9)) return json({ error: 'not_idaho' }, 404);
      const out = await byCoords(lat.toFixed(4), lon.toFixed(4), null, false);
      return json(out, out.error ? 404 : 200);
    }
    const address = (url.searchParams.get('address') || '').trim().slice(0, 200);
    if (address.length < 5) return json({ error: 'address_required' }, 400);
    const full = /\bid(aho)?\b/i.test(address) ? address : `${address}, Idaho`;
    const q = censusParams(new URL(CENSUS));
    q.searchParams.set('address', full);
    const r = await fetch(q);
    const match = r.ok ? (await r.json())?.result?.addressMatches?.[0] : null;
    if (match) {
      const out = fromGeographies(match.geographies, match.matchedAddress, false);
      return json(out, out.error ? 404 : 200);
    }
    const n = new URL(NOMINATIM);
    n.searchParams.set('format', 'jsonv2');
    n.searchParams.set('limit', '5');
    n.searchParams.set('countrycodes', 'us');
    n.searchParams.set('viewbox', '-117.3,49.1,-110.9,41.9');
    n.searchParams.set('bounded', '1');
    n.searchParams.set('q', full);
    const nr = await fetch(n, { headers: { 'user-agent': UA, 'accept-language': 'en' } });
    const hits = nr.ok ? await nr.json() : [];
    const hit = (Array.isArray(hits) ? hits : []).find((h) => placeWordsMatch(address, h.display_name || ''));
    if (!hit) return json({ error: 'not_found' }, 404);
    const label = String(hit.display_name || '').split(',').slice(0, 4).join(',');
    const out = await byCoords(Number(hit.lat).toFixed(5), Number(hit.lon).toFixed(5), label, true);
    return json(out, out.error ? 404 : 200);
  } catch {
    return json({ error: 'lookup_unavailable' }, 502);
  }
}

// POST /api/click with a home-page step name: count taps, nothing else.
const BUTTONS = new Set(['check', 'register', 'absentee', 'where', 'ballot', 'watch', 'measures', 'plan', 'join', 'share']);
async function click(request, env) {
  const key = (await request.text()).trim().slice(0, 20);
  if (env.DB && BUTTONS.has(key)) {
    await env.DB.prepare('INSERT INTO clicks (day, button, n) VALUES (?1, ?2, 1) ON CONFLICT(day, button) DO UPDATE SET n = n + 1')
      .bind(new Date().toISOString().slice(0, 10), key).run();
  }
  return new Response(null, { status: 204 });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === '/api/district' && request.method === 'GET') return district(url);
    if (url.pathname === '/api/click' && request.method === 'POST') return click(request, env);
    if (url.pathname === '/api/pledge' && request.method === 'POST') return pledge(request, env);
    if (url.pathname === '/api/verify' && request.method === 'GET') return verify(url, env);
    if (url.pathname === '/api/unsubscribe' && request.method === 'GET') return unsubscribe(url, env);
    // Local testing only: wrangler dev with REMINDER_TEST=1 in .dev.vars.
    if (url.pathname === '/api/test-reminders' && env.REMINDER_TEST === '1') { await sendReminders(env, url.searchParams.get('day')); return new Response('ok'); }
    if (url.pathname === '/api/tally' && request.method === 'GET') return tally(request, env, ctx);
    if (url.pathname.startsWith('/api/')) return json({ error: 'not_found' }, 404);
    return env.ASSETS.fetch(request);
  },
  async scheduled(_event, env, ctx) {
    ctx.waitUntil(drainOutbox(env).then(() => sendReminders(env)));
  },
};
