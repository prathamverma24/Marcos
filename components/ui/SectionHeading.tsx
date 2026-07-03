import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

type SectionHeadingProps = {
  eyebrow: string
  title: string
  description?: string
  align?: 'left' | 'center'
  tone?: 'light' | 'dark'
  children?: ReactNode
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  tone = 'light',
  children,
}: SectionHeadingProps) {
  const isDark = tone === 'dark'

  return (
    <div className={cn('max-w-3xl', align === 'center' && 'mx-auto text-center')}>
      <p className={cn('text-xs font-semibold uppercase tracking-[0.16em]', isDark ? 'text-cyan-300' : 'text-cyan-700')}>{eyebrow}</p>
      <h2 className={cn('mt-3 text-3xl font-semibold leading-tight md:text-4xl', isDark ? 'text-white' : 'text-slate-950')}>{title}</h2>
      {description ? (
        <p className={cn('mt-4 text-base leading-7 md:text-lg', isDark ? 'text-slate-300' : 'text-slate-700')}>{description}</p>
      ) : null}
      {children}
    </div>
  )
}
