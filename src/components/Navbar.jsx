import React, { useEffect, useState } from 'react';

const LINKS = [
  { id: 'sobre-mi', label: 'Sobre mí' },
  { id: 'stack', label: 'Stack' },
  { id: 'proyectos', label: 'Proyectos' },
  { id: 'contacto', label: 'Contacto' },
];

/** Barra de navegación flotante tipo "pill" con scroll suave y sección activa. */
const Navbar = () => {
  const [active, setActive] = useState('inicio');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const ids = ['inicio', ...LINKS.map((l) => l.id)];
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  const go = (e, id) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <a href="#inicio" className="navbar__brand" onClick={(e) => go(e, 'inicio')} data-cursor>
        <span className="navbar__brand-mark">DF</span>
        <span className="navbar__brand-text">diedrizon</span>
      </a>
      <ul className="navbar__links">
        {LINKS.map((l) => (
          <li key={l.id}>
            <a
              href={`#${l.id}`}
              className={active === l.id ? 'is-active' : ''}
              onClick={(e) => go(e, l.id)}
              data-cursor
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
      <a href="/CV.pdf" download className="navbar__cv" data-cursor>
        CV
      </a>
    </nav>
  );
};

export default Navbar;
