import { IDENTITY, SOCIALS } from '../data/profile';
import { SOCIAL_ICONS, ArrowRightIcon, ArrowDownIcon, DownloadIcon } from './Icons';
import avatarAvif from '../assets/avatar.avif';
import avatarWebp from '../assets/avatar.webp';
import avatarJpg from '../assets/avatar.jpg';
import './hero.css';

/**
 * Hero "ficha técnica": titular editorial a ancho completo +
 * placa de especificaciones en mono con datos reales. La
 * coreografía de entrada es 100% CSS (transform/opacity) y se
 * omite sin JS o con prefers-reduced-motion.
 */
export default function Hero() {
  return (
    <section id="inicio" className="hero">
      <div className="container hero__head">
        <p className="hero__eyebrow">
          <span className="hero__tag">[ Ficha técnica — 2026 ]</span>
          <span className="hero__status">
            <i aria-hidden="true" /> {IDENTITY.availability}
          </span>
        </p>

        <h1 className="hero__title">
          <span className="hero__line-wrap">
            <span className="hero__line">{IDENTITY.firstName}</span>
          </span>
          <span className="hero__line-wrap">
            <span className="hero__line hero__line--outline">
              {IDENTITY.lastName}
              <em className="hero__dot" aria-hidden="true">
                .
              </em>
            </span>
          </span>
        </h1>

        <div className="hero__rule" aria-hidden="true" />
      </div>

      <div className="container hero__grid">
        <div className="hero__main">
          <p className="hero__role">
            <span aria-hidden="true">&gt;_</span> {IDENTITY.role}
          </p>

          <p className="hero__lead">
            Diseño y construyo sistemas completos —del modelo de datos a la
            interfaz— y los convierto en información útil:{' '}
            <strong>dashboards, métricas e indicadores</strong> que sostienen
            decisiones reales.
          </p>

          <div className="hero__cta">
            <a href="#proyectos" className="btn btn--primary">
              Ver proyectos <ArrowRightIcon />
            </a>
            <a href="/CV-Diedrizon.pdf" download className="btn btn--ghost">
              <DownloadIcon /> Descargar CV
            </a>
          </div>

          <ul className="hero__socials" aria-label="Redes y contacto">
            {SOCIALS.map((s) => {
              const Icon = SOCIAL_ICONS[s.id];
              return (
                <li key={s.id}>
                  <a
                    href={s.href}
                    target={s.href.startsWith('http') ? '_blank' : undefined}
                    rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    aria-label={s.label}
                  >
                    <Icon />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Placa de especificaciones */}
        <aside className="hero__plate marks" aria-label="Datos de perfil">
          <div className="hero__plate-head">
            <picture>
              <source srcSet={avatarAvif} type="image/avif" />
              <source srcSet={avatarWebp} type="image/webp" />
              <img
                src={avatarJpg}
                alt={`Retrato de ${IDENTITY.fullName}`}
                width="264"
                height="264"
                fetchPriority="high"
                decoding="async"
                className="hero__avatar"
              />
            </picture>
            <div>
              <p className="hero__plate-name">{IDENTITY.fullName}</p>
              <p className="hero__plate-id">ID — DF·2026</p>
            </div>
          </div>

          <dl className="hero__specs">
            <div>
              <dt>Enfoque</dt>
              <dd>Software + Datos / BI</dd>
            </div>
            <div>
              <dt>Formación</dt>
              <dd>
                {IDENTITY.education}
                <span className="hero__spec-sub">{IDENTITY.educationYears}</span>
              </dd>
            </div>
            <div>
              <dt>Experiencia</dt>
              <dd>Freelance · {IDENTITY.freelanceSince} — actualidad</dd>
            </div>
            <div>
              <dt>Ubicación</dt>
              <dd>{IDENTITY.location}</dd>
            </div>
          </dl>

          <p className="hero__coords">{IDENTITY.coords} — Chontales, NI</p>
        </aside>
      </div>

      <div className="container hero__foot">
        <a href="#perfil" className="hero__scroll">
          Scroll <ArrowDownIcon />
        </a>
        <span className="hero__foot-index" aria-hidden="true">
          / 01
        </span>
      </div>
    </section>
  );
}
