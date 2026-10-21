import { useEffect, useRef, useState } from 'react';

export const PHOTO_BASE = `${import.meta.env.BASE_URL}photos/`;

// RFVNX's own BeamNG.drive screenshots. They show the stance the tool is for;
// they are not presented as output of loweredNG, so there are no captions.
const PHOTOS = [
  {
    file: 'wheel-fitment-closeup-960.webp',
    w: 960,
    h: 768,
    alt: 'Close-up of a front wheel tucked under the fender of a lowered black sedan',
    area: 'wheel',
  },
  {
    file: 'sedan-black-front-brick-960.webp',
    w: 960,
    h: 768,
    alt: 'Lowered black sedan on wide polished wheels in front of a brick building',
    area: 'front',
  },
  {
    file: 'sedan-black-rear-containers-960.webp',
    w: 960,
    h: 768,
    alt: 'The same sedan from the rear, parked low beside shipping containers',
    area: 'rear',
  },
  {
    file: 'coupe-white-livery-rear-960.webp',
    w: 960,
    h: 540,
    alt: 'White drift coupe with a sponsor livery and dished wheels, seen from the rear',
    area: 'coupe',
  },
];

export function PhotoStrip() {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  // Reveal once, the first time a quarter of the grid is on screen.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} className={`block photos${inView ? ' is-in' : ''}`} aria-label="Screenshots from BeamNG.drive and RFVNX wheel mods">
      {PHOTOS.map((p) => (
        <img
          key={p.file}
          className={`photo photo-${p.area}`}
          src={`${PHOTO_BASE}${p.file}`}
          width={p.w}
          height={p.h}
          alt={p.alt}
          loading="lazy"
          decoding="async"
        />
      ))}
      <div className="photo-promo">
        <h2>RFVNX wheel mods</h2>
        <p>Download RFVNX's wheel mods for BeamNG.drive on Ko-fi.</p>
        <a className="btn btn-outline" href="https://ko-fi.com/rfvnx" target="_blank" rel="noopener noreferrer">
          Get the wheels
          <span className="sr-only"> on ko-fi.com/rfvnx (opens in a new tab)</span>
        </a>
      </div>
    </section>
  );
}
