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

/* ────────────────────────────────────────────────────────
   Page Composition — editorial dark immersive
   ──────────────────────────────────────────────────────── */

export function CaseStudyPage({ project, nextProject, locale }: CaseStudyPageProps) {
  const t = useTranslations('caseStudy');
  const tP = useTranslations('portfolio');

  const heroBg = project.galleryBg || (project.bgTheme === 'dark' ? '#121212' : '#EBF0F5');

  return (
    <article>
      <CaseHero project={project} heroBg={heroBg} tP={tP} locale={locale} t={t} />

      {project.scopeKey && (
        <ScopeStrip items={tP.raw(project.scopeKey) as string[]} heroBg={heroBg} />
      )}

      {project.metrics && project.metrics.length > 0 && (
        <MetricsStrip metrics={project.metrics} heroBg={heroBg} tP={tP} />
      )}

      {(project.narrativeKey || project.problemKey) && (
        <NarrativeBlock
          label={t('sections.challenge')}
          content={tP(project.narrativeKey || project.problemKey!)}
        />
      )}

      <AppShowcase project={project} />

      <DeliverablesSection project={project} tP={tP} t={t} />

      {project.resultKey && (
        <ImpactQuote content={tP(project.resultKey)} liveUrl={project.liveUrl} t={t} />
      )}

      <BottomCTA t={t} locale={locale} />
      {nextProject && <NextProjectNav project={nextProject} tP={tP} t={t} locale={locale} />}
    </article>
  );
}

/* ────────────────────────────────────────────────────────
   1. Hero — video or image, full-viewport dark
   ──────────────────────────────────────────────────────── */

