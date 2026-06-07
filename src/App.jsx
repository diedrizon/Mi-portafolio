import React, { useEffect, useRef, lazy, Suspense } from 'react';
import anime from 'animejs/lib/anime.es.js';

// El canvas de partículas se carga de forma diferida (chunk aparte)
const ParticleBackground = lazy(() => import('./components/ParticleBackground'));
import AuroraBackground from './components/AuroraBackground';
import CustomCursor from './components/CustomCursor';
import ScrollProgress from './components/ScrollProgress';
import Navbar from './components/Navbar';
import useScrollReveal from './hooks/useScrollReveal';

import {
  FaDownload,
  FaArrowRight,
  FaPiggyBank,
  FaSchool,
  FaTools,
  FaPrescriptionBottleAlt,
  FaUtensils,
  FaServer,
  FaMobileAlt,
  FaEnvelope,
  FaGithub,
  FaFacebook,
  FaLinkedin,
  FaWhatsapp,
  FaArrowDown,
} from 'react-icons/fa';
import {
  SiReact,
  SiFlutter,
  SiSpringboot,
  SiFirebase,
  SiMysql,
  SiJavascript,
  SiNodedotjs,
  SiVite,
  SiFigma,
  SiTableau,
  SiExpo,
} from 'react-icons/si';
import { FaJava } from 'react-icons/fa6';

import './App.css';

/* ---------- Datos ---------- */

const EMAIL = 'diedrinzonfargas@gmail.com';
const PHONE_DISPLAY = '+505 8825 7506';

const SOCIALS = {
  email: `mailto:${EMAIL}`,
  whatsapp: 'https://wa.me/50588257506',
  github: 'https://github.com/diedrizon',
  linkedin: 'https://www.linkedin.com/in/diedrizon-fargas-a65181238',
  facebook: 'https://www.facebook.com/share/1ax1NVEDe8/',
};

const ROLES = [
  'Desarrollador Fullstack',
  'React · React Native',
  'Flutter & Java',
  'Spring Boot APIs',
];

const STATS = [
  { value: 7, suffix: '+', label: 'Proyectos' },
  { value: 15, suffix: '+', label: 'Tecnologías' },
  { value: 3, suffix: '', label: 'Plataformas' },
  { value: 100, suffix: '%', label: 'Pasión' },
];

const PROJECTS = [
  {
    name: 'APFINE',
    url: 'https://apfine.com/',
    desc: 'Gestión financiera: registra gastos, métricas, comprobantes y metas.',
    icon: <FaPiggyBank />,
    tech: ['React', 'Vite', 'Firebase'],
    accent: '#22d3ee',
    featured: true,
  },
  {
    name: 'Colegio Ebenezer · BI',
    url: 'https://github.com/JiniethM/Proyecto-Colegio-Bautista-Ebenezer_BI-2',
    desc: 'Sistema de calificaciones con reporting BI (Pentaho, Power BI, Tableau).',
    icon: <FaSchool />,
    tech: ['Pentaho', 'Power BI', 'Tableau'],
    accent: '#3b82f6',
    featured: true,
  },
  {
    name: 'Reparaciones de Bicicleta',
    url: 'https://github.com/diedrizon/Reparaciones-de-bicicleta-',
    desc: 'App móvil para gestión de órdenes de reparación.',
    icon: <FaTools />,
    tech: ['React Native', 'Expo', 'Firebase'],
    accent: '#2dd4bf',
  },
  {
    name: 'Farmacia Rosales',
    url: 'https://github.com/diedrizon/Repositorio-Farmacia-Rosales..git',
    desc: 'Gestión de farmacia con control de inventario y ventas.',
    icon: <FaPrescriptionBottleAlt />,
    tech: ['Java', 'MySQL'],
    accent: '#22d3ee',
  },
  {
    name: 'Chontal Grill',
    url: 'https://github.com/diedrizon/Chontal_Grill.git',
    desc: 'Control de pedidos y mesas para restaurante.',
    icon: <FaUtensils />,
    tech: ['React Native', 'MySQL'],
    accent: '#3b82f6',
  },
  {
    name: 'SIVEN · Backend',
    url: 'https://github.com/Alvaro-Hernandez/backend-SIVEN.git',
    desc: 'API REST con Spring Boot para datos epidemiológicos.',
    icon: <FaServer />,
    tech: ['Spring Boot', 'Java', 'REST'],
    accent: '#2dd4bf',
  },
  {
    name: 'SIVEN · App',
    url: 'https://github.com/Alvaro-Hernandez/SIVEN_APP.git',
    desc: 'Cliente móvil en Flutter consumiendo la API de SIVEN.',
    icon: <FaMobileAlt />,
    tech: ['Flutter', 'Dart'],
    accent: '#22d3ee',
  },
];

