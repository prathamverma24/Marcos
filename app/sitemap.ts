import type { MetadataRoute } from 'next'
import { getPublishedBlogs } from '../lib/blog-data'
import { siteData } from '../data/site'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteData.canonicalUrl.replace(/\/$/, '')
  const blogs = await getPublishedBlogs()

  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date('2026-07-03'),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date('2026-07-03'),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...blogs.map((blog) => ({
      url: `${baseUrl}/blog/${blog.slug}`,
      lastModified: new Date(blog.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
