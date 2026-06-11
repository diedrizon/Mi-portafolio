import { useState, useRef, useEffect } from 'react';
import { initMarquee } from '../lib/marquee';
import { EMAIL, PHONE_DISPLAY, SOCIALS } from '../data/profile';
import {
  SOCIAL_ICONS,
  ArrowUpRightIcon,
  CopyIcon,
  CheckIcon,
} from './Icons';
import './contact.css';

/**
 * [05] Contacto — un solo panel con dos rutas claras (WhatsApp
 * y correo) y utilidades honestas: copiar el email con feedback
 * visible y accesible (aria-live).
 */
export default function Contact() {
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);
  const stripRef = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  /* Cinta inversa reactiva a la velocidad del scroll */
  useEffect(() => initMarquee(stripRef.current, { speed: 70, reverse: false }), []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2200);
    } catch {
      /* Sin permisos de portapapeles: el mailto sigue disponible. */
      window.location.href = `mailto:${EMAIL}`;
    }
  };

  const whatsapp = SOCIALS.find((s) => s.id === 'whatsapp');
  const networks = SOCIALS.filter((s) => s.id !== 'whatsapp' && s.id !== 'mail');

  const STRIP = ['Disponible para proyectos', 'Jun 2026', 'Software + BI', 'Remoto / Nicaragua'];

  return (
    <section id="contacto" className="section contact">
      {/* Cinta inversa a sangre completa */}
      <div className="contact__strip" aria-hidden="true">
        <div className="contact__strip-track" ref={stripRef}>
          {[0, 1].map((k) => (
            <ul className="contact__strip-list" key={k}>
              {STRIP.concat(STRIP).map((t, i) => (
                <li key={i}>
                  {t} <span className="contact__strip-sep">◆</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      <div className="container">
        <header className="section-head">
          <p className="kicker">
            <span className="kicker__index">[05]</span> Contacto
          </p>
          <h2 className="contact__giant">
            <a
              href={`mailto:${EMAIL}`}
              aria-label="Hablemos — enviar correo"
              data-cursor
              data-magnetic="0.12"
            >
              <span aria-hidden="true" className="contact__giant-outline">
                Hablemos.
              </span>
              <span aria-hidden="true" className="contact__giant-fill">
                Hablemos.
              </span>
            </a>
          </h2>
          <p className="contact__sub">¿Tenés un sistema en mente?</p>
          <div className="axis" aria-hidden="true">
            <i />
          </div>
        </header>

        <div className="contact__panel marks" data-reveal>
          <p className="contact__lead">
            Si necesitás construir un producto, ordenar tus datos o ambas
            cosas, escribime. Respondo rápido y hablamos directo del problema.
          </p>

          <div className="contact__cta">
            <a
              href={whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--primary"
              data-magnetic
              data-cursor
            >
              Escribir por WhatsApp <ArrowUpRightIcon />
            </a>
            <a href={`mailto:${EMAIL}`} className="btn btn--ghost" data-magnetic data-cursor>
              Enviar correo
            </a>
          </div>

          <dl className="contact__rows">
            <div className="contact__row">
              <dt>Email</dt>
              <dd>
                <span className="contact__value">{EMAIL}</span>
                <button
                  type="button"
                  className="contact__copy"
                  onClick={copyEmail}
                  data-cursor
                >
                  {copied ? <CheckIcon /> : <CopyIcon />}
                  {copied ? 'Copiado' : 'Copiar'}
                </button>
                <span aria-live="polite" className="sr-only">
                  {copied ? 'Correo copiado al portapapeles' : ''}
                </span>
              </dd>
            </div>
            <div className="contact__row">
              <dt>Teléfono</dt>
              <dd>
                <span className="contact__value">{PHONE_DISPLAY}</span>
              </dd>
            </div>
            <div className="contact__row">
              <dt>Redes</dt>
              <dd>
                <ul className="contact__socials">
                  {networks.map((s) => {
                    const Icon = SOCIAL_ICONS[s.id];
                    return (
                      <li key={s.id}>
                        <a
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={s.label}
                        >
                          <Icon />
                          <span>{s.label}</span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
