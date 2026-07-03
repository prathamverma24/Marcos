import { getPublishedBlogs } from '../../lib/blog-data'
import BlogCard from '../ui/BlogCard'
import ButtonLink from '../ui/ButtonLink'
import Reveal from '../ui/Reveal'
import SectionHeading from '../ui/SectionHeading'

export default async function LatestBlogsSection() {
  const latestBlogs = (await getPublishedBlogs()).slice(0, 3)

  return (
    <section id="blog-preview" className="bg-white px-5 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <Reveal>
            <SectionHeading
              eyebrow="Latest Blogs"
              title="Water treatment blogs and guides"
              description="Educational guides for RO plants, STP/ETP systems, water softeners, industrial water treatment, and maintenance planning."
            />
          </Reveal>
          <Reveal delay={0.08}>
            <ButtonLink href="/blog" variant="ghost">
              View All Blogs
            </ButtonLink>
          </Reveal>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {latestBlogs.map((blog, index) => (
            <BlogCard key={blog.slug} blog={blog} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
