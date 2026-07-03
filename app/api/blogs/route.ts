import { NextResponse } from 'next/server'
import { getPublishedBlogs } from '../../../lib/blog-data'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')?.trim().toLowerCase() || ''
  const category = searchParams.get('category')?.trim() || 'all'
  const blogs = await getPublishedBlogs()

  const filteredBlogs = blogs.filter((blog) => {
    const categoryMatch = category === 'all' || blog.category.slug === category
    const searchText = [blog.title, blog.excerpt, blog.category.name, blog.keywords.join(' ')].join(' ').toLowerCase()
    return categoryMatch && (!query || searchText.includes(query))
  })

  return NextResponse.json({ success: true, blogs: filteredBlogs })
}
