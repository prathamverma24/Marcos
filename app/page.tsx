import FloatingActions from '../components/layout/FloatingActions'
import Footer from '../components/layout/Footer'
import HashScroller from '../components/layout/HashScroller'
import Header from '../components/layout/Header'
import AboutSection from '../components/sections/AboutSection'
import ContactSection from '../components/sections/ContactSection'
import FAQSection from '../components/sections/FAQSection'
import GallerySection from '../components/sections/GallerySection'
import HeroSection from '../components/sections/HeroSection'
import HowItWorksSection from '../components/sections/HowItWorksSection'
import LatestBlogsSection from '../components/sections/LatestBlogsSection'
import ProductExplainer from '../components/sections/ProductExplainer'
import ProductShowcase from '../components/sections/ProductShowcase'
import TrustSection from '../components/sections/TrustSection'
import VisualExperience from '../components/sections/VisualExperience'
import WhyChooseSection from '../components/sections/WhyChooseSection'
import { products } from '../data/services'
import { siteData } from '../data/site'

export const dynamic = 'force-dynamic'

export default function HomePage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: siteData.companyName,
    url: siteData.canonicalUrl,
    email: siteData.contact.email,
    ...(siteData.contact.phone ? { telephone: siteData.contact.phone } : {}),
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteData.contact.address,
      addressLocality: 'New Delhi',
      addressRegion: 'Delhi',
      postalCode: '110080',
      addressCountry: 'IN',
    },
    areaServed: ['New Delhi', 'Delhi NCR', 'India'],
    makesOffer: products.map((product) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: product.title,
        description: product.details,
      },
    })),
  }

  return (
    <>
      <HashScroller />
      <Header />
      <main className="bg-[#f5fbff] text-slate-950">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <HeroSection />
        <AboutSection />
        <ProductShowcase />
        <ProductExplainer />
        <VisualExperience />
        <HowItWorksSection />
        <WhyChooseSection />
        <GallerySection />
        <LatestBlogsSection />
        <TrustSection />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
      <FloatingActions />
    </>
  )
}
