import { ArrowRight, CalendarDays, Clock } from 'lucide-react'
import type { PublicBlog } from '../../lib/blog-data'
import Reveal from './Reveal'
import SiteImage from './SiteImage'

type BlogCardProps = {
  blog: PublicBlog
  index?: number
}

export default function BlogCard({ blog, index = 0 }: BlogCardProps) {
  return (
    <Reveal delay={index * 0.04}>
      <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-cyan-900/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
        <a href={`/blog/${blog.slug}`} className="relative aspect-[16/10] overflow-hidden bg-slate-100">
          <SiteImage
            src={blog.featuredImage}
            alt={blog.imageAlt}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
          />
          <span className="absolute left-3 top-3 rounded-md bg-white/90 px-3 py-1 text-xs font-semibold text-cyan-800 shadow-sm">
            {blog.category.name}
          </span>
        </a>
        <div className="flex flex-1 flex-col p-5">
          <div className="flex flex-wrap gap-3 text-xs font-semibold text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays size={14} aria-hidden="true" />
              {new Date(blog.publishedAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock size={14} aria-hidden="true" />
              {blog.readTime}
            </span>
          </div>
          <h3 className="mt-4 text-xl font-semibold leading-snug text-slate-950">
            <a href={`/blog/${blog.slug}`} className="transition hover:text-cyan-800">
              {blog.title}
            </a>
          </h3>
          <p className="mt-3 flex-1 text-sm leading-6 text-slate-700">{blog.excerpt}</p>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{blog.authorName}</p>
          <a
            href={`/blog/${blog.slug}`}
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-700 transition group-hover:text-cyan-900"
          >
            Read More
            <ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>
      </article>
    </Reveal>
  )
}
