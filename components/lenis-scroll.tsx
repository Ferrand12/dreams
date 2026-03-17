'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

export default function LenisScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2, // Duration of scroll animation (1.2 seconds = subtle but noticeable)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Smooth easing
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1, // Normal scroll speed
      touchMultiplier: 2,
      infinite: false,
    });

    // Expose for programmatic smooth scroll (nav links, etc.)
    (window as unknown as { __lenis: Lenis }).__lenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      delete (window as unknown as Record<string, unknown>).__lenis;
    };
  }, []);

  return null;
}
