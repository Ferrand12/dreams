import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import Navigation from '@/components/navigation';
import FooterSection from '@/components/sections/footer-section';
import { CaseStudyPage } from '@/components/sections/case-study/case-study-page';
import { getProjectBySlug, getNextProject, getAllProjectSlugs } from '@/lib/portfolio';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://preview.dreeeams.com';

export async function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) return {};

  const t = await getTranslations('caseStudy.meta');
  const tPortfolio = await getTranslations('portfolio');

  const title = `${project.titleKey} ${t('titleSuffix')}`;
  const description = project.impactLineKey
    ? `${t('descriptionPrefix')} ${tPortfolio(project.impactLineKey)}`
    : `${t('descriptionPrefix')} ${project.titleKey}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/work/${slug}`,
      type: 'website',
    },
  };
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) notFound();

  const nextProject = getNextProject(project.slug);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main id="main-content">
        <CaseStudyPage
          project={project}
          nextProject={nextProject}
          locale={locale}
        />
      </main>
      <FooterSection />
    </div>
  );
}
