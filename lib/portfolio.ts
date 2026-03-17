import type { Project, ContentState, ProjectCTA } from '@/types';
import { cdnAssetUrl } from '@/lib/constants';

// ── Content State Derivation ──

export function deriveContentState(project: Project): ContentState {
  if (project.editorialStateOverride) {
    return project.editorialStateOverride;
  }

  const hasImpactLine = Boolean(project.impactLineKey);
  const hasVisual = Boolean(project.heroImage || project.placeholderImage || project.mockupUrl);
  const hasNarrative = Boolean(project.problemKey && project.solutionKey && project.resultKey);

  // Published: impact line + visual + full narrative. Metrics are optional.
  if (hasImpactLine && hasVisual && hasNarrative) return 'published';
  if (hasVisual && (hasImpactLine || hasNarrative)) return 'preview';
  if (hasVisual) return 'coming-soon';
  return 'internal';
}

// ── CTA Resolution ──

export function resolveCTA(project: Project, state: ContentState): ProjectCTA | null {
  if (project.ctaOverride) return project.ctaOverride;

  if (state === 'published') {
    if (project.detailPageSlug) {
      return { type: 'caseStudy', labelKey: 'cta.viewCaseStudy', href: `/work/${project.detailPageSlug}` };
    }
    if (project.liveUrl) {
      return { type: 'liveSite', labelKey: 'cta.visitSite', href: `https://${project.liveUrl}` };
    }
    return null;
  }

  if (state === 'preview') {
    if (project.detailPageSlug) {
      return { type: 'caseStudy', labelKey: 'cta.viewCaseStudy', href: `/work/${project.detailPageSlug}` };
    }
    if (project.liveUrl) {
      return { type: 'liveSite', labelKey: 'cta.visitSite', href: `https://${project.liveUrl}` };
    }
    return null;
  }

  // coming-soon and internal: no CTA (component renders label if needed)
  return null;
}

// ── Image Resolution ──

export function resolveImageSrc(project: Project): string {
  if (project.heroImage) {
    const src = cdnAssetUrl(project.heroImage);
    if (src) return src;
  }
  if (project.placeholderImage) {
    const src = cdnAssetUrl(project.placeholderImage);
    if (src) return src;
  }
  if (project.mockupUrl) return project.mockupUrl;
  return '';
}

// ── Enriched Project Type ──

export type EnrichedProject = Project & {
  contentState: ContentState;
  cta: ProjectCTA | null;
  imageSrc: string;
};

// ── Featured Projects Helper ──

export function getFeaturedProjects(): EnrichedProject[] {
  return projects
    .filter((p) => p.featured)
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
    .map((p) => {
      const contentState = deriveContentState(p);
      return {
        ...p,
        contentState,
        cta: resolveCTA(p, contentState),
        imageSrc: resolveImageSrc(p),
      };
    })
    .filter((p) => p.contentState !== 'internal');
}

// ── Gallery Projects (fullscreen homepage reel) ──

export function getGalleryProjects(): EnrichedProject[] {
  return projects
    .filter((p) => p.galleryOrder !== undefined)
    .sort((a, b) => (a.galleryOrder ?? 99) - (b.galleryOrder ?? 99))
    .map((p) => {
      const contentState = deriveContentState(p);
      return {
        ...p,
        contentState,
        cta: resolveCTA(p, contentState),
        imageSrc: resolveImageSrc(p),
      };
    });
}

// ── Single Project Lookup ──

export function getProjectBySlug(slug: string): EnrichedProject | null {
  const project = projects.find((p) => p.slug === slug || p.detailPageSlug === slug);
  if (!project) return null;

  const contentState = deriveContentState(project);
  return {
    ...project,
    contentState,
    cta: resolveCTA(project, contentState),
    imageSrc: resolveImageSrc(project),
  };
}

// ── Next Project Navigation ──

