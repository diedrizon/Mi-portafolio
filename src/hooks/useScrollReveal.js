import { useEffect } from 'react';
import anime from 'animejs/lib/anime.es.js';

/**
 * Revela en cascada (con anime.js) todos los elementos marcados con la clase
 * `.reveal` cuando entran en el viewport. Usa IntersectionObserver para
 * disparar una sola vez por elemento.
 *
 * Cada `.reveal` puede definir:
 *   - data-reveal="up|left|right|scale"  (dirección, por defecto "up")
 *   - data-reveal-delay="120"            (retardo base en ms)
 * y sus hijos directos con clase `.reveal-child` se animan en stagger.
 */
export default function useScrollReveal() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const nodes = Array.from(document.querySelectorAll('.reveal'));

    if (reduce) {
      nodes.forEach((n) => {
        n.style.opacity = 1;
        n.querySelectorAll('.reveal-child').forEach((c) => (c.style.opacity = 1));
      });
      return;
    }

    // estado inicial oculto
    nodes.forEach((n) => {
      n.style.opacity = 0;
    });

    const translate = (dir) => {
      switch (dir) {
        case 'left':
          return { translateX: [-60, 0] };
        case 'right':
          return { translateX: [60, 0] };
        case 'scale':
          return { scale: [0.85, 1] };
        default:
          return { translateY: [48, 0] };
      }
    };

    const obs = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          observer.unobserve(el);

          const dir = el.dataset.reveal || 'up';
          const delay = parseInt(el.dataset.revealDelay || '0', 10);
          const children = el.querySelectorAll('.reveal-child');

          el.style.opacity = 1;

          if (children.length) {
            anime({
              targets: children,
              ...translate(dir),
              opacity: [0, 1],
              duration: 800,
              delay: anime.stagger(90, { start: delay }),
              easing: 'easeOutExpo',
            });
          } else {
            anime({
              targets: el,
              ...translate(dir),
              opacity: [0, 1],
              duration: 850,
              delay,
              easing: 'easeOutExpo',
            });
          }
        });
      },
      { threshold: 0.15 }
    );

    nodes.forEach((n) => obs.observe(n));
    return () => obs.disconnect();
  }, []);
}
