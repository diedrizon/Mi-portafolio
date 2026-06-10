import { PROJECTS } from '../data/profile';
import { ArrowUpRightIcon } from './Icons';
import './projects.css';

const pad = (n) => String(n + 1).padStart(3, '0');

function ProjectLinks({ links, name }) {
  if (!links.length) return null;
  return (
    <div className="proj__links">
      {links.map((l) => (
        <a
          key={l.href}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          className="proj__link"
          aria-label={`${l.label} — ${name} (se abre en pestaña nueva)`}
        >
          {l.label} <ArrowUpRightIcon />
        </a>
      ))}
    </div>
  );
}

/**
 * [04] Proyectos — los destacados se presentan como filas de
 * caso de estudio (índice, estado, narrativa, stack y enlaces);
 * el resto en una rejilla compacta. Los enlaces son elementos
 * propios (no toda la fila es un ancla) para mantener una
 * navegación por teclado limpia.
 */
export default function Projects() {
  const featured = PROJECTS.filter((p) => p.featured);
  const rest = PROJECTS.filter((p) => !p.featured);

  return (
    <section id="proyectos" className="section projects">
      <div className="container">
        <header className="section-head">
          <p className="kicker">
            <span className="kicker__index">[04]</span> Proyectos
          </p>
          <h2 className="section-title">Sistemas en uso, no demos</h2>
          <div className="axis" aria-hidden="true">
            <i />
          </div>
        </header>

        <div className="projects__featured" data-reveal>
          {featured.map((p, i) => (
            <article key={p.id} className="proj">
              <div className="proj__meta">
                <span className="proj__index" aria-hidden="true">
                  {pad(i)}
                </span>
                <span className="proj__status">{p.status}</span>
              </div>

              <div className="proj__body">
                <h3 className="proj__name">{p.name}</h3>
                <p className="proj__desc">{p.desc}</p>
                <ul className="proj__tech" aria-label="Tecnologías">
                  {p.tech.map((t) => (
                    <li key={t} className="chip">
                      {t}
                    </li>
                  ))}
                </ul>
                <ProjectLinks links={p.links} name={p.name} />
              </div>
            </article>
          ))}
        </div>

        <p className="projects__more-label">
          <span aria-hidden="true">//</span> Más proyectos
        </p>

        <div className="projects__grid" data-reveal>
          {rest.map((p) => (
            <article key={p.id} className="pcard">
              <div className="pcard__top">
                <h3 className="pcard__name">{p.name}</h3>
                <span className="pcard__status">{p.status}</span>
              </div>
              <p className="pcard__desc">{p.desc}</p>
              <div className="pcard__foot">
                <ul className="pcard__tech" aria-label="Tecnologías">
                  {p.tech.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                <ProjectLinks links={p.links} name={p.name} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
