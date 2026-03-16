'use client';

import { m } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { cn } from '@/lib/utils';
import { fadeInUp, transitions } from '@/lib/motion-presets';
import type { EnrichedProject } from '@/lib/portfolio';
import type { ProjectCTA, ProjectMetric, TeaserVariant, ContentState } from '@/types';

interface FeaturedCaseProps {
  project: EnrichedProject;
  index: number;
}

export function FeaturedCase({ project, index }: FeaturedCaseProps) {
  const t = useTranslations('portfolio');

  // Auto-downgrade: hero/standard requires at least preview state
  let variant: TeaserVariant = project.teaserVariant ?? 'minimal';
  if (variant !== 'minimal' && project.contentState === 'coming-soon') {
    variant = 'minimal';
  }

  const isDark = project.bgTheme === 'dark';

  switch (variant) {
    case 'hero':
      return (
        <HeroLayout
          project={project}
          index={index}
          isDark={isDark}
          t={t}

        />
      );
    case 'standard':
      return (
        <StandardLayout
          project={project}
          index={index}
          isDark={isDark}
          t={t}

        />
      );
    case 'minimal':
    default:
      return (
        <MinimalLayout
          project={project}
          index={index}
          isDark={isDark}
          t={t}

        />
      );
  }
}

// ── Shared Props ──

type LayoutProps = {
  project: EnrichedProject;
  index: number;
  isDark: boolean;
  t: ReturnType<typeof useTranslations>;
};

// ── Hero Variant ──

function HeroLayout({ project, index, isDark, t }: LayoutProps) {
  return (
    <m.div
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.15 }}
      variants={fadeInUp}
      transition={{ ...transitions.smooth, delay: index * 0.1 }}
      className={cn(
        'py-16 md:py-24 -mx-6 md:-mx-12 px-6 md:px-12',
        isDark ? 'bg-[#121212] text-white' : 'bg-surface-light-1 text-black'
      )}
    >
      {/* Hero image — full bleed within container */}
      <CaseImage
        src={project.imageSrc}
        alt={project.titleKey}
        aspect="aspect-[16/10] md:aspect-[2/1]"
        priority={index < 1}
      />

      {/* Editorial content — 2-col with clear separation */}
      <div className={cn(
        'mt-8 md:mt-12 pt-8 md:pt-10 md:grid md:grid-cols-12 md:gap-12 border-t',
        isDark ? 'border-white/10' : 'border-black/10'
      )}>
        {/* Left: identity block */}
        <div className="md:col-span-7">
          <span className={cn(
            'text-xs font-mono tracking-widest uppercase block mb-3',
            isDark ? 'text-white/40' : 'text-black/40'
          )}>
            {t(`categories.${project.categoryKey}`)}
          </span>

          <h3 className="text-3xl md:text-4xl lg:text-5xl font-nostalgic tracking-tight leading-[1.1]">
            {project.titleKey}
          </h3>

          {project.impactLineKey && (
            <p className={cn(
              'text-base md:text-lg leading-relaxed mt-4 max-w-lg',
              isDark ? 'text-white/60' : 'text-black/60'
            )}>
              {t(project.impactLineKey!)}
            </p>
          )}

          <p className={cn(
            'text-xs font-mono tracking-wider mt-6',
            isDark ? 'text-white/25' : 'text-black/25'
          )}>
            {project.tags.join(' · ')}
          </p>
        </div>

        {/* Right: metrics + CTA */}
        <div className="md:col-span-5 mt-8 md:mt-0 flex flex-col justify-between">
          <div>
            <CaseMetrics metrics={project.metrics} isDark={isDark} t={t} />
          </div>
          <div className="mt-6">
            <StateBadge state={project.contentState} isDark={isDark} t={t} />
            <CaseCTA cta={project.cta} isDark={isDark} t={t} />
          </div>
        </div>
      </div>
    </m.div>
  );
}

// ── Standard Variant ──

function StandardLayout({ project, index, isDark, t }: LayoutProps) {
  return (
    <m.div
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeInUp}
      transition={{ ...transitions.smooth, delay: index * 0.15 }}
      className={cn(
        'overflow-hidden',
        isDark
          ? 'bg-[#121212] text-white'
          : 'bg-surface-light-2 text-black'
      )}
    >
      {/* Image */}
      <CaseImage
        src={project.imageSrc}
        alt={project.titleKey}
        aspect="aspect-[4/3]"
        priority={index < 2}
      />

      {/* Content */}
      <div className="p-6 md:p-8">
        <span className={cn(
          'text-xs font-mono tracking-widest uppercase block mb-3',
          isDark ? 'text-white/40' : 'text-black/40'
        )}>
          {t(`categories.${project.categoryKey}`)}
        </span>

        <h3 className="text-xl md:text-2xl font-nostalgic tracking-tight">
          {project.titleKey}
        </h3>

        {project.impactLineKey && (
          <p className={cn(
            'text-sm leading-relaxed mt-2',
            isDark ? 'text-white/60' : 'text-black/60'
          )}>
            {t(project.impactLineKey!)}
          </p>
        )}

        <CaseMetrics metrics={project.metrics} isDark={isDark} t={t} compact />

        <p className={cn(
          'text-xs font-mono tracking-wider mt-4',
          isDark ? 'text-white/25' : 'text-black/25'
        )}>
          {project.tags.join(' · ')}
        </p>

        <div className="mt-5">
          <StateBadge state={project.contentState} isDark={isDark} t={t} />
          <CaseCTA cta={project.cta} isDark={isDark} t={t} />
        </div>
      </div>
    </m.div>
  );
}

