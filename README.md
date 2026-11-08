# LMAD — website rebuild

Rebuild of [lmad.in](https://lmad.in) for Let's Make A Difference, a youth movement running since 1993.

**Status: working prototype.** A vertical slice — homepage, story explorer, and all 182 story pages — running on the real content extracted from the current site.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # -> dist/  (184 static pages, ~4s)
npm run preview  # serve the build
```

---

## Stack

**Astro 5 + React islands**, static output.

The whole site pre-renders to plain HTML files. There is no Node runtime, no database and no server-side code in production — it can sit on LMAD's existing Hostinger space, and there is nothing to attack. React is used only for the three pieces that genuinely need state; everything else ships zero JavaScript.

| | |
|---|---|
| Framework | Astro 5.18 (`output: 'static'`) |
| Islands | React 18 — `QuietTime`, `PersonaSwitcher`, `StoryExplorer` |
| Styling | Hand-authored CSS with custom properties. No framework. |
| Content | Build-time import of `/content-inventory/data/*.json` |

---

## What's built

### `/` — homepage
- Hero leading with the movement's own question, not a stock photo
- **Take 60 seconds of silence** — dims the UI to a breathing canvas, 60s countdown, then a completion screen. The brief's flagship idea, working.
- **Persona switcher** — Youth / Parent / Alumni, as a proper ARIA tablist with arrow-key navigation
- Impact stats, every figure counted from LMAD's own published record
- Featured stories, the 8-day outline, and a join section

### `/stories` — story explorer
Replaces the current A–Z-by-first-name list (which shows visitors *"E — No Data Found."*).
- Filter by theme, region, and free text, all composable
- 182 story cards embedded — browsing and filtering work with no network
- Full-story search via a separate index fetched on search focus
- Real empty state instead of a dead end

### `/stories/[slug]` — 182 story pages
Long-form testimony at a readable measure. Per-story `Article` structured data, Open Graph tags carrying the person's own portrait, related stories by region and theme, prev/next. **Zero JavaScript.**

---

## Design system

Built from the logo, not from a palette picked alongside it. Colours were sampled directly from the supplied artwork:

| | hex | role |
|---|---|---|
| L — green | `#AFCB1F` | decoration, fills, category |
| M — yellow | `#FFCC01` | decoration, fills, category |
| A — blue | `#01A0E2` | decoration, fills, category |
| D — red | `#E31E25` | decoration, fills, category |
| wordmark | `#424242` | body text |

**The constraint:** those four are bright by design. As text on a light background they measure 1.43:1 (yellow), 1.74:1 (green), 2.78:1 (blue) and 4.42:1 (red) — none reach the 7:1 the brief's AAA target needs.

**The system:** each hue carries three roles, hue preserved —

- `--brand-*` — the true logo colour. Blocks, fills, the logo lockup. Never small text on light.
- `--brand-*-ink` — darkened to clear 7:1. Text and links.
- `--brand-*-surface` — pale tint for chips and category washes.

Variants are tuned against `#F2EEE8`, the *darkest* light surface, so they clear 7:1 everywhere rather than only on the base parchment. Dark mode inverts: the vivid logo colours sail past 7:1 on a dark ground and are used directly.

Full rationale and measured ratios are in [`src/styles/tokens.css`](src/styles/tokens.css).

---

## Measured results

Verified in-browser against the production build, not estimated.

### Weight (gzipped — what actually travels)

| page | new | current lmad.in |
|---|---|---|
| homepage | **8.2 KB** + 57 KB assets | 1.8 MB / 66 requests |
| story page | **6.2 KB, zero JS** | 45 KB + 30 scripts + 13 stylesheets |
| stories index | **27.3 KB** | 1.92 MB / 228 requests |

The 88 KB search index loads only when someone focuses the search box.

### Accessibility

| check | new | current lmad.in |
|---|---|---|
| Contrast failures (AA) | **0** light, **0** dark | 8 of 57 |
| Contrast failures (AAA) | **0** light, **0** dark | 10 of 57 |
| Visible focus ring | **all** | 0 of 40 |
| `<h1>` per page | **1** | 0 on homepage |
| Heading level skips | **0** | 2 |
| Images missing alt | **0** | 681 of 777 (88%) |
| Landmarks | main, nav, header, footer | **none** |
| Skip link | yes | no |
| Tap targets < 44px (mobile) | **0 of 39** | 30 of 43 |
| Body font (mobile) | **18px** | 14px |
| `prefers-reduced-motion` | honoured | ignored |
| Structured data | Organization + per-story Article | none |
| Open Graph tags | 6 per page | **none** |

---

## Content

All content comes from [`/content-inventory`](content-inventory/README.md) — a full extraction of the live site (216 pages, 156,618 words, 636 media assets). `src/lib/content.ts` is the only file that reads it; components consume typed objects, so moving to a CMS means changing that one file.

Two things it does on the way through:

**City normalisation.** The extraction found 55 city spellings for fewer real places (`Ahmedabad`/`Ahmedebad`, `Bangalore`/`Bengaluru`, `Baroda`/`Vadodara`). Collapsed to 49 so the filter and the future map agree on a count.

**Excerpts that end on a sentence.** The current site truncates mid-word — *"Those eight days th..."* — which the brief calls out by name.

---

## Known gaps

Honest list of what this prototype does not yet do.

1. **Story themes are derived, not authored.** No story on the live site carries theme tags, and the filter needs them, so `src/lib/content.ts` assigns them with keyword rules. They are good enough to test the interaction against real data and **will mislabel** — the rules cannot tell confession from description. A human has to tag these before launch.
2. **Story photos load from `lmad.in`.** Fine for a prototype; production needs them local, optimised and served as WebP/AVIF.
3. **Conference dates are placeholders.** The live site's "upcoming events" page lists three events that have already passed and never announces the flagship June conference, so there is no trustworthy source for real dates yet.
4. **The headline stats need source documents.** The figures shown are the ones traceable to LMAD's own published pages. The brief's other claims (32 national conferences, 106 regional programs, 300+ volunteers) are not stated anywhere on the current site.
5. **Not built yet:** India impact map, Letter to Self, certificate verification, donation flow, the remaining content pages, Hindi.
6. **React is 43 KB gzipped** of the homepage's budget. Swapping to Preact via `preact/compat` would cut it to roughly 4 KB with no component changes — worth doing before launch.
7. **Fonts come from Google Fonts.** Self-hosted subsets would remove two third-party connections from the critical path.

---

## Layout

```
src/
  components/     SiteHeader, SiteFooter (.astro)
                  QuietTime, PersonaSwitcher, StoryExplorer (.tsx + .css)
  layouts/        Base.astro — head, meta, OG, structured data, theme bootstrap
  lib/content.ts  the content layer
  pages/          index.astro
                  stories/index.astro
                  stories/[slug].astro
                  stories/search-index.json.ts
  styles/         tokens.css, global.css
content-inventory/  extracted content + migration notes
```

### Conventions

- Island CSS lives in a sibling `.css` file, never a `<style>` tag inside JSX — React escapes `>` in server-rendered style tags, which breaks hydration.
- Any new colour gets a measured contrast ratio in a comment next to it.
- Interactive elements are 44px minimum and must show a focus ring.
