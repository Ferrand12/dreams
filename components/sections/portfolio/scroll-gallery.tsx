'use client';

import Image from 'next/image';
import Link from 'next/link';
import { m } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { getGalleryProjects, type EnrichedProject } from '@/lib/portfolio';
import { cn } from '@/lib/utils';

// ── Editorial Gallery — stacked panels + whileInView entrances ──
// No sticky, no scroll tracking, no useTransform.
// Panels stack naturally. Content animates in when scrolled into view.

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
          locale={locale}
          t={t}
        />
      ))}
    </div>
  );
}

// ── Theme helpers — derived from project config ──

function panelTheme(project: EnrichedProject) {
  const isLight = project.galleryTheme === 'light';
  return {
    isLight,
    text: isLight ? 'text-[#1A1A1A]' : 'text-white',
    textMuted: isLight ? 'text-[#1A1A1A]/30' : 'text-white/25',
    textSecondary: isLight ? 'text-[#1A1A1A]/50' : 'text-white/40',
    textCta: isLight ? 'text-[#1A1A1A]/50' : 'text-white/50',
    textCtaHover: isLight ? 'hover:text-[#1A1A1A]' : 'hover:text-white',
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
  locale,
  t,
}: {
  project: EnrichedProject;
  index: number;
  locale: string;
  t: ReturnType<typeof useTranslations>;
}) {
  const bg = project.galleryBg || '#121212';
  const theme = panelTheme(project);
  const imgSize = imageMaxWidth(project);
  const heroSrc = project.galleryImage || project.imageSrc;

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

  const counter = String(index + 1).padStart(2, '0');

  return (
    <div
      className="relative min-h-screen flex flex-col"
      style={{ backgroundColor: bg }}
    >
      {/* Counter — editorial, secondary */}
      <div className="px-8 md:px-14 lg:px-20 pt-8 md:pt-10">
        <span className={cn('text-[10px] font-mono tracking-[0.3em]', theme.textMuted)}>
          {counter}
        </span>
      </div>

      {/* Hero image — fade in + subtle scale */}
      <m.div
        className="flex-1 flex items-center justify-center px-4 md:px-10 lg:px-16 py-6 md:py-8"
        initial={{ opacity: 0, scale: 1.04 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div className={cn('relative w-full aspect-[16/10] md:aspect-[16/9]', imgSize)}>
          <SlideImage src={heroSrc} alt={project.titleKey} isLight={theme.isLight} />
        </div>
      </m.div>

      {/* Title + impact line + CTA */}
      <div className="px-8 md:px-14 lg:px-20 pb-8 md:pb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <m.h3
            className={cn(
              'font-nostalgic leading-[0.85] tracking-tighter',
              theme.text,
              project.galleryImageSize === 'full'
                ? 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl'
                : 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl',
            )}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
          >
            {project.titleKey}
          </m.h3>
          {project.impactLineKey && (
            <m.p
              className={cn('text-sm md:text-base mt-2 md:mt-3 max-w-lg font-light leading-relaxed', theme.textSecondary)}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
            >
              {t(project.impactLineKey)}
            </m.p>
          )}
        </div>

        {href && ctaLabel && (
          <m.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <Link
              href={href}
              className={cn(
                'text-xs font-mono tracking-[0.15em] transition-colors duration-300 whitespace-nowrap shrink-0',
                theme.textCta,
                theme.textCtaHover,
              )}
              {...(!project.detailPageSlug && project.liveUrl
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
            >
              {ctaLabel} &#8594;
            </Link>
          </m.div>
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

  const fallbackColor = isLight ? 'text-black/[0.04]' : 'text-white/[0.04]';
  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
      <span className={cn('text-[12vw] font-nostalgic leading-none tracking-tighter select-none whitespace-nowrap', fallbackColor)}>
        {alt}
      </span>
    </div>
  );
}
