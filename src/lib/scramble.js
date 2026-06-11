/**
 * Efecto "scramble" tipo instrumento: el texto se descifra de
 * izquierda a derecha con glifos técnicos. Sin dependencias;
 * devuelve una función de cancelación.
 */
const GLYPHS = '01<>/+·▮░—#=';

export function scramble(el, text, { duration = 700, fps = 30 } = {}) {
  if (!el) return () => {};
  const frames = Math.max(1, Math.round((duration / 1000) * fps));
  let frame = 0;
  let raf = 0;
  let last = 0;
  const step = 1000 / fps;

  const tick = (now) => {
    if (now - last >= step) {
      last = now;
      frame += 1;
      const reveal = Math.floor((frame / frames) * text.length);
      let out = '';
      for (let i = 0; i < text.length; i += 1) {
        if (text[i] === ' ') out += ' ';
        else if (i < reveal) out += text[i];
        else out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      el.textContent = out;
      if (frame >= frames) {
        el.textContent = text;
        return;
      }
    }
    raf = requestAnimationFrame(tick);
  };

  raf = requestAnimationFrame(tick);
  return () => {
    cancelAnimationFrame(raf);
    el.textContent = text;
  };
}
