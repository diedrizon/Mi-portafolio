import { STATS, DOMAINS, IDENTITY } from '../data/profile';
import useCountUp from '../hooks/useCountUp';
import './about.css';

/**
 * [02] Perfil — qué hace, para quién y con qué evidencia.
 * Los indicadores usan count-up ligero (rAF ~1.1s) al entrar
 * en viewport; con prefers-reduced-motion muestran el valor final.
 */
export default function About() {
  const statsRef = useCountUp();

  return (
    <section id="perfil" className="section about">
      <div className="container">
        <header className="section-head">
          <p className="kicker">
            <span className="kicker__index">[02]</span> Perfil
          </p>
          <h2 className="section-title">Software que termina en decisiones</h2>
          <div className="axis" aria-hidden="true">
            <i />
          </div>
        </header>

        <div className="about__grid" data-reveal>
          <div className="about__text">
            <p>
              Soy <strong>Diedrizon Fargas</strong>, desarrollador de software
              y analista de datos en Juigalpa, Nicaragua. Trabajo el ciclo
              completo: modelo la base de datos, construyo el backend y la
              interfaz, y cierro con la capa de análisis —{' '}
              <strong>ETL, dashboards e indicadores</strong> que responden
              preguntas concretas del negocio.
            </p>
            <p>
              Desde 2022 desarrollo como freelance sistemas web, móviles y de
              BI para salud, finanzas, comercio y educación; en paralelo
              termino Ingeniería en Sistemas de la Información en la UNAN. Ese
              doble carril —producto y datos— es mi diferencial: no entrego
              solo una aplicación que funciona, entrego un sistema que{' '}
              <strong>mide lo que importa</strong>.
            </p>

            <ul
              className="about__domains"
              aria-label="Sectores en los que he trabajado"
            >
              {DOMAINS.map((d) => (
                <li key={d} className="chip">
                  {d}
                </li>
              ))}
            </ul>

            <ol className="about__timeline" aria-label="Línea de tiempo">
              <li>
                <span className="about__tl-year">2022</span>
                <span className="about__tl-text">
                  Inicio como freelance e ingreso a la {IDENTITY.education.split('·')[0].trim()}
                </span>
              </li>
              <li>
                <span className="about__tl-year">2026</span>
                <span className="about__tl-text">
                  Egreso de Ing. en Sistemas de la Información
                </span>
              </li>
            </ol>
          </div>

          <div className="about__stats marks" ref={statsRef}>
            <p className="about__stats-label">Indicadores</p>
            <dl className="about__kpis">
              {STATS.map((s) => (
                <div key={s.label} className="about__kpi">
                  <dt>{s.label}</dt>
                  <dd>
                    <span
                      className="about__kpi-value"
                      data-count={s.value}
                      data-suffix={s.suffix}
                    >
                      {s.value}
                      {s.suffix}
                    </span>
                    <span className="about__kpi-note">{s.note}</span>
                  </dd>
                </div>
              ))}
            </dl>
            <p className="about__stats-foot">Actualizado — Jun 2026</p>
          </div>
        </div>
      </div>
    </section>
  );
}
