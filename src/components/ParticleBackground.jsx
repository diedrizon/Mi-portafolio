// src/components/ParticleBackground.jsx
import React, { useEffect, useRef } from 'react';
import './ParticleBackground.css';

/**
 * Constelación interactiva multicolor.
 * - Las partículas flotan, pulsan y se conectan entre sí cuando están cerca.
 * - Un "nodo guía" sigue al ratón (o se mueve solo en móvil) y enlaza
 *   las partículas más próximas con líneas de neón.
 */
const ParticleBackground = () => {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  const autoPointer = useRef({ x: 0, y: 0, tx: 0, ty: 0, speed: 1.4 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let particles = [];
    let isMobile = window.innerWidth <= 768;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf;

    const palette = ['#22d3ee', '#a855f7', '#ec4899', '#a3e635'];

    mouse.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    autoPointer.current = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      tx: Math.random() * window.innerWidth,
      ty: Math.random() * window.innerHeight,
      speed: 1.4,
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      isMobile = window.innerWidth <= 768;

      const count = isMobile ? 55 : 110;
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

    const onMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMove);
    resize();

    const W = () => window.innerWidth;
    const H = () => window.innerHeight;

    const draw = () => {
      ctx.clearRect(0, 0, W(), H());

      // --- mover y dibujar partículas
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.05;
        if (p.x < 0 || p.x > W()) p.vx *= -1;
        if (p.y < 0 || p.y > H()) p.vy *= -1;

        const glow = (Math.sin(p.pulse) + 1) * 3 + 2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = glow;
        ctx.shadowColor = p.color;
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      // --- conexiones entre partículas cercanas
      const linkDist = isMobile ? 95 : 130;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < linkDist) {
            const alpha = (1 - d / linkDist) * 0.22;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(148, 163, 255, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // --- nodo guía (ratón / auto)
      let gx, gy;
      if (isMobile || reduce) {
        const ap = autoPointer.current;
        const dx = ap.tx - ap.x;
        const dy = ap.ty - ap.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 12) {
          ap.tx = Math.random() * W();
          ap.ty = Math.random() * H();
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

      const nearest = [...particles]
        .sort((a, b) => {
          const da = (a.x - gx) ** 2 + (a.y - gy) ** 2;
          const db = (b.x - gx) ** 2 + (b.y - gy) ** 2;
          return da - db;
        })
        .slice(0, 9);

      nearest.forEach((p) => {
        ctx.beginPath();
        ctx.moveTo(gx, gy);
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = 'rgba(34, 211, 238, 0.35)';
        ctx.lineWidth = 1.1;
        ctx.stroke();
      });

      ctx.beginPath();
      ctx.arc(gx, gy, 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(34, 211, 238, 0.95)';
      ctx.shadowBlur = 16;
      ctx.shadowColor = '#22d3ee';
      ctx.fill();
      ctx.shadowBlur = 0;

      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-canvas" />;
};

export default ParticleBackground;
