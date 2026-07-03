import { NextResponse } from 'next/server'
import { getPublishedBlogBySlug } from '../../../../lib/blog-data'

export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  const blog = await getPublishedBlogBySlug(params.slug)

  if (!blog) {
    return NextResponse.json({ success: false, error: 'Blog not found' }, { status: 404 })
  }

  return NextResponse.json({ success: true, blog })
}
