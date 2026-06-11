import { NAV } from '../data/profile';
import useActiveSection from '../hooks/useActiveSection';
import './rail.css';

const ALL = [{ id: 'inicio', index: '01', label: 'Inicio' }, ...NAV];

/**
 * Regla lateral (solo escritorio ancho): cinco marcas, índice activo
 * y etiqueta vertical de la sección actual. Navegable con teclado.
 */
export default function Rail() {
  const active = useActiveSection(ALL.map((s) => s.id));
  const current = ALL.find((s) => s.id === active) || ALL[0];

  return (
    <nav className="rail" aria-label="Progreso de secciones">
      <span className="rail__label" aria-hidden="true">
        {current.index} — {current.label}
      </span>
      <ul className="rail__ticks">
        {ALL.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className={s.id === active ? 'is-active' : ''}
              aria-label={`${s.label} (sección ${s.index})`}
              aria-current={s.id === active ? 'true' : undefined}
              data-cursor
            >
              <i aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
