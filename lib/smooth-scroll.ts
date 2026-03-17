const NAV_OFFSET = -96;

interface LenisLike {
  scrollTo: (
    target: string | number | HTMLElement,
    options?: {
      offset?: number;
      duration?: number;
      easing?: (t: number) => number;
    }
  ) => void;
}

/**
 * Smooth scroll to a CSS selector target using Lenis (with native fallback).
 * Accounts for fixed navbar offset.
 */
export function smoothScrollTo(target: string, offset: number = NAV_OFFSET) {
  const lenis = (window as unknown as { __lenis?: LenisLike }).__lenis;

  if (lenis) {
    lenis.scrollTo(target, {
      offset,
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    return;
  }

  // Fallback without Lenis
  const el = document.querySelector(target);
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}
