'use client'

import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { PublicBlog } from '../../lib/blog-data'
import { cn } from '../../lib/utils'
import BlogCard from '../ui/BlogCard'

type BlogCategory = {
  name: string
  slug: string
}

export default function BlogListing({ blogs, categories }: { blogs: PublicBlog[]; categories: BlogCategory[] }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')

  const filteredBlogs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return blogs.filter((blog) => {
      const categoryMatch = category === 'all' || blog.category.slug === category
      const searchText = [blog.title, blog.excerpt, blog.category.name, blog.keywords.join(' ')].join(' ').toLowerCase()
      return categoryMatch && (!normalizedQuery || searchText.includes(normalizedQuery))
    })
  }, [blogs, category, query])

  return (
    <section className="bg-white px-5 py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <label className="relative block">
            <span className="sr-only">Search blogs</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search RO, STP, ETP, water softener..."
              className="min-h-12 w-full rounded-md border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
            />
          </label>
          <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Blog category filters">
            {categories.map((item) => (
              <button
                key={item.slug}
                type="button"
                onClick={() => setCategory(item.slug)}
                className={cn(
                  'min-h-11 shrink-0 rounded-md border px-4 py-2 text-sm font-semibold transition',
                  category === item.slug
                    ? 'border-cyan-600 bg-cyan-600 text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-cyan-400 hover:text-cyan-800',
                )}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredBlogs.map((blog, index) => (
            <BlogCard key={blog.slug} blog={blog} index={index} />
          ))}
        </div>

        {filteredBlogs.length === 0 ? (
          <div className="mt-10 rounded-lg border border-slate-200 bg-slate-50 p-8 text-center">
            <p className="text-lg font-semibold text-slate-950">No blogs found</p>
            <p className="mt-2 text-sm text-slate-600">Try another keyword or category.</p>
          </div>
        ) : null}
      </div>
    </section>
  )
}
