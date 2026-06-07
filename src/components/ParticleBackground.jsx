// src/components/ParticleBackground.jsx
import React, { useEffect, useRef } from 'react';
import './ParticleBackground.css';

/**
 * Constelación interactiva multicolor (optimizada).
 * Mejoras de rendimiento:
 *  - Glow con sprite pre-renderizado (drawImage) en lugar de shadowBlur por
 *    partícula, que es muy costoso.
 *  - Bucle rAF que se pausa cuando la pestaña no está visible.
 *  - DPR capado y resize con debounce.
 *  - Conteo de partículas reducido en móvil / reduced-motion.
 */
const ParticleBackground = () => {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  const autoPointer = useRef({ x: 0, y: 0, tx: 0, ty: 0, speed: 1.4 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: true });
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let particles = [];
    let isMobile = window.innerWidth <= 768;
    let dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let raf = null;
    let running = true;

    const palette = ['#22d3ee', '#a855f7', '#ec4899', '#a3e635'];

    // --- sprites de glow pre-renderizados (uno por color) ---
    const SPRITE = 24;
    const sprites = {};
    const buildSprites = () => {
      palette.forEach((color) => {
        const s = document.createElement('canvas');
        s.width = s.height = SPRITE;
        const sc = s.getContext('2d');
        const g = sc.createRadialGradient(
          SPRITE / 2, SPRITE / 2, 0,
          SPRITE / 2, SPRITE / 2, SPRITE / 2
        );
        g.addColorStop(0, color);
        g.addColorStop(0.35, color + 'cc');
        g.addColorStop(1, color + '00');
        sc.fillStyle = g;
        sc.fillRect(0, 0, SPRITE, SPRITE);
        sprites[color] = s;
      });
    };
    buildSprites();

    mouse.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    autoPointer.current = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      tx: Math.random() * window.innerWidth,
      ty: Math.random() * window.innerHeight,
      speed: 1.4,
    };

    const buildParticles = () => {
      const count = reduce ? 36 : isMobile ? 50 : 100;
      particles = Array.from({ length: count }).map(() => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        r: Math.random() * 1.6 + 0.8,
        pulse: Math.random() * Math.PI * 2,
        color: palette[(Math.random() * palette.length) | 0],
      }));
    };

    const applySize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      isMobile = window.innerWidth <= 768;
      buildParticles();
    };

    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(applySize, 150);
    };

    const onMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    applySize();

    const W = () => window.innerWidth;
    const H = () => window.innerHeight;

    const draw = () => {
      const w = W();
      const h = H();
      ctx.clearRect(0, 0, w, h);

      // --- partículas (glow barato con sprite) ---
      ctx.globalCompositeOperation = 'lighter';
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.05;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        const scale = (Math.sin(p.pulse) * 0.25 + 1) * p.r;
        const size = SPRITE * scale;
        ctx.drawImage(sprites[p.color], p.x - size / 2, p.y - size / 2, size, size);
      }
      ctx.globalCompositeOperation = 'source-over';

      // --- conexiones entre partículas cercanas ---
      const linkDist = isMobile ? 95 : 130;
      const linkDist2 = linkDist * linkDist;
      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < linkDist2) {
            const alpha = (1 - Math.sqrt(d2) / linkDist) * 0.22;
            ctx.strokeStyle = `rgba(148, 163, 255, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // --- nodo guía (ratón / auto) ---
      let gx, gy;
      if (isMobile || reduce) {
        const ap = autoPointer.current;
        const dx = ap.tx - ap.x;
        const dy = ap.ty - ap.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 12) {
          ap.tx = Math.random() * w;
          ap.ty = Math.random() * h;
        } else {
          ap.x += (dx / dist) * ap.speed;
          ap.y += (dy / dist) * ap.speed;
        }
        gx = ap.x;
        gy = ap.y;
      } else {
        gx = mouse.current.x;
        gy = mouse.current.y;
      }

      // enlaza las 9 más cercanas al nodo guía sin ordenar todo el array
      const gd = particles.map((p, idx) => ({
        idx,
        d: (p.x - gx) ** 2 + (p.y - gy) ** 2,
      }));
      gd.sort((a, b) => a.d - b.d);
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.35)';
      ctx.lineWidth = 1.1;
      for (let k = 0; k < 9 && k < gd.length; k++) {
        const p = particles[gd[k].idx];
        ctx.beginPath();
        ctx.moveTo(gx, gy);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }

      const guide = sprites['#22d3ee'];
      ctx.globalCompositeOperation = 'lighter';
      ctx.drawImage(guide, gx - 14, gy - 14, 28, 28);
      ctx.globalCompositeOperation = 'source-over';

      raf = requestAnimationFrame(draw);
    };

    const start = () => {
      if (!running) return;
      if (raf == null) raf = requestAnimationFrame(draw);
    };
    const stop = () => {
      if (raf != null) {
        cancelAnimationFrame(raf);
        raf = null;
      }
    };

    const onVisibility = () => {
      running = !document.hidden;
      if (running) start();
      else stop();
    };

    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    start();

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('visibilitychange', onVisibility);
      clearTimeout(resizeTimer);
      stop();
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-canvas" />;
};

export default ParticleBackground;
