import { revalidatePath } from 'next/cache'

export function revalidatePublicBlogPaths(...slugs: Array<string | null | undefined>) {
  revalidatePath('/')
  revalidatePath('/blog')
  revalidatePath('/blog/[slug]', 'page')
  revalidatePath('/sitemap.xml')

  slugs
    .filter((slug): slug is string => Boolean(slug))
    .forEach((slug) => {
      revalidatePath(`/blog/${slug}`)
    })
}
