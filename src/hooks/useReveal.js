import { useEffect } from 'react';

/**
 * Revela en cascada los contenedores [data-reveal] al entrar en viewport.
 * - Asigna a cada hijo un índice (--ri) que la CSS usa como stagger.
 * - Una sola IntersectionObserver para toda la página; se desconecta sola.
 * - Sin librerías: la animación vive en CSS (transform/opacity, GPU).
 */
export default function useReveal() {
  useEffect(() => {
    const nodes = document.querySelectorAll('[data-reveal]');
    if (!nodes.length) return undefined;

    nodes.forEach((node) => {
      Array.from(node.children).forEach((child, i) => {
        child.style.setProperty('--ri', String(i));
      });
    });

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      nodes.forEach((n) => n.classList.add('in'));
      return undefined;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);
}
