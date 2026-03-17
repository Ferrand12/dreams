'use client';

import { m } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { fadeInUp, transitions } from '@/lib/motion-presets';
import { getGalleryProjects, type EnrichedProject } from '@/lib/portfolio';

export function WorkGallery() {
  const t = useTranslations('portfolio');
  const locale = useLocale();
  const projects = getGalleryProjects();

  if (projects.length === 0) return null;

  const enterprise = projects.filter((p) => p.segment === 'enterprise');
  const people = projects.filter((p) => p.segment === 'people');

  return (
    <div className="mt-16 md:mt-24">
      {/* Gallery intro */}
      <m.div
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={fadeInUp}
        transition={transitions.smooth}
        className="max-w-7xl mx-auto px-6 md:px-12 mb-12 md:mb-16"
      >
        <div className="border-t border-black/8 pt-12 md:pt-16">
          <h3
            className="text-3xl sm:text-4xl md:text-5xl font-nostalgic tracking-tighter leading-[0.95]"
          >
            {t('gallery.title')}
          </h3>
          <p className="text-sm md:text-base text-black/50 mt-4 max-w-xl font-light leading-relaxed">
            {t('gallery.subtitle')}
          </p>
        </div>
      </m.div>

      {/* Scroll-snap gallery */}
      <div
        className="snap-y snap-mandatory overflow-y-auto"
        style={{ height: `${projects.length * 100}vh` }}
      >
        {/* Enterprise slides */}
        {enterprise.map((project, idx) => (
          <WorkSlide
            key={project.slug}
            project={project}
            index={idx}
            total={projects.length}
            globalIndex={idx}
            locale={locale}
            t={t}
          />
        ))}

        {/* People slides */}
        {people.map((project, idx) => (
          <WorkSlide
            key={project.slug}
            project={project}
            index={idx}
            total={projects.length}
            globalIndex={enterprise.length + idx}
            locale={locale}
            t={t}
          />
        ))}
      </div>
    </div>
  );
}

// ── Work Slide ──

function WorkSlide({
  project,
  index,
  total,
  globalIndex,
  locale,
  t,
}: {
  project: EnrichedProject;
  index: number;
  total: number;
  globalIndex: number;
  locale: string;
  t: ReturnType<typeof useTranslations>;
}) {
  const bg = project.galleryBg || '#121212';
  const segmentLabel = project.segment === 'enterprise'
    ? t('gallery.enterprise')
    : t('gallery.people');
  const counter = String(globalIndex + 1).padStart(3, '0');

  const href = project.detailPageSlug
    ? `/${locale}/work/${project.detailPageSlug}`
    : undefined;

  return (
    <div
      className="snap-start h-screen relative flex flex-col justify-between overflow-hidden"
      style={{ backgroundColor: bg }}
    >
      {/* Top bar */}
      <div className="relative z-10 flex items-start justify-between px-6 md:px-12 pt-8 md:pt-12">
        <div className="flex items-center gap-4">
          <span className="text-[11px] font-mono tracking-[0.2em] text-white/25">
            W — {counter}
          </span>
          <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-white/40 px-2.5 py-1 border border-white/10">
            {segmentLabel}
          </span>
        </div>
        <span className="text-[11px] font-mono tracking-[0.2em] text-white/20">
          {t(`categories.${project.categoryKey}`)}
        </span>
      </div>

      {/* Center content — title + image */}
      <div className="relative z-10 flex-1 flex flex-col md:flex-row items-start md:items-center px-6 md:px-12 gap-6 md:gap-12 py-8 md:py-0">
        {/* Text column */}
        <div className="md:w-1/2 flex flex-col justify-center">
          <h4
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-nostalgic text-white leading-[0.9] tracking-tighter"
          >
            {project.titleKey}
          </h4>

          {project.impactLineKey && (
            <p className="text-sm md:text-base text-white/40 mt-6 max-w-md font-light leading-relaxed">
              {t(project.impactLineKey)}
            </p>
          )}
        </div>

        {/* Image column */}
        <div className="md:w-1/2 w-full">
          <SlideImage src={project.imageSrc} alt={project.titleKey} />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative z-10 flex items-end justify-between px-6 md:px-12 pb-8 md:pb-12">
        <div className="flex flex-wrap gap-2">
          {project.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-mono tracking-wider text-white/20 px-2 py-1 border border-white/8"
            >
              {tag}
            </span>
          ))}
        </div>

        {href && (
          <Link
            href={href}
            className="group inline-flex items-center gap-3"
          >
            <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors duration-200">
              {t('cta.viewCaseStudy')}
            </span>
            <span className="w-10 h-10 border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black text-white/60 transition-all duration-200">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 13L13 1M13 1H3M13 1V11" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </span>
          </Link>
        )}
      </div>
    </div>
  );
}

// ── Slide Image ──

function SlideImage({ src, alt }: { src: string; alt: string }) {
  if (src) {
    return (
      <div className="aspect-[4/3] md:aspect-[3/2] relative overflow-hidden w-full">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          quality={85}
        />
      </div>
    );
  }

  return (
    <div className="aspect-[4/3] md:aspect-[3/2] relative overflow-hidden w-full bg-white/[0.03]">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div className="absolute inset-0 flex items-end p-6 md:p-10">
        <span className="text-xs font-mono tracking-widest uppercase text-white/8">
          {alt}
        </span>
      </div>
    </div>
  );
}
