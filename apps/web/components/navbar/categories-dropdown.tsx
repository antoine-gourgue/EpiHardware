'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { cn } from '@epihardware/ui'
import type { CategoryDTO } from '@/lib/types'

export function CategoriesDropdown({ categories }: { categories: CategoryDTO[] }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div ref={ref} className="relative" onMouseLeave={() => setOpen(false)}>
      <button
        onClick={() => setOpen((o) => !o)}
        onMouseEnter={() => setOpen(true)}
        className="hover:text-brand-700 dark:hover:text-brand-300 inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition dark:text-slate-300"
      >
        Catégories
        <ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 w-[30rem] pt-2">
          <div className="shadow-soft-lg grid grid-cols-2 gap-1 rounded-2xl border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-900">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/products?category=${c.slug}`}
                onClick={() => setOpen(false)}
                className="hover:bg-brand-50 dark:hover:bg-brand-500/10 group flex items-start gap-3 rounded-xl p-3 transition"
              >
                <span className="bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300 mt-0.5 grid h-9 w-9 flex-none place-items-center rounded-lg">
                  <span className="text-sm font-bold">{c.name.charAt(0)}</span>
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-slate-900 dark:text-white">
                    {c.name}
                  </span>
                  <span className="line-clamp-1 text-xs text-slate-500">{c.description}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
