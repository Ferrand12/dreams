'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Logo from '@/components/logo';
import { Dithering } from '@paper-design/shaders-react';

export default function HeroSection() {
  const t = useTranslations('hero');
  const tManifesto = useTranslations('manifesto');
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative w-full h-screen bg-black flex items-center justify-center px-4 md:px-6">
      {/* SEO H1 - Visually hidden but available for screen readers and SEO */}
      <h1 className="sr-only">
        {t('seoHeading')}
      </h1>

      <div
        className="w-full max-w-7xl relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative overflow-hidden border border-black/10 bg-white shadow-sm min-h-[600px] md:min-h-[700px] flex flex-col items-center justify-center duration-500">
          {/* Dithering shader background */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-40 mix-blend-multiply">
            <Dithering
              colorBack="#00000000"
              colorFront="#A5B3C2"
              shape="warp"
              type="4x4"
              speed={isHovered ? 0.6 : 0.2}
              className="w-full h-full"
              minPixelRatio={1}
            />
          </div>

          <div className="relative z-10 px-6 max-w-4xl mx-auto text-center flex flex-col items-center">
            {/* Badge */}
            <div className="mb-8 inline-flex items-center gap-2 border border-black bg-black/5 px-4 py-1.5 text-sm font-medium text-black backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-black" />
              </span>
              {t('badge')}
            </div>

            {/* Headline with inline Logo */}
            <h2 className="font-nostalgic text-4xl md:text-6xl lg:text-7xl tracking-tight text-black mb-12 leading-tight flex flex-wrap items-center justify-center gap-x-4">
              {tManifesto('weAre')}{' '}
              <Logo className="h-10 md:h-12 lg:h-16 w-auto inline-block" fill="black" />
              , {tManifesto('description')}
            </h2>

            {/* CTA Button */}
            <Link
              href="/start"
              className="group relative inline-flex h-14 items-center justify-center gap-3 overflow-hidden bg-black border-2 border-black px-12 text-base font-medium text-white transition-all duration-300 hover:bg-white hover:text-black active:scale-95"
            >
              <span className="relative z-10">{t('cta')}</span>
              <ArrowRight className="h-5 w-5 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
