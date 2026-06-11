import { useEffect, useRef } from 'react';
import { gsap, lockScroll, reduced } from '../lib/motion';
import { scramble } from '../lib/scramble';
import './preloader.css';

const PHRASES = [
  'CALIBRANDO INSTRUMENTOS',
  'CARGANDO SUPERFICIE DE DATOS',
  'ALINEANDO EJES',
];

/**
 * Secuencia de arranque tipo instrumento. El porcentaje avanza hasta
 * 92 por su cuenta y solo cierra cuando las fuentes y la escena 3D
 * (señal `ready`) están listas — o vence un tope de seguridad.
 * Con prefers-reduced-motion no existe.
 */
export default function Preloader({ ready, onDone }) {
  const rootRef = useRef(null);
  const numRef = useRef(null);
  const barRef = useRef(null);
  const labelRef = useRef(null);
  const state = useRef({ p: 0, closed: false, ready: false });
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  /* señal externa (escena lista) */
  state.current.ready = ready;

  useEffect(() => {
    if (reduced()) {
      doneRef.current(true); // true = instantáneo
      return undefined;
    }

    lockScroll(true);
    const st = state.current;
    const root = rootRef.current;
    let cancelScr = () => {};
    let phraseIdx = 0;
    let fontsReady = false;

    document.fonts.ready.then(() => {
      fontsReady = true;
    });

    const setNum = () => {
      if (numRef.current) {
        numRef.current.textContent = String(Math.round(st.p)).padStart(3, '0');
      }
      if (barRef.current) {
        gsap.set(barRef.current, { scaleX: st.p / 100 });
      }
    };

    const phraseLoop = setInterval(() => {
      phraseIdx = (phraseIdx + 1) % PHRASES.length;
      cancelScr();
      cancelScr = scramble(labelRef.current, PHRASES[phraseIdx], {
        duration: 620,
      });
    }, 1500);
    cancelScr = scramble(labelRef.current, PHRASES[0], { duration: 620 });

    const close = () => {
      if (st.closed) return;
      st.closed = true;
      clearInterval(phraseLoop);
      crawl.kill();
      gsap.to(st, {
        p: 100,
        duration: 0.4,
        ease: 'power2.in',
        onUpdate: setNum,
        onComplete: () => {
          const tl = gsap.timeline({
            defaults: { ease: 'expo.inOut' },
            onComplete: () => {
              lockScroll(false);
              doneRef.current(false);
            },
          });
          tl.to(root.querySelectorAll('.pre__center, .pre__corner'), {
            yPercent: -34,
            autoAlpha: 0,
            duration: 0.55,
            stagger: 0.04,
          }).to(
            rootRef.current,
            { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.85 },
            '-=0.2'
          );
        },
      });
    };

    /* avance base: nunca pasa de 92 sin la señal de listo */
    const crawl = gsap.to(st, {
      p: 92,
      duration: 2.1,
      ease: 'power2.out',
      onUpdate: setNum,
    });

    const watcher = setInterval(() => {
      if (st.ready && fontsReady && st.p >= 88) close();
    }, 90);
    const failsafe = setTimeout(close, 5200);

    return () => {
      clearInterval(phraseLoop);
      clearInterval(watcher);
      clearTimeout(failsafe);
      crawl.kill();
      cancelScr();
      lockScroll(false);
    };
     
  }, []);

  if (typeof window !== 'undefined' && reduced()) return null;

  return (
    <div
      ref={rootRef}
      className="pre"
      role="status"
      aria-live="polite"
      aria-label="Cargando portafolio"
    >
      <div className="pre__corner pre__corner--tl">DF — 2026</div>
      <div className="pre__corner pre__corner--tr">[ BOOT ]</div>

      <div className="pre__center">
        <p className="pre__num" aria-hidden="true">
          <span ref={numRef}>000</span>
          <sup>%</sup>
        </p>
        <div className="pre__bar" aria-hidden="true">
          <i ref={barRef} />
        </div>
        <p className="pre__label" ref={labelRef} aria-hidden="true">
          CALIBRANDO INSTRUMENTOS
        </p>
      </div>

      <div className="pre__corner pre__corner--bl">12.10° N · 85.36° O</div>
      <div className="pre__corner pre__corner--br">PORTAFOLIO · V3</div>
    </div>
  );
}
