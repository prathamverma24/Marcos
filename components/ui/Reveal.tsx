'use client'

import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
}

export default function Reveal({ children, className }: RevealProps) {
  return <div className={cn('csp-reveal', className)}>{children}</div>
}

export function RevealList({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={cn('grid gap-4', className)}>{children}</div>
}
