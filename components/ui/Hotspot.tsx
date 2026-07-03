'use client'

import { cn } from '../../lib/utils'

type HotspotProps = {
  active?: boolean
  label: string
  className?: string
}

export default function Hotspot({ active = false, label, className }: HotspotProps) {
  return (
    <span
      className={cn(
        'absolute flex items-center gap-2 text-xs font-semibold text-slate-900 transition',
        active ? 'opacity-100' : 'opacity-55',
        className,
      )}
    >
      <span
        className={cn(
          'grid h-4 w-4 place-items-center rounded-full border-2 bg-white',
          active ? 'border-cyan-500 shadow-[0_0_0_6px_rgba(8,145,178,0.18)]' : 'border-slate-300',
        )}
      />
      <span className="rounded-md border border-white/80 bg-white/90 px-2 py-1 shadow-sm">{label}</span>
    </span>
  )
}
