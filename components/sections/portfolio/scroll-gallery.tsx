'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { getGalleryProjects, type EnrichedProject } from '@/lib/portfolio';

// ── Step 1: Static Gallery ──
// Simple stacked panels. No scroll animation yet.
// Goal: all 3 cases render correctly with real assets.

export function ScrollGallery() {
  const t = useTranslations('portfolio');
  const locale = useLocale();
  const projects = getGalleryProjects();

  if (projects.length === 0) return null;

  return (
    <div>
      {projects.map((project, i) => (
        <GalleryPanel
          key={project.slug}
          project={project}
          index={i}
          total={projects.length}
          locale={locale}
          t={t}
        />
      ))}
    </div>
  );
}

// ── Gallery Panel ──

function GalleryPanel({
  project,
  index,
  total,
  locale,
  t,
}: {
  project: EnrichedProject;
  index: number;
  total: number;
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

  const counter = `${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;

  return (
    <div
      className="relative min-h-screen flex flex-col"
      style={{ backgroundColor: bg }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 md:px-12 lg:px-20 pt-6 md:pt-8">
        <div className="flex items-center gap-4">
          <span className="text-[11px] font-mono tracking-[0.3em] text-white/30">
            {counter}
          </span>
          <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-white/40 px-3 py-1 border border-white/15">
            {segmentLabel}
          </span>
        </div>
        <span className="text-[10px] font-mono tracking-[0.2em] text-white/20 hidden sm:block">
          {t(`categories.${project.categoryKey}`)}
        </span>
      </div>

      {/* Hero image — dominant area */}
      <div className="flex-1 flex items-center justify-center px-4 md:px-10 lg:px-16 py-6 md:py-8">
        <div className="relative w-full max-w-5xl aspect-[16/10] md:aspect-[16/9]">
          <SlideImage src={project.imageSrc} alt={project.titleKey} />
        </div>
      </div>

      {/* Title + impact line */}
      <div className="px-6 md:px-12 lg:px-20 pb-4">
        <h3 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-nostalgic text-white leading-[0.85] tracking-tighter">
          {project.titleKey}
        </h3>
        {project.impactLineKey && (
          <p className="text-sm md:text-base text-white/40 mt-3 md:mt-4 max-w-lg font-light leading-relaxed">
            {t(project.impactLineKey)}
          </p>
        )}
      </div>

      {/* Bottom bar — tags + CTA */}
      <div className="flex items-end justify-between px-6 md:px-12 lg:px-20 pb-6 md:pb-8">
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
    </div>
  );
}

// ── Slide Image ──

function SlideImage({ src, alt }: { src: string; alt: string }) {
  if (src) {
    return (
      <div className="relative w-full h-full overflow-hidden">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 80vw"
          className="object-contain"
          quality={85}
        />
      </div>
    );
  }

  // Typographic fallback
  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
      <span className="text-[12vw] font-nostalgic text-white/[0.04] leading-none tracking-tighter select-none whitespace-nowrap">
        {alt}
      </span>
    </div>
  );
}
