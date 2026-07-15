/* eslint-disable @next/next/no-img-element */
import { cn } from '../../lib/utils'

type SiteImageProps = {
  src: string
  alt: string
  className?: string
  fill?: boolean
  loading?: 'eager' | 'lazy'
  priority?: boolean
  sizes?: string
}

export default function SiteImage({
  src,
  alt,
  className,
  fill = false,
  loading,
  priority = false,
}: SiteImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? 'eager' : loading || 'lazy'}
      decoding="async"
      className={cn(fill && 'absolute inset-0 h-full w-full', className)}
    />
  )
}
