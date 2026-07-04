'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { useRef } from 'react'
import type { PublicBlog } from '../../lib/blog-data'
import { cn } from '../../lib/utils'
import BlogCard from '../ui/BlogCard'

export default function HomeBlogSlider({ blogs }: { blogs: PublicBlog[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: -1 | 1) => {
    const scroller = scrollerRef.current

    if (!scroller) {
      return
    }

    scroller.scrollBy({
      left: direction * Math.max(320, scroller.clientWidth * 0.82),
      behavior: 'smooth',
    })
  }

  if (blogs.length === 0) {
    return null
  }

  return (
    <div className="mt-10">
      <div className="mb-4 flex justify-end gap-2">
        <SliderButton label="Previous blogs" onClick={() => scroll(-1)}>
          <ChevronLeft size={18} aria-hidden="true" />
        </SliderButton>
        <SliderButton label="Next blogs" onClick={() => scroll(1)}>
          <ChevronRight size={18} aria-hidden="true" />
        </SliderButton>
      </div>
      <div
        ref={scrollerRef}
        className="flex snap-x gap-5 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {blogs.map((blog, index) => (
          <div
            key={blog.slug}
            className="w-[min(86vw,360px)] shrink-0 snap-start md:w-[calc((100%_-_20px)/2)] xl:w-[calc((100%_-_40px)/3)]"
          >
            <BlogCard blog={blog} index={index} />
          </div>
        ))}
      </div>
    </div>
  )
}

function SliderButton({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn(
        'grid h-10 w-10 place-items-center rounded-md border border-slate-200 bg-white text-slate-700 shadow-sm transition',
        'hover:border-cyan-400 hover:text-cyan-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-100',
      )}
    >
      {children}
    </button>
  )
}
