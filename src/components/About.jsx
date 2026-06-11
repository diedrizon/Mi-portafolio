import { useLayoutEffect, useRef } from 'react';
import { STATS, DOMAINS, IDENTITY } from '../data/profile';
import Odometer from './Odometer';
import { gsap, reduced } from '../lib/motion';
import retratoAvif from '../assets/retrato.avif';
import retratoWebp from '../assets/retrato.webp';
import './about.css';

const STATEMENT = [
  ['No'], ['hago'], ['páginas'], ['sueltas.'],
  ['Construyo'], ['sistemas', 'em'], ['que'], ['capturan'], ['datos,', 'em'],
  ['los'], ['ordenan'], ['y'], ['los'], ['convierten'], ['en'],
  ['decisiones.', 'em'],
];

/**
 * [02] Perfil — qué hace, para quién y con qué evidencia.
 * Los indicadores usan count-up ligero (rAF ~1.1s) al entrar
 * en viewport; con prefers-reduced-motion muestran el valor final.
 */
export default function About() {
  const mfRef = useRef(null);
  const figRef = useRef(null);

  /* Ensamblado del retrato: revelado + capa ámbar que se asienta */
  useLayoutEffect(() => {
    const fig = figRef.current;
    if (reduced()) {
      gsap.set(fig, { clearProps: 'all' });
      return undefined;
    }
    const ctx = gsap.context(() => {
      gsap.set(fig, { clipPath: 'inset(100% 0% 0% 0%)' });
      gsap.set('.about__fig-ghost', { x: -22, opacity: 0.5 });
      gsap.set('.about__fig-scan', { yPercent: -110 });
      const tl = gsap.timeline({
        scrollTrigger: { trigger: fig, start: 'top 80%', once: true },
        defaults: { ease: 'expo.out' },
      });
      tl.to(fig, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2 })
        .to('.about__fig-scan', { yPercent: 240, duration: 1.1, ease: 'power2.inOut' }, 0.05)
        .to('.about__fig-ghost', { x: 0, opacity: 0.16, duration: 1.0 }, 0.25);
    }, fig);
    return () => ctx.revert();
  }, []);

  /* Llenado de palabras conducido por scroll */
  useLayoutEffect(() => {
    const words = mfRef.current.querySelectorAll('span');
    if (reduced()) {
      words.forEach((w) => {
        w.style.color = w.classList.contains('mf-em') ? '#f5a623' : '#ede8dd';
      });
      return undefined;
    }
    const ctx = gsap.context(() => {
      gsap.set(words, { color: 'rgba(138, 133, 123, 0.34)' });
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: mfRef.current,
          start: 'top 78%',
          end: 'bottom 42%',
          scrub: 0.6,
        },
      });
      words.forEach((w, i) => {
        tl.to(
          w,
          {
            color: w.classList.contains('mf-em') ? '#f5a623' : '#ede8dd',
            duration: 1,
            ease: 'none',
          },
          i * 0.55
        );
      });
    }, mfRef);
    return () => ctx.revert();
  }, []);

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

        <p className="about__mf" ref={mfRef} aria-label="No hago páginas sueltas. Construyo sistemas que capturan datos, los ordenan y los convierten en decisiones.">
          <span className="about__mf-tag" aria-hidden="true">// Manifiesto</span>
          {STATEMENT.map(([w, em], i) => (
            <span key={i} aria-hidden="true" className={em ? 'mf-em' : undefined}>
              {w}
            </span>
          ))}
        </p>

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

          <div className="about__side">
            <figure className="about__fig" ref={figRef}>
              <picture>
                <source srcSet={retratoAvif} type="image/avif" />
                <img
                  src={retratoWebp}
                  alt={`${IDENTITY.fullName} trabajando en el Hackathon Nicaragua`}
                  width="820"
                  height="830"
                  loading="lazy"
                  decoding="async"
                />
              </picture>
              <img
                src={retratoWebp}
                alt=""
                aria-hidden="true"
                className="about__fig-ghost"
                width="820"
                height="830"
                loading="lazy"
                decoding="async"
              />
              <span className="about__fig-scan" aria-hidden="true" />
              <figcaption className="about__fig-cap">
                <span>REG — hN·2026</span>
                <span>Campo de pruebas</span>
              </figcaption>
            </figure>

            <div className="about__stats marks">
            <p className="about__stats-label">Indicadores</p>
            <dl className="about__kpis">
              {STATS.map((s) => (
                <div key={s.label} className="about__kpi">
                  <dt>{s.label}</dt>
                  <dd>
                    <span className="about__kpi-value">
                      <span className="sr-only">
                        {s.value}
                        {s.suffix}
                      </span>
                      <Odometer value={s.value} suffix={s.suffix} />
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
      </div>
    </section>
  );
}
