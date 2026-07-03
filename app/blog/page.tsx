import type { Metadata } from 'next'
import FloatingActions from '../../components/layout/FloatingActions'
import Footer from '../../components/layout/Footer'
import Header from '../../components/layout/Header'
import BlogListing from '../../components/sections/BlogListing'
import SectionHeading from '../../components/ui/SectionHeading'
import { getPublishedBlogCategories, getPublishedBlogs } from '../../lib/blog-data'
import { siteData } from '../../data/site'

export const metadata: Metadata = {
  title: 'Water Treatment Blogs & Guides',
  description:
    'Read SEO-focused guides about RO plants, STP/ETP systems, water softeners, wastewater treatment, maintenance, and clean water solutions.',
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: 'Water Treatment Blogs & Guides | Marcos Water Solutions',
    description:
      'Guides about industrial RO plants, STP/ETP systems, water softeners, wastewater treatment, and clean water solutions.',
    url: `${siteData.canonicalUrl}/blog`,
    type: 'website',
    images: [
      {
        url: '/images/blog-industrial-ro.jpg',
        width: 1200,
        height: 630,
        alt: 'Water treatment blogs by Marcos Water Solutions',
      },
    ],
  },
}

export default async function BlogPage() {
  const [blogs, categories] = await Promise.all([
    getPublishedBlogs(),
    getPublishedBlogCategories(),
  ])

  return (
    <>
      <Header />
      <main className="bg-[#f5fbff] pt-28 text-slate-950 md:pt-36">
        <section className="section-band px-5 py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Blog"
              title="Water Treatment Blogs & Guides"
              description="Helpful articles for customers comparing RO plants, STP/ETP systems, water softeners, industrial water treatment, wastewater treatment, and maintenance support."
            />
          </div>
        </section>
        <BlogListing blogs={blogs} categories={categories} />
      </main>
      <Footer />
      <FloatingActions />
    </>
  )
}
