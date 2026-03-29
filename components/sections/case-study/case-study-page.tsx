'use client';

import { m } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { utAssetUrl } from '@/lib/constants';
import { fadeInUp, transitions } from '@/lib/motion-presets';
import type { EnrichedProject } from '@/lib/portfolio';

interface CaseStudyPageProps {
  project: EnrichedProject;
  nextProject: EnrichedProject | null;
  locale: string;
}

// ── Page Composition — 6 sections ──

export function CaseStudyPage({ project, nextProject, locale }: CaseStudyPageProps) {
  const t = useTranslations('caseStudy');
  const tP = useTranslations('portfolio');

  const heroBg = project.galleryBg || (project.bgTheme === 'dark' ? '#121212' : '#EBF0F5');
  const isDarkHero = project.galleryTheme === 'light' ? false : true;

  return (
    <article>
      {/* 1. Hero — title + image + metrics */}
      <CaseHero
        project={project}
        isDark={isDarkHero}
        heroBg={heroBg}
        tP={tP}
        locale={locale}
        t={t}
      />

      {/* 2. The Challenge */}
      {project.problemKey && (
        <NarrativeBlock
          label={t('sections.challenge')}
          content={tP(project.problemKey)}
        />
      )}

      {/* 3. The Build — approach + images + deliverables + tech */}
      {project.solutionKey && (
        <TheBuild
          project={project}
          tP={tP}
          t={t}
        />
      )}

      {/* 4. The Impact — result statement + live site */}
      {project.resultKey && (
        <TheImpact
          content={tP(project.resultKey)}
          liveUrl={project.liveUrl}
          t={t}
        />
      )}

      {/* 5. Start a Project */}
      <BottomCTA t={t} locale={locale} />

      {/* 6. Next Case */}
      {nextProject && (
        <NextProjectNav project={nextProject} tP={tP} t={t} locale={locale} />
      )}
    </article>
  );
}

// ── 1. Hero ──

