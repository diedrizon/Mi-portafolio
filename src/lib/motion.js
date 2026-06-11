import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Capa de movimiento central.
 * - Un único Lenis (scroll inercial) sincronizado con ScrollTrigger
 *   a través del ticker de GSAP (una sola fuente de rAF).
 * - Con prefers-reduced-motion NO se crea Lenis y los consumidores
 *   deben saltarse sus tweens (helper `reduced()`).
 * - Navegación por anclas suavizada respetando la altura de la barra.
 */

let lenis = null;
let initialized = false;

/* Registro a nivel de módulo: los efectos de los componentes hijos
   corren ANTES que el de App, y sus timelines ya referencian
   scrollTrigger. En SSR no hay window y el registro se omite. */
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

export const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const getLenis = () => lenis;

export async function initMotion() {
  if (initialized || typeof window === 'undefined') return lenis;
  initialized = true;

  gsap.registerPlugin(ScrollTrigger);

  if (reduced()) {
    /* Sin suavizado: anclas nativas (scroll-behavior + scroll-margin-top). */
    return null;
  }

  const { default: Lenis } = await import('lenis');

  lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    syncTouch: false, // táctil nativo: mejor rendimiento y UX en móvil
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  /* Anclas internas con desplazamiento suave, offset de la barra
     y foco accesible. El skip-link conserva el salto nativo. */
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || a.classList.contains('skip-link')) return;
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target, {
      offset: -76,
      duration: 1.2,
      easing: (t) => 1 - Math.pow(1 - t, 4),
    });
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    history.replaceState(null, '', id);
  });

  /* Re-medir triggers cuando cargan imágenes diferidas */
  window.addEventListener('load', () => ScrollTrigger.refresh());

  return lenis;
}

/** Bloquea/desbloquea el scroll (preloader). */
export function lockScroll(locked) {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('is-locked', locked);
  if (lenis) (locked ? lenis.stop : lenis.start).call(lenis);
}

/**
 * Botones magnéticos: atrae ligeramente el elemento hacia el puntero.
 * Solo en dispositivos con hover real; coste = listeners locales + quickTo.
 */
export function initMagnetic(root = document) {
  if (typeof window === 'undefined') return;
  if (reduced() || !window.matchMedia('(hover:hover) and (pointer:fine)').matches)
    return;

  root.querySelectorAll('[data-magnetic]').forEach((el) => {
    const strength = Number(el.dataset.magnetic) || 0.32;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3' });

    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    });
    el.addEventListener('pointerleave', () => {
      xTo(0);
      yTo(0);
    });
  });
}
