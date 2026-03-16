import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import Navigation from '@/components/navigation';
import FooterSection from '@/components/sections/footer-section';
import AboutContent from './about-content';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://preview.dreeeams.com';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations('about.meta');

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `${baseUrl}/${locale}/about`,
      type: 'website',
    },
  };
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#1E1E1E]">
      <Navigation />
      <main id="main-content">
        <AboutContent />
      </main>
      <FooterSection />
    </div>
  );
}