// ── Minimal Variant ──

function MinimalLayout({ project, index, isDark, t }: LayoutProps) {
  return (
    <m.div
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeInUp}
      transition={{ ...transitions.smooth, delay: index * 0.1 }}
      className={cn(
        'flex items-center justify-between gap-4 py-4 border-b',
        isDark ? 'border-white/10' : 'border-black/10'
      )}
    >
      <div className="flex items-center gap-4 min-w-0">
        <span className={cn(
          'text-xs font-mono tracking-widest uppercase shrink-0',
          isDark ? 'text-white/40' : 'text-black/40'
        )}>
          {t(`categories.${project.categoryKey}`)}
        </span>

        <h3 className="text-lg font-nostalgic tracking-tight truncate">
          {project.titleKey}
        </h3>

        {project.impactLineKey && (
          <p className={cn(
            'text-sm hidden md:block truncate',
            isDark ? 'text-white/50' : 'text-black/50'
          )}>
            {t(project.impactLineKey!)}
          </p>
        )}
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <StateBadge state={project.contentState} isDark={isDark} t={t} />
        <CaseCTA cta={project.cta} isDark={isDark} t={t} />
      </div>
    </m.div>
  );
}

// ── Sub-elements ──

function CaseImage({
  src,
  alt,
  aspect,
  priority = false,
}: {
  src: string;
  alt: string;
  aspect: string;
  priority?: boolean;
}) {
  if (src) {
    return (
      <div className={cn(aspect, 'relative overflow-hidden bg-black/5 w-full')}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 100vw"
          className="object-cover"
          priority={priority}
          quality={80}
        />
      </div>
    );
  }

  // Generated placeholder: structured dark block with title + grid texture
  return (
    <div className={cn(aspect, 'relative overflow-hidden bg-[#0a0a0a] flex items-end p-8 md:p-12')}>
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="relative z-10">
        <span className="text-xs font-mono tracking-widest uppercase text-white/20 block mb-2">
          {alt}
        </span>
        <div className="w-16 h-px bg-white/10" />
      </div>
    </div>
  );
}

function CaseMetrics({
  metrics,
  isDark,
  t,
  compact = false,
}: {
  metrics?: ProjectMetric[];
  isDark: boolean;
  t: ReturnType<typeof useTranslations>;
  compact?: boolean;
}) {
  if (!metrics || metrics.length === 0) return null;

  if (compact) {
    return (
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {metrics.map((metric, idx) => (
          <div key={idx}>
            <span className="font-mono text-sm font-bold">{metric.value}</span>
            <span className={cn('ml-1.5 text-xs', isDark ? 'text-white/40' : 'text-black/40')}>
              {t(metric.labelKey)}
            </span>
          </div>
        ))}
      </div>
    );
  }

  // Full display: stacked vertically for visual weight
  return (
    <div className="space-y-4">
      {metrics.map((metric, idx) => (
        <div key={idx}>
          <span className="font-mono text-2xl md:text-3xl font-bold block leading-none">
            {metric.value}
          </span>
          <span className={cn('text-xs mt-1 block', isDark ? 'text-white/40' : 'text-black/40')}>
            {t(metric.labelKey)}
          </span>
        </div>
      ))}
    </div>
  );
}

function StateBadge({
  state,
  isDark,
  t,
}: {
  state: ContentState;
  isDark: boolean;
  t: ReturnType<typeof useTranslations>;
}) {
  if (state === 'published' || state === 'internal') return null;

  const labelKey = state === 'coming-soon' ? 'states.comingSoon' : 'states.preview';

  return (
    <span className={cn(
      'text-xs font-mono tracking-wider uppercase',
      isDark ? 'text-white/30' : 'text-black/30'
    )}>
      {t(labelKey)}
    </span>
  );
}

function CaseCTA({
  cta,
  isDark,
  t,
}: {
  cta: ProjectCTA | null;
  isDark: boolean;
  t: ReturnType<typeof useTranslations>;
}) {
  const locale = useLocale();

  if (!cta) return null;

  if (cta.type === 'none') {
    return (
      <span className={cn(
        'text-xs font-mono tracking-wider uppercase',
        isDark ? 'text-white/30' : 'text-black/30'
      )}>
        {t(cta.labelKey)}
      </span>
    );
  }

  const isExternal = cta.href.startsWith('http');
  const linkClasses = cn(
    'inline-flex items-center gap-2 text-sm font-medium px-5 py-2.5 border transition-all duration-200 w-fit',
    isDark
      ? 'text-white border-white/20 hover:bg-white hover:text-black'
      : 'text-black border-black/20 hover:bg-black hover:text-white'
  );

  if (isExternal) {
    return (
      <a
        href={cta.href}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClasses}
      >
        {t(cta.labelKey)} →
      </a>
    );
  }

  return (
    <Link href={`/${locale}${cta.href}`} className={linkClasses}>
      {t(cta.labelKey)} →
    </Link>
  );
}
