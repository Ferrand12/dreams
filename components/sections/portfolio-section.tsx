'use client';

import { m } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { getFeaturedProjects } from '@/lib/portfolio';
import { FeaturedCase } from '@/components/sections/portfolio/featured-case';
import { WorkGallery } from '@/components/sections/portfolio/work-gallery';

export default function PortfolioSection() {
  const t = useTranslations('portfolio');
  const projects = getFeaturedProjects();

  const heroProjects = projects.filter((p) => p.teaserVariant === 'hero');
  const standardProjects = projects.filter((p) => p.teaserVariant === 'standard');
  const minimalProjects = projects.filter(
    (p) => p.teaserVariant === 'minimal' || !p.teaserVariant
  );

  return (
    <section id="work" className="relative z-10 py-24 md:py-32 px-6 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <m.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 md:mb-20"
        >
          <span className="text-xs font-mono tracking-widest uppercase text-muted-foreground mb-4 block">
            {t('eyebrow')}
          </span>
          <h2
            className="text-4xl sm:text-5xl md:text-6xl font-nostalgic max-w-3xl leading-tight tracking-tight"
            style={{ letterSpacing: '-0.04em' }}
          >
            {t('title')}
          </h2>
          <p className="text-sm md:text-base text-muted-foreground mt-4 max-w-xl">
            {t('subtitle')}
          </p>
        </m.div>

        {/* Hero blocks — full width, generous spacing */}
        {heroProjects.length > 0 && (
          <div className="mb-12 md:mb-16">
            {heroProjects.map((project, i) => (
              <FeaturedCase key={project.slug} project={project} index={i} />
            ))}
          </div>
        )}

        {/* Standard grid — 2 columns */}
        {standardProjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12">
            {standardProjects.map((project, i) => (
              <FeaturedCase key={project.slug} project={project} index={i} />
            ))}
          </div>
        )}

        {/* Minimal list — compact rows */}
        {minimalProjects.length > 0 && (
          <div className="space-y-4">
            {minimalProjects.map((project, i) => (
              <FeaturedCase key={project.slug} project={project} index={i} />
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen work gallery — Huge-style scroll-snap panels */}
      <WorkGallery />
    </section>
  );
}
