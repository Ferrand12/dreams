'use client';

import { useState, useEffect } from 'react';
import { m } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const faqKeys = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'];

function FAQItem({
  faqKey,
  index,
  question,
  answer,
  isOpen,
  onToggle,
}: {
  faqKey: string;
  index: number;
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className="group border-b border-[#1E1E1E]/10"
      itemScope
      itemProp="mainEntity"
      itemType="https://schema.org/Question"
    >
      <button
        onClick={onToggle}
        className="flex w-full items-start justify-between text-left gap-6 py-5 md:py-6"
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${faqKey}`}
      >
        <h3
          className="text-base md:text-lg font-medium text-[#1E1E1E]/70 leading-snug transition-[color] duration-200 ease-out group-hover:text-[#1E1E1E]"
          itemProp="name"
        >
          {question}
        </h3>
        <span
          className={`text-[#1E1E1E]/30 group-hover:text-[#1E1E1E]/60 text-lg font-mono shrink-0 mt-0.5 transition-[transform,color] duration-200 ease-out select-none ${
            isOpen ? 'rotate-45' : ''
          }`}
          aria-hidden="true"
        >
          +
        </span>
      </button>

      <div
        id={`faq-answer-${faqKey}`}
        className={`grid transition-[grid-template-rows] duration-250 ease-[cubic-bezier(.25,.1,.25,1)] ${
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
        itemScope
        itemProp="acceptedAnswer"
        itemType="https://schema.org/Answer"
      >
        <div className="min-h-0 overflow-hidden">
          <div className="pb-5 md:pb-6 space-y-2" itemProp="text">
            {answer.split('\n').map((line, i) => (
              <p
                key={i}
                className="text-sm md:text-base leading-relaxed text-[#5A5A5A]"
              >
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FAQSection() {
  const t = useTranslations('faq');
  const locale = useLocale();
  const [openKey, setOpenKey] = useState<string | null>(null);

  useEffect(() => {
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqKeys.map((faqKey) => ({
        '@type': 'Question',
        name: t(`questions.${faqKey}.question`),
        acceptedAnswer: {
          '@type': 'Answer',
          text: t(`questions.${faqKey}.answer`),
        },
      })),
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(faqSchema);
    script.id = 'faq-schema';

    const existing = document.getElementById('faq-schema');
    if (existing) existing.remove();
    document.head.appendChild(script);

    return () => {
      const el = document.getElementById('faq-schema');
      if (el) el.remove();
    };
  }, [t, locale]);

  return (
    <section
      className="relative z-10 py-24 md:py-32 px-6 md:px-12 bg-white"
      itemScope
      itemType="https://schema.org/FAQPage"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left — context panel */}
          <m.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-5 lg:sticky lg:top-32 lg:self-start"
          >
            <span className="text-xs font-mono tracking-widest text-[#5A5A5A] uppercase">
              {t('label')}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-nostalgic text-[#1E1E1E] tracking-tight leading-[1.1]">
              {t('title')}
            </h2>
            <p className="text-base md:text-lg text-[#5A5A5A] leading-relaxed max-w-md">
              {t('supporting')}
            </p>
            <div className="mt-3">
              <Link
                href="/start"
                className="group inline-flex items-center gap-2 text-sm font-medium text-[#1E1E1E] transition-[color] duration-200 hover:text-[#5A5A5A]"
              >
                <span>{t('cta')}</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </m.div>

          {/* Right — accordion */}
          <div className="border-t border-[#1E1E1E]/10">
            {faqKeys.map((faqKey, index) => (
              <FAQItem
                key={faqKey}
                faqKey={faqKey}
                index={index}
                question={t(`questions.${faqKey}.question`)}
                answer={String(t(`questions.${faqKey}.answer`))}
                isOpen={openKey === faqKey}
                onToggle={() => setOpenKey(openKey === faqKey ? null : faqKey)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
