import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/utils'

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'dark' | 'ghost'
}

export default function ButtonLink({
  children,
  className,
  variant = 'primary',
  ...props
}: ButtonLinkProps) {
  const variants = {
    primary:
      'bg-cyan-600 text-white shadow-[0_14px_36px_rgba(8,145,178,0.28)] hover:bg-cyan-700 focus-visible:ring-cyan-300',
    secondary:
      'border border-white/70 bg-white/90 text-slate-950 hover:bg-white focus-visible:ring-white',
    dark:
      'bg-slate-950 text-white hover:bg-slate-800 focus-visible:ring-slate-300',
    ghost:
      'border border-slate-200 bg-white text-slate-900 hover:border-cyan-400 hover:text-cyan-800 focus-visible:ring-cyan-200',
  }

  return (
    <a
      className={cn(
        'inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-4',
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </a>
  )
}
