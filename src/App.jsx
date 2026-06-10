import Backdrop from './components/Backdrop';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Stack from './components/Stack';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import useReveal from './hooks/useReveal';

export default function App() {
  /* Un único IntersectionObserver revela todos los bloques [data-reveal]. */
  useReveal();

  return (
    <>
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      <Backdrop />
      <Navbar />
      <main id="contenido">
        <Hero />
        <About />
        <Stack />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
