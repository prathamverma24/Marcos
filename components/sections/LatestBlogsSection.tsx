import { getHomepageBlogs } from '../../lib/blog-data'
import ButtonLink from '../ui/ButtonLink'
import Reveal from '../ui/Reveal'
import SectionHeading from '../ui/SectionHeading'
import HomeBlogSlider from './HomeBlogSlider'

export default async function LatestBlogsSection() {
  const latestBlogs = await getHomepageBlogs(6)

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
        <HomeBlogSlider blogs={latestBlogs} />
      </div>
    </section>
  )
}
