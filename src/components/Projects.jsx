import { useEffect, useRef } from 'react';
import { PROJECTS } from '../data/profile';
import { ArrowUpRightIcon } from './Icons';
import { gsap, ScrollTrigger, reduced } from '../lib/motion';
import './projects.css';

/* Mapa id → URL del arte generado (avif + webp) */
const ART = import.meta.glob('../assets/previews/*.{avif,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
});
const art = (id, ext) => ART[`../assets/previews/${id}.${ext}`];

const pad = (n) => String(n + 1).padStart(2, '0');

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
          data-cursor
        >
          {l.label} <ArrowUpRightIcon />
        </a>
      ))}
    </div>
  );
}

/**
 * [04] Proyectos.
 * Destacados: carril horizontal PINEADO conducido por el scroll
 * (escritorio con puntero fino); en táctil/reduced, pila vertical.
 * Cada lámina lleva su tarjeta de instrumento con parallax interno.
 * Rejilla compacta: tarjeta flotante que sigue el puntero.
 */
export default function Projects() {
  const featured = PROJECTS.filter((p) => p.featured);
  const rest = PROJECTS.filter((p) => !p.featured);
  const rootRef = useRef(null);
  const hwrapRef = useRef(null);
  const hrailRef = useRef(null);
  const hudBarRef = useRef(null);
  const hudIdxRef = useRef(null);
  const floatRef = useRef(null);
  const floatImgRef = useRef(null);
  const floatSrcRef = useRef(null);

  /* Carril horizontal pineado + parallax del arte por lámina */
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 941px) and (prefers-reduced-motion: no-preference)', () => {
      const wrap = hwrapRef.current;
      const rail = hrailRef.current;
      const n = featured.length;
      const dist = () => Math.max(0, rail.scrollWidth - wrap.clientWidth);

      const tween = gsap.to(rail, {
        x: () => -dist(),
        ease: 'none',
        scrollTrigger: {
          trigger: wrap,
          start: 'top top',
          end: () => `+=${dist()}`,
          pin: true,
          scrub: 0.65,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (hudBarRef.current) {
              gsap.set(hudBarRef.current, { scaleX: self.progress });
            }
            if (hudIdxRef.current) {
              const idx = Math.min(n, Math.floor(self.progress * n) + 1);
              hudIdxRef.current.textContent = `${String(idx).padStart(2, '0')} / ${String(n).padStart(2, '0')}`;
            }
          },
        },
      });

      /* profundidad: el arte se desliza dentro de su marco */
      rail.querySelectorAll('.pslide__art img').forEach((img) => {
        gsap.fromTo(
          img,
          { xPercent: -7 },
          {
            xPercent: 7,
            ease: 'none',
            scrollTrigger: {
              trigger: img.closest('.pslide'),
              containerAnimation: tween,
              start: 'left 95%',
              end: 'right 5%',
              scrub: true,
            },
          }
        );
      });
    });
    return () => mm.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Tarjeta flotante para la rejilla compacta */
  useEffect(() => {
    if (
      reduced() ||
      !window.matchMedia('(hover:hover) and (pointer:fine)').matches
    )
      return undefined;

    const root = rootRef.current;
    const float = floatRef.current;
    const rows = root.querySelectorAll('[data-art]');

    const xTo = gsap.quickTo(float, 'x', { duration: 0.5, ease: 'power3' });
    const yTo = gsap.quickTo(float, 'y', { duration: 0.5, ease: 'power3' });
    const rTo = gsap.quickTo(float, 'rotation', { duration: 0.6, ease: 'power3' });

    let lastX = 0;
    const onMove = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
      rTo(gsap.utils.clamp(-7, 7, (e.clientX - lastX) * 0.55));
      lastX = e.clientX;
    };

    const show = (id, name) => {
      floatSrcRef.current.srcset = art(id, 'avif');
      floatImgRef.current.src = art(id, 'webp');
      floatImgRef.current.alt = `Vista de instrumento del proyecto ${name}`;
      gsap.to(float, { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'power3.out' });
    };
    const hide = () => {
      gsap.to(float, { autoAlpha: 0, scale: 0.92, duration: 0.35, ease: 'power3.out' });
      rTo(0);
    };

    const handlers = [];
    rows.forEach((row) => {
      const enter = () => show(row.dataset.art, row.dataset.artName || '');
      row.addEventListener('pointerenter', enter);
      row.addEventListener('pointerleave', hide);
      handlers.push([row, enter]);
    });
    root.addEventListener('pointermove', onMove, { passive: true });
    gsap.set(float, { xPercent: -50, yPercent: -118, autoAlpha: 0, scale: 0.92 });

    return () => {
      handlers.forEach(([row, enter]) => {
        row.removeEventListener('pointerenter', enter);
        row.removeEventListener('pointerleave', hide);
      });
      root.removeEventListener('pointermove', onMove);
    };
  }, []);

  return (
    <section id="proyectos" className="section projects" ref={rootRef}>
      {/* Tarjeta flotante (rejilla compacta, escritorio) */}
      <div className="projects__float" ref={floatRef} aria-hidden="true">
        <picture>
          <source ref={floatSrcRef} srcSet={art('ebenezer', 'avif')} type="image/avif" />
          <img
            ref={floatImgRef}
            src={art('ebenezer', 'webp')}
            alt=""
            width="960"
            height="600"
            decoding="async"
          />
        </picture>
      </div>

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
      </div>

      {/* Carril de destacados */}
      <div className="projects__hwrap" ref={hwrapRef}>
        <div className="projects__hrail" ref={hrailRef}>
          {featured.map((p, i) => (
            <article key={p.id} className="pslide">
              <div className="pslide__head">
                <span className="pslide__index" aria-hidden="true">
                  {pad(i)}
                </span>
                <span className="pslide__status">{p.status}</span>
              </div>

              <div className="pslide__grid">
                <div className="pslide__body">
                  <h3 className="pslide__name">{p.name}</h3>
                  <p className="pslide__desc">{p.desc}</p>
                  <ul className="proj__tech" aria-label="Tecnologías">
                    {p.tech.map((t) => (
                      <li key={t} className="chip">
                        {t}
                      </li>
                    ))}
                  </ul>
                  <ProjectLinks links={p.links} name={p.name} />
                </div>

                <figure className="pslide__art">
                  <picture>
                    <source srcSet={art(p.id, 'avif')} type="image/avif" />
                    <img
                      src={art(p.id, 'webp')}
                      alt={`Vista de instrumento del proyecto ${p.name}`}
                      width="960"
                      height="600"
                      loading="lazy"
                      decoding="async"
                    />
                  </picture>
                </figure>
              </div>
            </article>
          ))}
        </div>

        <div className="projects__hud" aria-hidden="true">
          <span ref={hudIdxRef} className="projects__hud-idx">
            01 / {String(featured.length).padStart(2, '0')}
          </span>
          <span className="projects__hud-bar">
            <i ref={hudBarRef} />
          </span>
          <span className="projects__hud-hint">Scroll</span>
        </div>
      </div>

      <div className="container">
        <p className="projects__more-label">
          <span aria-hidden="true">//</span> Más proyectos
        </p>

        <div className="projects__grid" data-reveal>
          {rest.map((p) => (
            <article key={p.id} className="pcard" data-art={p.id} data-art-name={p.name}>
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
