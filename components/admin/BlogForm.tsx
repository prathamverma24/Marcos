'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Eye, Loader2, Save, UploadCloud } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { slugify, type RichTextDocument } from '../../lib/blog-content'
import RichTextRenderer from '../ui/RichTextRenderer'
import TiptapEditor from './TiptapEditor'

type CategoryOption = {
  id: string
  name: string
}

export type BlogFormInitialValue = {
  id?: string
  title?: string
  slug?: string
  excerpt?: string
  content?: unknown
  featuredImage?: string | null
  imageAlt?: string | null
  categoryId?: string | null
  authorName?: string | null
  seoTitle?: string | null
  metaDescription?: string | null
  keywords?: string[]
  readTime?: string | null
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  publishedAt?: string | null
}

const formSchema = z.object({
  title: z.string().trim().min(3, 'Blog title is required'),
  slug: z
    .string()
    .trim()
    .min(2, 'Slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use a lowercase SEO slug'),
  excerpt: z.string().trim().min(10, 'Excerpt is required'),
  featuredImage: z.string().trim().optional(),
  imageAlt: z.string().trim().optional(),
  categoryId: z.string().trim().min(1, 'Category is required'),
  authorName: z.string().trim().min(2, 'Author name is required'),
  seoTitle: z.string().trim().optional(),
  metaDescription: z.string().trim().optional(),
  keywords: z.string().trim().optional(),
  readTime: z.string().trim().optional(),
  publishedAt: z.string().trim().optional(),
})

type BlogFormData = z.infer<typeof formSchema>

const emptyDocument: RichTextDocument = {
  type: 'doc',
  content: [{ type: 'paragraph', content: [] }],
}

