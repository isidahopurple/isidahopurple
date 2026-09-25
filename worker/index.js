// Worker in front of the static site. Only /api/* runs code; every other path is a static asset.
// Privacy: nothing here logs or stores addresses. See /privacy.
import { pledge, verify, tally, drainOutbox } from './pledge.js';

const CENSUS = 'https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress';
const STATE_FIPS = '16'; // Idaho

function json(body, status = 200, extra = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...extra },
  });
}

// GET /api/district?address=... → { county, ld, cd, matched } using the US Census geocoder.
async function district(url) {
  const address = (url.searchParams.get('address') || '').trim().slice(0, 200);
  if (address.length < 5) return json({ error: 'address_required' }, 400);
  const q = new URL(CENSUS);
  q.searchParams.set('address', /\bid(aho)?\b/i.test(address) ? address : `${address}, Idaho`);
  q.searchParams.set('benchmark', 'Public_AR_Current');
  q.searchParams.set('vintage', 'Current_Current');
  q.searchParams.set('format', 'json');
  let data;
  try {
    const r = await fetch(q, { cf: { cacheTtl: 0 } });
    if (!r.ok) return json({ error: 'lookup_unavailable' }, 502);
    data = await r.json();
  } catch {
    return json({ error: 'lookup_unavailable' }, 502);
  }
  const match = data?.result?.addressMatches?.[0];
  if (!match) return json({ error: 'not_found' }, 404);
  const g = match.geographies || {};
  const pick = (re) => Object.entries(g).find(([k]) => re.test(k))?.[1]?.[0];
  const state = pick(/^States$/);
  if (state?.STATE !== STATE_FIPS) return json({ error: 'not_idaho' }, 404);
  const upper = pick(/Legislative Districts - Upper/);
  const county = pick(/^Counties$/);
  const cd = pick(/Congressional Districts/);
  return json({
    matched: match.matchedAddress,
    county: county?.BASENAME ?? null,
    ld: upper ? Number(upper.BASENAME) : null,
    cd: cd ? Number(cd.BASENAME ?? cd.CD119 ?? cd.CD120) : null,
  });
}

// POST /api/click with body "check" | "register" | "absentee" | "where": count taps, nothing else.
const BUTTONS = new Set(['check', 'register', 'absentee', 'where']);
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
    if (url.pathname === '/api/tally' && request.method === 'GET') return tally(request, env, ctx);
    if (url.pathname.startsWith('/api/')) return json({ error: 'not_found' }, 404);
    return env.ASSETS.fetch(request);
  },
  async scheduled(_event, env, ctx) {
    ctx.waitUntil(drainOutbox(env));
  },
};
