import { useEffect, useRef } from 'react';
import { gsap, reduced } from '../lib/motion';
import './odometer.css';

const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

/**
 * Número tipo rodillo de instrumento: cada dígito es una columna
 * 0–9 que gira hasta su valor al entrar en viewport (una vez).
 * Con reduced-motion se muestra el valor final estático.
 */
export default function Odometer({ value, suffix = '' }) {
  const rootRef = useRef(null);
  const str = String(value);

  useEffect(() => {
    if (reduced()) {
      return undefined;
    }
    const cols = rootRef.current.querySelectorAll('.odo__col');
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: rootRef.current,
        start: 'top 88%',
        once: true,
      },
    });
    cols.forEach((col, i) => {
      const d = Number(col.dataset.digit);
      tl.fromTo(
        col,
        { yPercent: 0 },
        { yPercent: -d * 10, duration: 1.6, ease: 'expo.inOut' },
        i * 0.12
      );
    });
    return () => {
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    };
  }, []);

  if (typeof window !== 'undefined' && reduced()) {
    return (
      <span className="odo" aria-hidden="true">
        {str}
        {suffix && <span className="odo__suffix">{suffix}</span>}
      </span>
    );
  }

  return (
    <span className="odo" ref={rootRef} aria-hidden="true">
      {str.split('').map((ch, i) => (
        <span className="odo__win" key={i}>
          <span className="odo__col" data-digit={ch}>
            {DIGITS.map((d) => (
              <span key={d}>{d}</span>
            ))}
          </span>
        </span>
      ))}
      {suffix && <span className="odo__suffix">{suffix}</span>}
    </span>
  );
}
