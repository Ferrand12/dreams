'use client';

import { useRef } from 'react';
import { m, useScroll, useTransform, useSpring } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

// ---------------------------------------------------------------------------
// ValueItem — scroll-activated principle with spring-smoothed opacity
// ---------------------------------------------------------------------------
function ValueItem({ word, description }: { word: string; description: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const rawOpacity = useTransform(
    scrollYProgress,
    [0, 0.25, 0.4, 0.65, 0.85],
    [0.1, 0.1, 1, 1, 0.1]
  );
  const opacity = useSpring(rawOpacity, { stiffness: 150, damping: 25 });

  return (
    <m.div ref={ref} style={{ opacity }}>
      <h3 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-nostalgic text-white tracking-tight leading-[1.1] mb-4 md:mb-6">
        {word}
      </h3>
      <p className="text-base md:text-lg text-white/50 max-w-xl leading-relaxed">
        {description}
      </p>
    </m.div>
  );
}

// ---------------------------------------------------------------------------
// AboutContent — all about page sections
// ---------------------------------------------------------------------------
export default function AboutContent() {
  const t = useTranslations('about');

  const stats = t.raw('stats.items') as { value: string; label: string }[];
  const values = t.raw('values.items') as { word: string; description: string }[];
  const steps = t.raw('process.steps') as { number: string; title: string; description: string }[];
  const capabilities = t.raw('capabilities.items') as { title: string; description: string }[];

  return (
    <>
      {/* ================================================================= */}
      {/* HERO — dark, editorial positioning statement                      */}
      {/* ================================================================= */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 px-6 md:px-12 bg-[#1E1E1E]">
        <div className="max-w-5xl mx-auto">
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-xs font-mono tracking-widest text-white/40 uppercase mb-6 block">
              {t('hero.label')}
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-nostalgic text-white tracking-tight leading-[1.1] mb-6 md:mb-8">
              {t('hero.title')}
            </h1>
            <p className="text-lg md:text-xl text-white/50 leading-relaxed max-w-2xl">
              {t('hero.description')}
            </p>
          </m.div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* STATS — compact credibility strip                                 */}
      {/* ================================================================= */}
      <section className="py-16 md:py-20 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, i) => (
              <m.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="border-l-2 border-[#1E1E1E] pl-5"
              >
                <span className="block text-3xl md:text-4xl font-nostalgic text-[#1E1E1E] tracking-tight mb-1">
                  {stat.value}
                </span>
                <span className="text-sm text-[#5A5A5A]">
                  {stat.label}
                </span>
              </m.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* VALUES — scroll-activated principles on dark background           */}
      {/* ================================================================= */}
      <section className="py-24 md:py-32 px-6 md:px-12 bg-[#1E1E1E]">
        <div className="max-w-5xl mx-auto">
          <m.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-mono tracking-widest text-white/40 uppercase mb-16 md:mb-20 block"
          >
            {t('values.label')}
          </m.span>

          <div className="space-y-20 md:space-y-28">
            {values.map((value, i) => (
              <ValueItem key={i} word={value.word} description={value.description} />
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* PROCESS — numbered steps in editorial grid                        */}
      {/* ================================================================= */}
      <section className="py-24 md:py-32 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <m.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 md:mb-16"
          >
            <span className="text-xs font-mono tracking-widest text-[#5A5A5A] uppercase mb-4 block">
              {t('process.label')}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-nostalgic text-[#1E1E1E] tracking-tight leading-[1.1]">
              {t('process.title')}
            </h2>
          </m.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#1E1E1E]/10 border border-[#1E1E1E]/10">
            {steps.map((step, i) => (
              <m.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-white p-6 md:p-8 flex flex-col"
              >
                <span className="text-xs font-mono tracking-widest text-[#1E1E1E]/25 mb-6">
                  {step.number}
                </span>
                <h3 className="text-lg md:text-xl font-nostalgic font-semibold text-[#1E1E1E] tracking-tight mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-[#5A5A5A] leading-relaxed mt-auto">
                  {step.description}
                </p>
              </m.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* CAPABILITIES — technical range + stack                            */}
      {/* ================================================================= */}
      <section className="py-24 md:py-32 px-6 md:px-12 bg-surface-light-1">
        <div className="max-w-7xl mx-auto">
          <m.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 md:mb-16"
          >
            <span className="text-xs font-mono tracking-widest text-[#5A5A5A] uppercase mb-4 block">
              {t('capabilities.label')}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-nostalgic text-[#1E1E1E] tracking-tight leading-[1.1]">
              {t('capabilities.title')}
            </h2>
          </m.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#1E1E1E]/10 border border-[#1E1E1E]/10 mb-12">
            {capabilities.map((item, i) => (
              <m.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="bg-surface-light-1 p-6 md:p-8"
              >
                <h3 className="text-base font-medium text-[#1E1E1E] mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-[#5A5A5A] leading-relaxed">
                  {item.description}
                </p>
              </m.div>
            ))}
          </div>

          <p className="text-sm font-mono tracking-wider text-[#5A5A5A]/60">
            {t('capabilities.stack')}
          </p>
        </div>
      </section>

      {/* ================================================================= */}
      {/* CTA — closing call to action                                      */}
      {/* ================================================================= */}
      <section className="py-24 md:py-32 px-6 md:px-12 bg-[#1E1E1E]">
        <div className="max-w-3xl mx-auto text-center">
          <m.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-6"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-nostalgic text-white tracking-tight leading-[1.1]">
              {t('cta.title')}
            </h2>
            <p className="text-base md:text-lg text-white/50 leading-relaxed max-w-lg">
              {t('cta.description')}
            </p>
            <Link
              href="/start"
              className="group inline-flex h-14 items-center justify-center gap-3 bg-white border-2 border-white px-12 text-base font-medium text-[#1E1E1E] transition-all duration-300 hover:bg-[#DEE5ED] hover:border-[#DEE5ED] active:scale-[0.98] mt-2"
            >
              <span>{t('cta.button')}</span>
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </m.div>
        </div>
      </section>
    </>
  );
}
