import React, { useEffect, useRef } from 'react';

/** Barra de progreso de scroll fija en la parte superior. */
const ScrollProgress = () => {
  const barRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${scrolled})`;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return <div ref={barRef} className="scroll-progress" aria-hidden="true" />;
};

export default ScrollProgress;
