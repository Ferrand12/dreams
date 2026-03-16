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

// ── Page Composition ──

export function CaseStudyPage({ project, nextProject, locale }: CaseStudyPageProps) {
  const t = useTranslations('caseStudy');
  const tPortfolio = useTranslations('portfolio');

  const isDark = project.bgTheme === 'dark';

  return (
    <article>
      <CaseHero
        project={project}
        isDark={isDark}
        tPortfolio={tPortfolio}
        locale={locale}
        t={t}
      />

      {project.metrics && project.metrics.length > 0 && (
        <ProofStrip project={project} tPortfolio={tPortfolio} />
      )}

      {project.problemKey && (
        <NarrativeBlock
          label={t('sections.challenge')}
          content={tPortfolio(project.problemKey)}
          layout="left"
          bg="white"
        />
      )}

      {/* Full-bleed visual break */}
      <FullBleedVisual src={project.imageSrc} alt={project.titleKey} />

      {project.solutionKey && (
        <NarrativeBlock
          label={t('sections.approach')}
          content={tPortfolio(project.solutionKey)}
          layout="right"
          bg="white"
        />
      )}

      {/* Deliverables */}
      {project.deliverablesKey && (
        <DeliverablesRow
          items={tPortfolio.raw(project.deliverablesKey) as string[]}
          label={t('sections.deliverables')}
        />
      )}

      {/* Insight block — pull the result as a typographic statement */}
      {project.resultKey && (
        <InsightBlock content={tPortfolio(project.resultKey)} />
      )}

      {/* Tech stack */}
      {project.tags.length > 0 && <TechStackRow tags={project.tags} />}

      {project.liveUrl && <LiveSiteCTA url={project.liveUrl} t={t} />}

      <BottomCTA t={t} locale={locale} />

      {nextProject && (
        <NextProjectNav
          project={nextProject}
          tPortfolio={tPortfolio}
          t={t}
          locale={locale}
        />
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
        'pt-32 md:pt-44 pb-0',
        isDark ? 'bg-[#121212] text-white' : 'bg-surface-light-1 text-black'
      )}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-12">
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
              'text-[11px] font-mono tracking-[0.2em] uppercase inline-block mb-16 md:mb-20 transition-opacity hover:opacity-100',
              isDark ? 'text-white/25 hover:text-white/50' : 'text-black/25 hover:text-black/50'
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
            'text-[11px] font-mono tracking-[0.2em] uppercase block mb-6',
            isDark ? 'text-white/35' : 'text-black/35'
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
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-nostalgic leading-[0.95] tracking-tighter"
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
              'text-lg md:text-xl lg:text-2xl leading-relaxed mt-8 md:mt-10 max-w-2xl font-light',
              isDark ? 'text-white/50' : 'text-black/50'
            )}
          >
            {tPortfolio(project.impactLineKey)}
          </m.p>
        )}
      </div>

      {/* Hero image — full bleed, no max-width constraint */}
      <m.div
        initial="initial"
        animate="animate"
        variants={fadeInUp}
        transition={{ ...transitions.smooth, delay: 0.25 }}
        className="mt-16 md:mt-24"
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
      <div className="aspect-[16/9] md:aspect-[21/9] relative overflow-hidden w-full">
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
    <div
      className={cn(
        'aspect-[16/9] md:aspect-[21/9] relative overflow-hidden flex items-end p-8 md:p-16',
        isDark ? 'bg-[#0a0a0a]' : 'bg-[#e8e8e8]'
      )}
    >
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(128,128,128,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(128,128,128,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
      <div className="relative z-10">
        <span
          className={cn(
            'text-sm font-mono tracking-widest uppercase block mb-3',
            isDark ? 'text-white/10' : 'text-black/10'
          )}
        >
          {alt}
        </span>
        <div className={cn('w-16 h-px', isDark ? 'bg-white/10' : 'bg-black/10')} />
      </div>
    </div>
  );
}

// ── Proof Strip ──

