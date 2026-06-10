import { useEffect, useRef } from 'react';

const easeOut = (t) => 1 - Math.pow(1 - t, 3);

/**
 * Anima contadores numéricos (elementos con [data-count]) dentro del nodo
 * referenciado, una sola vez, al entrar en viewport. rAF mínimo (~1s) y
 * respeta prefers-reduced-motion mostrando el valor final directamente.
 */
export default function useCountUp() {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return undefined;

    const targets = Array.from(root.querySelectorAll('[data-count]'));
    if (!targets.length) return undefined;

    const setFinal = () =>
      targets.forEach((el) => {
        el.textContent = el.dataset.count + (el.dataset.suffix || '');
      });

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setFinal();
      return undefined;
    }

    /* Con JS y movimiento permitido: parte de 0 hasta que el bloque entra
       en viewport (sin JS el markup ya trae el valor final). */
    targets.forEach((el) => {
      el.textContent = `0${el.dataset.suffix || ''}`;
    });

    let raf = 0;
    const run = () => {
      const start = performance.now();
      const duration = 1100;
      const tick = (now) => {
        const t = Math.min((now - start) / duration, 1);
        const k = easeOut(t);
        targets.forEach((el) => {
          el.textContent =
            String(Math.round(Number(el.dataset.count) * k)) +
            (el.dataset.suffix || '');
        });
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          run();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(root);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return ref;
}
