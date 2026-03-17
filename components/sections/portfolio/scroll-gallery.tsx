'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { getGalleryProjects, type EnrichedProject } from '@/lib/portfolio';
import { cn } from '@/lib/utils';

// ── Step 1: Static Gallery with Per-Project Art Direction ──
// Stacked panels. Theming driven by project config (galleryTheme, galleryImageSize).
// No scroll animation yet — rendering correctness first.

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

// ── Theme helpers — derived from project config, not hardcoded per-slug ──

function panelTheme(project: EnrichedProject) {
  const isLight = project.galleryTheme === 'light';
  return {
    isLight,
    text: isLight ? 'text-[#1A1A1A]' : 'text-white',
    textMuted: isLight ? 'text-[#1A1A1A]/35' : 'text-white/30',
    textSecondary: isLight ? 'text-[#1A1A1A]/50' : 'text-white/40',
    textCta: isLight ? 'text-[#1A1A1A]/60' : 'text-white/50',
    textCtaHover: isLight ? 'group-hover:text-[#1A1A1A]' : 'group-hover:text-white',
    border: isLight ? 'border-[#1A1A1A]/12' : 'border-white/[0.08]',
    borderBadge: isLight ? 'border-[#1A1A1A]/15' : 'border-white/15',
    ctaBoxBg: isLight
      ? 'group-hover:bg-[#1A1A1A] group-hover:text-[#E8E0D4]'
      : 'group-hover:bg-white group-hover:text-[#0A0A0A]',
    ctaBoxDefault: isLight ? 'text-[#1A1A1A]/40' : 'text-white/40',
  };
}

function imageMaxWidth(project: EnrichedProject) {
  switch (project.galleryImageSize) {
    case 'full':
      return 'max-w-7xl';
    case 'large':
      return 'max-w-6xl';
    default:
      return 'max-w-5xl';
  }
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
  const theme = panelTheme(project);
  const imgSize = imageMaxWidth(project);
  const heroSrc = project.galleryImage || project.imageSrc;

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
          <span className={cn('text-[11px] font-mono tracking-[0.3em]', theme.textMuted)}>
            {counter}
          </span>
          <span className={cn('text-[10px] font-mono tracking-[0.2em] uppercase px-3 py-1 border', theme.textSecondary, theme.borderBadge)}>
            {segmentLabel}
          </span>
        </div>
        <span className={cn('text-[10px] font-mono tracking-[0.2em] hidden sm:block', theme.textMuted)}>
          {t(`categories.${project.categoryKey}`)}
        </span>
      </div>

      {/* Hero image */}
      <div className="flex-1 flex items-center justify-center px-4 md:px-10 lg:px-16 py-6 md:py-8">
        <div className={cn('relative w-full aspect-[16/10] md:aspect-[16/9]', imgSize)}>
          <SlideImage src={heroSrc} alt={project.titleKey} isLight={theme.isLight} />
        </div>
      </div>

      {/* Title + impact line */}
      <div className="px-6 md:px-12 lg:px-20 pb-4">
        <h3 className={cn(
          'font-nostalgic leading-[0.85] tracking-tighter',
          theme.text,
          // Smaller title when the asset already contains the project name prominently
          project.galleryImageSize === 'full'
            ? 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl'
            : 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl'
        )}>
          {project.titleKey}
        </h3>
        {project.impactLineKey && (
          <p className={cn('text-sm md:text-base mt-3 md:mt-4 max-w-lg font-light leading-relaxed', theme.textSecondary)}>
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
              className={cn('text-[10px] font-mono tracking-wider px-2.5 py-1 border', theme.textMuted, theme.border)}
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
            <span className={cn('text-sm font-medium transition-colors duration-300', theme.textCta, theme.textCtaHover)}>
              {ctaLabel}
            </span>
            <span className={cn(
              'w-10 h-10 border flex items-center justify-center transition-all duration-300',
              theme.borderBadge,
              theme.ctaBoxDefault,
              theme.ctaBoxBg,
            )}>
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

function SlideImage({ src, alt, isLight }: { src: string; alt: string; isLight: boolean }) {
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
  const fallbackColor = isLight ? 'text-black/[0.04]' : 'text-white/[0.04]';
  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
      <span className={cn('text-[12vw] font-nostalgic leading-none tracking-tighter select-none whitespace-nowrap', fallbackColor)}>
        {alt}
      </span>
    </div>
  );
}
