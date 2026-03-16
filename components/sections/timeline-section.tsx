'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { m } from 'framer-motion';
import { useTranslations } from 'next-intl';

const milestones = ['2023', '2024', '2025', '2026'] as const;

export default function TimelineSection() {
  const t = useTranslations('timeline');
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const autoRef = useRef<number>(0);
  const directionRef = useRef(1);

  // Auto-advance when not hovering
  useEffect(() => {
    let raf: number;
    const speed = 0.00015; // ~8s full sweep

    const tick = () => {
      if (!isHovering) {
        autoRef.current += speed * directionRef.current;
        if (autoRef.current >= 1) {
          autoRef.current = 1;
          directionRef.current = -1;
        } else if (autoRef.current <= 0) {
          autoRef.current = 0;
          directionRef.current = 1;
        }
        setProgress(autoRef.current);
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isHovering]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setProgress(x);
    autoRef.current = x;
  }, []);

  const handleMouseEnter = useCallback(() => setIsHovering(true), []);
  const handleMouseLeave = useCallback(() => setIsHovering(false), []);

  // Determine which milestone is closest to progress
  const activeIndex = Math.min(3, Math.floor(progress * 4 + 0.5));

  return (
    <section className="relative z-10 py-24 md:py-32 px-6 md:px-12 bg-surface-light-1">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
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

        {/* Interactive Timeline */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="relative"
        >
          {/* Progress line — desktop only */}
          <div className="hidden lg:block relative h-px bg-black/10 mb-0">
            {/* Highlight that tracks progress */}
            <div
              className="absolute top-0 h-px bg-black/40 transition-all duration-300 ease-out"
              style={{
                left: 0,
                width: `${progress * 100}%`,
              }}
            />
            {/* Glow dot at progress tip */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-black/50 transition-all duration-300 ease-out"
              style={{ left: `${progress * 100}%`, marginLeft: '-3px' }}
            />
          </div>

          {/* Timeline Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0">
            {milestones.map((year, index) => {
              const isActive = index === activeIndex;

              return (
                <m.div
                  key={year}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: index * 0.08 }}
                  className="border-t border-black/10 lg:border-t-0 lg:aspect-square flex flex-col p-6 md:p-8"
                >
                  <span
                    className="block text-sm font-mono tracking-wider mb-4 transition-all duration-500"
                    style={{ color: isActive ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.25)' }}
                  >
                    {year}
                  </span>
                  <h3
                    className="text-xl md:text-2xl font-nostalgic font-bold tracking-tight mb-3 transition-all duration-500"
                    style={{
                      opacity: isActive ? 1 : 0.65,
                      transform: isActive ? 'translateY(-2px)' : 'translateY(0)',
                    }}
                  >
                    {t(`items.${year}.phase`)}
                  </h3>
                  <p
                    className="text-sm leading-relaxed transition-all duration-500 mt-auto"
                    style={{ color: isActive ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.4)' }}
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