export function getNextProject(currentSlug: string): EnrichedProject | null {
  const featured = getFeaturedProjects();
  const currentIndex = featured.findIndex((p) => p.slug === currentSlug);
  if (currentIndex === -1) return null;

  const nextIndex = (currentIndex + 1) % featured.length;
  return featured[nextIndex];
}

// ── Static Params ──

export function getAllProjectSlugs(): string[] {
  return projects
    .filter((p) => p.detailPageSlug)
    .map((p) => p.detailPageSlug!);
}

// ── Project Registry ──
// Current projects migrated to new type. Editorial assignments are defaults —
// final roster, copy, and variant assignments are separate editorial decisions.

export const projects: Project[] = [
  {
    slug: 'hunt-tickets',
    titleKey: 'HUNT TICKETS',
    categoryKey: 'mobileApp',
    tags: ['React Native', 'TypeScript', 'Firebase'],
    featured: true,
    segment: 'enterprise',
    galleryOrder: 1,
    galleryBg: '#121212',
    teaserVariant: 'hero',
    order: 1,
    bgTheme: 'dark',
    proofType: 'metrics',
    editorialStateOverride: 'published',
    detailPageSlug: 'hunt-tickets',
    heroImage: 'hunt_mockup.png',
    impactLineKey: 'projects.huntTickets.impactLine',
    problemKey: 'projects.huntTickets.problem',
    solutionKey: 'projects.huntTickets.solution',
    resultKey: 'projects.huntTickets.result',
    deliverablesKey: 'projects.huntTickets.deliverables',
    metrics: [
      { value: '30K+', labelKey: 'metrics.ticketsSold' },
      { value: '4.3★', labelKey: 'metrics.appRating' },
      { value: '5K+', labelKey: 'metrics.downloads' },
    ],
  },
  {
    slug: 'perro-negro',
    titleKey: 'PERRO NEGRO',
    categoryKey: 'webPlatform',
    tags: ['Next.js', 'Stripe', 'PostgreSQL'],
    featured: true,
    segment: 'enterprise',
    galleryOrder: 2,
    galleryBg: '#141820',
    teaserVariant: 'standard',
    order: 2,
    bgTheme: 'light',
    proofType: 'metrics',
    editorialStateOverride: 'published',
    detailPageSlug: 'perro-negro',
    heroImage: 'mockup_perro_negro.png',
    mockupUrl: '/images/mockup_perro_negro.png',
    impactLineKey: 'projects.perroNegro.impactLine',
    problemKey: 'projects.perroNegro.problem',
    solutionKey: 'projects.perroNegro.solution',
    resultKey: 'projects.perroNegro.result',
    liveUrl: 'perronegro.biotickets.com',
    metrics: [
      { value: '90K+', labelKey: 'metrics.uniqueVisitors' },
      { value: '105K+', labelKey: 'metrics.totalVisits' },
    ],
  },
  {
    slug: 'amazonas-toures',
    titleKey: 'AMAZONAS TOURES',
    categoryKey: 'tourismPlatform',
    tags: ['Next.js', 'Tailwind', 'Supabase'],
    featured: true,
    segment: 'enterprise',
    teaserVariant: 'standard',
    order: 3,
    bgTheme: 'dark',
    proofType: 'visual',
    editorialStateOverride: 'preview',
    detailPageSlug: 'amazonas-toures',
    impactLineKey: 'projects.amazonasToures.impactLine',
    liveUrl: 'www.amazonas-toures.com',
  },
  {
    slug: 'maria-helena-amador',
    titleKey: 'MARÍA HELENA AMADOR',
    categoryKey: 'brandSite',
    tags: ['Next.js', 'Framer Motion', 'Tailwind'],
    featured: false,
    segment: 'people',
    galleryOrder: 3,
    galleryBg: '#16141A',
    proofType: 'visual',
    editorialStateOverride: 'preview',
    mockupUrl: '/images/mockup_mha.jpeg',
    impactLineKey: 'projects.mariaHelena.impactLine',
    liveUrl: 'maria-helena-amador.hunt-tickets.com',
  },
];
