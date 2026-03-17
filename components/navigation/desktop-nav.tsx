'use client';

import { m } from 'framer-motion';
import { smoothScrollTo } from '@/lib/smooth-scroll';

interface DesktopNavProps {
  isAtTop: boolean;
  isVisible: boolean;
  servicesLabel: string;
  portfolioLabel: string;
  aboutLabel: string;
  getStartedLabel: string;
  isContactPage: boolean;
  activeSection: string;
}

const sectionLinks = [
  { key: 'services', target: '#services' },
  { key: 'work', target: '#work' },
] as const;

export default function DesktopNav({
  isAtTop,
  isVisible,
  servicesLabel,
  portfolioLabel,
  aboutLabel,
  getStartedLabel,
  isContactPage,
  activeSection,
}: DesktopNavProps) {
  const labels: Record<string, string> = {
    services: servicesLabel,
    work: portfolioLabel,
  };

  return (
    <>
      {/* Section links — smooth scroll with active state */}
      {sectionLinks.map(({ key, target }) => {
        const isActive = activeSection === key;
        return (
          <button
            key={key}
            onClick={() => smoothScrollTo(target)}
            className={`hidden md:block px-3 py-2 text-sm font-medium transition-colors duration-200 ${
              isAtTop
                ? isActive
                  ? 'text-white'
                  : 'text-white/50 hover:text-white'
                : isActive
                  ? 'text-foreground-light'
                  : 'text-foreground-light/40 hover:text-foreground-light'
            }`}
          >
            {labels[key]}
          </button>
        );
      })}

      {/* About — route link, not anchor */}
      <m.a
        whileTap={{ scale: 0.98 }}
        href="/about"
        className={`hidden md:block px-3 py-2 text-sm font-medium transition-colors duration-200 ${
          isAtTop
            ? 'text-white/50 hover:text-white'
            : 'text-foreground-light/40 hover:text-foreground-light'
        }`}
      >
        {aboutLabel}
      </m.a>

      {/* CTA */}
      {isVisible && !isContactPage && (
        <m.a
          layoutId="get-started-button"
          whileTap={{ scale: 0.98 }}
          href="/start"
          className={`hidden md:block px-4 py-2 text-sm font-medium border transition-[color,background-color,border-color] duration-200 ${
            isAtTop
              ? 'text-black bg-white border-white/20 hover:bg-surface-light-1'
              : 'text-white bg-black hover:bg-brand-hover border-black hover:border-brand-hover'
          }`}
        >
          {getStartedLabel} →
        </m.a>
      )}
    </>
  );
}
