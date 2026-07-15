import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowLeft, CalendarDays, Clock, Tag } from 'lucide-react'
import FloatingActions from '../../../components/layout/FloatingActions'
import Footer from '../../../components/layout/Footer'
import Header from '../../../components/layout/Header'
import BlogCard from '../../../components/ui/BlogCard'
import ButtonLink from '../../../components/ui/ButtonLink'
import RichTextRenderer from '../../../components/ui/RichTextRenderer'
import SiteImage from '../../../components/ui/SiteImage'
import { getPublishedBlogBySlug, getRelatedPublishedBlogs } from '../../../lib/blog-data'
import { siteData } from '../../../data/site'

export const dynamic = 'force-dynamic'

type BlogDetailPageProps = {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const blog = await getPublishedBlogBySlug(params.slug)

  if (!blog) {
    return {
      title: 'Blog Not Found',
    }
  }

  return {
    title: blog.seoTitle || blog.title,
    description: blog.metaDescription || blog.excerpt,
    keywords: blog.keywords,
    alternates: {
      canonical: `/blog/${blog.slug}`,
    },
    openGraph: {
      title: blog.seoTitle || blog.title,
      description: blog.metaDescription || blog.excerpt,
      url: `${siteData.canonicalUrl}/blog/${blog.slug}`,
      type: 'article',
      publishedTime: blog.publishedAt,
      modifiedTime: blog.updatedAt,
      authors: [blog.authorName],
      section: blog.category.name,
      tags: blog.keywords,
      images: [
        {
          url: blog.featuredImage,
          width: 1200,
          height: 630,
          alt: blog.imageAlt,
        },
      ],
    },
  }
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const blog = await getPublishedBlogBySlug(params.slug)

  if (!blog) {
    notFound()
  }

  const relatedBlogs = await getRelatedPublishedBlogs(blog)

  return (
    <>
      <Header />
      <main className="bg-[#f5fbff] pt-28 text-slate-950 md:pt-36">
        <article>
          <header className="section-band px-5 py-14 lg:px-8">
            <div className="mx-auto max-w-5xl">
              <a href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-700 hover:text-cyan-900">
                <ArrowLeft size={16} aria-hidden="true" />
                Back to Blog
              </a>
              <p className="mt-8 inline-flex items-center gap-2 rounded-md bg-cyan-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-800">
                <Tag size={14} aria-hidden="true" />
                {blog.category.name}
              </p>
              <h1 className="mt-5 text-4xl font-semibold leading-tight text-slate-950 md:text-6xl">{blog.title}</h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-700">{blog.excerpt}</p>
              <div className="mt-6 flex flex-wrap gap-4 text-sm font-semibold text-slate-600">
                <span>{blog.authorName}</span>
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays size={16} aria-hidden="true" />
                  {new Date(blog.publishedAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock size={16} aria-hidden="true" />
                  {blog.readTime}
                </span>
              </div>
            </div>
          </header>

          <div className="bg-white px-5 py-10 lg:px-8">
            <div className="mx-auto max-w-5xl">
              <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-slate-100 shadow-[0_20px_70px_rgba(8,145,178,0.12)]">
                <SiteImage
                  src={blog.featuredImage}
                  alt={blog.imageAlt}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              <div className="mt-10">
                <RichTextRenderer content={blog.content} />

                <section className="prose-water mx-auto mt-8 max-w-3xl">
                  <h2>Related Search Topics</h2>
                  <p>
                    This guide is related to {blog.keywords.join(', ')} and other water treatment solution planning needs.
                  </p>
                </section>
              </div>
            </div>
          </div>
        </article>

        <section className="section-band px-5 py-16 lg:px-8">
          <div className="mx-auto grid max-w-5xl gap-6 rounded-lg border border-cyan-900/10 bg-white p-6 shadow-sm md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-700">Consultation</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">Need a water solution for your business?</h2>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                Share your requirement and Marcos Water Solutions can help you plan the right RO, STP/ETP, softener, or service path.
              </p>
            </div>
            <ButtonLink href="/#products">Book Consultation</ButtonLink>
          </div>
        </section>

        {relatedBlogs.length > 0 ? (
          <section className="bg-white px-5 py-16 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <h2 className="text-3xl font-semibold text-slate-950">Related blogs</h2>
              <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {relatedBlogs.map((item, index) => (
                  <BlogCard key={item.slug} blog={item} index={index} />
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </main>
      <Footer />
      <FloatingActions />
    </>
  )
}
