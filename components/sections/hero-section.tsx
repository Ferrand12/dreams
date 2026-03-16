'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Dithering } from '@paper-design/shaders-react';

const CARD_KEYS = ['card1', 'card2'] as const;

export default function HeroSection() {
  const t = useTranslations('hero');
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative w-full h-screen bg-[#1E1E1E] flex items-center justify-center px-6 md:px-12"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h1 className="sr-only">{t('seoHeading')}</h1>

      {/* Dithering shader — screen blend for dark background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30 mix-blend-screen">
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
      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center gap-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 border border-white/20 bg-white/5 px-4 py-1.5 text-sm font-medium text-white/70 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
          </span>
          {t('badge')}
        </div>

        {/* Headline — ZT Hoky, white */}
        <h2 className="font-nostalgic text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight text-white leading-[1.1]">
          {t('title')}
        </h2>

        {/* Supporting — Geist Sans, muted white */}
        <p className="text-lg md:text-xl text-white/60 leading-relaxed max-w-2xl">
          {t('subtitle')}
        </p>

        {/* Cards — 2 column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
          {CARD_KEYS.map((key) => (
            <div
              key={key}
              className="border border-white/10 bg-white/5 px-6 py-5 text-left backdrop-blur-sm"
            >
              <p className="text-base font-medium text-white">
                {t(`cards.${key}`)}
              </p>
            </div>
          ))}
        </div>

        {/* CTA — white on dark, hover Winter Haze */}
        <Link
          href="/start"
          className="group inline-flex h-14 items-center justify-center gap-3 bg-white border-2 border-white px-12 text-base font-medium text-[#1E1E1E] transition-all duration-300 hover:bg-[#DEE5ED] hover:border-[#DEE5ED] active:scale-[0.98]"
        >
          <span>{t('cta')}</span>
          <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
