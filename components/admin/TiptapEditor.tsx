'use client'

import ImageExtension from '@tiptap/extension-image'
import LinkExtension from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Bold, Heading2, Heading3, ImageIcon, Italic, Link, List, ListOrdered, Quote, Redo2, Undo2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { useEffect } from 'react'
import type { RichTextDocument } from '../../lib/blog-content'

type TiptapEditorProps = {
  value: unknown
  onChange: (value: RichTextDocument) => void
}

const emptyDocument: RichTextDocument = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [],
    },
  ],
}

export default function TiptapEditor({ value, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      LinkExtension.configure({
        openOnClick: false,
        autolink: true,
      }),
      ImageExtension,
      Placeholder.configure({
        placeholder: 'Write the blog content...',
      }),
    ],
    content: value || emptyDocument,
    editorProps: {
      attributes: {
        class:
          'min-h-[320px] rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm leading-7 text-slate-800 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100',
      },
    },
    onUpdate({ editor: currentEditor }) {
      onChange(currentEditor.getJSON() as RichTextDocument)
    },
  })

  useEffect(() => {
    if (!editor || !value) {
      return
    }

    const current = JSON.stringify(editor.getJSON())
    const incoming = JSON.stringify(value)

    if (current !== incoming) {
      editor.commands.setContent(value)
    }
  }, [editor, value])

  if (!editor) {
    return <div className="min-h-[320px] rounded-lg border border-slate-200 bg-white" />
  }

  const addLink = () => {
    const previousUrl = editor.getAttributes('link').href as string | undefined
    const url = window.prompt('Link URL', previousUrl || 'https://')

    if (url === null) {
      return
    }

    if (!url.trim()) {
      editor.chain().focus().unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run()
  }

  const addImage = () => {
    const url = window.prompt('Image URL', 'https://')

    if (url?.trim()) {
      editor.chain().focus().setImage({ src: url.trim(), alt: 'Blog image' }).run()
    }
  }

  return (
    <div className="rounded-lg border border-cyan-900/10 bg-slate-50 p-3">
      <div className="mb-3 flex flex-wrap gap-2">
        <ToolbarButton label="Heading 2" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          <Heading2 size={16} aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton label="Heading 3" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          <Heading3 size={16} aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton label="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold size={16} aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton label="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic size={16} aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton label="Bullet list" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List size={16} aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton label="Numbered list" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered size={16} aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton label="Blockquote" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <Quote size={16} aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton label="Link" active={editor.isActive('link')} onClick={addLink}>
          <Link size={16} aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton label="Image" onClick={addImage}>
          <ImageIcon size={16} aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton label="Undo" onClick={() => editor.chain().focus().undo().run()}>
          <Undo2 size={16} aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton label="Redo" onClick={() => editor.chain().focus().redo().run()}>
          <Redo2 size={16} aria-hidden="true" />
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}

function ToolbarButton({
  label,
  active,
  onClick,
  children,
}: {
  label: string
  active?: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`grid h-10 w-10 place-items-center rounded-md border text-slate-700 transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-100 ${
        active ? 'border-cyan-600 bg-cyan-600 text-white' : 'border-slate-200 bg-white hover:border-cyan-400 hover:text-cyan-800'
      }`}
    >
      {children}
    </button>
  )
}
