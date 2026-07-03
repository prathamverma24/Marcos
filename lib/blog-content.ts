import type { Blog } from '../data/blogs'

export type RichTextMark = {
  type?: string
  attrs?: Record<string, unknown>
}

export type RichTextNode = {
  type?: string
  attrs?: Record<string, unknown>
  content?: RichTextNode[]
  marks?: RichTextMark[]
  text?: string
}

export type RichTextDocument = {
  type: 'doc'
  content: RichTextNode[]
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function legacyBlogToRichText(blog: Blog): RichTextDocument {
  return {
    type: 'doc',
    content: blog.content.flatMap((block) => [
      {
        type: 'heading',
        attrs: { level: 2 },
        content: [{ type: 'text', text: block.heading }],
      },
      {
        type: 'paragraph',
        content: [{ type: 'text', text: block.paragraph }],
      },
    ]),
  }
}

export function plainTextFromRichText(document: unknown) {
  const chunks: string[] = []

  const walk = (node: unknown) => {
    if (!node || typeof node !== 'object') {
      return
    }

    const current = node as RichTextNode

    if (current.text) {
      chunks.push(current.text)
    }

    current.content?.forEach(walk)
  }

  walk(document)
  return chunks.join(' ').replace(/\s+/g, ' ').trim()
}

export function estimateReadTime(document: unknown) {
  const wordCount = plainTextFromRichText(document).split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.ceil(wordCount / 180))
  return `${minutes} min read`
}

export function safeExternalHref(value: unknown) {
  if (typeof value !== 'string') {
    return '#'
  }

  if (
    value.startsWith('/') ||
    value.startsWith('#') ||
    value.startsWith('mailto:') ||
    value.startsWith('tel:') ||
    value.startsWith('https://') ||
    value.startsWith('http://')
  ) {
    return value
  }

  return '#'
}
