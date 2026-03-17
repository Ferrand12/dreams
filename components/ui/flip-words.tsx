"use client";
import React, { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export const FlipWords = ({
  words,
  duration = 2800,
  className,
}: {
  words: string[];
  duration?: number;
  className?: string;
}) => {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  const advance = useCallback(() => {
    setVisible(false);
    setTimeout(() => {
      setIndex((prev) => (prev + 1) % words.length);
      setVisible(true);
    }, 200);
  }, [words.length]);

  useEffect(() => {
    const timer = setTimeout(advance, duration);
    return () => clearTimeout(timer);
  }, [index, duration, advance]);

  return (
    <span className={cn("relative inline-flex items-baseline", className)}>
      {/* Invisible spacer — widest word sets stable width */}
      <span className="invisible whitespace-nowrap" aria-hidden="true">
        {words.reduce((a, b) => (a.length >= b.length ? a : b))}
      </span>
      {/* Active word — crossfade, no layout shift */}
      <span
        className="absolute inset-0 flex items-baseline justify-start whitespace-nowrap transition-opacity duration-200 ease-out"
        style={{ opacity: visible ? 1 : 0 }}
        aria-live="polite"
      >
        {words[index]}
      </span>
    </span>
  );
};
