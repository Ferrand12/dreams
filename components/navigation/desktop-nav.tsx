'use client';

import { m, AnimatePresence } from 'framer-motion';

interface DesktopNavProps {
  isAtTop: boolean;
  isVisible: boolean;
  servicesLabel: string;
  portfolioLabel: string;
  aboutLabel: string;
  getStartedLabel: string;
  isContactPage: boolean;
}

export default function DesktopNav({ isAtTop, isVisible, servicesLabel, portfolioLabel, aboutLabel, getStartedLabel, isContactPage }: DesktopNavProps) {
  const linkClass = `md:block hidden px-4 py-2 text-sm font-medium border transition-fast ${
    isAtTop
      ? 'text-white border-overlay-border-medium hover:bg-white hover:text-black'
      : 'text-foreground-light border-black/10 hover:border-black hover:text-white hover:bg-black'
  }`;

  return (
    <>
      <m.a whileTap={{ scale: 0.98 }} href="#services" className={linkClass}>
        {servicesLabel}
      </m.a>

      <m.a whileTap={{ scale: 0.98 }} href="#work" className={linkClass}>
        {portfolioLabel}
      </m.a>

      <m.a whileTap={{ scale: 0.98 }} href="/about" className={linkClass}>
        {aboutLabel}
      </m.a>

      {/* CTA Button - Desktop only */}
      {isVisible && !isContactPage && (
        <m.a
          layoutId="get-started-button"
          whileTap={{ scale: 0.98 }}
          href="/start"
          className={`hidden md:block px-4 py-2 text-sm font-medium border transition-fast ${
            isAtTop
              ? 'text-black bg-white border-overlay-border-medium hover:bg-surface-light-1'
              : 'text-white bg-black hover:bg-brand-hover border-black hover:border-brand-hover'
          }`}
        >
          {getStartedLabel} →
        </m.a>
      )}
    </>
  );
}
