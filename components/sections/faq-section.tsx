'use client';

import { useState, useEffect } from 'react';
import { m } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';

const faqKeys = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'];

function FAQItem({
  faqKey,
  index,
  question,
  answer,
}: {
  faqKey: string;
  index: number;
  question: string;
  answer: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <m.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1], delay: index * 0.06 }}
      className="group border-b border-[#1E1E1E]/10"
      itemScope
      itemProp="mainEntity"
      itemType="https://schema.org/Question"
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start justify-between text-left gap-6 py-6 md:py-7"
        aria-expanded={open}
        aria-controls={`faq-answer-${faqKey}`}
      >
        <div className="flex items-baseline gap-4 flex-1 min-w-0">
          <span className="text-xs font-mono tracking-widest text-[#1E1E1E]/25 shrink-0 tabular-nums">
            {String(index + 1).padStart(2, '0')}
          </span>
          <h3
            className="text-base md:text-lg font-nostalgic font-semibold text-[#1E1E1E]/70 leading-tight transition-[color] duration-200 ease-out group-hover:text-[#1E1E1E]"
            itemProp="name"
          >
            {question}
          </h3>
        </div>
        <span
          className={`text-[#1E1E1E]/30 group-hover:text-[#1E1E1E]/60 text-lg font-mono shrink-0 mt-0.5 transition-[transform,color] duration-200 ease-out ${
            open ? 'rotate-45' : ''
          }`}
        >
          +
        </span>
      </button>

      <div
        id={`faq-answer-${faqKey}`}
        className={`grid transition-[grid-template-rows] duration-250 ease-[cubic-bezier(.25,.1,.25,1)] ${
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
        itemScope
        itemProp="acceptedAnswer"
        itemType="https://schema.org/Answer"
      >
        <div className="min-h-0 overflow-hidden">
          <div className="pl-10 md:pl-11 pb-6 md:pb-7 space-y-2" itemProp="text">
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
    </m.div>
  );
}

export default function FAQSection() {
  const t = useTranslations('faq');
  const locale = useLocale();

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
      className="relative z-10 py-24 md:py-32 px-6 md:px-12 bg-surface-light-1"
      itemScope
      itemType="https://schema.org/FAQPage"
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <m.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16"
        >
          <p className="text-sm font-mono tracking-widest text-[#5A5A5A] mb-4">
            {t('intro')}
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-nostalgic text-[#1E1E1E] tracking-tight leading-[1.1] mb-3">
            {t('title')}
          </h2>
          <p className="text-base text-[#5A5A5A]">
            {t('introSub')}
          </p>
        </m.div>

        {/* FAQ list */}
        <div className="border-t border-[#1E1E1E]/10">
          {faqKeys.map((faqKey, index) => (
            <FAQItem
              key={faqKey}
              faqKey={faqKey}
              index={index}
              question={t(`questions.${faqKey}.question`)}
              answer={String(t(`questions.${faqKey}.answer`))}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
