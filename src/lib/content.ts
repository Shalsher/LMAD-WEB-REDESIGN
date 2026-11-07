/**
 * Content layer.
 *
 * Reads the extracted inventory in /content-inventory/data at BUILD TIME, so
 * nothing here ships to the browser. Every page is pre-rendered to static HTML.
 *
 * When LMAD moves to a real CMS this file is the only thing that changes — the
 * components consume these types, not the JSON shape.
 */

import storiesRaw from '../../content-inventory/data/stories.json';
import speakersRaw from '../../content-inventory/data/speakers.json';
import teamRaw from '../../content-inventory/data/core-team.json';
import quotesRaw from '../../content-inventory/data/participant-quotes.json';

/* ========================================================================== */
/* Types                                                                      */
/* ========================================================================== */

export type ThemeId = 'career' | 'family' | 'integrity' | 'habits' | 'confidence';

export interface Theme {
  id: ThemeId;
  label: string;
  /** Maps to one of the four logo block colours. */
  brand: 'green' | 'yellow' | 'blue' | 'red' | 'char';
}

export interface Story {
  slug: string;
  name: string;
  city: string;
  region: string;
  location: string;
  photo: string | null;
  signature: string | null;
  paragraphs: string[];
  wordCount: number;
  themes: ThemeId[];
  excerpt: string;
  /** Deduped significant words from the whole story, for client-side search. */
  keywords: string;
}

/* ========================================================================== */
/* Themes                                                                     */
/* ========================================================================== */

export const THEMES: Theme[] = [
  { id: 'career',     label: 'Career & Purpose',      brand: 'blue' },
  { id: 'family',     label: 'Family & Relationships', brand: 'green' },
  { id: 'integrity',  label: 'Honesty & Integrity',   brand: 'yellow' },
  { id: 'habits',     label: 'Habits & Addiction',    brand: 'red' },
  { id: 'confidence', label: 'Confidence & Self-Worth', brand: 'char' },
];

/**
 * PROTOTYPE ONLY — derived, not authored.
 *
 * None of the 182 stories carry theme tags on the current site, and the brief
 * needs a theme filter. These keyword rules give us a working filter to test
 * the interaction against real data. Before launch a human has to tag these
 * properly: a story about a father's death matching on "family" is fine, but
 * these rules cannot tell confession from description, and they will mislabel.
 */
const THEME_RULES: Record<ThemeId, RegExp> = {
  career: /\b(career|job|profession|engineer|college|study|studies|exam|workplace|business|ambition|purpose|IAS|placement|interview|salary)\b/i,
  family: /\b(father|mother|parents?|brother|sister|family|wife|husband|son|daughter|relationship|home|dad|mom|mummy|papa)\b/i,
  integrity: /\b(honest|honesty|truth|integrity|lie|lied|lying|cheat|cheating|stole|stealing|corrupt|bribe|apolog)\b/i,
  habits: /\b(addict|addiction|smoking|smoke|drink|drinking|alcohol|drugs?|porn|habit|screen time|phone addiction|gambl)\b/i,
  confidence: /\b(confiden|under.?confident|introvert|shy|self.?worth|self.?esteem|fear|anxiet|depress|insecur|lonely|loneliness)\b/i,
};

function deriveThemes(text: string): ThemeId[] {
  const hits = (Object.keys(THEME_RULES) as ThemeId[]).filter((id) =>
    THEME_RULES[id].test(text),
  );
  return hits.length ? hits : ['confidence'];
}

/* ========================================================================== */
/* City normalisation                                                         */
/* ========================================================================== */

/**
 * The extraction found 55 city spellings for what are fewer real places.
 * Collapsing them here is what lets the map and the filter agree on a count.
 */
const CITY_ALIASES: Record<string, string> = {
  Ahmedebad: 'Ahmedabad',
  Sholapur: 'Solapur',
  Bangalore: 'Bengaluru',
  Baroda: 'Vadodara',
  Delhi: 'New Delhi',
  Ahmednagr: 'Ahmednagar',
};

const REGION_ALIASES: Record<string, string> = {
  'Maharashtra.': 'Maharashtra',
  Orissa: 'Odisha',
  'Ajmer, Rajasthan': 'Rajasthan',
  Colorado: 'USA',
  Georgia: 'USA',
};

const normCity = (c: string) => CITY_ALIASES[c] ?? c;
const normRegion = (r: string) => REGION_ALIASES[r] ?? r;

/* ========================================================================== */
/* Stories                                                                    */
/* ========================================================================== */

interface RawStory {
  slug: string; name: string; city: string; region: string; location: string;
  photo: string | null; signature: string | null;
  paragraphs: string[]; wordCount: number;
}

