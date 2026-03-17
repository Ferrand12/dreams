"use client"

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { FlipWords } from '@/components/ui/flip-words';

const TRANSLATION_KEYS: Record<string, string> = {
  webDevelopment: 'webDev',
  mobileDevelopment: 'mobileDev',
  aiSolutions: 'uiux',
};

interface ServicePageTemplateProps {
  serviceKey: 'webDevelopment' | 'mobileDevelopment' | 'aiSolutions';
}

export default function ServicePageTemplate({ serviceKey }: ServicePageTemplateProps) {
  const translationKey = TRANSLATION_KEYS[serviceKey];
  const t = useTranslations(`services.${translationKey}`);

  return (
    <main className="min-h-screen bg-[#1E1E1E] text-white">
      {/* Back Button */}
      <div className="fixed top-24 left-6 z-50">
        <Link
          href="/#services"
          className="inline-flex items-center gap-2 px-4 py-2 border border-white/20 bg-[#1E1E1E]/80 backdrop-blur-sm text-sm text-white/70 hover:text-white hover:border-white/40 transition-[color,border-color] duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Link>
      </div>

      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 px-6 md:px-12 bg-[#1E1E1E]">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-nostalgic text-white tracking-tight leading-[1.1] mb-5">
            {t('hero.h1')}
          </h1>

          <h2 className="flex items-baseline gap-3 text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight leading-[1.1] mb-4">
            <span className="text-white/40 whitespace-nowrap">{t('hero.h2Prefix')}</span>
            <FlipWords
              words={(t.raw('hero.flipWords') as string[]).map(w => w + '.')}
              duration={2400}
              className="text-white"
            />
          </h2>

          <p className="text-sm md:text-base font-mono tracking-wider text-white/40">
            {t('hero.microline')}
          </p>
        </div>
      </section>

      {/* Body */}
      <section className="py-16 md:py-24 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">

          {/* What You Get */}
          <div className="mb-20 md:mb-24">
            <h2 className="text-2xl md:text-3xl font-nostalgic text-white tracking-tight mb-6">
              {t('problem.title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
              {(t.raw('problem.bullets') as string[]).map((bullet, i) => (
                <p key={i} className="border-l-2 border-white/15 pl-5 text-base text-white/60 leading-relaxed">
                  {bullet}
                </p>
              ))}
            </div>

            {/* Deliverable cards — gap-px grid with fine borders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10 border border-white/10">
              {(t.raw('deliverables.items') as string[]).map((item, i) => {
                const items = t.raw('deliverables.items') as string[];
                const isLast = i === items.length - 1 && items.length % 2 !== 0;
                return (
                  <div
                    key={i}
                    className={`bg-[#1E1E1E] p-6 md:p-8 transition-[background-color] duration-200 hover:bg-white/[0.03] ${
                      isLast ? 'md:col-span-2' : ''
                    }`}
                  >
                    <span className="text-xs font-mono tracking-widest text-white/25 mb-3 block">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className="text-base text-white/70 leading-relaxed">{item}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* How It Works */}
          <div className="mb-20 md:mb-24">
            <h2 className="text-2xl md:text-3xl font-nostalgic text-white tracking-tight mb-8">
              {t('processSection.title')}
            </h2>
            <ol className="space-y-4 mb-12">
              {(t.raw('processSection.steps') as string[]).map((step, i) => (
                <li key={i} className="flex items-start gap-5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-white/15 text-sm font-mono text-white/40">
                    {i + 1}
                  </span>
                  <span className="text-base md:text-lg text-white/60 leading-relaxed pt-1">{step}</span>
                </li>
              ))}
            </ol>

            <p className="text-xs font-mono tracking-widest text-white/30 uppercase mb-5">
              {t('fit.title')}
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10 border border-white/10 mb-12">
              {(t.raw('fit.bullets') as string[]).map((bullet, i) => (
                <li key={i} className="bg-[#1E1E1E] px-6 py-4 flex items-start gap-3">
                  <span className="text-white/25 text-xs mt-1">—</span>
                  <span className="text-sm text-white/60 leading-relaxed">{bullet}</span>
                </li>
              ))}
            </ul>

            <div className="space-y-3">
              {(t.raw('proof.bullets') as string[]).map((bullet, i) => (
                <blockquote key={i} className="border-l-2 border-white/15 pl-5 text-white/40 italic text-sm">
                  {bullet}
                </blockquote>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="border-t border-white/10 pt-16 text-center">
            <h2 className="text-2xl md:text-3xl font-nostalgic text-white tracking-tight mb-4">
              {t('cta.heading')}
            </h2>
            <p className="text-base text-white/50 mb-8 max-w-lg mx-auto">
              {t('cta.description')}
            </p>
            <Link
              href="/start"
              className="group inline-flex h-14 items-center justify-center gap-3 bg-white border-2 border-white px-12 text-base font-medium text-[#1E1E1E] transition-all duration-300 hover:bg-[#DEE5ED] hover:border-[#DEE5ED] active:scale-[0.98]"
            >
              <span>{t('cta.button')}</span>
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

        </div>
      </section>
    </main>
  );
}
