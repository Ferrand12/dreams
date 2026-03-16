'use client';

import { m } from 'framer-motion';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
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
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeInUp}
      transition={{ ...transitions.smooth, delay: index * 0.1 }}
      className={cn(
        'py-12 md:py-16 px-6 md:px-10',
        isDark ? 'bg-[#121212] text-white' : 'bg-white text-black'
      )}
    >
      {/* Hero image */}
      <CaseImage
        src={project.imageSrc}
        alt={project.titleKey}
        aspect="aspect-[16/10]"
        priority={index < 1}
      />

      {/* Content: 2-col on desktop */}
      <div className="mt-6 md:mt-8 md:grid md:grid-cols-12 md:gap-8">
        {/* Left: identity */}
        <div className="md:col-span-7 space-y-3">
          <span className={cn(
            'text-xs font-mono tracking-widest uppercase',
            isDark ? 'text-white/40' : 'text-black/40'
          )}>
            {t(`categories.${project.categoryKey}`)}
          </span>

          <h3 className="text-3xl md:text-4xl lg:text-5xl font-nostalgic tracking-tight">
            {project.titleKey}
          </h3>

          {project.impactLineKey && (
            <p className={cn(
              'text-sm md:text-base leading-relaxed max-w-lg',
              isDark ? 'text-white/60' : 'text-black/60'
            )}>
              {t(project.impactLineKey!)}
            </p>
          )}

          <p className={cn(
            'text-xs font-mono tracking-wider',
            isDark ? 'text-white/30' : 'text-black/30'
          )}>
            {project.tags.join(' · ')}
          </p>
        </div>

        {/* Right: proof + CTA */}
        <div className="md:col-span-5 mt-6 md:mt-0 space-y-6">
          <CaseMetrics metrics={project.metrics} isDark={isDark} t={t} />
          <StateBadge state={project.contentState} isDark={isDark} t={t} />
          <CaseCTA cta={project.cta} isDark={isDark} t={t} />
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
      transition={{ ...transitions.smooth, delay: index * 0.1 }}
      className={cn(
        'border overflow-hidden',
        isDark
          ? 'bg-[#121212] text-white border-white/10'
          : 'bg-white text-black border-black/10'
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
      <div className="p-6 space-y-3">
        <span className={cn(
          'text-xs font-mono tracking-widest uppercase',
          isDark ? 'text-white/40' : 'text-black/40'
        )}>
          {t(`categories.${project.categoryKey}`)}
        </span>

        <h3 className="text-xl md:text-2xl font-nostalgic tracking-tight">
          {project.titleKey}
        </h3>

        {project.impactLineKey && (
          <p className={cn(
            'text-sm leading-relaxed',
            isDark ? 'text-white/60' : 'text-black/60'
          )}>
            {t(project.impactLineKey!)}
          </p>
        )}

        <CaseMetrics metrics={project.metrics} isDark={isDark} t={t} compact />

        <p className={cn(
          'text-xs font-mono tracking-wider',
          isDark ? 'text-white/30' : 'text-black/30'
        )}>
          {project.tags.join(' · ')}
        </p>

        <StateBadge state={project.contentState} isDark={isDark} t={t} />
        <CaseCTA cta={project.cta} isDark={isDark} t={t} />
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

  // Generated placeholder: dark bg + title
  return (
    <div className={cn(aspect, 'relative overflow-hidden bg-[#121212] flex items-center justify-center')}>
      <span className="text-4xl md:text-5xl font-nostalgic text-white/10 tracking-tight select-none">
        {alt}
      </span>
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

  return (
    <div className={cn(
      'flex flex-wrap',
      compact ? 'gap-x-4 gap-y-1' : 'gap-x-6 gap-y-2 pt-3 border-t',
      !compact && (isDark ? 'border-white/10' : 'border-black/10')
    )}>
      {metrics.map((metric, idx) => (
        <div key={idx}>
          <span className={cn(
            'font-mono font-bold',
            compact ? 'text-sm' : 'text-lg md:text-xl'
          )}>
            {metric.value}
          </span>
          <span className={cn(
            'ml-1.5',
            compact ? 'text-xs' : 'text-xs',
            isDark ? 'text-white/40' : 'text-black/40'
          )}>
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

  return (
    <a
      href={cta.href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className={cn(
        'inline-flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-70',
        isDark ? 'text-white' : 'text-black'
      )}
    >
      {t(cta.labelKey)} →
    </a>
  );
}
