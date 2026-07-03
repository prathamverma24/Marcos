import { mkdir, writeFile } from 'fs/promises'
import path from 'path'
import { NextResponse } from 'next/server'
import { apiError, requireAdminApi } from '../../../../lib/cms-api'
import { prisma } from '../../../../lib/prisma'

const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
const maxSize = 5 * 1024 * 1024

function cleanFileName(value: string) {
  const extension = path.extname(value).toLowerCase()
  const base = path
    .basename(value, extension)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return `${base || 'blog-image'}-${Date.now()}${extension}`
}

export async function POST(request: Request) {
  const auth = await requireAdminApi()

  if (auth.response) {
    return auth.response
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file')
    const alt = formData.get('alt')

    if (!(file instanceof File)) {
      return NextResponse.json({ success: false, error: 'Image file is required' }, { status: 400 })
    }

    if (!allowedTypes.has(file.type)) {
      return NextResponse.json({ success: false, error: 'Only JPG, PNG, WebP, or GIF images are allowed' }, { status: 400 })
    }

    if (file.size > maxSize) {
      return NextResponse.json({ success: false, error: 'Image must be 5 MB or smaller' }, { status: 400 })
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'blogs')
    await mkdir(uploadDir, { recursive: true })

    const fileName = cleanFileName(file.name)
    const filePath = path.join(uploadDir, fileName)
    const bytes = Buffer.from(await file.arrayBuffer())
    await writeFile(filePath, bytes)

    const url = `/uploads/blogs/${fileName}`

    if (prisma) {
      await prisma.media.create({
        data: {
          url,
          alt: typeof alt === 'string' ? alt : undefined,
          mimeType: file.type,
          size: file.size,
        },
      })
    }

    return NextResponse.json({
      success: true,
      provider: 'local-placeholder',
      url,
      setupRequired: true,
      message: 'Image saved locally. Configure Cloudinary or another storage provider for production uploads.',
    })
  } catch (error) {
    return apiError(error, 'Unable to upload image')
  }
}
