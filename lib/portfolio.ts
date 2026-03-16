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

// ── Project Registry ──
// Current projects migrated to new type. Editorial assignments are defaults —
// final roster, copy, and variant assignments are separate editorial decisions.

export const projects: Project[] = [
  {
    slug: 'perro-negro',
    titleKey: 'PERRO NEGRO',
    categoryKey: 'webPlatform',
    tags: ['Next.js', 'Stripe', 'PostgreSQL'],
    featured: true,
    teaserVariant: 'hero',
    order: 1,
    bgTheme: 'dark',
    proofType: 'metrics',
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
    slug: 'hunt-tickets',
    titleKey: 'HUNT TICKETS',
    categoryKey: 'mobileApp',
    tags: ['React Native', 'TypeScript', 'Firebase'],
    featured: true,
    teaserVariant: 'standard',
    order: 2,
    bgTheme: 'light',
    proofType: 'metrics',
    heroImage: 'hunt_mockup.png',
    impactLineKey: 'projects.huntTickets.impactLine',
    problemKey: 'projects.huntTickets.problem',
    solutionKey: 'projects.huntTickets.solution',
    resultKey: 'projects.huntTickets.result',
    metrics: [
      { value: '30K+', labelKey: 'metrics.ticketsSold' },
      { value: '4.3★', labelKey: 'metrics.appRating' },
      { value: '5K+', labelKey: 'metrics.downloads' },
    ],
  },
  {
    slug: 'amazonas-toures',
    titleKey: 'AMAZONAS TOURES',
    categoryKey: 'tourismPlatform',
    tags: ['Next.js', 'Tailwind', 'Supabase'],
    featured: true,
    teaserVariant: 'standard',
    order: 3,
    bgTheme: 'dark',
    proofType: 'visual',
    impactLineKey: 'projects.amazonasToures.impactLine',
    liveUrl: 'www.amazonas-toures.com',
  },
  {
    slug: 'maria-helena-amador',
    titleKey: 'MARÍA HELENA AMADOR',
    categoryKey: 'brandSite',
    tags: ['Next.js', 'Stripe', 'PostgreSQL'],
    featured: false,
    proofType: 'visual',
    mockupUrl: 'https://eeyjhkhrdoouapuilwep.supabase.co/storage/v1/object/public/content/mockup_mha.png',
    impactLineKey: 'projects.mariaHelena.impactLine',
    liveUrl: 'maria-helena-amador.hunt-tickets.com',
  },
  {
    slug: 'startup-mvp',
    titleKey: 'STARTUP MVP',
    categoryKey: 'saasProduct',
    tags: ['Next.js', 'Supabase', 'Stripe'],
    featured: false,
    proofType: 'narrative',
    impactLineKey: 'projects.startupMvp.impactLine',
    problemKey: 'projects.startupMvp.problem',
    solutionKey: 'projects.startupMvp.solution',
    resultKey: 'projects.startupMvp.result',
  },
  {
    slug: 'dtc-landing-system',
    titleKey: 'DTC LANDING SYSTEM',
    categoryKey: 'ecommerce',
    tags: ['Next.js', 'Tailwind', 'Analytics'],
    featured: false,
    proofType: 'narrative',
    impactLineKey: 'projects.ecommerceLanding.impactLine',
    problemKey: 'projects.ecommerceLanding.problem',
    solutionKey: 'projects.ecommerceLanding.solution',
    resultKey: 'projects.ecommerceLanding.result',
  },
];
