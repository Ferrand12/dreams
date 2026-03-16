'use client';

import { useRef, useState } from 'react';
import { m, useScroll, useTransform, useSpring, useMotionValueEvent } from 'framer-motion';
import { useTranslations } from 'next-intl';

const milestones = ['2023', '2024', '2025', '2026'] as const;

export default function TimelineSection() {
  const t = useTranslations('timeline');
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [scrollActiveIndex, setScrollActiveIndex] = useState(0);
  const prevIndexRef = useRef(0);

  // Scroll-based progress tied to section visibility
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.8', 'end 0.2'],
  });

  // Spring-smoothed for buttery movement
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Clamp to [0,1] — spring can overshoot
  const clampedProgress = useTransform(smoothProgress, (v) => Math.max(0, Math.min(1, v)));

  // Indicator position as CSS percentage
  const indicatorLeft = useTransform(clampedProgress, (v) => `${v * 100}%`);

  // Only re-render when active milestone actually changes
  useMotionValueEvent(clampedProgress, 'change', (v) => {
    const idx = Math.min(3, Math.max(0, Math.round(v * 3)));
    if (idx !== prevIndexRef.current) {
      prevIndexRef.current = idx;
      setScrollActiveIndex(idx);
    }
  });

  const activeIndex = hoveredIndex !== null ? hoveredIndex : scrollActiveIndex;

  return (
    <section
      ref={sectionRef}
      className="relative z-10 py-24 md:py-32 px-6 md:px-12 bg-surface-light-1"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <m.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 md:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-nostalgic max-w-4xl leading-tight mb-4 tracking-tight">
            {t('title')}
          </h2>
          <p className="text-sm md:text-base font-mono tracking-widest text-muted-foreground">
            {t('subtitle')}
          </p>
        </m.div>

        {/* Timeline */}
        <div className="relative">
          {/* Progress line — desktop only */}
          <div className="hidden lg:block relative h-px bg-black/10">
            {/* Filled line — scaleX for GPU acceleration */}
            <m.div
              className="absolute top-0 left-0 h-px bg-black/40 w-full origin-left"
              style={{ scaleX: clampedProgress }}
            />
            {/* Square indicator — 8px, sharp corners */}
            <m.div
              className="absolute top-1/2 w-2 h-2 bg-[#1E1E1E]"
              style={{
                left: indicatorLeft,
                y: '-50%',
                x: '-50%',
              }}
            />
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0">
            {milestones.map((year, index) => {
              const isActive = index === activeIndex;

              return (
                <m.div
                  key={year}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: 0.6,
                    ease: [0.25, 0.1, 0.25, 1],
                    delay: index * 0.08,
                  }}
                  className="border-t border-black/10 lg:border-t-0 lg:aspect-square flex flex-col p-6 md:p-8 cursor-default"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <span
                    className="block text-sm font-mono tracking-wider mb-4 transition-[color] duration-200 ease-out"
                    style={{
                      color: isActive ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.25)',
                    }}
                  >
                    {year}
                  </span>
                  <h3
                    className="text-xl md:text-2xl font-nostalgic font-bold tracking-tight mb-3 transition-[opacity,transform] duration-200 ease-out"
                    style={{
                      opacity: isActive ? 1 : 0.5,
                      transform: isActive ? 'translateY(-2px)' : 'translateY(0)',
                    }}
                  >
                    {t(`items.${year}.phase`)}
                  </h3>
                  <p
                    className="text-sm leading-relaxed mt-auto transition-[color] duration-200 ease-out"
                    style={{
                      color: isActive ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.35)',
                    }}
                  >
                    {t(`items.${year}.description`)}
                  </p>
                </m.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
