import "./QuietTime.css";
import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * "Take 60 Seconds of Silence".
 *
 * The brief's headline idea: let a stranger experience Quiet Time in the
 * browser before they read a word about it. Clicking dims the whole UI to a
 * breathing canvas and counts down 60 seconds.
 *
 * Deliberately no audio file — ambient sound that autoplays is hostile, and
 * the asset doesn't exist yet. The breathing guide carries it instead.
 */

const DURATION = 60;
/** One full breath cycle: in 4s, hold 2s, out 6s. */
const CYCLE = 12;

export default function QuietTime() {
  const [open, setOpen] = useState(false);
  const [remaining, setRemaining] = useState(DURATION);
  const [done, setDone] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setDone(false);
    setRemaining(DURATION);
    document.body.style.overflow = '';
    openerRef.current?.focus();
  }, []);

  const start = () => {
    openerRef.current = document.activeElement as HTMLElement;
    setRemaining(DURATION);
    setDone(false);
    setOpen(true);
    document.body.style.overflow = 'hidden';
  };

  // countdown
  useEffect(() => {
    if (!open || done) return;
    if (remaining <= 0) { setDone(true); return; }
    const t = window.setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => window.clearTimeout(t);
  }, [open, remaining, done]);

  // focus trap + escape
  useEffect(() => {
    if (!open) return;
    dialogRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { close(); return; }
      if (e.key !== 'Tab') return;
      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>('button, [href], [tabindex]:not([tabindex="-1"])');
      if (!focusables?.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, close]);

  useEffect(() => () => { document.body.style.overflow = ''; }, []);

  const elapsed = DURATION - remaining;
  const phase = elapsed % CYCLE;
  const breathLabel = phase < 4 ? 'Breathe in' : phase < 6 ? 'Hold' : 'Breathe out';
  const progress = (elapsed / DURATION) * 100;

  return (
    <>
      <button type="button" className="qt-trigger btn btn--quiet" onClick={start}>
        <span className="qt-trigger__dot" aria-hidden="true" />
        Take 60 seconds of silence
      </button>

      {open && (
        <div
          className="qt"
          role="dialog"
          aria-modal="true"
          aria-label="Sixty seconds of quiet"
          ref={dialogRef}
          tabIndex={-1}
        >
          <button type="button" className="qt__close" onClick={close} aria-label="End quiet time">
            Close
          </button>

          {!done ? (
            <div className="qt__body">
              <p className="qt__question">
                What is truly right for me, and how can I bring that change into my life?
              </p>

              <div className={`qt__orb ${reduced.current ? 'qt__orb--still' : ''}`} aria-hidden="true">
                <span className="qt__orb-ring" />
                <span className="qt__orb-core" />
              </div>

              <p className="qt__breath" aria-live="polite">{breathLabel}</p>

              <p className="qt__count">
                <span className="visually-hidden">Time remaining: </span>
                {remaining}s
              </p>

              <div className="qt__bar" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100} aria-label="Quiet time progress">
                <span style={{ width: `${progress}%` }} />
              </div>
            </div>
          ) : (
            <div className="qt__body qt__body--done">
              <p className="qt__done-eyebrow">That was one minute.</p>
              <h2 className="qt__done-title">At our conferences, it&rsquo;s the first thing every morning.</h2>
              <p className="qt__done-copy">
                Quiet Time is where the eight days begin. No lecture, no sermon &mdash; just the
                space to ask yourself an honest question and listen for the answer.
              </p>
              <div className="qt__done-actions">
                <a href="/stories" className="btn btn--primary">Read what changed for others</a>
                <button type="button" className="btn btn--ghost" onClick={close}>Back to the site</button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