const SKILL_GROUPS = [
  {
    title: 'Frontend & Móvil',
    items: ['React', 'React Native', 'Flutter', 'JavaScript'],
  },
  {
    title: 'Backend',
    items: ['Java', 'Spring Boot', 'Node.js', 'SQL'],
  },
  {
    title: 'Datos & BI',
    items: ['MySQL', 'Firebase', 'Power BI', 'Pentaho', 'Tableau'],
  },
  {
    title: 'Herramientas',
    items: ['Git', 'Vite', 'AWS', 'Figma'],
  },
];

const MARQUEE = [
  { icon: <SiReact />, name: 'React' },
  { icon: <SiFlutter />, name: 'Flutter' },
  { icon: <FaJava />, name: 'Java' },
  { icon: <SiSpringboot />, name: 'Spring' },
  { icon: <SiFirebase />, name: 'Firebase' },
  { icon: <SiMysql />, name: 'MySQL' },
  { icon: <SiJavascript />, name: 'JavaScript' },
  { icon: <SiNodedotjs />, name: 'Node.js' },
  { icon: <SiVite />, name: 'Vite' },
  { icon: <SiFigma />, name: 'Figma' },
  { icon: <SiTableau />, name: 'Tableau' },
  { icon: <SiExpo />, name: 'Expo' },
];

/* ---------- Utilidad: dividir texto en spans por carácter ---------- */
function SplitChars({ text, className = 'char' }) {
  return (
    <>
      {Array.from(text).map((ch, i) => (
        <span key={i} className={className} aria-hidden="true">
          {ch === ' ' ? ' ' : ch}
        </span>
      ))}
    </>
  );
}