function toDatetimeLocal(value?: string | null) {
  if (!value) {
    return ''
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return date.toISOString().slice(0, 16)
}

function keywordString(keywords?: string[]) {
  return keywords?.join(', ') || ''
}

export default function BlogForm({
  categories,
  initialValue,
}: {
  categories: CategoryOption[]
  initialValue?: BlogFormInitialValue
}) {
  const router = useRouter()
  const [content, setContent] = useState<unknown>(initialValue?.content || emptyDocument)
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED' | 'ARCHIVED'>(initialValue?.status || 'DRAFT')
  const [slugTouched, setSlugTouched] = useState(Boolean(initialValue?.slug))
  const [serverMessage, setServerMessage] = useState('')
  const [serverError, setServerError] = useState('')
  const [uploading, setUploading] = useState(false)
  const isEditing = Boolean(initialValue?.id)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BlogFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialValue?.title || '',
      slug: initialValue?.slug || '',
      excerpt: initialValue?.excerpt || '',
      featuredImage: initialValue?.featuredImage || '',
      imageAlt: initialValue?.imageAlt || '',
      categoryId: initialValue?.categoryId || categories[0]?.id || '',
      authorName: initialValue?.authorName || 'Marcos Water Solutions',
      seoTitle: initialValue?.seoTitle || '',
      metaDescription: initialValue?.metaDescription || '',
      keywords: keywordString(initialValue?.keywords),
      readTime: initialValue?.readTime || '',
      publishedAt: toDatetimeLocal(initialValue?.publishedAt),
    },
  })

  const title = watch('title')
  const featuredImage = watch('featuredImage')
  const previewBlog = {
    title: title || 'Blog preview',
    excerpt: watch('excerpt') || 'Preview excerpt will appear here.',
    content,
  }

  useEffect(() => {
    if (!slugTouched) {
      setValue('slug', slugify(title), { shouldValidate: true })
    }
  }, [setValue, slugTouched, title])

  const uploadFeaturedImage = async (file: File | undefined) => {
    if (!file) {
      return
    }

    setUploading(true)
    setServerError('')

    try {
      const body = new FormData()
      body.append('file', file)
      body.append('alt', watch('imageAlt') || title || 'Blog featured image')

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body,
      })
      const payload = (await response.json()) as { success?: boolean; url?: string; error?: string }

      if (!response.ok || !payload.success || !payload.url) {
        throw new Error(payload.error || 'Unable to upload image')
      }

      setValue('featuredImage', payload.url, { shouldValidate: true })
      setServerMessage('Featured image uploaded.')
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Unable to upload image')
    } finally {
      setUploading(false)
    }
  }

  const submitWithStatus = (targetStatus: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED') =>
    handleSubmit(async (values) => {
      setStatus(targetStatus)
      setServerError('')
      setServerMessage('')

      const payload = {
        ...values,
        content,
        status: targetStatus,
        keywords: values.keywords
          ? values.keywords
              .split(',')
              .map((item) => item.trim())
              .filter(Boolean)
          : [],
      }

      const response = await fetch(isEditing ? `/api/admin/blogs/${initialValue?.id}` : '/api/admin/blogs', {
        method: isEditing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = (await response.json()) as { success?: boolean; error?: string }

      if (!response.ok || !result.success) {
        setServerError(result.error || 'Unable to save blog')
        return
      }

      setServerMessage(targetStatus === 'PUBLISHED' ? 'Blog published.' : 'Blog saved.')
      router.push('/admin/blogs')
      router.refresh()
    })()

  return (
    <div className="grid gap-8 xl:grid-cols-[1fr_380px]">
      <form className="rounded-lg border border-cyan-900/10 bg-white p-5 shadow-sm" onSubmit={(event) => event.preventDefault()}>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-5">
          <Link href="/admin/blogs" className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-700 hover:text-cyan-900">
            <ArrowLeft size={16} aria-hidden="true" />
            Back to Blogs
          </Link>
          <div className="flex flex-wrap gap-3">
            {isEditing ? (
              <Link
                href={`/admin/blogs/${initialValue?.id}/preview`}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-cyan-400 hover:text-cyan-800"
              >
                <Eye size={16} aria-hidden="true" />
                Preview
              </Link>
            ) : null}
            <button
              type="button"
              onClick={() => submitWithStatus('DRAFT')}
              disabled={isSubmitting}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-cyan-400 hover:text-cyan-800 disabled:opacity-60"
            >
              <Save size={16} aria-hidden="true" />
              Save Draft
            </button>
            <button
              type="button"
              onClick={() => submitWithStatus('PUBLISHED')}
              disabled={isSubmitting}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:opacity-60"
            >
              {isSubmitting && status === 'PUBLISHED' ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : null}
              Publish
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-5">
          <Field label="Blog title" error={errors.title?.message}>
            <input {...register('title')} className="form-field" />
          </Field>
          <Field label="Slug" error={errors.slug?.message}>
            <input
              {...register('slug')}
              className="form-field"
              onChange={(event) => {
                setSlugTouched(true)
                setValue('slug', slugify(event.target.value), { shouldValidate: true })
              }}
            />
          </Field>
          <Field label="Excerpt" error={errors.excerpt?.message}>
            <textarea {...register('excerpt')} rows={3} className="form-field resize-y" />
          </Field>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Category" error={errors.categoryId?.message}>
              <select {...register('categoryId')} className="form-field">
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Author" error={errors.authorName?.message}>
              <input {...register('authorName')} className="form-field" />
            </Field>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
              <Field label="Featured image URL" error={errors.featuredImage?.message}>
                <input {...register('featuredImage')} className="form-field bg-white" />
              </Field>
              <label className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-cyan-400 hover:text-cyan-800">
                {uploading ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <UploadCloud size={16} aria-hidden="true" />}
                Upload
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="sr-only"
                  onChange={(event) => uploadFeaturedImage(event.target.files?.[0])}
                />
              </label>
            </div>
            <div className="mt-4">
              <Field label="Image alt text" error={errors.imageAlt?.message}>
                <input {...register('imageAlt')} className="form-field bg-white" />
              </Field>
            </div>
            {featuredImage ? (
              <div className="mt-4 overflow-hidden rounded-lg border border-slate-200 bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={featuredImage} alt={watch('imageAlt') || 'Featured image preview'} className="h-52 w-full object-cover" />
              </div>
            ) : null}
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold text-slate-800">Rich blog content</p>
            <TiptapEditor value={content} onChange={setContent} />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="SEO title" error={errors.seoTitle?.message}>
              <input {...register('seoTitle')} className="form-field" />
            </Field>
            <Field label="Read time" error={errors.readTime?.message}>
              <input {...register('readTime')} className="form-field" placeholder="4 min read" />
            </Field>
          </div>
          <Field label="Meta description" error={errors.metaDescription?.message}>
            <textarea {...register('metaDescription')} rows={3} className="form-field resize-y" />
          </Field>
          <Field label="Keywords" error={errors.keywords?.message}>
            <input {...register('keywords')} className="form-field" placeholder="industrial RO plant, water treatment" />
          </Field>
          <Field label="Publish date" error={errors.publishedAt?.message}>
            <input {...register('publishedAt')} type="datetime-local" className="form-field" />
          </Field>
        </div>

        {serverMessage ? (
          <p className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" role="status">
            {serverMessage}
          </p>
        ) : null}
        {serverError ? (
          <p className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
            {serverError}
          </p>
        ) : null}
      </form>

      <aside className="rounded-lg border border-cyan-900/10 bg-white p-5 shadow-sm xl:sticky xl:top-28 xl:self-start">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-700">Preview</p>
        <h2 className="mt-3 text-2xl font-semibold text-slate-950">{previewBlog.title}</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">{previewBlog.excerpt}</p>
        <div className="mt-6 max-h-[520px] overflow-y-auto border-t border-slate-200 pt-5">
          <RichTextRenderer content={previewBlog.content} />
        </div>
      </aside>
    </div>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: ReactNode
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-800">{label}</span>
      <span className="mt-2 block">{children}</span>
      {error ? <span className="mt-2 block text-sm text-red-700">{error}</span> : null}
    </label>
  )
}
