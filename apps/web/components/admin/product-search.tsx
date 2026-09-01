'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

export function ProductSearch({ initial }: { initial: string }) {
  const [value, setValue] = useState(initial)
  const router = useRouter()

  useEffect(() => {
    const t = setTimeout(() => {
      const q = value.trim()
      router.push(q ? `/admin/products?q=${encodeURIComponent(q)}` : '/admin/products')
    }, 300)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <div className="relative w-full sm:w-72">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Rechercher un produit…"
        className="focus:border-brand-400 focus:ring-brand-500/10 h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-900 transition placeholder:text-slate-400 focus:outline-none focus:ring-4 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
      />
    </div>
  )
}
