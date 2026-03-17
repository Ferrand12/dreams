'use client';

import { useRef } from 'react';
import { m, useScroll, useTransform, useSpring } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { getGalleryProjects, type EnrichedProject } from '@/lib/portfolio';

export function ScrollGallery() {
  const t = useTranslations('portfolio');
  const locale = useLocale();
  const projects = getGalleryProjects();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const count = projects.length;
  if (count === 0) return null;

  // Track scroll progress through the tall wrapper
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001,
  });

  return (
    <div
      ref={wrapperRef}
      style={{ height: `${count * 100}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {projects.map((project, i) => (
          <GalleryPanel
            key={project.slug}
            project={project}
            index={i}
            total={count}
            progress={smoothProgress}
            locale={locale}
            t={t}
          />
        ))}
      </div>
    </div>
  );
}

// ── Gallery Panel ──

function GalleryPanel({
  project,
  index,
  total,
  progress,
  locale,
  t,
}: {
  project: EnrichedProject;
  index: number;
  total: number;
  progress: ReturnType<typeof useSpring>;
  locale: string;
  t: ReturnType<typeof useTranslations>;
}) {
  const bg = project.galleryBg || '#121212';
  const segmentLabel = project.segment === 'enterprise'
    ? t('gallery.enterprise')
    : t('gallery.people');
  const counter = String(index + 1).padStart(3, '0');

  const href = project.detailPageSlug
    ? `/${locale}/work/${project.detailPageSlug}`
    : undefined;

  // Each slide occupies 1/total of the scroll range
  const slideStart = index / total;
  const slideEnd = (index + 1) / total;
  const fadeDuration = 0.15 / total; // overlap zone for cross-fade

  // Opacity: fade in at start, hold, fade out at end
  const opacity = useTransform(progress, [
    slideStart,
    slideStart + fadeDuration,
    slideEnd - fadeDuration,
    slideEnd,
  ], [
    index === 0 ? 1 : 0, // first slide starts visible
    1,
    1,
    index === total - 1 ? 1 : 0, // last slide stays visible
  ]);

  // Subtle y-translate for entrance
  const y = useTransform(progress, [
    slideStart,
    slideStart + fadeDuration,
    slideEnd - fadeDuration,
    slideEnd,
  ], [
    index === 0 ? 0 : 30,
    0,
    0,
    index === total - 1 ? 0 : -20,
  ]);

  return (
    <m.div
      className="absolute inset-0 flex flex-col justify-between"
      style={{ backgroundColor: bg, opacity, y }}
    >
      {/* Top bar */}
      <div className="relative z-10 flex items-start justify-between px-6 md:px-12 lg:px-16 pt-8 md:pt-12">
        <div className="flex items-center gap-4">
          <span className="text-[11px] font-mono tracking-[0.2em] text-white/20">
            W — {counter}
          </span>
          <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-white/35 px-2.5 py-1 border border-white/10">
            {segmentLabel}
          </span>
        </div>
        <span className="text-[11px] font-mono tracking-[0.2em] text-white/15 hidden sm:block">
          {t(`categories.${project.categoryKey}`)}
        </span>
      </div>

      {/* Center content */}
      <div className="relative z-10 flex-1 flex flex-col md:flex-row items-start md:items-center px-6 md:px-12 lg:px-16 gap-8 md:gap-16 py-8 md:py-0">
        {/* Text */}
        <div className="md:w-5/12 flex flex-col justify-center">
          <h3 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-nostalgic text-white leading-[0.9] tracking-tighter">
            {project.titleKey}
          </h3>

          {project.impactLineKey && (
            <p className="text-sm md:text-base text-white/35 mt-6 md:mt-8 max-w-sm font-light leading-relaxed">
              {t(project.impactLineKey)}
            </p>
          )}
        </div>

        {/* Image */}
        <div className="md:w-7/12 w-full">
          <SlideImage src={project.imageSrc} alt={project.titleKey} />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative z-10 flex items-end justify-between px-6 md:px-12 lg:px-16 pb-8 md:pb-12">
        <div className="flex flex-wrap gap-2">
          {project.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-mono tracking-wider text-white/15 px-2.5 py-1 border border-white/8"
            >
              {tag}
            </span>
          ))}
        </div>

        {href && (
          <Link href={href} className="group inline-flex items-center gap-3">
            <span className="text-sm font-medium text-white/60 group-hover:text-white transition-colors duration-200">
              {t('cta.viewCaseStudy')}
            </span>
            <span className="w-10 h-10 border border-white/15 flex items-center justify-center group-hover:bg-white group-hover:text-black text-white/50 transition-all duration-200">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 13L13 1M13 1H3M13 1V11" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </span>
          </Link>
        )}
      </div>
    </m.div>
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
          sizes="(max-width: 768px) 100vw, 60vw"
          className="object-cover"
          quality={85}
        />
      </div>
    );
  }

  return (
    <div className="aspect-[4/3] md:aspect-[3/2] relative overflow-hidden w-full bg-white/[0.02]">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
      <div className="absolute inset-0 flex items-end p-6 md:p-10">
        <div>
          <span className="text-xs font-mono tracking-widest uppercase text-white/6 block mb-2">
            {alt}
          </span>
          <div className="w-12 h-px bg-white/6" />
        </div>
      </div>
    </div>
  );
}
