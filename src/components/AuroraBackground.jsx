import React from 'react';

/**
 * Capa de fondo "aurora": blobs de color difusos que flotan lentamente
 * detrás del contenido, más una rejilla y grano sutil para profundidad.
 * Es puramente decorativa (CSS animado en App.css).
 */
const AuroraBackground = () => (
  <div className="aurora" aria-hidden="true">
    <div className="aurora__blob aurora__blob--cyan" />
    <div className="aurora__blob aurora__blob--blue" />
    <div className="aurora__blob aurora__blob--teal" />
    <div className="aurora__grid" />
    <div className="aurora__noise" />
  </div>
);

export default AuroraBackground;
