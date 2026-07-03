import type { ReactNode } from 'react'
import type { RichTextMark, RichTextNode } from '../../lib/blog-content'
import { safeExternalHref } from '../../lib/blog-content'

type RichTextRendererProps = {
  content: unknown
}

export default function RichTextRenderer({ content }: RichTextRendererProps) {
  const root = content as { content?: RichTextNode[] }
  const nodes = Array.isArray(root?.content) ? root.content : []

  return <div className="prose-water mx-auto max-w-3xl">{nodes.map((node, index) => renderBlock(node, index))}</div>
}

function renderBlock(node: RichTextNode, index: number): ReactNode {
  const children = renderChildren(node)

  switch (node.type) {
    case 'heading': {
      const level = typeof node.attrs?.level === 'number' ? node.attrs.level : 2

      if (level === 3) {
        return (
          <section key={index}>
            <h3 className="text-xl font-semibold text-slate-950">{children}</h3>
          </section>
        )
      }

      return (
        <section key={index}>
          <h2>{children}</h2>
        </section>
      )
    }
    case 'bulletList':
      return (
        <ul key={index} className="my-6 grid list-disc gap-2 pl-6">
          {node.content?.map((item, itemIndex) => renderBlock(item, itemIndex))}
        </ul>
      )
    case 'orderedList':
      return (
        <ol key={index} className="my-6 grid list-decimal gap-2 pl-6">
          {node.content?.map((item, itemIndex) => renderBlock(item, itemIndex))}
        </ol>
      )
    case 'listItem':
      return <li key={index}>{children}</li>
    case 'blockquote':
      return (
        <blockquote key={index} className="my-6 border-l-4 border-cyan-500 bg-cyan-50 p-4 text-slate-700">
          {children}
        </blockquote>
      )
    case 'codeBlock':
      return (
        <pre key={index} className="my-6 overflow-x-auto rounded-lg bg-slate-950 p-4 text-sm text-cyan-50">
          <code>{plainNodeText(node)}</code>
        </pre>
      )
    case 'image': {
      const src = typeof node.attrs?.src === 'string' ? node.attrs.src : ''
      const alt = typeof node.attrs?.alt === 'string' ? node.attrs.alt : 'Blog content image'

      if (!src) {
        return null
      }

      return (
        <figure key={index} className="my-8">
          <div className="overflow-hidden rounded-lg bg-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={alt} className="w-full object-cover" />
          </div>
        </figure>
      )
    }
    case 'horizontalRule':
      return <hr key={index} className="my-8 border-slate-200" />
    case 'paragraph':
    default:
      return <p key={index}>{children}</p>
  }
}

function renderChildren(node: RichTextNode) {
  return node.content?.map((child, index) => renderInline(child, index)) || null
}

function renderInline(node: RichTextNode, index: number): ReactNode {
  if (node.type === 'hardBreak') {
    return <br key={index} />
  }

  if (node.type !== 'text') {
    return renderBlock(node, index)
  }

  let child: ReactNode = node.text || ''

  node.marks?.forEach((mark) => {
    child = applyMark(child, mark, index)
  })

  return <span key={index}>{child}</span>
}

function applyMark(child: ReactNode, mark: RichTextMark, index: number) {
  switch (mark.type) {
    case 'bold':
      return <strong key={`bold-${index}`}>{child}</strong>
    case 'italic':
      return <em key={`italic-${index}`}>{child}</em>
    case 'code':
      return (
        <code key={`code-${index}`} className="rounded bg-slate-100 px-1.5 py-0.5 text-sm text-slate-900">
          {child}
        </code>
      )
    case 'link':
      return (
        <a
          key={`link-${index}`}
          href={safeExternalHref(mark.attrs?.href)}
          className="font-semibold text-cyan-700 underline-offset-4 hover:underline"
          target={typeof mark.attrs?.href === 'string' && mark.attrs.href.startsWith('http') ? '_blank' : undefined}
          rel={typeof mark.attrs?.href === 'string' && mark.attrs.href.startsWith('http') ? 'noreferrer' : undefined}
        >
          {child}
        </a>
      )
    default:
      return child
  }
}

function plainNodeText(node: RichTextNode) {
  const chunks: string[] = []

  const walk = (item: RichTextNode) => {
    if (item.text) {
      chunks.push(item.text)
    }

    item.content?.forEach(walk)
  }

  walk(node)
  return chunks.join('\n')
}