function CaseHero({
  project, heroBg, tP, locale, t,
}: {
  project: EnrichedProject;
  heroBg: string;
  tP: ReturnType<typeof useTranslations>;
  locale: string;
  t: ReturnType<typeof useTranslations>;
}) {
  const videoSrc = project.heroVideoKey ? utAssetUrl(project.heroVideoKey) : null;

  return (
    <section style={{ backgroundColor: heroBg }}>
      {/* Title block */}
      <div className="pt-32 md:pt-44 max-w-6xl mx-auto px-6 md:px-12">
        <m.div initial="initial" animate="animate" variants={fadeInUp} transition={transitions.fast}>
          <Link
            href={`/${locale}/#work`}
            className="text-[11px] font-mono tracking-[0.2em] uppercase inline-block mb-16 md:mb-20 transition-opacity text-white/25 hover:text-white/50"
          >
            {t('nav.backToWork')}
          </Link>
        </m.div>

        <m.span
          initial="initial" animate="animate" variants={fadeInUp}
          transition={{ ...transitions.smooth, delay: 0.05 }}
          className="text-[11px] font-mono tracking-[0.2em] uppercase block mb-6 text-white/30"
        >
          {tP(`categories.${project.categoryKey}`)}
        </m.span>

        <m.h1
          initial="initial" animate="animate" variants={fadeInUp}
          transition={{ ...transitions.smooth, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-nostalgic leading-[0.95] tracking-tighter text-white"
        >
          {project.titleKey}
        </m.h1>

        {project.impactLineKey && (
          <m.p
            initial="initial" animate="animate" variants={fadeInUp}
            transition={{ ...transitions.smooth, delay: 0.15 }}
            className="text-lg md:text-xl lg:text-2xl leading-relaxed mt-8 md:mt-10 max-w-2xl font-light text-white/50"
          >
            {tP(project.impactLineKey)}
          </m.p>
        )}
      </div>

      {/* Hero media — video or image */}
      <m.div
        initial="initial" animate="animate" variants={fadeInUp}
        transition={{ ...transitions.smooth, delay: 0.25 }}
        className="mt-16 md:mt-24"
      >
        {videoSrc ? (
          <div className="relative w-full overflow-hidden aspect-[16/9] md:aspect-[21/9] bg-black">
            <video
              autoPlay
              loop
              muted
              playsInline
              poster={project.imageSrc || undefined}
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src={videoSrc} type="video/mp4" />
            </video>
          </div>
        ) : (
          <HeroImage src={project.imageSrc} alt={project.titleKey} />
        )}
      </m.div>
    </section>
  );
}

function HeroImage({ src, alt }: { src: string; alt: string }) {
  if (src) {
    return (
      <div className="aspect-[16/9] md:aspect-[21/9] relative overflow-hidden w-full">
        <Image src={src} alt={alt} fill sizes="100vw" className="object-cover" priority quality={85} />
      </div>
    );
  }

  return (
    <div className="aspect-[16/9] md:aspect-[21/9] relative overflow-hidden flex items-end p-8 md:p-16 bg-[#0a0a0a]">
      <div className="relative z-10">
        <span className="text-sm font-mono tracking-widest uppercase block mb-3 text-white/10">{alt}</span>
        <div className="w-16 h-px bg-white/10" />
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────
   2. Scope strip — numbered editorial bullets
   ──────────────────────────────────────────────────────── */

function ScopeStrip({ items, heroBg }: { items: string[]; heroBg: string }) {
  return (
    <section className="py-12 md:py-16 px-6 md:px-12" style={{ backgroundColor: heroBg }}>
      <div className="max-w-6xl mx-auto">
        <div className="border-t border-white/10 pt-12 md:pt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {items.map((item, idx) => (
              <m.div
                key={idx}
                initial="initial" whileInView="animate" viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ ...transitions.smooth, delay: idx * 0.08 }}
                className="flex items-baseline gap-4"
              >
                <span className="text-xs font-mono text-white/20 tabular-nums">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <span className="text-sm md:text-base font-medium tracking-tight text-white/70">
                  {item}
                </span>
              </m.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────
   3. Metrics — huge typographic numbers
   ──────────────────────────────────────────────────────── */

function MetricsStrip({
  metrics, heroBg, tP,
}: {
  metrics: { value: string; labelKey: string }[];
  heroBg: string;
  tP: ReturnType<typeof useTranslations>;
}) {
  return (
    <section className="py-20 md:py-32 px-6 md:px-12" style={{ backgroundColor: heroBg }}>
      <div className="max-w-6xl mx-auto">
        <div className={cn(
          'grid gap-12 md:gap-16',
          metrics.length <= 2 ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3',
        )}>
          {metrics.map((metric, idx) => (
            <m.div
              key={idx}
              initial="initial" whileInView="animate" viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ ...transitions.smooth, delay: idx * 0.1 }}
            >
              <span className="font-mono text-6xl md:text-7xl lg:text-8xl font-bold block leading-none tracking-tighter text-white">
                {metric.value}
              </span>
              <span className="text-xs md:text-sm mt-4 block font-mono tracking-wider uppercase text-white/25">
                {tP(metric.labelKey)}
              </span>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────
   4. Narrative — dark editorial paragraph
   ──────────────────────────────────────────────────────── */

function NarrativeBlock({ label, content }: { label: string; content: string }) {
  return (
    <section className="py-24 md:py-40 px-6 md:px-12" style={{ backgroundColor: '#111' }}>
      <div className="max-w-6xl mx-auto">
        <div className="md:grid md:grid-cols-12 md:gap-8">
          <m.div
            initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp} transition={transitions.smooth}
            className="md:col-span-4 mb-8 md:mb-0"
          >
            <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-white/25 block">
              {label}
            </span>
          </m.div>
          <m.div
            initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp} transition={{ ...transitions.smooth, delay: 0.1 }}
            className="md:col-span-8"
          >
            <p className="text-xl md:text-2xl lg:text-3xl leading-[1.4] text-white/60 font-light">
              {content}
            </p>
          </m.div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────
   5. App showcase — editorial asymmetric phone grid
   Feature phone (hero, large, centered with glow) +
   supporting phones (smaller, staggered grid)
   ──────────────────────────────────────────────────────── */

function AppShowcase({ project }: { project: EnrichedProject }) {
  const images = (project.galleryImages || [])
    .map((img) => utAssetUrl(img) || img)
    .filter(Boolean);

  if (images.length === 0) return null;

  // First image = feature (large, hero), rest = supporting grid
  const [feature, ...supporting] = images;

  return (
    <section className="py-28 md:py-44" style={{ backgroundColor: '#080808' }}>
      {/* Feature phone — large, centered, ambient glow */}
      <m.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex justify-center mb-20 md:mb-32 px-6"
      >
        <div className="relative">
          {/* Ambient glow behind phone */}
          <div
            className="absolute -inset-12 md:-inset-20 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.04) 0%, transparent 70%)',
            }}
          />
          <div className="relative w-[260px] md:w-[320px] lg:w-[360px] rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-white/[0.08]">
            <Image
              src={feature}
              alt={`${project.titleKey} — main screen`}
              width={1290}
              height={2796}
              sizes="(max-width: 768px) 260px, (max-width: 1024px) 320px, 360px"
              className="w-full h-auto"
              quality={85}
            />
          </div>
        </div>
      </m.div>

      {/* Supporting phones — editorial grid with stagger */}
      {supporting.length > 0 && (
        <div className="max-w-5xl mx-auto px-6 md:px-12">
          <div className={cn(
            'grid gap-5 md:gap-8 justify-items-center',
            supporting.length <= 2
              ? 'grid-cols-2 max-w-md mx-auto'
              : 'grid-cols-2 md:grid-cols-4',
          )}>
            {supporting.map((img, idx) => (
              <m.div
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.12 + idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="w-full"
              >
                <div
                  className={cn(
                    'rounded-2xl md:rounded-[1.5rem] overflow-hidden shadow-xl ring-1 ring-white/[0.06]',
                    // Stagger: alternate phones get a top margin offset (desktop only)
                    idx % 2 === 1 ? 'md:mt-8' : 'md:mt-0',
                  )}
                >
                  <Image
                    src={img}
                    alt={`${project.titleKey} screen ${idx + 2}`}
                    width={1290}
                    height={2796}
                    sizes="(max-width: 768px) 160px, 200px"
                    className="w-full h-auto"
                    quality={80}
                  />
                </div>
              </m.div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

/* ────────────────────────────────────────────────────────
   6. Deliverables — dark, numbered, prominent
   ──────────────────────────────────────────────────────── */

function DeliverablesSection({
  project, tP, t,
}: {
  project: EnrichedProject;
  tP: ReturnType<typeof useTranslations>;
  t: ReturnType<typeof useTranslations>;
}) {
  const deliverables = project.deliverablesKey
    ? (tP.raw(project.deliverablesKey) as string[])
    : [];

  if (deliverables.length === 0 && project.tags.length === 0) return null;

  return (
    <section className="py-24 md:py-40 px-6 md:px-12" style={{ backgroundColor: '#111' }}>
      <div className="max-w-6xl mx-auto">
        {deliverables.length > 0 && (
          <m.div
            initial="initial" whileInView="animate" viewport={{ once: true }}
            variants={fadeInUp} transition={transitions.smooth}
          >
            <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-white/25 block mb-12 md:mb-16">
              {t('sections.deliverables')}
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {deliverables.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-baseline gap-6 py-5 md:py-6 border-b border-white/[0.06]"
                >
                  <span className="text-sm font-mono text-white/20 tabular-nums shrink-0">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="text-base md:text-lg lg:text-xl text-white/60 font-light">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </m.div>
        )}

        {project.tags.length > 0 && (
          <m.div
            initial="initial" whileInView="animate" viewport={{ once: true }}
            variants={fadeInUp} transition={{ ...transitions.smooth, delay: 0.1 }}
            className={deliverables.length > 0 ? 'mt-16 md:mt-24' : ''}
          >
            <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-white/25 block mb-8">
              {t('sections.architecture')}
            </span>
            <div className="flex flex-wrap gap-3">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-sm font-mono tracking-wider text-white/35 px-5 py-2.5 border border-white/[0.08]"
                >
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

/* ────────────────────────────────────────────────────────
   7. Impact quote — full-width statement
   ──────────────────────────────────────────────────────── */

function ImpactQuote({
  content, liveUrl, t,
}: {
  content: string;
  liveUrl?: string;
  t: ReturnType<typeof useTranslations>;
}) {
  const fullUrl = liveUrl ? (liveUrl.startsWith('http') ? liveUrl : `https://${liveUrl}`) : undefined;

  return (
    <section className="py-28 md:py-44 px-6 md:px-12" style={{ backgroundColor: '#0A0A0A' }}>
      <div className="max-w-5xl mx-auto">
        <m.div
          initial="initial" whileInView="animate" viewport={{ once: true }}
          variants={fadeInUp} transition={transitions.smooth}
        >
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

/* ────────────────────────────────────────────────────────
   8a. CTA — earned after proof
   ──────────────────────────────────────────────────────── */

function BottomCTA({ t, locale }: { t: ReturnType<typeof useTranslations>; locale: string }) {
  return (
    <section className="py-28 md:py-44 px-6 md:px-12" style={{ backgroundColor: '#080808' }}>
      <div className="max-w-3xl mx-auto text-center">
        <m.h2
          initial="initial" whileInView="animate" viewport={{ once: true }}
          variants={fadeInUp} transition={transitions.smooth}
          className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-nostalgic tracking-tighter leading-[0.95] text-white"
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

/* ────────────────────────────────────────────────────────
   8b. Next project — dark, consistent with editorial
   ──────────────────────────────────────────────────────── */

function NextProjectNav({
  project, tP, t, locale,
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
    <section className="border-t border-white/[0.06]" style={{ backgroundColor: '#111' }}>
      <Link href={href} className="group block py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <m.div
            initial="initial" whileInView="animate" viewport={{ once: true }}
            variants={fadeInUp} transition={transitions.smooth}
          >
            <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-white/25 block mb-8">
              {t('nav.nextProject')}
            </span>
            <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-white/35 block mb-3">
              {tP(`categories.${project.categoryKey}`)}
            </span>
            <h3 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-nostalgic tracking-tighter leading-[0.95] text-white transition-opacity duration-300 group-hover:opacity-50">
              {project.titleKey}
            </h3>
            {project.impactLineKey && (
              <p className="text-sm md:text-base text-white/40 mt-4 max-w-xl font-light leading-relaxed">
                {tP(project.impactLineKey)}
              </p>
            )}
          </m.div>
        </div>
      </Link>
    </section>
  );
}
