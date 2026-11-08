import "./StoryExplorer.css";
import { useMemo, useState, useId, useEffect, useRef } from 'react';
import type { Theme, ThemeId } from '~/lib/content';

/**
 * Story explorer.
 *
 * Replaces the current A–Z-by-first-name list (which shows visitors
 * "E — No Data Found.") with filtering by theme, region and free text.
 *
 * Card data is embedded, so browsing and theme/region filtering work on first
 * paint with no network. The full-story search index is a separate file,
 * fetched when the search box is focused — browsers that never search never
 * pay for it.
 */

export interface ExplorerStory {
  slug: string;
  name: string;
  city: string;
  region: string;
  photo: string | null;
  excerpt: string;
  themes: ThemeId[];
  wordCount: number;
}

interface Props {
  stories: ExplorerStory[];
  themes: (Theme & { count: number })[];
  regions: { value: string; count: number }[];
}

const PAGE = 24;

export default function StoryExplorer({ stories, themes, regions }: Props) {
  const [theme, setTheme] = useState<ThemeId | 'all'>('all');
  const [region, setRegion] = useState('all');
  const [query, setQuery] = useState('');
  const [shown, setShown] = useState(PAGE);
  const [index, setIndex] = useState<Record<string, string> | null>(null);
  const requested = useRef(false);
  const searchId = useId();
  const regionId = useId();

  /** Pulled in on first focus of the search box — before the first keystroke lands. */
  const loadIndex = () => {
    if (requested.current) return;
    requested.current = true;
    fetch('/stories/search-index.json')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => data && setIndex(data))
      .catch(() => { /* search falls back to the excerpt */ });
  };

  // If a query arrives some other way (autofill, paste), make sure we fetch.
  useEffect(() => { if (query) loadIndex(); }, [query]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return stories.filter((s) => {
      if (theme !== 'all' && !s.themes.includes(theme)) return false;
      if (region !== 'all' && s.region !== region) return false;
      if (q) {
        const haystack = `${s.name} ${s.city} ${s.region} ${s.excerpt} ${index?.[s.slug] ?? ''}`;
        if (!haystack.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [stories, theme, region, query, index]);

  const visible = results.slice(0, shown);
  const reset = () => { setTheme('all'); setRegion('all'); setQuery(''); setShown(PAGE); };
  const activeFilters = (theme !== 'all' ? 1 : 0) + (region !== 'all' ? 1 : 0) + (query.trim() ? 1 : 0);

  const change = (fn: () => void) => { fn(); setShown(PAGE); };

  return (
    <div className="sx">
      <div className="sx__controls">
        <div className="sx__themes" role="group" aria-label="Filter by theme">
          <button
            type="button"
            className={`sx__chip ${theme === 'all' ? 'is-active' : ''}`}
            onClick={() => change(() => setTheme('all'))}
            aria-pressed={theme === 'all'}
          >
            All <span className="sx__chip-n">{stories.length}</span>
          </button>
          {themes.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`sx__chip sx__chip--${t.brand} ${theme === t.id ? 'is-active' : ''}`}
              onClick={() => change(() => setTheme(t.id))}
              aria-pressed={theme === t.id}
            >
              {t.label} <span className="sx__chip-n">{t.count}</span>
            </button>
          ))}
        </div>

        <div className="sx__row">
          <div className="sx__field">
            <label htmlFor={searchId}>Search stories</label>
            <input
              id={searchId}
              type="search"
              value={query}
              onFocus={loadIndex}
              placeholder="Name, city, or a word from the story"
              onChange={(e) => change(() => setQuery(e.target.value))}
            />
          </div>

          <div className="sx__field sx__field--region">
            <label htmlFor={regionId}>Region</label>
            <select id={regionId} value={region} onChange={(e) => change(() => setRegion(e.target.value))}>
              <option value="all">All regions</option>
              {regions.map((r) => (
                <option key={r.value} value={r.value}>{r.value} ({r.count})</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="sx__meta" role="status" aria-live="polite">
        <p>
          <strong>{results.length}</strong> {results.length === 1 ? 'story' : 'stories'}
          {activeFilters > 0 && <> matching your filters</>}
        </p>
        {activeFilters > 0 && (
          <button type="button" className="sx__clear" onClick={reset}>Clear filters</button>
        )}
      </div>

      {results.length === 0 ? (
        <div className="sx__empty">
          <h3>No stories match that yet.</h3>
          <p>
            Try a broader theme, or clear the filters to read all {stories.length}.
          </p>
          <button type="button" className="btn btn--ghost" onClick={reset}>Clear filters</button>
        </div>
      ) : (
        <>
          <ul className="sx__grid">
            {visible.map((s) => (
              <li key={s.slug}>
                <a className="sc card" href={`/stories/${s.slug}`}>
                  {s.photo && (
                    <img
                      className="sc__photo"
                      src={s.photo}
                      alt=""
                      width={120} height={120}
                      loading="lazy" decoding="async"
                    />
                  )}
                  <div className="sc__body">
                    <h3 className="sc__name">{s.name}</h3>
                    <p className="sc__place">{s.city}{s.region ? `, ${s.region}` : ''}</p>
                    <p className="sc__excerpt">{s.excerpt}</p>
                    <p className="sc__themes">
                      {s.themes.map((id) => {
                        const t = themes.find((x) => x.id === id);
                        return t ? <span key={id} className={`sc__tag sc__tag--${t.brand}`}>{t.label}</span> : null;
                      })}
                    </p>
                  </div>
                </a>
              </li>
            ))}
          </ul>

          {shown < results.length && (
            <div className="sx__more">
              <button type="button" className="btn btn--ghost" onClick={() => setShown((n) => n + PAGE)}>
                Show {Math.min(PAGE, results.length - shown)} more
              </button>
              <p className="sx__more-note">Showing {visible.length} of {results.length}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
