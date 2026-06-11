import { useEffect, useRef, useState } from 'react';
import { NAV } from '../data/profile';
import useActiveSection from '../hooks/useActiveSection';
import { MenuIcon, CloseIcon, DownloadIcon } from './Icons';
import './navbar.css';

/**
 * Barra de navegación técnica:
 * - Progreso de scroll (línea ámbar superior, transform-only).
 * - Sección activa vía IntersectionObserver (sin cálculos en scroll).
 * - Menú móvil accesible: aria-expanded, Escape y clic fuera para cerrar.
 */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection(['inicio', ...NAV.map((l) => l.id)]);
  const [open, setOpen] = useState(false);
  const progressRef = useRef(null);
  const navRef = useRef(null);

  /* Estado "scrolled" + barra de progreso en un único listener pasivo */
  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight || 1;
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${doc.scrollTop / max})`;
      }
      setScrolled(doc.scrollTop > 24);
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Cierre del menú móvil: Escape y clic fuera */
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const onClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onClick);
    };
  }, [open]);

  return (
    <header ref={navRef} className={`nav ${scrolled || open ? 'nav--solid' : ''}`}>
      <div ref={progressRef} className="nav__progress" aria-hidden="true" />

      <div className="container nav__inner">
        <a href="#inicio" className="nav__brand" aria-label="Ir al inicio" data-cursor>
          <span className="nav__brand-mark">DF</span>
          <span className="nav__brand-text">Fargas — Portafolio</span>
        </a>

        <nav className="nav__links" aria-label="Secciones">
          <ul>
            {NAV.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  aria-current={active === l.id ? 'true' : undefined}
                  data-cursor
                >
                  <span className="nav__num">{l.index}</span>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="nav__actions">
          <a href="/CV-Diedrizon.pdf" download className="nav__cv" data-cursor data-magnetic="0.25">
            CV <DownloadIcon />
          </a>
          <button
            type="button"
            className="nav__toggle"
            aria-expanded={open}
            aria-controls="menu-movil"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
            <span className="sr-only">{open ? 'Cerrar menú' : 'Abrir menú'}</span>
          </button>
        </div>
      </div>

      {/* Panel móvil */}
      <div id="menu-movil" className={`nav__sheet ${open ? 'nav__sheet--open' : ''}`}>
        <ul>
          {NAV.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                aria-current={active === l.id ? 'true' : undefined}
                onClick={() => setOpen(false)}
              >
                <span className="nav__num">{l.index}</span>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
