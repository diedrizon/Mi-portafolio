import { useState, useRef, useEffect } from 'react';
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

  useEffect(() => () => clearTimeout(timer.current), []);

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

  return (
    <section id="contacto" className="section contact">
      <div className="container">
        <header className="section-head">
          <p className="kicker">
            <span className="kicker__index">[05]</span> Contacto
          </p>
          <h2 className="section-title">¿Tenés un sistema en mente?</h2>
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
            >
              Escribir por WhatsApp <ArrowUpRightIcon />
            </a>
            <a href={`mailto:${EMAIL}`} className="btn btn--ghost">
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
