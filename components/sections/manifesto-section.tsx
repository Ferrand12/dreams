'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Dithering } from '@paper-design/shaders-react';

export default function ManifestoSection() {
  const t = useTranslations('manifesto');
  const [isHovered, setIsHovered] = useState(false);
  const principles = t.raw('principles') as { title: string; description: string }[];

  return (
    <section className="py-20 md:py-32 w-full flex justify-center items-center px-4 md:px-6 bg-[#1E1E1E]">
      <div
        className="w-full max-w-7xl relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative overflow-hidden bg-white border border-[#DEE5ED] py-20 md:py-28">
          {/* Dithering shader — multiply blend for white card */}
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
          <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center gap-10 px-6">
            {/* Badge — editorial label, no ping dot */}
            <div className="inline-flex items-center px-4 py-1.5 text-sm font-medium text-[#5A5A5A] border border-[#1E1E1E]/15 bg-[#1E1E1E]/5">
              {t('badge')}
            </div>

            {/* Headline — ZT Hoky, one step down from hero (6xl max vs 7xl) */}
            <h2 className="font-nostalgic text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight text-[#1E1E1E] leading-[1.1]">
              {t('title')}
            </h2>

            {/* Supporting — Geist Sans, Gris Acento */}
            <p className="text-lg md:text-xl text-[#5A5A5A] leading-relaxed max-w-2xl">
              {t('subtitle')}
            </p>

            {/* Principles — 2x2 grid, title + description */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-3xl">
              {principles.map((principle, index) => (
                <div
                  key={index}
                  className="border border-[#1E1E1E]/10 px-6 py-5 text-left"
                >
                  <p className="text-base font-medium text-[#1E1E1E] mb-1">
                    {principle.title}
                  </p>
                  <p className="text-sm text-[#5A5A5A] leading-relaxed">
                    {principle.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
