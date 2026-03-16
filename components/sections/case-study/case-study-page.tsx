'use client';

import { m } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { fadeInUp, transitions } from '@/lib/motion-presets';
import type { EnrichedProject } from '@/lib/portfolio';

interface CaseStudyPageProps {
  project: EnrichedProject;
  nextProject: EnrichedProject | null;
  locale: string;
}

export function CaseStudyPage({ project, nextProject, locale }: CaseStudyPageProps) {
  const t = useTranslations('caseStudy');
  const tPortfolio = useTranslations('portfolio');

  const isDark = project.bgTheme === 'dark';

  return (
    <article>
      {/* Hero */}
      <CaseHero project={project} isDark={isDark} tPortfolio={tPortfolio} locale={locale} t={t} />

      {/* Proof Strip — Metrics */}
      {project.metrics && project.metrics.length > 0 && (
        <ProofStrip project={project} tPortfolio={tPortfolio} t={t} />
      )}

      {/* Challenge */}
      {project.problemKey && (
        <NarrativeSection
          label={t('sections.challenge')}
          content={tPortfolio(project.problemKey)}
          index={0}
        />
      )}

      {/* Approach */}
      {project.solutionKey && (
        <NarrativeSection
          label={t('sections.approach')}
          content={tPortfolio(project.solutionKey)}
          index={1}
        />
      )}

      {/* Outcome */}
      {project.resultKey && (
        <NarrativeSection
          label={t('sections.outcome')}
          content={tPortfolio(project.resultKey)}
          index={2}
          accent
        />
      )}

      {/* Live Site CTA */}
      {project.liveUrl && (
        <LiveSiteCTA url={project.liveUrl} t={t} />
      )}

      {/* Bottom CTA */}
      <BottomCTA t={t} locale={locale} />

      {/* Next Project */}
      {nextProject && (
        <NextProjectNav project={nextProject} tPortfolio={tPortfolio} t={t} locale={locale} />
      )}
    </article>
  );
}

// ── Hero ──

