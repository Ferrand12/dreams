'use client';

import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { m } from 'framer-motion';
import SocialLinks from '@/components/social-links';
import Logo from '@/components/logo';
import { useState, useEffect } from 'react';
import { isLocalhost } from '@/lib/localhost';

export default function FooterSection() {
  const tFooter = useTranslations('contact.footer');
  const tNav = useTranslations('nav');
  const pathname = usePathname();
  const [showAdminLink, setShowAdminLink] = useState(false);

  useEffect(() => {
    setShowAdminLink(isLocalhost());
  }, []);

  const isContactPage = pathname.includes('/contact');
  const isThankYouPage = pathname.includes('/thank-you');

  return (
    <footer className="bg-black text-white border-t border-overlay-border-light py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* CTA Section - Hidden on contact and thank you pages */}
        {!isContactPage && !isThankYouPage && (
          <div className="text-center mb-16">
            <h3 className="text-2xl md:text-3xl font-nostalgic text-white mb-4">
              {tFooter('ctaHeading')}
            </h3>
            <Link
              href="/start"
              className="text-base text-muted hover:text-white border-b border-muted hover:border-white transition-colors"
            >
              {tNav('getStarted')} →
            </Link>
          </div>
        )}

        {/* Main Content */}
        <div className="flex flex-col md:flex-row justify-between gap-12 mb-12">
          {/* Brand */}
          <div>
            <Link href="/" aria-label="Dreeeams Home">
              <Logo
                className="h-auto w-auto max-w-[180px] mb-3"
                fill="white"
              />
            </Link>
            <p className="text-sm text-muted max-w-xs">
              {tFooter('tagline')}
            </p>
            <p className="text-xs text-muted mt-3">
              Bogotá, Colombia
            </p>
            <div className="mt-4">
              <SocialLinks />
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-8 md:gap-12">
            <div className="space-y-3">
              <a href="#services" className="block text-sm text-muted hover:text-white transition-colors">
                {tFooter('services')}
              </a>
              <a href="#work" className="block text-sm text-muted hover:text-white transition-colors">
                {tFooter('portfolio')}
              </a>
              <a href="#contact" className="block text-sm text-muted hover:text-white transition-colors">
                {tFooter('contact')}
              </a>
              <Link href="/about" className="block text-sm text-muted hover:text-white transition-colors">
                {tFooter('about')}
              </Link>
            </div>

            <div className="space-y-3">
              <Link href="/payments" className="block text-sm text-muted hover:text-white transition-colors">
                {tFooter('payments')}
              </Link>
              <Link href="/legal" className="block text-sm text-muted hover:text-white transition-colors">
                Legal
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-overlay-border-light pt-8 flex justify-between items-center">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} Dreeeams. {tFooter('rights')}.
          </p>
          {showAdminLink && (
            <Link
              href="/admin/login"
              className="text-xs text-muted hover:text-white/80 transition-colors opacity-50 hover:opacity-100"
              title="Admin Login"
            >
              ●
            </Link>
          )}
        </div>
      </div>
    </footer>
  );
}