/**
 * Search index.
 *
 * Shipping all 112,173 words to the browser would cost ~700 KB, which defeats
 * the point on a rural 3G connection. Instead each story contributes its
 * deduped significant words — full-story coverage at roughly a fifth the size.
 */
const STOPWORDS = new Set(
  ('the and that was for with have this from they been were what when there would could should about into your'
    + ' been will which their them then than some such only other more most many much very just also been being'
    + ' because before after over under again once here where both each few own same too can had has his her'
    + ' she him our out who how why did does doing done you are not but all any one two get got like make made'
    + ' time life know think thing things people person first last long great little').split(' '),
);

function buildKeywords(body: string): string {
  const words = body
    .toLowerCase()
    .replace(/[^a-z\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 4 && !STOPWORDS.has(w));
  return [...new Set(words)].join(' ');
}

export const stories: Story[] = (storiesRaw as RawStory[])
  .map((s) => {
    const body = s.paragraphs.join(' ');
    return {
      ...s,
      city: normCity(s.city),
      region: normRegion(s.region),
      themes: deriveThemes(body),
      excerpt: buildExcerpt(s.paragraphs),
      keywords: buildKeywords(body),
    };
  })
  .sort((a, b) => a.name.localeCompare(b.name));

/**
 * Excerpts end on a sentence boundary. The current site truncates mid-word
 * ("Those eight days th...") which is the thing the brief calls out by name.
 */
function buildExcerpt(paragraphs: string[], max = 180): string {
  const text = paragraphs.join(' ').replace(/\s+/g, ' ').trim();
  if (text.length <= max) return text;
  const window = text.slice(0, max);
  const lastStop = Math.max(window.lastIndexOf('. '), window.lastIndexOf('? '), window.lastIndexOf('! '));
  if (lastStop > max * 0.5) return window.slice(0, lastStop + 1);
  const lastSpace = window.lastIndexOf(' ');
  return window.slice(0, lastSpace > 0 ? lastSpace : max).trimEnd() + '…';
}

export const storyBySlug = (slug: string) => stories.find((s) => s.slug === slug);

/* ========================================================================== */
/* Facets                                                                     */
/* ========================================================================== */

function tally<T extends string>(values: T[]): { value: T; count: number }[] {
  const m = new Map<T, number>();
  for (const v of values) if (v) m.set(v, (m.get(v) ?? 0) + 1);
  return [...m.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));
}

export const cityFacets = tally(stories.map((s) => s.city));
export const regionFacets = tally(stories.map((s) => s.region));
export const themeFacets = THEMES.map((t) => ({
  ...t,
  count: stories.filter((s) => s.themes.includes(t.id)).length,
}));

/* ========================================================================== */
/* Other collections                                                          */
/* ========================================================================== */

export interface Speaker { id: string; name: string; photo: string | null; bio: string; wordCount: number; }
export const speakers = speakersRaw as Speaker[];

export interface TeamMember { name: string; role: string | null; photo: string | null; bio: string; wordCount: number; }
export const team = teamRaw as TeamMember[];

export interface Quote { name: string | null; quote: string; wordCount: number; }
export const quotes = quotesRaw as Quote[];

/* ========================================================================== */
/* Headline figures                                                           */
/* ========================================================================== */

/**
 * Every figure below is counted from the extracted content, not copied from a
 * brochure. `source` says where each one comes from so nobody has to trust it
 * blindly — and so the ones still needing a document are obvious.
 */
export const IMPACT_STATS = [
  { value: '33', suffix: '+', label: 'years', detail: 'Since 1993', brand: 'green', source: 'About Us page' },
  { value: '20,000', suffix: '+', label: 'lives touched', detail: 'Across India and beyond', brand: 'yellow', source: "Founder's bio, Working Team page" },
  { value: String(stories.length), suffix: '', label: 'stories told', detail: 'In their own words', brand: 'blue', source: 'Counted from the live site' },
  { value: String(new Set(stories.map((s) => s.city)).size), suffix: '', label: 'cities', detail: 'And 4 countries beyond India', brand: 'red', source: 'Counted from story datelines' },
] as const;

export const ORG = {
  name: "Let's Make A Difference",
  short: 'LMAD',
  founded: 1993,
  tagline: 'A national youth movement, non-political and non-religious, since 1993.',
  question: 'What is truly right for me, and how can I bring that change into my life?',
  address: 'A-394, 3rd Floor, Defence Colony, New Delhi – 110024, India',
  phone: '+91 84323-21993',
  email: 'info@lmad.in',
  social: {
    instagram: 'https://www.instagram.com/lmad.youth',
    youtube: 'https://www.youtube.com/@lmadproduction',
    facebook: 'https://www.facebook.com/pages/IofC-LMAD/220123374684520',
  },
} as const;
