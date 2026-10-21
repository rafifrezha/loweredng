import { useEffect, useLayoutEffect, useState } from 'react';

const BRAND = `${import.meta.env.BASE_URL}brand/`;

// Hold before the curtain lifts, counted from mount. The logo finishes
// arriving at 650ms; the rest is a short beat to read it. With the 650ms
// lift the whole intro runs 1.5s.
const HOLD_MS = 850;
const HOLD_REDUCED_MS = 900;

type Stage = 'playing' | 'leaving' | 'gone';

/**
 * Brand intro on every page load: the wheel rolls in, the wordmark wipes on,
 * then the dark screen lifts off the page. Any click or key skips straight
 * to the lift.
 */
export function Intro() {
  const [stage, setStage] = useState<Stage>('playing');

  // Pause the hero's own entrance until the curtain starts lifting, and lock scroll meanwhile.
  useLayoutEffect(() => {
    document.documentElement.classList.toggle('intro-playing', stage === 'playing');
  }, [stage]);

  useEffect(() => {
    if (stage !== 'playing') return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timer = window.setTimeout(() => setStage('leaving'), reduce ? HOLD_REDUCED_MS : HOLD_MS);
    const skip = () => setStage('leaving');
    window.addEventListener('keydown', skip);
    window.addEventListener('pointerdown', skip);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('keydown', skip);
      window.removeEventListener('pointerdown', skip);
    };
  }, [stage]);

  if (stage === 'gone') return null;

  return (
    <div
      className={`intro${stage === 'leaving' ? ' is-leaving' : ''}`}
      aria-hidden="true"
      onAnimationEnd={(e) => {
        if (e.target === e.currentTarget && stage === 'leaving') setStage('gone');
      }}
    >
      <div className="intro-stage">
        <div className="intro-logo">
          <img className="intro-emblem" src={`${BRAND}loweredng-emblem.webp`} width={880} height={445} alt="" />
          <img className="intro-wordmark" src={`${BRAND}loweredng-wordmark.webp`} width={880} height={144} alt="" />
        </div>
      </div>
    </div>
  );
}
