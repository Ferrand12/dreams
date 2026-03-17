'use client';

import { m } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ScrollGallery } from '@/components/sections/portfolio/scroll-gallery';

export default function PortfolioSection() {
  const t = useTranslations('portfolio');

  return (
    <section id="work" className="relative z-10">
      {/* Section Intro */}
      <div className="bg-[#0A0A0A] px-6 md:px-12 lg:px-16 pt-24 md:pt-32 pb-16 md:pb-20">
        <m.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto"
        >
          <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-white/20 mb-6 block">
            {t('eyebrow')}
          </span>
          <h2
            className="text-4xl sm:text-5xl md:text-6xl font-nostalgic text-white max-w-3xl leading-tight tracking-tight"
            style={{ letterSpacing: '-0.04em' }}
          >
            {t('gallery.title')}
          </h2>
          <p className="text-sm md:text-base text-white/40 mt-4 max-w-xl font-light">
            {t('gallery.subtitle')}
          </p>
        </m.div>
      </div>

      {/* Scroll-driven editorial gallery */}
      <ScrollGallery />
    </section>
  );
}
