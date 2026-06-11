import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger, reduced } from '../lib/motion';
import './scene3d.css';

/**
 * Capa WebGL de fondo (z-index −1, sobre el Backdrop estático).
 * - No se monta con prefers-reduced-motion ni sin WebGL: el
 *   Backdrop CSS queda como fallback idéntico en identidad.
 * - El módulo three se importa en diferido → chunk aparte que se
 *   descarga mientras corre el preloader.
 * - La cámara se conduce con un ScrollTrigger (scrub) sobre el hero
 *   y la capa entera se desvanece al entrar al perfil; al salir de
 *   pantalla el bucle se detiene por completo.
 */
export default function Scene3D({ onReady }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const readyRef = useRef(onReady);
  readyRef.current = onReady;

  useEffect(() => {
    const fire = () => readyRef.current && readyRef.current();

    if (reduced()) {
      fire();
      return undefined;
    }

    let scene = null;
    let disposed = false;
    const triggers = [];
    let onResize = null;
    let onPointer = null;
    let onVis = null;

    (async () => {
      try {
        const { createDataScene } = await import('../three/createDataScene');
        if (disposed) return;
        scene = createDataScene(canvasRef.current);
      } catch {
        /* WebGL no disponible: queda el Backdrop estático */
        fire();
        return;
      }

      fire();
      scene.start();
      gsap.to(wrapRef.current, { opacity: 1, duration: 1.1, ease: 'power2.out' });

      onResize = () => scene.resize();
      window.addEventListener('resize', onResize);

      if (window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
        onPointer = (e) => {
          scene.setPointer(
            (e.clientX / window.innerWidth) * 2 - 1,
            -((e.clientY / window.innerHeight) * 2 - 1)
          );
        };
        window.addEventListener('pointermove', onPointer, { passive: true });
      }

      onVis = () => {
        if (document.hidden) scene.stop();
        else if (ScrollTrigger.isInViewport(wrapRef.current)) scene.start();
      };
      document.addEventListener('visibilitychange', onVis);

      /* Viaje por fases: cada sección conduce un tramo de la cámara
         y el estado de sus objetos (torres, constelación, DF). */
      const PHASES = [
        { name: 'hero', trigger: '#inicio', start: 'top top', end: 'bottom top' },
        { name: 'stats', trigger: '.about__stats', start: 'top 88%', end: 'center 38%' },
        { name: 'nodes', trigger: '#proyectos', start: 'top 75%', end: 'center 35%' },
        { name: 'finale', trigger: '#contacto', start: 'top 80%', end: 'center 45%' },
      ];
      PHASES.forEach(({ name, trigger, start, end }) => {
        triggers.push(
          ScrollTrigger.create({
            trigger,
            start,
            end,
            scrub: 0.6,
            onUpdate: (self) => scene.setPhase(name, self.progress),
          })
        );
      });

      /* Durante el carril pineado de proyectos la escena se atenúa
         (el contenido manda); recupera presencia hacia el final. */
      triggers.push(
        ScrollTrigger.create({
          trigger: '#proyectos',
          start: 'top 60%',
          end: 'top 12%',
          scrub: true,
          onUpdate: (self) => {
            gsap.set(wrapRef.current, { opacity: 1 - 0.55 * self.progress });
          },
        })
      );
      triggers.push(
        ScrollTrigger.create({
          trigger: '#contacto',
          start: 'top 96%',
          end: 'top 55%',
          scrub: true,
          onUpdate: (self) => {
            gsap.set(wrapRef.current, { opacity: 0.45 + 0.55 * self.progress });
          },
        })
      );
    })();

    return () => {
      disposed = true;
      triggers.forEach((t) => t.kill());
      if (onResize) window.removeEventListener('resize', onResize);
      if (onPointer) window.removeEventListener('pointermove', onPointer);
      if (onVis) document.removeEventListener('visibilitychange', onVis);
      if (scene) scene.dispose();
    };
  }, []);

  if (typeof window !== 'undefined' && reduced()) return null;

  return (
    <div ref={wrapRef} className="gl" aria-hidden="true">
      <canvas ref={canvasRef} className="gl__canvas" />
    </div>
  );
}