function App() {
  const heroRef = useRef(null);
  const roleRef = useRef(null);
  const statsRef = useRef(null);

  useScrollReveal();

  /* --- Timeline de entrada del hero --- */
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const tl = anime.timeline({ easing: 'easeOutExpo', duration: 900 });
    tl.add({
      targets: '.hero__badge',
      opacity: [0, 1],
      translateY: [-20, 0],
    })
      .add(
        {
          targets: '.hero__avatar',
          opacity: [0, 1],
          scale: [0.4, 1],
          rotate: [-25, 0],
          duration: 1100,
          easing: 'spring(1, 80, 12, 0)',
        },
        '-=600'
      )
      .add(
        {
          targets: '.hero__title .char',
          opacity: [0, 1],
          translateY: [60, 0],
          rotateZ: [12, 0],
          duration: 900,
          delay: anime.stagger(40),
        },
        '-=700'
      )
      .add(
        {
          targets: '.hero__role-wrap, .hero__lead, .hero__cta, .hero__socials',
          opacity: [0, 1],
          translateY: [24, 0],
          delay: anime.stagger(110),
        },
        '-=500'
      )
      .add(
        {
          targets: '.hero__scroll',
          opacity: [0, 1],
        },
        '-=300'
      );
  }, []);

  /* --- Roles rotativos --- */
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const el = roleRef.current;
    if (!el) return;
    if (reduce) {
      el.textContent = ROLES[0];
      return;
    }
    let i = 0;
    el.textContent = ROLES[0];
    const id = setInterval(() => {
      anime({
        targets: el,
        opacity: [1, 0],
        translateY: [0, -14],
        duration: 350,
        easing: 'easeInQuad',
        complete: () => {
          i = (i + 1) % ROLES.length;
          el.textContent = ROLES[i];
          anime({
            targets: el,
            opacity: [0, 1],
            translateY: [14, 0],
            duration: 450,
            easing: 'easeOutExpo',
          });
        },
      });
    }, 2400);
    return () => clearInterval(id);
  }, []);

  /* --- Contadores animados al entrar en viewport --- */
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const node = statsRef.current;
    if (!node) return;

    const run = () => {
      node.querySelectorAll('.stat__num').forEach((n) => {
        const target = parseFloat(n.dataset.value);
        if (reduce) {
          n.textContent = target;
          return;
        }
        const obj = { v: 0 };
        anime({
          targets: obj,
          v: target,
          round: 1,
          duration: 1600,
          easing: 'easeOutExpo',
          update: () => {
            n.textContent = obj.v;
          },
        });
      });
    };

    const obs = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            run();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  /* --- Botones magnéticos --- */
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const els = Array.from(document.querySelectorAll('[data-magnetic]'));
    const cleanups = els.map((el) => {
      const move = (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
      };
      const reset = () => {
        el.style.transform = 'translate(0,0)';
      };
      el.addEventListener('mousemove', move);
      el.addEventListener('mouseleave', reset);
      return () => {
        el.removeEventListener('mousemove', move);
        el.removeEventListener('mouseleave', reset);
      };
    });
    return () => cleanups.forEach((c) => c());
  }, []);

  /* --- Tilt 3D en tarjetas de proyecto --- */
  const handleTilt = (e) => {
    const card = e.currentTarget;
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const rx = (py - 0.5) * -10;
    const ry = (px - 0.5) * 12;
    card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
    card.style.setProperty('--mx', `${px * 100}%`);
    card.style.setProperty('--my', `${py * 100}%`);
  };
  const resetTilt = (e) => {
    e.currentTarget.style.transform =
      'perspective(900px) rotateX(0) rotateY(0) translateY(0)';
  };

  return (
    <>
      <AuroraBackground />
      <Suspense fallback={null}>
        <ParticleBackground />
      </Suspense>
      <CustomCursor />
      <ScrollProgress />
      <Navbar />

      <div className="app-content">
        {/* ===================== HERO ===================== */}
        <header id="inicio" className="hero" ref={heroRef}>
          <div className="hero__inner">
            <span className="hero__badge" data-cursor>
              <span className="hero__badge-dot" /> Disponible para nuevos proyectos
            </span>

            <div className="hero__avatar-wrap">
              <img
                src="/imagenmia.jpg"
                alt="Diedrizon Fargas"
                className="hero__avatar"
                width="132"
                height="132"
                fetchPriority="high"
                decoding="async"
              />
              <span className="hero__avatar-ring" />
            </div>

            <h1 className="hero__title">
              <span className="hero__title-line">
                <SplitChars text="Diedrizon" />
              </span>
              <span className="hero__title-line hero__title-line--grad">
                <SplitChars text="Fargas" />
              </span>
            </h1>

            <div className="hero__role-wrap">
              <span className="hero__role-prefix">&lt;/&gt;</span>
              <span className="hero__role" ref={roleRef}>
                Desarrollador Fullstack
              </span>
            </div>

            <p className="hero__lead">
              Construyo experiencias <strong>web</strong> y{' '}
              <strong>móviles</strong> rápidas y elegantes — del backend en Java
              y Spring Boot al frontend en React, React Native y Flutter.
            </p>

            <div className="hero__cta">
              <a
                href="#proyectos"
                className="btn btn--primary"
                data-magnetic
                data-cursor
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById('proyectos')
                    ?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Ver proyectos <FaArrowRight />
              </a>
              <a
                href="/CV.pdf"
                download
                className="btn btn--ghost"
                data-magnetic
                data-cursor
              >
                <FaDownload /> Descargar CV
              </a>
            </div>

            <div className="hero__socials">
              <a href={SOCIALS.github} target="_blank" rel="noreferrer" aria-label="GitHub" data-cursor>
                <FaGithub />
              </a>
              <a href={SOCIALS.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" data-cursor>
                <FaLinkedin />
              </a>
              <a href={SOCIALS.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" data-cursor>
                <FaFacebook />
              </a>
              <a href={SOCIALS.whatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp" data-cursor>
                <FaWhatsapp />
              </a>
              <a href={SOCIALS.email} aria-label="Email" data-cursor>
                <FaEnvelope />
              </a>
            </div>
          </div>

          <a href="#sobre-mi" className="hero__scroll" aria-label="Bajar" onClick={(e) => { e.preventDefault(); document.getElementById('sobre-mi')?.scrollIntoView({ behavior: 'smooth' }); }}>
            <span>scroll</span>
            <FaArrowDown />
          </a>
        </header>

        <main>
          {/* ===================== SOBRE MÍ ===================== */}
          <section id="sobre-mi" className="section">
            <div className="container">
              <div className="reveal" data-reveal="up">
                <p className="section__kicker reveal-child">01 — Sobre mí</p>
                <h2 className="section__title reveal-child">
                  Ingeniería con propósito y diseño con intención
                </h2>
              </div>

              <div className="about__grid">
                <div className="about__text reveal" data-reveal="left">
                  <p className="reveal-child">
                    Soy <strong>Diedrizon Domingo Fargas Barrera</strong>,
                    desarrollador Fullstack con experiencia en web y móvil.
                    Estudiante de Ingeniería en Sistemas de la Información en la
                    UNAN. Me especializo en Git, Java, Spring Boot y React, y
                    disfruto convertir problemas reales en productos usables.
                  </p>
                  <p className="reveal-child">
                    He trabajado en distintos dominios, llevando ideas desde la
                    base de datos hasta la interfaz:
                  </p>
                  <ul className="about__chips reveal-child">
                    <li>Calificaciones estudiantiles</li>
                    <li>Salud · epidemiología</li>
                    <li>Restaurantes</li>
                    <li>Reparaciones</li>
                    <li>Farmacia e inventario</li>
                  </ul>
                  <a href="/CV.pdf" download className="btn btn--primary reveal-child" data-cursor>
                    <FaDownload /> Descargar mi CV
                  </a>
                </div>

                <div className="about__stats reveal" data-reveal="right" ref={statsRef}>
                  {STATS.map((s) => (
                    <div className="stat reveal-child" key={s.label}>
                      <div className="stat__value">
                        <span className="stat__num" data-value={s.value}>
                          0
                        </span>
                        <span className="stat__suffix">{s.suffix}</span>
                      </div>
                      <div className="stat__label">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ===================== STACK ===================== */}
          <section id="stack" className="section">
            <div className="container">
              <div className="reveal" data-reveal="up">
                <p className="section__kicker reveal-child">02 — Stack</p>
                <h2 className="section__title reveal-child">
                  Tecnologías que uso a diario
                </h2>
              </div>
            </div>

            {/* Marquee infinito */}
            <div className="marquee" aria-hidden="true">
              <div className="marquee__track">
                {[...MARQUEE, ...MARQUEE].map((m, i) => (
                  <span className="marquee__item" key={i}>
                    {m.icon}
                    {m.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="container">
              <div className="skills__grid reveal" data-reveal="up">
                {SKILL_GROUPS.map((g) => (
                  <div className="skill-card reveal-child" key={g.title} data-cursor>
                    <h3>{g.title}</h3>
                    <ul>
                      {g.items.map((it) => (
                        <li key={it}>{it}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ===================== PROYECTOS ===================== */}
          <section id="proyectos" className="section">
            <div className="container">
              <div className="reveal" data-reveal="up">
                <p className="section__kicker reveal-child">03 — Proyectos</p>
                <h2 className="section__title reveal-child">
                  Cosas que he construido
                </h2>
              </div>

              <div className="projects__grid reveal" data-reveal="up">
                {PROJECTS.map((p) => (
                  <a
                    key={p.name}
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`project-card reveal-child ${p.featured ? 'project-card--featured' : ''}`}
                    style={{ '--accent': p.accent }}
                    onMouseMove={handleTilt}
                    onMouseLeave={resetTilt}
                    data-cursor
                  >
                    <div className="project-card__glow" />
                    <div className="project-card__top">
                      <span className="project-card__icon">{p.icon}</span>
                      <FaArrowRight className="project-card__arrow" />
                    </div>
                    <h3 className="project-card__name">{p.name}</h3>
                    <p className="project-card__desc">{p.desc}</p>
                    <div className="project-card__tags">
                      {p.tech.map((t) => (
                        <span key={t}>{t}</span>
                      ))}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>

          {/* ===================== CONTACTO ===================== */}
          <section id="contacto" className="section">
            <div className="container">
              <div className="contact reveal" data-reveal="scale">
                <p className="section__kicker reveal-child">04 — Contacto</p>
                <h2 className="section__title section__title--center reveal-child">
                  ¿Construimos algo juntos?
                </h2>
                <p className="contact__lead reveal-child">
                  Estoy abierto a proyectos, prácticas y colaboraciones. Escríbeme
                  y te respondo pronto.
                </p>

                <div className="contact__methods reveal-child">
                  <a href={SOCIALS.whatsapp} target="_blank" rel="noreferrer" className="contact-method" data-cursor>
                    <span className="contact-method__icon"><FaWhatsapp /></span>
                    <span className="contact-method__body">
                      <span className="contact-method__label">WhatsApp</span>
                      <span className="contact-method__value">{PHONE_DISPLAY}</span>
                    </span>
                  </a>
                  <a href={SOCIALS.email} className="contact-method" data-cursor>
                    <span className="contact-method__icon"><FaEnvelope /></span>
                    <span className="contact-method__body">
                      <span className="contact-method__label">Email</span>
                      <span className="contact-method__value">{EMAIL}</span>
                    </span>
                  </a>
                </div>

                <a
                  href={SOCIALS.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn--primary btn--lg reveal-child"
                  data-magnetic
                  data-cursor
                >
                  <FaWhatsapp /> Hablemos por WhatsApp
                </a>

                <div className="contact__socials reveal-child">
                  <a href={SOCIALS.github} target="_blank" rel="noreferrer" className="contact__social" data-cursor>
                    <FaGithub /> <span>GitHub</span>
                  </a>
                  <a href={SOCIALS.linkedin} target="_blank" rel="noreferrer" className="contact__social" data-cursor>
                    <FaLinkedin /> <span>LinkedIn</span>
                  </a>
                  <a href={SOCIALS.facebook} target="_blank" rel="noreferrer" className="contact__social" data-cursor>
                    <FaFacebook /> <span>Facebook</span>
                  </a>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* ===================== FOOTER ===================== */}
        <footer className="footer">
          <div className="container footer__inner">
            <span className="footer__brand">Diedrizon Fargas</span>
            <p>© {new Date().getFullYear()} · Hecho con React, anime.js y mucho ☕</p>
          </div>
        </footer>
      </div>
    </>
  );
}

export default App;
