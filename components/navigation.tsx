'use client';

import { m } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import Logo from '@/components/logo';
import { useScrollPosition } from '@/lib/hooks';
import MobileMenu from '@/components/navigation/mobile-menu';
import DesktopNav from '@/components/navigation/desktop-nav';

const TRACKED_SECTIONS = ['services', 'work'] as const;

export default function Navigation() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [activeSection, setActiveSection] = useState('');
  const lastScrollY = useRef(0);
  const { isAtTop } = useScrollPosition();

  const isContactPage = pathname.includes('/contact') || pathname.includes('/start');

  // Force scroll to top on locale change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [locale]);

  // Hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < lastScrollY.current) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Active section detection via IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: '-30% 0px -50% 0px', threshold: 0 }
    );

    TRACKED_SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Clear active section when at top of page
  useEffect(() => {
    if (isAtTop) setActiveSection('');
  }, [isAtTop]);

  const toggleLanguage = () => {
    const newLocale = locale === 'en' ? 'es' : 'en';
    // Remove current locale from pathname and add new locale
    const pathWithoutLocale = pathname.replace(`/${locale}`, '');
    
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  const menuItems = [
    { label: t('services'), href: '#services' },
    { label: 'Portfolio', href: '#work' },
    { label: t('about'), href: '/about' },
    { label: t('getStarted'), href: '/start' },
  ];

  return (
    <>
      {/* Main Navigation - Hides on scroll */}
      <m.nav
        initial={{ y: -100 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ duration: isVisible ? 0.3 : 0, ease: 'easeInOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-smooth ${
          isAtTop
            ? 'bg-transparent border-b border-transparent'
            : 'bg-background-light/80 backdrop-blur-sm border-b border-black/10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex items-center justify-between">
            {/* Left Side - Logo */}
            <Link href="/" aria-label="Dreeeams Home">
              <m.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center cursor-pointer"
              >
                <Logo
                  className="h-auto w-auto max-w-[70px] sm:max-w-[75px] md:max-w-[80px]"
                  fill={isAtTop ? 'white' : 'currentColor'}
                />
              </m.div>
            </Link>

            {/* Right Side - Navigation & Controls */}
            <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-foreground-light ml-auto">
              {/* Language Toggle */}
              <m.button
                onClick={toggleLanguage}
                whileTap={{ scale: 0.98 }}
                className={`px-4 py-2 border transition-fast flex items-center justify-center gap-2 group ${
                  isAtTop
                    ? 'border-overlay-border-medium hover:bg-white'
                    : 'border-black/10 hover:border-black hover:bg-black'
                }`}
                aria-label="Toggle language"
              >
                {locale === 'en' ? (
                  <svg className="w-7 h-5" viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#bd3d44" d="M0 0h640v480H0z"/>
                    <path stroke="#fff" strokeWidth="37" d="M0 55.3h640m0 74H0m0 73.9h640m0 74H0m0 73.8h640m0 74H0"/>
                    <path fill="#192f5d" d="M0 0h364.8v258.5H0z"/>
                    <marker id="us-a" markerHeight="30" markerWidth="30">
                      <path fill="#fff" d="m14 0 9 27L0 10h28L5 27z"/>
                    </marker>
                    <path fill="none" markerMid="url(#us-a)" d="m0 0 16 11h61 61 61 61 60L47 37h61 61 60 61L16 63h61 61 61 61 60L47 89h61 61 60 61L16 115h61 61 61 61 60L47 141h61 61 60 61L16 166h61 61 61 61 60L47 192h61 61 60 61L16 218h61 61 61 61 60z"/>
                  </svg>
                ) : (
                  <svg className="w-7 h-5" viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg">
                    <rect width="900" height="300" fill="#FCD116"/>
                    <rect width="900" height="150" y="300" fill="#003893"/>
                    <rect width="900" height="150" y="450" fill="#CE1126"/>
                  </svg>
                )}
                {/* Chevron Down Icon */}
                <svg
                  className={`w-3 h-3 transition-colors ${
                    isAtTop ? 'text-white group-hover:text-black' : 'text-black group-hover:text-white'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </m.button>

              {/* Desktop Navigation */}
              <DesktopNav
                isAtTop={isAtTop}
                isVisible={isVisible}
                servicesLabel={t('services')}
                portfolioLabel={t('work')}
                aboutLabel={t('about')}
                getStartedLabel={t('getStarted')}
                isContactPage={isContactPage}
                activeSection={activeSection}
              />

              {/* Mobile Menu Button */}
              <m.button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                whileTap={{ scale: 0.98 }}
                className={`md:hidden px-3 py-2 flex flex-col items-center justify-center gap-1.5 border transition-fast group ${
                  isAtTop
                    ? 'border-overlay-border-medium hover:bg-white'
                    : 'border-black/10 hover:border-black hover:bg-black'
                }`}
                aria-label="Toggle menu"
              >
                <m.span
                  animate={isMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                  className={`w-5 h-0.5 transition-colors ${
                    isAtTop ? 'bg-white group-hover:bg-black' : 'bg-black group-hover:bg-white'
                  }`}
                />
                <m.span
                  animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                  className={`w-5 h-0.5 transition-colors ${
                    isAtTop ? 'bg-white group-hover:bg-black' : 'bg-black group-hover:bg-white'
                  }`}
                />
                <m.span
                  animate={isMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                  className={`w-5 h-0.5 transition-colors ${
                    isAtTop ? 'bg-white group-hover:bg-black' : 'bg-black group-hover:bg-white'
                  }`}
                />
              </m.button>
            </div>
          </div>
        </div>
      </m.nav>

      {/* Fixed Contact Button - Visible when header is hidden */}
      {!isVisible && !isContactPage && (
        <m.a
          layoutId="get-started-button"
          href="/start"
          whileTap={{ scale: 0.98 }}
          className="block fixed top-4 sm:top-5 right-4 sm:right-6 md:right-[calc((100vw-80rem)/2+1.5rem)] z-[60] px-5 py-2.5 sm:px-4 sm:py-2 text-sm font-medium text-white bg-black hover:bg-brand-hover border border-black hover:border-brand-hover transition-fast"
        >
          {t('getStarted')} →
        </m.a>
      )}

      {/* Full Screen Mobile Menu */}
      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        menuItems={menuItems}
      />
    </>
  );
}
