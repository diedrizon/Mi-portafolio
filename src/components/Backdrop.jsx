import './backdrop.css';

/**
 * Fondo de "instrumento de medición": rejilla fina, cruces de registro
 * y una línea de barrido ambiental. 100% CSS estático + una sola
 * animación de transform (GPU). Sustituye al canvas de partículas:
 * cero JavaScript, cero trabajo por frame en el hilo principal.
 */
export default function Backdrop() {
  return (
    <div className="backdrop" aria-hidden="true">
      <div className="backdrop__grid" />
      <div className="backdrop__cross" />
      <div className="backdrop__scan" />
    </div>
  );
}
