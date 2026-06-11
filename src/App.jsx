import { useEffect, useState } from 'react';
import Backdrop from './components/Backdrop';
import Scene3D from './components/Scene3D';
import Preloader from './components/Preloader';
import Cursor from './components/Cursor';
import Rail from './components/Rail';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Stack from './components/Stack';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import useReveal from './hooks/useReveal';
import { initMotion, initMagnetic } from './lib/motion';
import { initLetterTitles } from './lib/split';

/**
 * Orquestación v3:
 * 1. initMotion() levanta Lenis + ScrollTrigger (una sola fuente rAF).
 * 2. El Preloader bloquea el scroll y espera fuentes + escena 3D
 *    (`sceneReady`); al cerrar dispara la intro del hero (`intro`).
 * 3. Los botones magnéticos se activan después del arranque para
 *    garantizar que todo el DOM exista.
 */
export default function App() {
  const [sceneReady, setSceneReady] = useState(false);
  const [intro, setIntro] = useState(false);
  const [booted, setBooted] = useState(false);

  useReveal();

  useEffect(() => {
    initMotion();
  }, []);

  useEffect(() => {
    if (!booted) return;
    initMagnetic(document);
    initLetterTitles('.section-title');
  }, [booted]);

  /* Huevo de pascua en consola + título de pestaña vivo */
  useEffect(() => {
    if (window.__dfBoot) return undefined;
    window.__dfBoot = true;

     
    console.log(
      '%c\n  ██████╗ ███████╗\n  ██╔══██╗██╔════╝\n  ██║  ██║█████╗\n  ██║  ██║██╔══╝\n  ██████╔╝██║\n  ╚═════╝ ╚═╝\n',
      'color:#F5A623;font-family:monospace;font-size:12px;line-height:1.2'
    );
    console.log(
      '%c OBSERVATORIO DE DATOS — DF·2026 ',
      'background:#F5A623;color:#0A0D12;font-weight:bold;padding:4px 8px;border-radius:3px'
    );
    console.log(
      '%c¿Husmeando el código? Me gusta tu estilo.\n→ diedrinzonfargas@gmail.com · github.com/diedrizon',
      'color:#EDE8DD;font-family:monospace'
    );
     

    const orig = document.title;
    const onVis = () => {
      document.title = document.hidden ? '¿Ya te vas? — DF·2026' : orig;
    };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      document.removeEventListener('visibilitychange', onVis);
      document.title = orig;
    };
  }, []);

  return (
    <>
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>

      {!booted && (
        <Preloader
          ready={sceneReady}
          onDone={() => {
            setIntro(true);
            setBooted(true);
          }}
        />
      )}

      <Cursor />
      <Backdrop />
      <Scene3D onReady={() => setSceneReady(true)} />
      <Rail />
      <Navbar />

      <main id="contenido">
        <Hero play={intro} />
        <About />
        <Stack />
        <Projects />
        <Contact />
      </main>
      <Footer />

      <div className="grain" aria-hidden="true" />
    </>
  );
}
