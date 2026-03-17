'use client';

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

      {/* About — route link */}
      <a
        href="/about"
        className={`hidden md:block px-3 py-2 text-sm font-medium transition-colors duration-200 ${
          isAtTop
            ? 'text-white/50 hover:text-white'
            : 'text-foreground-light/40 hover:text-foreground-light'
        }`}
      >
        {aboutLabel}
      </a>

      {/* CTA — primary action */}
      {!isContactPage && (
        <a
          href="/start"
          className={`hidden md:block px-5 py-2 text-sm font-medium border group transition-[color,background-color,border-color] duration-200 ${
            isAtTop
              ? 'text-[#1E1E1E] bg-white border-white hover:bg-[#DEE5ED]'
              : 'text-white bg-[#1E1E1E] border-[#1E1E1E] hover:bg-[#333]'
          }`}
        >
          {getStartedLabel}
          <span className="inline-block ml-1.5 transition-transform duration-200 group-hover:translate-x-0.5">→</span>
        </a>
      )}
    </>
  );
}
