'use client';

import { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { LazyIframe } from '@/components/ui/lazy-iframe';
import { cdnAssetUrl } from '@/lib/constants';

type Project = {
  titleKey: string;
  categoryKey: 'webApp' | 'mobileApp';
  descriptionKey: string;
  tags: string[];
  color: string;
  url?: string;
  mobileView?: boolean;
  isMockup?: boolean;
  mockupUrl?: string;
  isIcon?: boolean;
  rating?: {
    stars: number;
    reviews: number;
  };
  appStore?: boolean;
  downloads?: number;
  ticketsSold?: number;
  metrics?: {
    visitors?: string;
    visits?: string;
  };
};

interface ProjectCardProps {
  project: Project;
  index: number;
  tButtons: (key: string) => string;
  tLabels: (key: string) => string;
  tProjects: (key: string) => string;
}

export default function ProjectCard({ project, index, tButtons, tLabels, tProjects }: ProjectCardProps) {
  const [isActive, setIsActive] = useState(false);
  const fallbackMockup = cdnAssetUrl('hunt_mockup.png');
  const isPriority = index < 2;

  // Build project-specific metrics array
  const projectMetrics: { label: string; value: string }[] = [];
  if (project.ticketsSold) {
    projectMetrics.push({
      value: project.ticketsSold >= 1000 ? `${(project.ticketsSold / 1000).toFixed(0)}K+` : `${project.ticketsSold}+`,
      label: tLabels('ticketsSold'),
    });
  }
  if (project.rating) {
    projectMetrics.push({
      value: `${project.rating.stars}★`,
      label: `${project.rating.reviews}+ ${tLabels('reviews')}`,
    });
  }
  if (project.downloads) {
    projectMetrics.push({
      value: project.downloads >= 1000 ? `${(project.downloads / 1000).toFixed(0)}K+` : `${project.downloads}+`,
      label: tLabels('downloads'),
    });
  }
  if (project.appStore) {
    projectMetrics.push({
      value: '●',
      label: tLabels('appStore'),
    });
  }
  if (project.metrics?.visitors) {
    projectMetrics.push({
      value: tProjects(`${project.descriptionKey}.metrics.${project.metrics.visitors}`),
      label: tProjects(`${project.descriptionKey}.metrics.${project.metrics.visitors}Label`),
    });
  }
  if (project.metrics?.visits) {
    projectMetrics.push({
      value: tProjects(`${project.descriptionKey}.metrics.${project.metrics.visits}`),
      label: tProjects(`${project.descriptionKey}.metrics.${project.metrics.visits}Label`),
    });
  }

  // Check if project has case study data (problem/solution/result)
  let hasCaseStudy = false;
  try {
    tProjects(`${project.descriptionKey}.problem`);
    hasCaseStudy = true;
  } catch {
    hasCaseStudy = false;
  }

  const handleCardClick = () => {
    setIsActive((prev) => !prev);
  };

  return (
    <m.div
      key={project.titleKey}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      {/* Card container */}
      <div
        onClick={handleCardClick}
        className={`relative border-2 border-black transition-all duration-500 cursor-pointer ${
          isActive
            ? 'shadow-[0_12px_40px_rgb(0_0_0/0.25)]'
            : 'hover:-translate-y-1 hover:shadow-lg'
        }`}
      >
        {/* Image area — scales down subtly when active (adapted from PinContainer scale shift) */}
        <m.div
          animate={{ scale: isActive ? 0.97 : 1 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className={`aspect-[4/3] ${project.color} relative overflow-hidden`}
        >
          {/* Visual content: mockup, iframe, or fallback */}
          {project.isMockup ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white">
              {(project.mockupUrl || fallbackMockup) && (
                <Image
                  src={project.mockupUrl || fallbackMockup}
                  alt={`${project.titleKey} Mockup`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                  loading={isPriority ? 'eager' : 'lazy'}
                  priority={isPriority}
                  quality={80}
                />
              )}
            </div>
          ) : project.url ? (
            <LazyIframe
              src={`https://${project.url}`}
              title={project.titleKey}
              className="absolute inset-0 w-full h-full pointer-events-none border-0"
              mobileView={project.mobileView}
              delay={index * 300}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className={`text-6xl font-bold ${
                  project.color.includes('white') && !project.color.includes('dark')
                    ? 'text-black'
                    : 'text-white opacity-20'
                }`}
              >
                {index + 1}
              </div>
            </div>
          )}

          {/* Active overlay — dims image when expanded */}
          <m.div
            animate={{ opacity: isActive ? 0.4 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black pointer-events-none z-10"
          />

          {/* Category badge */}
          <div className={`absolute bottom-3 left-3 z-10 transition-opacity duration-200 ${
            isActive ? 'opacity-0' : ''
          }`}>
            <span className="text-xs font-bold bg-black text-white px-3 py-1">
              {tLabels(project.categoryKey)}
            </span>
          </div>
        </m.div>

        {/* Expansion panel — click to reveal (desktop only) */}
        <AnimatePresence>
          {isActive && (
            <m.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              className="overflow-hidden bg-black text-white hidden md:block"
            >
              <div className="p-6 space-y-4">
                <h3 className="text-lg font-bold font-nostalgic tracking-tight">
                  {project.titleKey}
                </h3>

                {hasCaseStudy ? (
                  <div className="space-y-3">
                    <div>
                      <span className="text-xs font-mono text-white/40 tracking-wider uppercase">{tLabels('problem')}</span>
                      <p className="text-sm leading-relaxed text-white/70 mt-1">{tProjects(`${project.descriptionKey}.problem`)}</p>
                    </div>
                    <div>
                      <span className="text-xs font-mono text-white/40 tracking-wider uppercase">{tLabels('solution')}</span>
                      <p className="text-sm leading-relaxed text-white/70 mt-1">{tProjects(`${project.descriptionKey}.solution`)}</p>
                    </div>
                    <div>
                      <span className="text-xs font-mono text-white/40 tracking-wider uppercase">{tLabels('result')}</span>
                      <p className="text-sm leading-relaxed text-white/70 mt-1">{tProjects(`${project.descriptionKey}.result`)}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed text-white/70 max-w-md">
                    {tProjects(`${project.descriptionKey}.description`)}
                  </p>
                )}

                {projectMetrics.length > 0 && (
                  <div className="flex flex-wrap gap-x-6 gap-y-2 pt-3 border-t border-white/10">
                    {projectMetrics.map((metric, idx) => (
                      <div key={idx}>
                        <span className="font-mono text-sm font-bold">{metric.value}</span>
                        <span className="text-white/40 text-xs ml-1.5">{metric.label}</span>
                      </div>
                    ))}
                  </div>
                )}

                <p className="text-xs font-mono text-white/30 tracking-wider">
                  {project.tags.join(' · ')}
                </p>

                {project.url && (
                  <a
                    href={`https://${project.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-2 text-sm font-medium text-white border border-white/30 hover:border-white hover:bg-white hover:text-black px-5 py-2.5 transition-all duration-200 w-fit"
                  >
                    {tButtons('viewProject')} →
                  </a>
                )}
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </div>

      {/* Project Info — below card */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xl md:text-2xl font-bold font-nostalgic">
            {project.titleKey}
          </h3>
          <div className="hidden md:flex items-center gap-3 text-xs text-muted-foreground font-mono">
            {project.tags.slice(0, 2).map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>

        {/* Mobile: description + metrics + link (always visible on touch devices) */}
        <div className="md:hidden space-y-3">
          {hasCaseStudy ? (
            <div className="space-y-2">
              <div>
                <span className="text-xs font-mono text-muted-foreground/60 tracking-wider uppercase">{tLabels('problem')}</span>
                <p className="text-sm text-muted-foreground leading-relaxed mt-0.5">{tProjects(`${project.descriptionKey}.problem`)}</p>
              </div>
              <div>
                <span className="text-xs font-mono text-muted-foreground/60 tracking-wider uppercase">{tLabels('solution')}</span>
                <p className="text-sm text-muted-foreground leading-relaxed mt-0.5">{tProjects(`${project.descriptionKey}.solution`)}</p>
              </div>
              <div>
                <span className="text-xs font-mono text-muted-foreground/60 tracking-wider uppercase">{tLabels('result')}</span>
                <p className="text-sm text-muted-foreground leading-relaxed mt-0.5">{tProjects(`${project.descriptionKey}.result`)}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {tProjects(`${project.descriptionKey}.description`)}
            </p>
          )}

          {projectMetrics.length > 0 && (
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {projectMetrics.map((metric, idx) => (
                <div key={idx} className="text-xs">
                  <span className="font-mono font-bold">{metric.value}</span>
                  <span className="text-muted-foreground ml-1">{metric.label}</span>
                </div>
              ))}
            </div>
          )}

          {project.url && (
            <a
              href={`https://${project.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-sm font-bold border-b-2 border-black hover:opacity-70 transition-opacity"
            >
              {tButtons('viewProject')} →
            </a>
          )}
        </div>
      </div>
    </m.div>
  );
}
