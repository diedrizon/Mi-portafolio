import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { IDENTITY, SOCIALS } from '../data/profile';
import { SOCIAL_ICONS, ArrowRightIcon, ArrowDownIcon, DownloadIcon } from './Icons';
import { gsap, ScrollTrigger, reduced } from '../lib/motion';
import { scramble } from '../lib/scramble';
import avatarAvif from '../assets/avatar.avif';
import avatarWebp from '../assets/avatar.webp';
import avatarJpg from '../assets/avatar.jpg';
import './hero.css';

/**
 * Hero cinematográfico (170svh con interior sticky):
 * - Intro GSAP disparada al cerrar el preloader (prop `play`).
 * - Salida conducida por scroll: el nombre se parte (líneas en X
 *   opuestas) mientras la cámara 3D se sumerge en el terreno.
 * - HUD de instrumento en las esquinas con hora local viva.
 * Sin JS todo es visible y estático (estados ocultos solo bajo html.js).
 */
export default function Hero({ play }) {
  const rootRef = useRef(null);
  const introRef = useRef(null);
  const roleRef = useRef(null);
  const [clock, setClock] = useState('--:--:--');

  /* hora local del HUD */
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('es-NI', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    const tick = () => setClock(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  /* intro + scroll-out (layout effect: estados iniciales antes del pintado) */
  useLayoutEffect(() => {
    const root = rootRef.current;
    const q = gsap.utils.selector(root);

    if (reduced()) {
      gsap.set(q('[data-hi]'), { opacity: 1 });
      return undefined;
    }

    const ctx = gsap.context(() => {
      /* Estados iniciales (sin flash: corre antes del primer paint) */
      gsap.set(q('.hero__line'), { yPercent: 112 });
      gsap.set(q('.hero__hud > *'), { opacity: 0, y: -10 });
      gsap.set(q('.hero__rule'), { scaleX: 0 });
      gsap.set(q('.hero__col > *'), { opacity: 0, y: 16 });
      gsap.set(q('.hero__plate'), { opacity: 0, x: 30 });
      gsap.set(q('.hero__foot'), { opacity: 0 });

      /* Intro (pausada hasta `play`) */
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } });
      tl.to(q('.hero__line'), {
        yPercent: 0,
        duration: 1.15,
        stagger: 0.12,
      })
        .to(q('.hero__hud > *'), { opacity: 1, y: 0, duration: 0.7, stagger: 0.07 }, 0.15)
        .to(q('.hero__rule'), { scaleX: 1, duration: 0.9 }, 0.55)
        .to(
          q('.hero__col > *'),
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.09 },
          0.7
        )
        .to(q('.hero__plate'), { opacity: 1, x: 0, duration: 0.9 }, 0.8)
        .to(q('.hero__foot'), { opacity: 1, duration: 0.7 }, 1.15);
      introRef.current = tl;

      /* Scroll-out: el nombre se parte y el contenido cede el paso.
         fromTo + immediateRender:false → los valores de partida son
         los finales de la intro, no los del estado oculto inicial. */
      const out = { immediateRender: false, ease: 'none' };
      gsap
        .timeline({
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.7,
          },
        })
        .fromTo(
          q('.hero__line--a'),
          { xPercent: 0, opacity: 1 },
          { xPercent: -16, opacity: 0.06, ...out },
          0
        )
        .fromTo(
          q('.hero__line--b'),
          { xPercent: 0, opacity: 1 },
          { xPercent: 16, opacity: 0.06, ...out },
          0
        )
        .fromTo(
          q('.hero__rule'),
          { scaleX: 1, opacity: 1 },
          { scaleX: 0.12, opacity: 0.4, ...out },
          0
        )
        .fromTo(
          q('.hero__col, .hero__plate'),
          { yPercent: 0, opacity: 1 },
          { yPercent: -7, opacity: 0, ...out },
          0
        )
        .fromTo(
          q('.hero__hud, .hero__foot'),
          { opacity: 1 },
          { opacity: 0, ...out },
          0.1
        );
    }, root);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!play) return undefined;
    if (introRef.current) introRef.current.play();
    if (reduced()) return undefined;
    return scramble(roleRef.current, IDENTITY.role, { duration: 900 });
  }, [play]);

  return (
    <section id="inicio" className="hero" ref={rootRef}>
      <div className="hero__sticky">
        {/* HUD de instrumento */}
        <div className="container hero__hud" aria-hidden="true">
          <span data-hi>SUPERFICIE DE DATOS — V3</span>
          <span data-hi>
            <i className="hero__live" /> {IDENTITY.availability}
          </span>
          <span data-hi>{IDENTITY.coords}</span>
          <span data-hi className="hero__clock">
            JUIGALPA · {clock}
          </span>
        </div>

        <div className="container hero__core">
          <h1 className="hero__title">
            <span className="hero__line-wrap">
              <span className="hero__line hero__line--a" data-hi>
                {IDENTITY.firstName}
              </span>
            </span>
            <span className="hero__line-wrap">
              <span className="hero__line hero__line--b hero__line--outline" data-hi>
                {IDENTITY.lastName}
                <em className="hero__dot" aria-hidden="true">
                  .
                </em>
              </span>
            </span>
          </h1>

          <div className="hero__rule" aria-hidden="true" data-hi />

          <div className="hero__grid">
            <div className="hero__col">
              <p className="hero__role" data-hi>
                <span aria-hidden="true">&gt;_</span>{' '}
                <span ref={roleRef}>{IDENTITY.role}</span>
              </p>

              <p className="hero__lead" data-hi>
                Diseño y construyo sistemas completos —del modelo de datos a
                la interfaz— y los convierto en información útil:{' '}
                <strong>dashboards, métricas e indicadores</strong> que
                sostienen decisiones reales.
              </p>

              <div className="hero__cta" data-hi>
                <a href="#proyectos" className="btn btn--primary" data-magnetic data-cursor>
                  Ver proyectos <ArrowRightIcon />
                </a>
                <a
                  href="/CV-Diedrizon.pdf"
                  download
                  className="btn btn--ghost"
                  data-magnetic
                  data-cursor
                >
                  <DownloadIcon /> Descargar CV
                </a>
              </div>

              <ul className="hero__socials" aria-label="Redes y contacto" data-hi>
                {SOCIALS.map((s) => {
                  const Icon = SOCIAL_ICONS[s.id];
                  return (
                    <li key={s.id}>
                      <a
                        href={s.href}
                        target={s.href.startsWith('http') ? '_blank' : undefined}
                        rel={
                          s.href.startsWith('http')
                            ? 'noopener noreferrer'
                            : undefined
                        }
                        aria-label={s.label}
                        data-magnetic="0.45"
                        data-cursor
                      >
                        <Icon />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Placa de especificaciones */}
            <aside className="hero__plate marks" aria-label="Datos de perfil" data-hi>
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
        </div>

        <div className="container hero__foot" data-hi>
          <a href="#perfil" className="hero__scroll" data-cursor>
            Scroll <ArrowDownIcon />
          </a>
          <span className="hero__foot-index" aria-hidden="true">
            / 01
          </span>
        </div>
      </div>
    </section>
  );
}
