import { NAV, IDENTITY } from '../data/profile';
import { ArrowUpIcon } from './Icons';
import './footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="axis" aria-hidden="true">
          <i />
        </div>

        <div className="footer__grid">
          <p className="footer__brand">
            <span className="footer__mark" aria-hidden="true">
              DF
            </span>
            © 2026 {IDENTITY.fullName.split(' ').slice(0, 2).join(' ')} ·
            Juigalpa, Nicaragua
          </p>

          <nav aria-label="Pie de página">
            <ul className="footer__nav">
              {NAV.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} data-cursor>{item.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer__meta">
            <span className="footer__stack">React + Vite · Sin trackers</span>
            <a href="#inicio" className="footer__top" aria-label="Volver arriba" data-magnetic="0.4" data-cursor>
              <ArrowUpIcon />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