function ProofStrip({
  project,
  tPortfolio,
}: {
  project: EnrichedProject;
  tPortfolio: ReturnType<typeof useTranslations>;
}) {
  return (
    <section className="bg-[#121212] text-white">
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-20 md:py-28">
        <div
          className={cn(
            'grid gap-12 md:gap-16',
            project.metrics!.length <= 2 ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3'
          )}
        >
          {project.metrics!.map((metric, idx) => (
            <m.div
              key={idx}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ ...transitions.smooth, delay: idx * 0.1 }}
            >
              <span className="font-mono text-4xl md:text-5xl lg:text-6xl font-bold block leading-none tracking-tight">
                {metric.value}
              </span>
              <span className="text-xs md:text-sm text-white/35 mt-3 block font-mono tracking-wider uppercase">
                {tPortfolio(metric.labelKey)}
              </span>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Narrative Block ──
// layout: "left" = label left, content right (4/8)
// layout: "right" = content left, label right (8/4)

function NarrativeBlock({
  label,
  content,
  layout = 'left',
  bg = 'white',
}: {
  label: string;
  content: string;
  layout?: 'left' | 'right';
  bg?: 'white' | 'surface';
}) {
  return (
    <section
      className={cn(
        'py-20 md:py-32 px-6 md:px-12',
        bg === 'surface' ? 'bg-surface-light-1' : 'bg-white'
      )}
    >
      <div className="max-w-6xl mx-auto">
        {/* Top border */}
        <div className="border-t border-black/8 mb-12 md:mb-16" />

        <div className="md:grid md:grid-cols-12 md:gap-8">
          {layout === 'left' ? (
            <>
              <m.div
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeInUp}
                transition={transitions.smooth}
                className="md:col-span-4 mb-8 md:mb-0"
              >
                <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-black/30 block">
                  {label}
                </span>
              </m.div>
              <m.div
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeInUp}
                transition={{ ...transitions.smooth, delay: 0.1 }}
                className="md:col-span-8"
              >
                <p className="text-xl md:text-2xl lg:text-3xl leading-[1.4] text-black/75 font-light">
                  {content}
                </p>
              </m.div>
            </>
          ) : (
            <>
              <m.div
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeInUp}
                transition={{ ...transitions.smooth, delay: 0.1 }}
                className="md:col-span-8 mb-8 md:mb-0 md:order-1"
              >
                <p className="text-xl md:text-2xl lg:text-3xl leading-[1.4] text-black/75 font-light">
                  {content}
                </p>
              </m.div>
              <m.div
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeInUp}
                transition={transitions.smooth}
                className="md:col-span-4 md:order-2 md:text-right"
              >
                <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-black/30 block">
                  {label}
                </span>
              </m.div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

// ── Full-Bleed Visual ──

function FullBleedVisual({ src, alt }: { src: string; alt: string }) {
  if (!src) return null;

  return (
    <section className="bg-[#0a0a0a]">
      <div className="aspect-[16/7] md:aspect-[21/8] relative overflow-hidden w-full">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="100vw"
          className="object-cover opacity-90"
          quality={85}
        />
      </div>
    </section>
  );
}

// ── Insight Block ──
// Large typographic statement on dark bg

function InsightBlock({ content }: { content: string }) {
  return (
    <section className="bg-[#121212] text-white py-24 md:py-36 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        <m.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={transitions.smooth}
        >
          <div className="w-10 h-px bg-white/20 mb-10 md:mb-14" />
          <p className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl leading-[1.2] font-nostalgic tracking-tight text-white/90">
            {content}
          </p>
        </m.div>
      </div>
    </section>
  );
}

// ── Deliverables Row ──

function DeliverablesRow({ items, label }: { items: string[]; label: string }) {
  return (
    <section className="bg-surface-light-1 py-16 md:py-24 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <m.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={transitions.smooth}
        >
          <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-black/30 block mb-8 md:mb-10">
            {label}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="text-sm md:text-base text-black/60 font-light py-3 border-b border-black/6 last:border-b-0 sm:last:border-b sm:[&:nth-last-child(-n+2)]:border-b-0 md:[&:nth-last-child(-n+3)]:border-b-0"
              >
                {item}
              </div>
            ))}
          </div>
        </m.div>
      </div>
    </section>
  );
}

// ── Tech Stack Row ──

function TechStackRow({ tags }: { tags: string[] }) {
  return (
    <section className="bg-white py-12 md:py-16 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <m.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={transitions.smooth}
          className="flex flex-wrap gap-3 justify-center"
        >
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-mono tracking-wider text-black/30 px-4 py-2 border border-black/8"
            >
              {tag}
            </span>
          ))}
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
          className="inline-flex items-center gap-3 text-sm font-medium px-8 py-3.5 border border-black/15 text-black/70 transition-all duration-200 hover:bg-black hover:text-white hover:border-black"
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
    <section className="bg-[#121212] text-white py-24 md:py-36 px-6 md:px-12">
      <div className="max-w-3xl mx-auto text-center">
        <m.h2
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={transitions.smooth}
          className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-nostalgic tracking-tighter leading-[0.95]"
        >
          {t('cta.title')}
        </m.h2>

        <m.p
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ ...transitions.smooth, delay: 0.1 }}
          className="text-base md:text-lg text-white/40 mt-5 mb-12"
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
            className="inline-flex items-center gap-2 text-sm font-medium px-10 py-4 border border-white/15 text-white transition-all duration-200 hover:bg-white hover:text-black hover:border-white"
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

  return (
    <section className="bg-surface-light-1 text-black border-t border-black/5">
      <Link href={href} className="group block py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <m.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={transitions.smooth}
          >
            <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-black/25 block mb-8">
              {t('nav.nextProject')}
            </span>

            <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-black/35 block mb-3">
              {tPortfolio(`categories.${project.categoryKey}`)}
            </span>

            <h3
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-nostalgic tracking-tighter leading-[0.95] transition-opacity duration-300 group-hover:opacity-50"
            >
              {project.titleKey}
            </h3>

            {project.impactLineKey && (
              <p className="text-sm md:text-base text-black/40 mt-4 max-w-xl font-light leading-relaxed">
                {tPortfolio(project.impactLineKey)}
              </p>
            )}
          </m.div>
        </div>
      </Link>
    </section>
  );
}
