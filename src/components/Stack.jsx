import { SKILL_GROUPS, TICKER } from '../data/profile';
import './stack.css';

/**
 * [03] Stack — ticker continuo (solo texto, CSS transform) y
 * matriz de capacidades agrupadas por dominio. El ticker se
 * duplica con aria-hidden para el loop infinito; se pausa al
 * hacer hover y se detiene con prefers-reduced-motion.
 */
export default function Stack() {
  return (
    <section id="stack" className="section stack">
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
        <div className="stack__track">
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
