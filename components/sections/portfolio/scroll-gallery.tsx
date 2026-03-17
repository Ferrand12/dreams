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

  // Tight spring — follows scroll closely with minimal lag
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 300,
    damping: 40,
    restDelta: 0.001,
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
        <div className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-12 lg:px-20 pt-6 md:pt-8 pointer-events-none">
          <span className="text-[11px] font-mono tracking-[0.3em] text-white/30">
            {String(activeIndex + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
          </span>
        </div>

        {/* Progress bar */}
        <m.div
          className="absolute bottom-0 left-0 z-40 h-px bg-white/25 origin-left"
          style={{ scaleX: smoothProgress, width: '100%' }}
        />
      </div>
    </div>
  );
}

// ── Opacity keyframe calculator ──
// Overlapping fade ranges ensure continuous cross-fade with no black gaps.
//
// For panel i of N, the transition zone overlaps with adjacent panels:
//   fadeInStart  = boundary(i) - overlap
//   fadeInEnd    = boundary(i) + overlap
//   fadeOutStart = boundary(i+1) - overlap
//   fadeOutEnd   = boundary(i+1) + overlap
//
// With overlap = 0.3/N, at each boundary both adjacent panels are ~0.5 opacity.

function computeSlideOpacity(
  index: number,
  total: number,
  progress: MotionValue<number>
) {
  const overlap = 0.3 / total;
  const boundary = index / total;
  const nextBoundary = (index + 1) / total;

  const p1 = Math.max(0, boundary - overlap);
  const p2 = Math.min(1, boundary + overlap);
  const p3 = Math.max(0, nextBoundary - overlap);
  const p4 = Math.min(1, nextBoundary + overlap);

  return useTransform(
    progress,
    [p1, p2, p3, p4],
    [
      index === 0 ? 1 : 0,
      1,
      1,
      index === total - 1 ? 1 : 0,
    ]
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

  // ── Overlapping cross-fade opacity ──
  const opacity = computeSlideOpacity(index, total, progress);

  // ── z-index: higher opacity = higher layer ──
  const zIndex = useTransform(opacity, (v) => Math.round(v * 10));

  // ── pointer-events: disabled when invisible ──
  const pointerEvents = useTransform(opacity, (v) =>
    v > 0.1 ? 'auto' : 'none'
  );

  // ── Image scale: zoom-out entrance ──
  const overlap = 0.3 / total;
  const slideStart = index / total;
  const slideEnd = (index + 1) / total;
  const imageScale = useTransform(
    progress,
    [
      Math.max(0, slideStart - overlap),
      slideStart + overlap * 2,
      slideEnd - overlap,
      Math.min(1, slideEnd + overlap),
    ],
    [index === 0 ? 1.0 : 1.06, 1.0, 1.0, index === total - 1 ? 1.0 : 0.98]
  );

  // ── Staggered title entrance ──
  const titleDelay = 0.03 / total;
  const titleOpacity = computeSlideOpacity(index, total,
    // Offset the progress slightly for stagger effect
    progress
  );
  const titleY = useTransform(
    progress,
    [
      Math.max(0, slideStart - overlap + titleDelay),
      slideStart + overlap + titleDelay,
      slideEnd - overlap,
      Math.min(1, slideEnd + overlap),
    ],
    [index === 0 ? 0 : 20, 0, 0, index === total - 1 ? 0 : -10]
  );

  return (
    <m.div
      className="absolute inset-0"
      style={{
        backgroundColor: bg,
        opacity,
        zIndex,
        pointerEvents: pointerEvents as unknown as React.CSSProperties['pointerEvents'],
      }}
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
      <div className="absolute inset-x-4 md:inset-x-10 lg:inset-x-16 top-14 md:top-16 bottom-[36%] md:bottom-[30%] z-10 overflow-hidden">
        <SlideImage
          src={project.imageSrc}
          alt={project.titleKey}
          imageScale={imageScale}
        />
      </div>

      {/* Title + impact line — bottom area */}
      <m.div
        className="absolute inset-x-0 bottom-14 md:bottom-12 z-20 px-6 md:px-12 lg:px-20"
        style={{ y: titleY }}
      >
        <h3 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-nostalgic text-white leading-[0.85] tracking-tighter">
          {project.titleKey}
        </h3>
        {project.impactLineKey && (
          <p className="text-sm md:text-base text-white/40 mt-3 md:mt-4 max-w-lg font-light leading-relaxed">
            {t(project.impactLineKey)}
          </p>
        )}
      </m.div>

      {/* Bottom bar — tags + CTA */}
      <div className="absolute bottom-0 inset-x-0 z-20 flex items-end justify-between px-6 md:px-12 lg:px-20 pb-5 md:pb-7">
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
