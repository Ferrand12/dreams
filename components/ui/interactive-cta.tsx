"use client";

import { useRef, useState, useCallback } from "react";
import { motion, useAnimation } from "framer-motion";
import { Plus } from "lucide-react";
import Link from "next/link";

interface InteractiveCTAProps {
  heading: string;
  description: string;
  buttonText: string;
  href: string;
}

const PARTICLE_COUNT = 24;

export function InteractiveCTA({
  heading,
  description,
  buttonText,
  href,
}: InteractiveCTAProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const particlesControl = useAnimation();
  const [isHovering, setIsHovering] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const [particles] = useState(() =>
    Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      id: i,
      left: 5 + Math.random() * 90,
      top: 15 + Math.random() * 80,
      size: 1.5 + Math.random() * 1.5,
    }))
  );

  const getButtonTarget = useCallback(() => {
    if (!containerRef.current || !buttonRef.current) return null;
    const cr = containerRef.current.getBoundingClientRect();
    const br = buttonRef.current.getBoundingClientRect();
    return {
      x: br.left + br.width / 2 - cr.left,
      y: br.top + br.height / 2 - cr.top,
      cw: cr.width,
      ch: cr.height,
    };
  }, []);

  const getProximity = useCallback(
    (
      i: number,
      target: { x: number; y: number; cw: number; ch: number }
    ) => {
      const px = (particles[i].left / 100) * target.cw;
      const py = (particles[i].top / 100) * target.ch;
      const dx = target.x - px;
      const dy = target.y - py;
      const maxDist = Math.sqrt(target.cw ** 2 + target.ch ** 2);
      return Math.sqrt(dx ** 2 + dy ** 2) / maxDist;
    },
    [particles]
  );

  const handleHoverStart = useCallback(() => {
    const target = getButtonTarget();
    if (!target) return;
    setIsHovering(true);

    particlesControl.start((i) => {
      const px = (particles[i].left / 100) * target.cw;
      const py = (particles[i].top / 100) * target.ch;
      const proximity = getProximity(i, target);
      const pullFactor = 0.5 + (1 - proximity) * 0.35;
      const opacity = 0.4 + (1 - proximity) * 0.5;
      const scale = 1 + (1 - proximity) * 0.8;

      return {
        x: (target.x - px) * pullFactor,
        y: (target.y - py) * pullFactor,
        opacity,
        scale,
        transition: {
          type: "spring",
          stiffness: 20 + (1 - proximity) * 30,
          damping: 18,
          delay: proximity * 0.15,
        },
      };
    });
  }, [particlesControl, particles, getButtonTarget, getProximity]);

  const handleHoverEnd = useCallback(() => {
    setIsHovering(false);
    setIsPressed(false);
    particlesControl.start((i) => ({
      x: 0,
      y: 0,
      opacity: 0.3,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 40,
        damping: 18,
        delay: i * 0.008,
      },
    }));
  }, [particlesControl]);

  const handleMouseDown = useCallback(() => {
    const target = getButtonTarget();
    if (!target) return;
    setIsPressed(true);

    particlesControl.start((i) => {
      const px = (particles[i].left / 100) * target.cw;
      const py = (particles[i].top / 100) * target.ch;
      return {
        x: (target.x - px) * 0.95 + (Math.random() - 0.5) * 6,
        y: (target.y - py) * 0.95 + (Math.random() - 0.5) * 6,
        opacity: 0.9,
        scale: 0.5,
        transition: {
          type: "spring",
          stiffness: 80,
          damping: 14,
        },
      };
    });
  }, [particlesControl, particles, getButtonTarget]);

  return (
    <div className="relative mx-auto max-w-3xl">
      {/* Corner marks */}
      <Plus
        className="absolute -top-3 -left-3 z-10 h-6 w-6 text-white/20"
        strokeWidth={1}
      />
      <Plus
        className="absolute -top-3 -right-3 z-10 h-6 w-6 text-white/20"
        strokeWidth={1}
      />
      <Plus
        className="absolute -bottom-3 -left-3 z-10 h-6 w-6 text-white/20"
        strokeWidth={1}
      />
      <Plus
        className="absolute -bottom-3 -right-3 z-10 h-6 w-6 text-white/20"
        strokeWidth={1}
      />

      {/* Vertical side rules */}
      <div className="pointer-events-none absolute -inset-y-6 left-0 w-px border-l border-overlay-border-light" />
      <div className="pointer-events-none absolute -inset-y-6 right-0 w-px border-r border-overlay-border-light" />

      {/* Center dashed rule */}
      <div className="pointer-events-none absolute top-0 left-1/2 h-full border-l border-dashed border-overlay-border-light opacity-50" />

      {/* Main container */}
      <div
        ref={containerRef}
        className="relative overflow-hidden border-y border-overlay-border-light bg-[radial-gradient(35%_80%_at_25%_0%,rgba(255,255,255,0.04),transparent)] px-6 py-12"
      >
        {/* Particle field */}
        <div className="pointer-events-none absolute inset-0">
          {particles.map((p, i) => (
            <motion.div
              key={p.id}
              custom={i}
              initial={{ x: 0, y: 0, opacity: 0.3, scale: 1 }}
              animate={particlesControl}
              style={{
                left: `${p.left}%`,
                top: `${p.top}%`,
                width: p.size,
                height: p.size,
              }}
              className="absolute rounded-full bg-white"
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 space-y-6">
          <div className="space-y-2">
            <h2 className="heading-xl text-center">{heading}</h2>
            <p className="mx-auto max-w-2xl text-center text-lg text-muted">
              {description}
            </p>
          </div>

          <div className="relative flex justify-center">
            {/* Magnetic field glow */}
            <div
              className={`pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${
                isHovering ? "opacity-100" : "opacity-0"
              }`}
              style={{
                width: "320px",
                height: "140px",
                background: isPressed
                  ? "radial-gradient(ellipse at center, rgba(255,255,255,0.14) 0%, transparent 70%)"
                  : "radial-gradient(ellipse at center, rgba(255,255,255,0.08) 0%, transparent 70%)",
              }}
            />

            <Link
              ref={buttonRef}
              href={href}
              onMouseEnter={handleHoverStart}
              onMouseLeave={handleHoverEnd}
              onMouseDown={handleMouseDown}
              className={`relative inline-flex items-center gap-3 px-8 py-4 font-medium transition-all duration-300 ${
                isPressed
                  ? "bg-white text-black scale-[0.97] shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                  : isHovering
                    ? "bg-white text-black scale-[1.03] shadow-[0_0_24px_rgba(255,255,255,0.15)]"
                    : "bg-white text-black"
              }`}
            >
              {buttonText}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
