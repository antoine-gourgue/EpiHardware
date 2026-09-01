'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, X, Loader2 } from 'lucide-react'
import { cn } from '@epihardware/ui'
import { formatPrice } from '@/lib/format'

interface Result {
  slug: string
  name: string
  price: number
  imageUrl: string
  category: string
}

export function SearchBar({ className }: { className?: string }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Result[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const boxRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([])
      setLoading(false)
      return
    }
    setLoading(true)
    const controller = new AbortController()
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
          signal: controller.signal
        })
        const data = (await res.json()) as { results: Result[] }
        setResults(data.results)
        setOpen(true)
      } catch {
        /* aborted */
      } finally {
        setLoading(false)
      }
    }, 250)
    return () => {
      clearTimeout(t)
      controller.abort()
    }
  }, [query])

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    setOpen(false)
    router.push(`/products?search=${encodeURIComponent(query.trim())}`)
  }

  return (
    <div ref={boxRef} className={cn('relative', className)}>
      <form onSubmit={submit}>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => results.length && setOpen(true)}
            placeholder="Rechercher un composant…"
            className="focus:border-brand-400 focus:ring-brand-500/10 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-9 text-sm text-slate-900 transition placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-4 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100 dark:focus:bg-slate-900"
          />
          {loading ? (
            <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-slate-400" />
          ) : query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label="Effacer"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </form>

      {open && results.length > 0 && (
        <div className="shadow-soft-lg absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
          <ul className="ec-scroll max-h-96 overflow-auto py-1.5">
            {results.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/products/${r.slug}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 transition hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={r.imageUrl}
                    alt=""
                    className="h-10 w-10 flex-none rounded-lg bg-white object-contain p-0.5"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-slate-900 dark:text-white">
                      {r.name}
                    </span>
                    <span className="block text-xs text-slate-500">{r.category}</span>
                  </span>
                  <span className="text-brand-600 dark:text-brand-400 flex-none text-sm font-semibold">
                    {formatPrice(r.price)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
