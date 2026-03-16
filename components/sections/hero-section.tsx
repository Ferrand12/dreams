'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Dithering } from '@paper-design/shaders-react';

export default function HeroSection() {
  const t = useTranslations('hero');
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative w-full h-screen bg-white flex items-center justify-center px-6 md:px-12"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* SEO H1 */}
      <h1 className="sr-only">{t('seoHeading')}</h1>

      {/* Dithering shader background — fills full viewport */}
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

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center gap-8">
        {/* Badge — Geist Sans Medium, caption size */}
        <div className="inline-flex items-center gap-2 border border-[#1E1E1E] bg-[#1E1E1E]/5 px-4 py-1.5 text-sm font-medium text-[#1E1E1E] backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1E1E1E] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1E1E1E]" />
          </span>
          {t('badge')}
        </div>

        {/* Headline — ZT Hoky, H1 responsive */}
        <h2 className="font-nostalgic text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight text-[#1E1E1E] leading-[1.1]">
          {t('title')}
        </h2>

        {/* Supporting — Geist Sans Regular, body-large, relaxed line-height */}
        <p className="text-lg md:text-xl text-[#5A5A5A] leading-relaxed max-w-2xl">
          {t('subtitle')}
        </p>

        {/* CTA — hover Gris Acento #5A5A5A */}
        <Link
          href="/start"
          className="group inline-flex h-14 items-center justify-center gap-3 bg-[#1E1E1E] border-2 border-[#1E1E1E] px-12 text-base font-medium text-white transition-all duration-300 hover:bg-[#5A5A5A] hover:border-[#5A5A5A] active:scale-[0.98]"
        >
          <span>{t('cta')}</span>
          <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
