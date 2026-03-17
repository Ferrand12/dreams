import dynamic from 'next/dynamic';
import Navigation from '@/components/navigation';
import HeroSection from '@/components/sections/hero-section';
import ManifestoSection from '@/components/sections/manifesto-section';
import FooterSection from '@/components/sections/footer-section';
import SkipToContent from '@/components/skip-to-content';
import Script from 'next/script';

// Lazy load below-the-fold sections for better initial load performance
const ServicesSection = dynamic(() => import('@/components/sections/services-section'), {
  loading: () => <div className="min-h-screen bg-white" />,
});
const PortfolioSection = dynamic(() => import('@/components/sections/portfolio-section'), {
  loading: () => (
    <div className="bg-[#0A0A0A]">
      <div className="px-6 md:px-12 lg:px-16 pt-24 md:pt-32 pb-16 md:pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="h-3 w-24 bg-white/5 animate-pulse mb-6" />
          <div className="h-12 w-96 max-w-full bg-white/5 animate-pulse mb-4" />
          <div className="h-4 w-64 bg-white/[0.03] animate-pulse" />
        </div>
      </div>
      <div className="h-screen bg-[#121212]" />
    </div>
  ),
});
const TimelineSection = dynamic(() => import('@/components/sections/timeline-section'), {
  loading: () => <div className="min-h-[30vh] bg-surface-light-1" />,
});
const FAQSection = dynamic(() => import('@/components/sections/faq-section'), {
  loading: () => <div className="min-h-[50vh] bg-white" />,
});
const CTASection = dynamic(() => import('@/components/sections/cta-section'), {
  loading: () => <div className="min-h-[30vh] bg-black" />,
});

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://preview.dreeeams.com';

  // WebPage structured data for SEO
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${baseUrl}/${locale}#webpage`,
    url: `${baseUrl}/${locale}`,
    name: locale === 'es'
      ? 'Dreeeams - Agencia Desarrollo Web y Apps Móviles'
      : 'Dreeeams - Web & Mobile App Development Agency',
    description: locale === 'es'
      ? 'Agencia experta en desarrollo web. Apps web, móviles y SaaS con React, Next.js y React Native. Entrega rápida y resultados comprobados.'
      : 'Expert web development agency. Custom web apps, mobile apps, and SaaS solutions with React, Next.js & React Native. Fast delivery, proven results.',
    inLanguage: locale === 'es' ? 'es-ES' : 'en-US',
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${baseUrl}#website`,
    },
    about: {
      '@type': 'Thing',
      name: locale === 'es' ? 'Desarrollo Web y Móvil' : 'Web and Mobile Development',
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: locale === 'es' ? 'Inicio' : 'Home',
          item: `${baseUrl}/${locale}`,
        },
      ],
    },
    mainEntity: {
      '@type': 'SoftwareApplication',
      name: 'Dreeeams',
      applicationCategory: 'WebApplication',
      offers: {
        '@type': 'AggregateOffer',
        offerCount: 4,
        offers: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: locale === 'es' ? 'Desarrollo Web' : 'Web Development',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: locale === 'es' ? 'Desarrollo Móvil' : 'Mobile Development',
            },
          },
        ],
      },
    },
  };
  return (
    <>
      {/* WebPage structured data for SEO */}
      <Script
        id="webpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />

      <div className="min-h-screen bg-background-light">
        <SkipToContent />
        <Navigation />
        <main id="main-content" className="relative">
          {/* Hero as fixed background */}
          <div className="fixed top-0 left-0 w-full h-screen z-0">
            <HeroSection />
          </div>

          {/* Content that scrolls over hero */}
          <div className="relative z-10 mt-[100vh]">
            <ServicesSection />
            <ManifestoSection />
            <PortfolioSection />
            <TimelineSection />
            <CTASection />
            <FAQSection />
            <FooterSection />
          </div>
        </main>
      </div>
    </>
  );
}