function CaseHero({
  project,
  isDark,
  heroBg,
  tP,
  locale,
  t,
}: {
  project: EnrichedProject;
  isDark: boolean;
  heroBg: string;
  tP: ReturnType<typeof useTranslations>;
  locale: string;
  t: ReturnType<typeof useTranslations>;
}) {
  const text = isDark ? 'text-white' : 'text-[#1A1A1A]';
  const muted = isDark ? 'text-white/30' : 'text-[#1A1A1A]/30';
  const secondary = isDark ? 'text-white/50' : 'text-[#1A1A1A]/50';

  return (
    <section className="pt-32 md:pt-44 pb-0" style={{ backgroundColor: heroBg }}>
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        {/* Back link */}
        <m.div initial="initial" animate="animate" variants={fadeInUp} transition={transitions.fast}>
          <Link
            href={`/${locale}/#work`}
            className={cn(
              'text-[11px] font-mono tracking-[0.2em] uppercase inline-block mb-16 md:mb-20 transition-opacity hover:opacity-100',
              isDark ? 'text-white/25 hover:text-white/50' : 'text-[#1A1A1A]/25 hover:text-[#1A1A1A]/50',
            )}
          >
            {t('nav.backToWork')}
          </Link>
        </m.div>

        {/* Category */}
        <m.span
          initial="initial" animate="animate" variants={fadeInUp}
          transition={{ ...transitions.smooth, delay: 0.05 }}
          className={cn('text-[11px] font-mono tracking-[0.2em] uppercase block mb-6', muted)}
        >
          {tP(`categories.${project.categoryKey}`)}
        </m.span>

        {/* Title */}
        <m.h1
          initial="initial" animate="animate" variants={fadeInUp}
          transition={{ ...transitions.smooth, delay: 0.1 }}
          className={cn('text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-nostalgic leading-[0.95] tracking-tighter', text)}
        >
          {project.titleKey}
        </m.h1>

        {/* Impact line */}
        {project.impactLineKey && (
          <m.p
            initial="initial" animate="animate" variants={fadeInUp}
            transition={{ ...transitions.smooth, delay: 0.15 }}
            className={cn('text-lg md:text-xl lg:text-2xl leading-relaxed mt-8 md:mt-10 max-w-2xl font-light', secondary)}
          >
            {tP(project.impactLineKey)}
          </m.p>
        )}
      </div>

      {/* Hero image */}
      <m.div
        initial="initial" animate="animate" variants={fadeInUp}
        transition={{ ...transitions.smooth, delay: 0.25 }}
        className="mt-16 md:mt-24"
      >
        <HeroImage src={project.imageSrc} alt={project.titleKey} isDark={isDark} />
      </m.div>

      {/* Metrics — inside the hero */}
      {project.metrics && project.metrics.length > 0 && (
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-16 md:py-24">
          <div className={cn(
            'grid gap-12 md:gap-16',
            project.metrics.length <= 2 ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3',
          )}>
            {project.metrics.map((metric, idx) => (
              <m.div
                key={idx}
                initial="initial" whileInView="animate" viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ ...transitions.smooth, delay: idx * 0.1 }}
              >
                <span className={cn('font-mono text-4xl md:text-5xl lg:text-6xl font-bold block leading-none tracking-tight', text)}>
                  {metric.value}
                </span>
                <span className={cn('text-xs md:text-sm mt-3 block font-mono tracking-wider uppercase', muted)}>
                  {tP(metric.labelKey)}
                </span>
              </m.div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

// ── Hero Image ──

function HeroImage({ src, alt, isDark }: { src: string; alt: string; isDark: boolean }) {
  if (src) {
    return (
      <div className="aspect-[16/9] md:aspect-[21/9] relative overflow-hidden w-full">
        <Image src={src} alt={alt} fill sizes="100vw" className="object-cover" priority quality={85} />
      </div>
    );
  }

  return (
    <div className={cn(
      'aspect-[16/9] md:aspect-[21/9] relative overflow-hidden flex items-end p-8 md:p-16',
      isDark ? 'bg-[#0a0a0a]' : 'bg-[#e8e8e8]',
    )}>
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(rgba(128,128,128,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(128,128,128,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
      <div className="relative z-10">
        <span className={cn('text-sm font-mono tracking-widest uppercase block mb-3', isDark ? 'text-white/10' : 'text-black/10')}>
          {alt}
        </span>
        <div className={cn('w-16 h-px', isDark ? 'bg-white/10' : 'bg-black/10')} />
      </div>
    </div>
  );
}

// ── 2. The Challenge ──

function NarrativeBlock({ label, content }: { label: string; content: string }) {
  return (
    <section className="py-20 md:py-32 px-6 md:px-12 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="border-t border-black/8 mb-12 md:mb-16" />
        <div className="md:grid md:grid-cols-12 md:gap-8">
          <m.div
            initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp} transition={transitions.smooth}
            className="md:col-span-4 mb-8 md:mb-0"
          >
            <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-black/30 block">
              {label}
            </span>
          </m.div>
          <m.div
            initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp} transition={{ ...transitions.smooth, delay: 0.1 }}
            className="md:col-span-8"
          >
            <p className="text-xl md:text-2xl lg:text-3xl leading-[1.4] text-black/75 font-light">
              {content}
            </p>
          </m.div>
        </div>
      </div>
    </section>
  );
}

// ── 3. The Build — approach + image grid + deliverables + architecture ──

function TheBuild({
  project,
  tP,
  t,
}: {
  project: EnrichedProject;
  tP: ReturnType<typeof useTranslations>;
  t: ReturnType<typeof useTranslations>;
}) {
  const deliverables = project.deliverablesKey
    ? (tP.raw(project.deliverablesKey) as string[])
    : [];

  const images = (project.galleryImages || [])
    .map((img) => utAssetUrl(img) || img)
    .filter(Boolean);

  return (
    <section className="bg-surface-light-1 py-20 md:py-32 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Approach narrative */}
        <div className="border-t border-black/8 mb-12 md:mb-16" />
        <div className="md:grid md:grid-cols-12 md:gap-8">
          <m.div
            initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp} transition={transitions.smooth}
            className="md:col-span-4 mb-8 md:mb-0"
          >
            <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-black/30 block">
              {t('sections.build')}
            </span>
          </m.div>
          <m.div
            initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp} transition={{ ...transitions.smooth, delay: 0.1 }}
            className="md:col-span-8"
          >
            <p className="text-xl md:text-2xl lg:text-3xl leading-[1.4] text-black/75 font-light">
              {tP(project.solutionKey!)}
            </p>
          </m.div>
        </div>

        {/* Image gallery — horizontal scroll for mobile screenshots */}
        {images.length > 0 && (
          <div className="mt-16 md:mt-24 -mx-6 md:-mx-12 px-6 md:px-12 overflow-x-auto">
            <div className="flex gap-4 md:gap-6 pb-4" style={{ minWidth: 'min-content' }}>
              {images.map((img, idx) => (
                <m.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.08, ease: 'easeOut' }}
                  className="relative w-[220px] md:w-[260px] lg:w-[280px] shrink-0 rounded-2xl overflow-hidden bg-black/5 shadow-lg"
                >
                  <Image
                    src={img}
                    alt={`${project.titleKey} ${idx + 1}`}
                    width={1290}
                    height={2796}
                    sizes="280px"
                    className="w-full h-auto"
                    quality={80}
                  />
                </m.div>
              ))}
            </div>
          </div>
        )}

        {/* Deliverables — compact grid */}
        {deliverables.length > 0 && (
          <m.div
            initial="initial" whileInView="animate" viewport={{ once: true }}
            variants={fadeInUp} transition={{ ...transitions.smooth, delay: 0.15 }}
            className="mt-16 md:mt-24"
          >
            <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-black/30 block mb-6">
              {t('sections.deliverables')}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {deliverables.map((item, idx) => (
                <div key={idx} className="text-sm text-black/60 font-light py-2.5 border-b border-black/6">
                  {item}
                </div>
              ))}
            </div>
          </m.div>
        )}

        {/* Architecture — tech stack */}
        {project.tags.length > 0 && (
          <m.div
            initial="initial" whileInView="animate" viewport={{ once: true }}
            variants={fadeInUp} transition={{ ...transitions.smooth, delay: 0.2 }}
            className="mt-12 md:mt-16"
          >
            <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-black/30 block mb-4">
              {t('sections.architecture')}
            </span>
            <div className="flex flex-wrap gap-2.5">
              {project.tags.map((tag) => (
                <span key={tag} className="text-xs font-mono tracking-wider text-black/35 px-3.5 py-1.5 border border-black/8">
                  {tag}
                </span>
              ))}
            </div>
          </m.div>
        )}
      </div>
    </section>
  );
}

// ── 4. The Impact — result + live site ──

function TheImpact({
  content,
  liveUrl,
  t,
}: {
  content: string;
  liveUrl?: string;
  t: ReturnType<typeof useTranslations>;
}) {
  const fullUrl = liveUrl ? (liveUrl.startsWith('http') ? liveUrl : `https://${liveUrl}`) : undefined;

  return (
    <section className="bg-[#121212] text-white py-24 md:py-36 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        <m.div
          initial="initial" whileInView="animate" viewport={{ once: true }}
          variants={fadeInUp} transition={transitions.smooth}
        >
          <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-white/25 block mb-10 md:mb-14">
            {t('sections.impact')}
          </span>
          <p className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl leading-[1.2] font-nostalgic tracking-tight text-white/90">
            {content}
          </p>

          {fullUrl && (
            <a
              href={fullUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 mt-12 md:mt-16 text-sm font-mono tracking-wider text-white/40 transition-colors duration-200 hover:text-white"
            >
              {t('nav.visitSite')}
            </a>
          )}
        </m.div>
      </div>
    </section>
  );
}

// ── 5. Start a Project ──

function BottomCTA({ t, locale }: { t: ReturnType<typeof useTranslations>; locale: string }) {
  return (
    <section className="bg-[#0A0A0A] text-white py-24 md:py-36 px-6 md:px-12">
      <div className="max-w-3xl mx-auto text-center">
        <m.h2
          initial="initial" whileInView="animate" viewport={{ once: true }}
          variants={fadeInUp} transition={transitions.smooth}
          className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-nostalgic tracking-tighter leading-[0.95]"
        >
          {t('cta.title')}
        </m.h2>
        <m.p
          initial="initial" whileInView="animate" viewport={{ once: true }}
          variants={fadeInUp} transition={{ ...transitions.smooth, delay: 0.1 }}
          className="text-base md:text-lg text-white/40 mt-5 mb-12"
        >
          {t('cta.subtitle')}
        </m.p>
        <m.div
          initial="initial" whileInView="animate" viewport={{ once: true }}
          variants={fadeInUp} transition={{ ...transitions.smooth, delay: 0.2 }}
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

// ── 6. Next Case ──

function NextProjectNav({
  project,
  tP,
  t,
  locale,
}: {
  project: EnrichedProject;
  tP: ReturnType<typeof useTranslations>;
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
            initial="initial" whileInView="animate" viewport={{ once: true }}
            variants={fadeInUp} transition={transitions.smooth}
          >
            <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-black/25 block mb-8">
              {t('nav.nextProject')}
            </span>
            <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-black/35 block mb-3">
              {tP(`categories.${project.categoryKey}`)}
            </span>
            <h3 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-nostalgic tracking-tighter leading-[0.95] transition-opacity duration-300 group-hover:opacity-50">
              {project.titleKey}
            </h3>
            {project.impactLineKey && (
              <p className="text-sm md:text-base text-black/40 mt-4 max-w-xl font-light leading-relaxed">
                {tP(project.impactLineKey)}
              </p>
            )}
          </m.div>
        </div>
      </Link>
    </section>
  );
}
