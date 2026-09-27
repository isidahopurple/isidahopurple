// UI strings and helpers for English and Spanish.
export type Lang = 'en' | 'es';

export const ATTRIBUTION = {
  en: 'Made and paid for by Ronald Baird, Idaho. Not authorized by any candidate or candidate’s committee. No donations accepted.',
  es: 'Hecho y pagado por Ronald Baird, Idaho. No autorizado por ningún candidato ni comité de candidato. No se aceptan donaciones.',
};

export const REPO_URL = 'https://github.com/isidahopurple/isidahopurple';
// Flip to true when the repo goes public; it turns on "edit this page" links.
export const REPO_PUBLIC = true;
export const CONTACT_EMAIL = 'contact@isidahopurple.com';

export const ui = {
  en: {
    'site.name': 'Is Idaho Purple?',
    'site.tagline': 'An open experiment for Idaho’s Nov 3, 2026 election.',
    'nav.home': 'Home',
    'nav.vote': 'How to vote',
    'nav.races': 'Races',
    'nav.experiment': 'The experiment',
    'nav.share': 'Share',
    'nav.about': 'About',
    'nav.privacy': 'Privacy',
    'nav.skip': 'Skip to content',
    'lang.switch': 'Español',
    'lang.switchLabel': 'Ver en español',
    'deadline.banner': 'Register or request an absentee ballot by Fri Oct 23, 5 p.m.',
    'deadline.cta': 'How to vote →',
    'footer.source': 'Every fact links to its source. Found an error?',
    'footer.contact': 'Tell us',
    'footer.open': 'Open source on GitHub. Anyone can check the data or fork it for their state.',
    'footer.edit': 'Edit this page on GitHub',
    'footer.updated': 'Last updated',
    'preview.banner': 'Preview build. Not public yet; picks and quotes are awaiting review.',
    'party.R': 'Republican',
    'party.D': 'Democrat',
    'party.I': 'Independent',
    'party.L': 'Libertarian',
    'party.C': 'Constitution',
    'party.NP': 'Nonpartisan',
    'party.Other': 'Other',
    'cand.incumbent': 'incumbent',
    'cand.withdrawn': 'withdrew, may still be on the ballot',
    'cand.website': 'Website',
    'quote.unverified': 'Quote not yet checked against the source',
    'race.controls': 'What this office controls',
    'race.candidates': 'Candidates',
    'race.polls': 'Polls',
    'race.history': 'Past results',
    'race.pick': 'The vote math',
    'race.scenarios': 'What your vote does',
    'race.sources': 'Sources',
    'race.unverified': 'Still being checked',
    'race.seeBallot': 'See your exact ballot on VoteIdaho',
    'race.pickPending': 'Draft: awaiting review',
    'race.notResearched': 'Not researched yet. Candidates only.',
    'race.sponsor': 'Paid for by',
    'race.sponsorNone': 'No sponsor (independent)',
    'race.sponsorUnknown': 'Sponsor not disclosed',
    'race.campaignPoll': 'Campaign poll',
    'race.undecided': 'Undecided',
    'race.pollCaution': 'Polls disagree. Campaign-paid polls are shown but never used to make a pick.',
    'pick.clear': 'Clear pick',
    'pick.two-way': 'Two-way race: turnout matters',
    'pick.not-sure': 'Not sure',
    'pick.no-pick': 'No pick',
    'pick.not-researched': 'Not researched yet',
    'pick.method': 'How we pick',
    'races.federal': 'Federal',
    'races.statewide': 'Statewide',
    'races.legislative': 'Legislature',
    'races.county': 'County',
    'races.measures': 'Ballot measures',
    'races.featured': 'Featured races',
    'races.open': 'Open',
    'measure.yes': 'A YES vote means',
    'measure.no': 'A NO vote means',
    'measure.passes': 'To pass',
    'measure.supporters': 'Supporters include',
    'measure.opponents': 'Opponents include',
    'measure.official': 'Official text and summary',
    'measure.neutral': 'We take no position on ballot measures. This is a plain-language summary.',
    'common.source': 'source',
    'common.back': 'Back',
  },
  es: {
    'site.name': '¿Es Idaho morado?',
    'site.tagline': 'Un experimento abierto para la elección del 3 de noviembre de 2026 en Idaho.',
    'nav.home': 'Inicio',
    'nav.vote': 'Cómo votar',
    'nav.races': 'Contiendas',
    'nav.experiment': 'El experimento',
    'nav.share': 'Compartir',
    'nav.about': 'Quiénes somos',
    'nav.privacy': 'Privacidad',
    'nav.skip': 'Ir al contenido',
    'lang.switch': 'English',
    'lang.switchLabel': 'View in English',
    'deadline.banner': 'Regístrese o pida su boleta de voto ausente antes del viernes 23 de octubre, 5 p.m.',
    'deadline.cta': 'Cómo votar →',
    'footer.source': 'Cada dato enlaza a su fuente. ¿Encontró un error?',
    'footer.contact': 'Avísenos',
    'footer.open': 'Código abierto en GitHub. Cualquiera puede revisar los datos o copiarlos para su estado.',
    'footer.edit': 'Editar esta página en GitHub',
    'footer.updated': 'Última actualización',
    'preview.banner': 'Versión preliminar. Aún no es pública; las recomendaciones y citas están en revisión.',
    'party.R': 'Republicano',
    'party.D': 'Demócrata',
    'party.I': 'Independiente',
    'party.L': 'Libertario',
    'party.C': 'Constitución',
    'party.NP': 'No partidista',
    'party.Other': 'Otro',
    'cand.incumbent': 'titular',
    'cand.withdrawn': 'se retiró, pero puede seguir en la boleta',
    'cand.website': 'Sitio web',
    'quote.unverified': 'Cita aún no verificada con la fuente',
    'race.controls': 'Qué controla este cargo',
    'race.candidates': 'Candidatos',
    'race.polls': 'Encuestas',
    'race.history': 'Resultados anteriores',
    'race.pick': 'Las matemáticas del voto',
    'race.scenarios': 'Qué hace su voto',
    'race.sources': 'Fuentes',
    'race.unverified': 'Aún en verificación',
    'race.seeBallot': 'Vea su boleta exacta en VoteIdaho',
    'race.pickPending': 'Borrador: en revisión',
    'race.notResearched': 'Aún sin investigar. Solo candidatos.',
    'race.sponsor': 'Pagada por',
    'race.sponsorNone': 'Sin patrocinador (independiente)',
    'race.sponsorUnknown': 'Patrocinador no revelado',
    'race.campaignPoll': 'Encuesta de campaña',
    'race.undecided': 'Indecisos',
    'race.pollCaution': 'Las encuestas no coinciden. Mostramos las pagadas por campañas, pero nunca las usamos para recomendar.',
    'pick.clear': 'Recomendación clara',
    'pick.two-way': 'Contienda de dos: la participación decide',
    'pick.not-sure': 'No es seguro',
    'pick.no-pick': 'Sin recomendación',
    'pick.not-researched': 'Aún sin investigar',
    'pick.method': 'Cómo elegimos',
    'races.federal': 'Federal',
    'races.statewide': 'Estatal',
    'races.legislative': 'Legislatura',
    'races.county': 'Condado',
    'races.measures': 'Medidas en la boleta',
    'races.featured': 'Contiendas destacadas',
    'races.open': 'Abierta',
    'measure.yes': 'Votar SÍ significa',
    'measure.no': 'Votar NO significa',
    'measure.passes': 'Para aprobarse',
    'measure.supporters': 'A favor',
    'measure.opponents': 'En contra',
    'measure.official': 'Texto y resumen oficial',
    'measure.neutral': 'No tomamos posición sobre las medidas. Este es un resumen en lenguaje sencillo.',
    'common.source': 'fuente',
    'common.back': 'Volver',
  },
} as const;

export type UIKey = keyof (typeof ui)['en'];

export function t(lang: Lang, key: UIKey): string {
  return ui[lang][key] ?? ui.en[key];
}

// Localized data field: plain string (English) or { en, es }.
export type Text = string | { en: string; es?: string };
export function tx(value: Text | undefined, lang: Lang): string {
  if (value === undefined) return '';
  if (typeof value === 'string') return value;
  return (lang === 'es' && value.es) || value.en;
}
// True when Spanish was asked for but only English exists.
export function untranslated(value: Text | undefined, lang: Lang): boolean {
  if (lang !== 'es' || value === undefined) return false;
  return typeof value === 'string' || !value.es;
}

// Path helpers: English lives at /x, Spanish at /es/x.
export function href(lang: Lang, path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (lang === 'en') return clean;
  return clean === '/' ? '/es/' : `/es${clean}`;
}
export function otherLangPath(lang: Lang, pathname: string): string {
  if (lang === 'es') return pathname.replace(/^\/es(\/|$)/, '/') || '/';
  return pathname === '/' ? '/es/' : `/es${pathname}`;
}

export function fmtDate(iso: string, lang: Lang): string {
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(lang === 'es' ? 'es-US' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
