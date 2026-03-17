'use client';

import { useRef, useState } from 'react';
import {
  m,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
  type MotionValue,
} from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { getGalleryProjects, type EnrichedProject } from '@/lib/portfolio';

// ── Main Gallery ──

export function ScrollGallery() {
  const t = useTranslations('portfolio');
  const locale = useLocale();
  const projects = getGalleryProjects();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const count = projects.length;
  if (count === 0) return null;

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.0005,
  });

  useMotionValueEvent(smoothProgress, 'change', (v) => {
    const idx = Math.min(count - 1, Math.max(0, Math.round(v * (count - 1))));
    setActiveIndex(idx);
  });

  return (
    <div ref={wrapperRef} className="bg-[#0A0A0A]" style={{ height: `${count * 100}vh` }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#0A0A0A]">
        {/* Panels */}
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

        {/* Global counter — top left */}
        <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 md:px-12 lg:px-20 pt-6 md:pt-8 pointer-events-none">
          <span className="text-[11px] font-mono tracking-[0.3em] text-white/30">
            {String(activeIndex + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
          </span>
        </div>

        {/* Progress bar */}
        <m.div
          className="absolute bottom-0 left-0 z-30 h-px bg-white/25 origin-left"
          style={{ scaleX: smoothProgress, width: '100%' }}
        />
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
  progress: MotionValue<number>;
  locale: string;
  t: ReturnType<typeof useTranslations>;
}) {
  const bg = project.galleryBg || '#121212';
  const segmentLabel =
    project.segment === 'enterprise'
      ? t('gallery.enterprise')
      : t('gallery.people');

  const href = project.detailPageSlug
    ? `/${locale}/work/${project.detailPageSlug}`
    : project.liveUrl
      ? `https://${project.liveUrl}`
      : undefined;

  const ctaLabel = project.detailPageSlug
    ? t('cta.viewCaseStudy')
    : project.liveUrl
      ? t('cta.visitSite')
      : '';

  // Slide range
  const slideStart = index / total;
  const slideEnd = (index + 1) / total;
  const fade = 0.15 / total;

  // Panel opacity
  const opacity = useTransform(
    progress,
    [slideStart, slideStart + fade, slideEnd - fade, slideEnd],
    [index === 0 ? 1 : 0, 1, 1, index === total - 1 ? 1 : 0]
  );

  // Image scale: zoom-out entrance
  const imageScale = useTransform(
    progress,
    [slideStart, slideStart + fade * 2.5, slideEnd - fade, slideEnd],
    [index === 0 ? 1.0 : 1.08, 1.0, 1.0, index === total - 1 ? 1.0 : 0.98]
  );

  // Staggered title
  const titleDelay = 0.025 / total;
  const titleOpacity = useTransform(
    progress,
    [slideStart + titleDelay, slideStart + fade + titleDelay, slideEnd - fade, slideEnd],
    [index === 0 ? 1 : 0, 1, 1, index === total - 1 ? 1 : 0]
  );
  const titleY = useTransform(
    progress,
    [slideStart + titleDelay, slideStart + fade + titleDelay, slideEnd - fade, slideEnd],
    [index === 0 ? 0 : 24, 0, 0, index === total - 1 ? 0 : -12]
  );

  // Staggered impact line
  const impactDelay = 0.04 / total;
  const impactOpacity = useTransform(
    progress,
    [slideStart + impactDelay, slideStart + fade + impactDelay, slideEnd - fade, slideEnd],
    [index === 0 ? 1 : 0, 1, 1, index === total - 1 ? 1 : 0]
  );

  return (
    <m.div
      className="absolute inset-0"
      style={{ backgroundColor: bg, opacity }}
    >
      {/* Top bar — segment + category */}
      <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-6 md:px-12 lg:px-20 pt-6 md:pt-8">
        <div className="flex items-center gap-4 ml-16 md:ml-24">
          <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-white/40 px-3 py-1 border border-white/15">
            {segmentLabel}
          </span>
        </div>
        <span className="text-[10px] font-mono tracking-[0.2em] text-white/20 hidden sm:block">
          {t(`categories.${project.categoryKey}`)}
        </span>
      </div>

      {/* Hero image — absolute positioned, ~60% of viewport */}
      <div className="absolute inset-x-4 md:inset-x-10 lg:inset-x-16 top-16 md:top-20 bottom-[38%] md:bottom-[32%] z-10 overflow-hidden">
        <SlideImage
          src={project.imageSrc}
          alt={project.titleKey}
          imageScale={imageScale}
        />
      </div>

      {/* Title + impact line — bottom area */}
      <div className="absolute inset-x-0 bottom-16 md:bottom-14 z-20 px-6 md:px-12 lg:px-20">
        <m.h3
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-nostalgic text-white leading-[0.85] tracking-tighter"
          style={{ opacity: titleOpacity, y: titleY }}
        >
          {project.titleKey}
        </m.h3>
        {project.impactLineKey && (
          <m.p
            className="text-sm md:text-base text-white/40 mt-3 md:mt-4 max-w-lg font-light leading-relaxed"
            style={{ opacity: impactOpacity }}
          >
            {t(project.impactLineKey)}
          </m.p>
        )}
      </div>

      {/* Bottom bar — tags + CTA */}
      <div className="absolute bottom-0 inset-x-0 z-20 flex items-end justify-between px-6 md:px-12 lg:px-20 pb-6 md:pb-8">
        <div className="flex flex-wrap gap-2">
          {project.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-mono tracking-wider text-white/20 px-2.5 py-1 border border-white/[0.08]"
            >
              {tag}
            </span>
          ))}
        </div>

        {href && ctaLabel && (
          <Link
            href={href}
            className="group inline-flex items-center gap-3"
            {...(!project.detailPageSlug && project.liveUrl
              ? { target: '_blank', rel: 'noopener noreferrer' }
              : {})}
          >
            <span className="text-sm font-medium text-white/50 group-hover:text-white transition-colors duration-300">
              {ctaLabel}
            </span>
            <span className="w-10 h-10 border border-white/15 flex items-center justify-center group-hover:bg-white group-hover:text-[#0A0A0A] text-white/40 transition-all duration-300">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
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

function SlideImage({
  src,
  alt,
  imageScale,
}: {
  src: string;
  alt: string;
  imageScale: MotionValue<number>;
}) {
  if (src) {
    return (
      <m.div className="relative w-full h-full overflow-hidden" style={{ scale: imageScale }}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 90vw"
          className="object-contain"
          quality={85}
        />
        {/* Bottom gradient for text legibility */}
        <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/40 to-transparent" />
      </m.div>
    );
  }

  // Typographic fallback
  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
      <span className="text-[15vw] font-nostalgic text-white/[0.04] leading-none tracking-tighter select-none whitespace-nowrap">
        {alt}
      </span>
    </div>
  );
}
