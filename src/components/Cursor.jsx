import { useEffect, useRef, useState } from 'react';
import { gsap, reduced } from '../lib/motion';
import './cursor.css';

/**
 * Cursor de instrumento: punto ámbar + anillo en mix-blend
 * difference. Solo existe con puntero fino y hover real; el anillo
 * crece sobre elementos interactivos. Dos quickTo por capa — coste
 * mínimo, sensación enorme.
 */
export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (
      !reduced() &&
      window.matchMedia('(hover:hover) and (pointer:fine)').matches
    ) {
      setEnabled(true);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;
    const dot = dotRef.current;
    const ring = ringRef.current;
    document.documentElement.classList.add('has-cursor');

    const dx = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power2' });
    const dy = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power2' });
    const rx = gsap.quickTo(ring, 'x', { duration: 0.42, ease: 'power3' });
    const ry = gsap.quickTo(ring, 'y', { duration: 0.42, ease: 'power3' });

    let seen = false;
    const onMove = (e) => {
      if (!seen) {
        seen = true;
        gsap.set([dot, ring], { x: e.clientX, y: e.clientY, opacity: 1 });
      }
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
    };
    const onOver = (e) => {
      const hit = e.target.closest('[data-cursor], a, button');
      ring.classList.toggle('is-hover', Boolean(hit));
    };
    const onLeave = () => gsap.to([dot, ring], { opacity: 0, duration: 0.25 });
    const onEnter = () => gsap.to([dot, ring], { opacity: 1, duration: 0.25 });

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerover', onOver, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    document.documentElement.addEventListener('pointerenter', onEnter);

    return () => {
      document.documentElement.classList.remove('has-cursor');
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerover', onOver);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      document.documentElement.removeEventListener('pointerenter', onEnter);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="cursor" aria-hidden="true">
      <div ref={dotRef} className="cursor__dot" />
      <div ref={ringRef} className="cursor__ring" />
    </div>
  );
}
