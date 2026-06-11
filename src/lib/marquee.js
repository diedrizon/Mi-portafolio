import { gsap, getLenis, reduced } from './motion';

/**
 * Marquesina reactiva: avanza sola y acelera/se inclina con la
 * velocidad del scroll (Lenis). El track debe contener su contenido
 * DUPLICADO (dos listas) para el bucle perfecto; el desplazamiento
 * se hace con módulo de la mitad del ancho.
 * Sin JS o con reduced-motion manda la animación CSS de respaldo.
 */
export function initMarquee(track, { speed = 60, reverse = false } = {}) {
  if (!track || typeof window === 'undefined' || reduced()) return () => {};

  track.classList.add('is-js'); // apaga la animación CSS de respaldo
  const dir = reverse ? 1 : -1;
  let x = 0;
  let half = track.scrollWidth / 2;
  const skewTo = gsap.quickTo(track, 'skewX', { duration: 0.5, ease: 'power3' });

  const onResize = () => {
    half = track.scrollWidth / 2;
  };
  window.addEventListener('resize', onResize);

  const tick = (_t, deltaMs) => {
    const dt = Math.min(deltaMs / 1000, 0.05);
    const lenis = getLenis();
    const vel = lenis ? lenis.velocity : 0; // px/frame aprox
    x += dir * (speed + Math.min(Math.abs(vel) * 5.5, 520)) * dt;
    const wrapped = ((x % half) + half) % half;
    gsap.set(track, { x: -wrapped });
    skewTo(gsap.utils.clamp(-4, 4, vel * 0.045));
  };
  gsap.ticker.add(tick);

  return () => {
    gsap.ticker.remove(tick);
    window.removeEventListener('resize', onResize);
    track.classList.remove('is-js');
    gsap.set(track, { clearProps: 'x,skewX' });
  };
}
