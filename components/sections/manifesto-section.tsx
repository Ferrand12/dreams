'use client';

import { useRef, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { m } from 'framer-motion';
import Logo from '@/components/logo';

// ---------------------------------------------------------------------------
// TypeWriter — character-by-character reveal with blinking cursor
// ---------------------------------------------------------------------------
function TypeWriter({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [cursorVisible, setCursorVisible] = useState(true);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    let i = 0;
    const speed = 35;

    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setTimeout(() => setShowCursor(false), 2000);
        }
      }, speed);
    }, 500);

    return () => clearTimeout(timeout);
  }, [text]);

  useEffect(() => {
    if (!showCursor) return;
    const blink = setInterval(() => setCursorVisible((v) => !v), 530);
    return () => clearInterval(blink);
  }, [showCursor]);

  return (
    <span className="inline">
      {displayed}
      {showCursor && (
        <span
          className="inline-block w-[3px] h-[0.8em] bg-white/60 ml-1 align-baseline translate-y-[0.05em]"
          style={{ opacity: cursorVisible ? 1 : 0, transition: 'opacity 0.1s' }}
        />
      )}
    </span>
  );
}

// ---------------------------------------------------------------------------
// ManifestoSection
// ---------------------------------------------------------------------------
export default function ManifestoSection() {
  const t = useTranslations('manifesto');

  const principles = t.raw('principles') as { title: string; description: string }[];
  const headlineFull = t('headlineFull');

  return (
    <section className="relative z-10 py-24 md:py-32 px-6 md:px-12 bg-black">
      <div className="max-w-5xl mx-auto">
        {/* Logo identity anchor */}
        <m.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex justify-center mb-16 md:mb-20"
        >
          <Logo className="h-8 md:h-10 w-auto" fill="white" />
        </m.div>

        {/* Typing headline */}
        <m.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-nostalgic text-3xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.15] tracking-tight text-white text-center mb-24 md:mb-32"
        >
          <TypeWriter text={headlineFull} />
        </m.h2>

        {/* Principles grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {principles.map((principle, index) => (
            <m.div
              key={index}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group border border-white/10 hover:border-white/20 overflow-hidden transition-all duration-500 hover:-translate-y-0.5"
            >
              {/* Grid texture layer */}
              <div
                className="size-full"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }}
              >
                {/* Gradient overlay */}
                <div className="size-full bg-gradient-to-tr from-black/95 via-black/70 to-black/40">
                  <div className="p-7 md:p-10">
                    <span className="block text-2xl md:text-3xl font-mono font-bold tracking-tight text-white/15 mb-5">
                      0{index + 1}
                    </span>
                    <h3 className="text-xl md:text-2xl font-nostalgic font-bold text-white mb-3 group-hover:text-white/95 transition-colors duration-300">
                      {principle.title}
                    </h3>
                    <p className="text-sm md:text-base leading-relaxed text-white/45 group-hover:text-white/60 transition-colors duration-300">
                      {principle.description}
                    </p>
                  </div>
                </div>
              </div>
            </m.div>
          ))}
        </div>

      </div>
    </section>
  );
}
