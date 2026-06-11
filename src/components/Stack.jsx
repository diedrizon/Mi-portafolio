import { useEffect, useRef } from 'react';
import { SKILL_GROUPS, TICKER } from '../data/profile';
import { reduced } from '../lib/motion';
import { initMarquee } from '../lib/marquee';
import { scramble } from '../lib/scramble';
import './stack.css';

/**
 * [03] Stack — ticker continuo (solo texto, CSS transform) y
 * matriz de capacidades agrupadas por dominio. El ticker se
 * duplica con aria-hidden para el loop infinito; se pausa al
 * hacer hover y se detiene con prefers-reduced-motion.
 */
export default function Stack() {
  const rootRef = useRef(null);
  const trackRef = useRef(null);

  /* Marquesina reactiva a la velocidad del scroll */
  useEffect(() => initMarquee(trackRef.current, { speed: 55, reverse: true }), []);

  /* Descifrado de los títulos de dominio la primera vez que entran */
  useEffect(() => {
    if (reduced()) return undefined;
    const titles = rootRef.current.querySelectorAll('.stack__domain');
    const cancels = [];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target;
          io.unobserve(el);
          cancels.push(scramble(el, el.textContent, { duration: 760 }));
        });
      },
      { threshold: 0.6 }
    );
    titles.forEach((t) => io.observe(t));
    return () => {
      io.disconnect();
      cancels.forEach((c) => c());
    };
  }, []);

  return (
    <section id="stack" className="section stack" ref={rootRef}>
      <div className="container">
        <header className="section-head">
          <p className="kicker">
            <span className="kicker__index">[03]</span> Stack
          </p>
          <h2 className="section-title">Herramientas con propósito</h2>
          <div className="axis" aria-hidden="true">
            <i />
          </div>
        </header>
      </div>

      <div className="stack__ticker" aria-label="Tecnologías principales">
        <div className="stack__track" ref={trackRef}>
          <ul className="stack__list">
            {TICKER.map((t) => (
              <li key={t}>
                {t}
                <span className="stack__sep" aria-hidden="true">
                  ◆
                </span>
              </li>
            ))}
          </ul>
          <ul className="stack__list" aria-hidden="true">
            {TICKER.map((t) => (
              <li key={t}>
                {t}
                <span className="stack__sep">◆</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container">
        <dl className="stack__matrix" data-reveal>
          {SKILL_GROUPS.map((g) => (
            <div key={g.title} className="stack__row">
              <dt className="stack__domain">{g.title}</dt>
              <dd className="stack__items">
                {g.items.map((item) => (
                  <span key={item} className="chip">
                    {item}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