function CaseHero({
  project,
  isDark,
  tPortfolio,
  locale,
  t,
}: {
  project: EnrichedProject;
  isDark: boolean;
  tPortfolio: ReturnType<typeof useTranslations>;
  locale: string;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <section
      className={cn(
        'pt-28 md:pt-36 pb-16 md:pb-24 px-6 md:px-12',
        isDark ? 'bg-[#121212] text-white' : 'bg-surface-light-1 text-black'
      )}
    >
      <div className="max-w-6xl mx-auto">
        {/* Back link */}
        <m.div
          initial="initial"
          animate="animate"
          variants={fadeInUp}
          transition={transitions.fast}
        >
          <Link
            href={`/${locale}/#work`}
            className={cn(
              'text-xs font-mono tracking-widest uppercase inline-block mb-10 md:mb-14 transition-opacity hover:opacity-100',
              isDark ? 'text-white/30 hover:text-white/60' : 'text-black/30 hover:text-black/60'
            )}
          >
            {t('nav.backToWork')}
          </Link>
        </m.div>

        {/* Category */}
        <m.span
          initial="initial"
          animate="animate"
          variants={fadeInUp}
          transition={{ ...transitions.smooth, delay: 0.05 }}
          className={cn(
            'text-xs font-mono tracking-widest uppercase block mb-4',
            isDark ? 'text-white/40' : 'text-black/40'
          )}
        >
          {tPortfolio(`categories.${project.categoryKey}`)}
        </m.span>

        {/* Title */}
        <m.h1
          initial="initial"
          animate="animate"
          variants={fadeInUp}
          transition={{ ...transitions.smooth, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-nostalgic tracking-tight leading-[1.05]"
          style={{ letterSpacing: '-0.04em' }}
        >
          {project.titleKey}
        </m.h1>

        {/* Impact line */}
        {project.impactLineKey && (
          <m.p
            initial="initial"
            animate="animate"
            variants={fadeInUp}
            transition={{ ...transitions.smooth, delay: 0.15 }}
            className={cn(
              'text-base md:text-lg lg:text-xl leading-relaxed mt-6 max-w-2xl',
              isDark ? 'text-white/60' : 'text-black/60'
            )}
          >
            {tPortfolio(project.impactLineKey)}
          </m.p>
        )}

        {/* Tech stack */}
        <m.div
          initial="initial"
          animate="animate"
          variants={fadeInUp}
          transition={{ ...transitions.smooth, delay: 0.2 }}
          className="flex flex-wrap gap-2 mt-8"
        >
          {project.tags.map((tag) => (
            <span
              key={tag}
              className={cn(
                'text-xs font-mono tracking-wider px-3 py-1.5 border',
                isDark
                  ? 'text-white/40 border-white/10'
                  : 'text-black/40 border-black/10'
              )}
            >
              {tag}
            </span>
          ))}
        </m.div>
      </div>

      {/* Hero image — full bleed */}
      <m.div
        initial="initial"
        animate="animate"
        variants={fadeInUp}
        transition={{ ...transitions.smooth, delay: 0.25 }}
        className="max-w-7xl mx-auto mt-12 md:mt-16"
      >
        <HeroImage src={project.imageSrc} alt={project.titleKey} isDark={isDark} />
      </m.div>
    </section>
  );
}

// ── Hero Image ──

function HeroImage({ src, alt, isDark }: { src: string; alt: string; isDark: boolean }) {
  if (src) {
    return (
      <div className="aspect-[16/10] md:aspect-[2/1] relative overflow-hidden bg-black/5 w-full">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="100vw"
          className="object-cover"
          priority
          quality={85}
        />
      </div>
    );
  }

  return (
    <div className="aspect-[16/10] md:aspect-[2/1] relative overflow-hidden bg-[#0a0a0a] flex items-end p-8 md:p-16">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div className="relative z-10">
        <span className="text-sm font-mono tracking-widest uppercase text-white/15 block mb-3">
          {alt}
        </span>
        <div className="w-20 h-px bg-white/10" />
      </div>
    </div>
  );
}

// ── Proof Strip ──

function ProofStrip({
  project,
  tPortfolio,
  t,
}: {
  project: EnrichedProject;
  tPortfolio: ReturnType<typeof useTranslations>;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <section className="bg-[#121212] text-white py-16 md:py-20 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <m.span
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={transitions.smooth}
          className="text-xs font-mono tracking-widest uppercase text-white/30 block mb-8"
        >
          {t('sections.proof')}
        </m.span>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
          {project.metrics!.map((metric, idx) => (
            <m.div
              key={idx}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ ...transitions.smooth, delay: idx * 0.1 }}
            >
              <span className="font-mono text-3xl md:text-4xl lg:text-5xl font-bold block leading-none">
                {metric.value}
              </span>
              <span className="text-xs md:text-sm text-white/40 mt-2 block">
                {tPortfolio(metric.labelKey)}
              </span>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Narrative Section ──

function NarrativeSection({
  label,
  content,
  index,
  accent = false,
}: {
  label: string;
  content: string;
  index: number;
  accent?: boolean;
}) {
  return (
    <section
      className={cn(
        'py-16 md:py-24 px-6 md:px-12',
        accent ? 'bg-surface-light-1' : 'bg-white'
      )}
    >
      <div className="max-w-6xl mx-auto md:grid md:grid-cols-12 md:gap-12">
        {/* Label column */}
        <m.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
          transition={{ ...transitions.smooth, delay: index * 0.05 }}
          className="md:col-span-4 mb-6 md:mb-0"
        >
          <span className="text-xs font-mono tracking-widest uppercase text-black/30 block">
            {label}
          </span>
        </m.div>

        {/* Content column */}
        <m.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
          transition={{ ...transitions.smooth, delay: index * 0.05 + 0.1 }}
          className="md:col-span-8"
        >
          <p className="text-lg md:text-xl lg:text-2xl leading-relaxed text-black/80 font-light">
            {content}
          </p>
        </m.div>
      </div>
    </section>
  );
}

// ── Live Site CTA ──

function LiveSiteCTA({
  url,
  t,
}: {
  url: string;
  t: ReturnType<typeof useTranslations>;
}) {
  const fullUrl = url.startsWith('http') ? url : `https://${url}`;

  return (
    <section className="py-12 md:py-16 px-6 md:px-12 bg-white">
      <div className="max-w-6xl mx-auto flex justify-center">
        <m.a
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={transitions.smooth}
          href={fullUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 text-sm font-medium px-8 py-3.5 border border-black/20 text-black transition-all duration-200 hover:bg-black hover:text-white"
        >
          {t('nav.visitSite')}
        </m.a>
      </div>
    </section>
  );
}

// ── Bottom CTA ──

function BottomCTA({
  t,
  locale,
}: {
  t: ReturnType<typeof useTranslations>;
  locale: string;
}) {
  return (
    <section className="bg-[#121212] text-white py-20 md:py-28 px-6 md:px-12">
      <div className="max-w-3xl mx-auto text-center">
        <m.h2
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={transitions.smooth}
          className="text-3xl md:text-4xl lg:text-5xl font-nostalgic tracking-tight"
          style={{ letterSpacing: '-0.04em' }}
        >
          {t('cta.title')}
        </m.h2>

        <m.p
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ ...transitions.smooth, delay: 0.1 }}
          className="text-base md:text-lg text-white/50 mt-4 mb-10"
        >
          {t('cta.subtitle')}
        </m.p>

        <m.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ ...transitions.smooth, delay: 0.2 }}
        >
          <Link
            href={`/${locale}/start`}
            className="inline-flex items-center gap-2 text-sm font-medium px-8 py-3.5 border border-white/20 text-white transition-all duration-200 hover:bg-white hover:text-black"
          >
            {t('cta.button')}
          </Link>
        </m.div>
      </div>
    </section>
  );
}

// ── Next Project Navigation ──

function NextProjectNav({
  project,
  tPortfolio,
  t,
  locale,
}: {
  project: EnrichedProject;
  tPortfolio: ReturnType<typeof useTranslations>;
  t: ReturnType<typeof useTranslations>;
  locale: string;
}) {
  const href = project.detailPageSlug
    ? `/${locale}/work/${project.detailPageSlug}`
    : `/${locale}/#work`;

  const isDark = project.bgTheme === 'dark';

  return (
    <section
      className={cn(
        'py-16 md:py-20 px-6 md:px-12 border-t',
        isDark
          ? 'bg-[#121212] text-white border-white/5'
          : 'bg-surface-light-1 text-black border-black/5'
      )}
    >
      <div className="max-w-6xl mx-auto">
        <m.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={transitions.smooth}
        >
          <span
            className={cn(
              'text-xs font-mono tracking-widest uppercase block mb-6',
              isDark ? 'text-white/30' : 'text-black/30'
            )}
          >
            {t('nav.nextProject')}
          </span>

          <Link href={href} className="group block">
            <span
              className={cn(
                'text-xs font-mono tracking-widest uppercase block mb-2',
                isDark ? 'text-white/40' : 'text-black/40'
              )}
            >
              {tPortfolio(`categories.${project.categoryKey}`)}
            </span>

            <h3
              className={cn(
                'text-3xl md:text-4xl lg:text-5xl font-nostalgic tracking-tight transition-opacity group-hover:opacity-60',
              )}
              style={{ letterSpacing: '-0.04em' }}
            >
              {project.titleKey}
            </h3>

            {project.impactLineKey && (
              <p
                className={cn(
                  'text-sm md:text-base leading-relaxed mt-3 max-w-xl',
                  isDark ? 'text-white/50' : 'text-black/50'
                )}
              >
                {tPortfolio(project.impactLineKey)}
              </p>
            )}
          </Link>
        </m.div>
      </div>
    </section>
  );
}
