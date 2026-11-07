import "./PersonaSwitcher.css";
import { useState } from 'react';

/**
 * Intent-driven persona switcher.
 *
 * The brief's "3-lens architecture": one visitor in three very different
 * frames of mind, each needing a different first answer. Rendered as a real
 * tablist so it works with a keyboard and announces correctly.
 */

type PersonaId = 'youth' | 'parent' | 'alumni';

interface Persona {
  id: PersonaId;
  tab: string;
  brand: 'blue' | 'green' | 'yellow';
  headline: string;
  body: string;
  points: { title: string; detail: string }[];
  cta: { label: string; href: string };
  secondary: { label: string; href: string };
}

const PERSONAS: Persona[] = [
  {
    id: 'youth',
    tab: 'Youth / Student',
    brand: 'blue',
    headline: 'Career confusion, screen fatigue, relationships that feel stuck?',
    body:
      'You will not be lectured. Eight days, no phones, a room full of people your age being honest about the same things you are carrying.',
    points: [
      { title: 'No sermons', detail: 'Non-political, non-religious. Nobody tells you what to believe.' },
      { title: 'People like you', detail: '182 participants have written down what changed, in their own words.' },
      { title: 'It is residential', detail: 'Eight days, June 1–8. You arrive a stranger and leave with a family.' },
    ],
    cta: { label: 'Read their stories', href: '/stories' },
    secondary: { label: 'What happens in 8 days', href: '#programs' },
  },
  {
    id: 'parent',
    tab: 'Parent / Guardian',
    brand: 'green',
    headline: 'You want to know it is safe, supervised and worth the eight days.',
    body:
      'A 33-year-old registered educational trust, run by named trustees, with published reports going back to 1996.',
    points: [
      { title: 'Non-political, non-religious', detail: 'Stated plainly and held to for 33 years.' },
      { title: 'Named, reachable people', detail: '30 team members and 7 trustees are listed with their own bios.' },
      { title: 'A published record', detail: '142 conference and impact reports, the oldest from 1996.' },
    ],
    cta: { label: 'For parents & guardians', href: '#parents' },
    secondary: { label: 'Talk to a coordinator', href: '#contact' },
  },
  {
    id: 'alumni',
    tab: 'Alumni / Supporter',
    brand: 'yellow',
    headline: 'You already know what this does. Here is where it is going.',
    body:
      'Impact reports, the Haridwar Fellowship, and a transparent route for giving — with 80G exemption.',
    points: [
      { title: 'Annual impact reports', detail: 'Independent assessments for 2022–23 through 2025–26.' },
      { title: 'Where it reaches', detail: '49 cities across India, and four countries beyond it.' },
      { title: '80G exemption', detail: 'Registered under Section 10(23C) of the Income Tax Act, 1961.' },
    ],
    cta: { label: 'Support the movement', href: '#donate' },
    secondary: { label: 'Verify a certificate', href: '#verify' },
  },
];

export default function PersonaSwitcher() {
  const [active, setActive] = useState<PersonaId>('youth');
  const current = PERSONAS.find((p) => p.id === active)!;

  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    const keys: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1 };
    if (!(e.key in keys) && e.key !== 'Home' && e.key !== 'End') return;
    e.preventDefault();
    let next = index;
    if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = PERSONAS.length - 1;
    else next = (index + keys[e.key] + PERSONAS.length) % PERSONAS.length;
    setActive(PERSONAS[next].id);
    document.getElementById(`persona-tab-${PERSONAS[next].id}`)?.focus();
  };

  return (
    <div className="ps">
      <p className="ps__lead" id="persona-label">I am a…</p>

      <div className="ps__tabs" role="tablist" aria-labelledby="persona-label">
        {PERSONAS.map((p, i) => (
          <button
            key={p.id}
            id={`persona-tab-${p.id}`}
            role="tab"
            type="button"
            aria-selected={active === p.id}
            aria-controls={`persona-panel-${p.id}`}
            tabIndex={active === p.id ? 0 : -1}
            className={`ps__tab ps__tab--${p.brand} ${active === p.id ? 'is-active' : ''}`}
            onClick={() => setActive(p.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
          >
            {p.tab}
          </button>
        ))}
      </div>

      <div
        className={`ps__panel ps__panel--${current.brand}`}
        id={`persona-panel-${current.id}`}
        role="tabpanel"
        aria-labelledby={`persona-tab-${current.id}`}
        tabIndex={0}
        key={current.id}
      >
        <div className="ps__panel-main">
          <h3 className="ps__headline">{current.headline}</h3>
          <p className="ps__body">{current.body}</p>
          <div className="ps__actions">
            <a className="btn btn--primary" href={current.cta.href}>{current.cta.label}</a>
            <a className="btn btn--ghost" href={current.secondary.href}>{current.secondary.label}</a>
          </div>
        </div>

        <ul className="ps__points">
          {current.points.map((pt) => (
            <li key={pt.title}>
              <strong>{pt.title}</strong>
              <span>{pt.detail}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
