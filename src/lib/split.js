import { gsap, reduced } from './motion';

/**
 * Entrada letra-por-letra para títulos de sección.
 * Envuelve cada carácter en <span> dobles (máscara + letra) y los
 * sube en cascada al entrar en viewport, una sola vez. El texto
 * original queda como aria-label del elemento.
 */
export function initLetterTitles(selector = '.section-title') {
  if (typeof document === 'undefined' || reduced()) return;

  document.querySelectorAll(selector).forEach((el) => {
    if (el.dataset.split) return;
    el.dataset.split = '1';
    const text = el.textContent;
    el.setAttribute('aria-label', text);
    el.textContent = '';

    const frag = document.createDocumentFragment();
    const letters = [];
    for (const ch of text) {
      if (ch === ' ') {
        frag.appendChild(document.createTextNode(' '));
        continue;
      }
      const wrap = document.createElement('span');
      wrap.className = 'lt';
      wrap.setAttribute('aria-hidden', 'true');
      const inner = document.createElement('span');
      inner.className = 'lt__c';
      inner.textContent = ch;
      wrap.appendChild(inner);
      frag.appendChild(wrap);
      letters.push(inner);
    }
    el.appendChild(frag);

    gsap.from(letters, {
      yPercent: 112,
      duration: 0.75,
      ease: 'expo.out',
      stagger: 0.022,
      scrollTrigger: {
        trigger: el,
        start: 'top 86%',
        once: true,
      },
    });
  });
}
