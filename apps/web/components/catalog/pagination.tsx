import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@epihardware/ui'
import { catalogHref, type CatalogParams } from '@/lib/query'

export function Pagination({
  params,
  page,
  totalPages
}: {
  params: CatalogParams
  page: number
  totalPages: number
}) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  )

  const items: (number | 'gap')[] = []
  pages.forEach((p, i) => {
    if (i > 0 && p - (pages[i - 1] as number) > 1) items.push('gap')
    items.push(p)
  })

  const linkBase =
    'inline-grid h-10 min-w-10 place-items-center rounded-xl border px-3 text-sm font-medium transition'

  return (
    <nav className="mt-10 flex items-center justify-center gap-1.5" aria-label="Pagination">
      <PageLink
        disabled={page <= 1}
        href={catalogHref(params, { page: page - 1 })}
        className={linkBase}
        aria-label="Précédent"
      >
        <ChevronLeft className="h-4 w-4" />
      </PageLink>

      {items.map((it, i) =>
        it === 'gap' ? (
          <span key={`gap-${i}`} className="px-1.5 text-slate-400">
            …
          </span>
        ) : (
          <Link
            key={it}
            href={catalogHref(params, { page: it })}
            className={cn(
              linkBase,
              it === page
                ? 'border-brand-600 bg-brand-600 text-white'
                : 'hover:border-brand-300 hover:text-brand-600 border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'
            )}
            aria-current={it === page ? 'page' : undefined}
          >
            {it}
          </Link>
        )
      )}

      <PageLink
        disabled={page >= totalPages}
        href={catalogHref(params, { page: page + 1 })}
        className={linkBase}
        aria-label="Suivant"
      >
        <ChevronRight className="h-4 w-4" />
      </PageLink>
    </nav>
  )
}

function PageLink({
  disabled,
  href,
  className,
  children,
  ...rest
}: {
  disabled: boolean
  href: string
  className: string
  children: React.ReactNode
} & React.HTMLAttributes<HTMLElement>) {
  const style = cn(
    className,
    'border-slate-200 bg-white text-slate-700 hover:border-brand-300 hover:text-brand-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200',
    disabled && 'pointer-events-none opacity-40'
  )
  if (disabled)
    return (
      <span className={style} {...rest}>
        {children}
      </span>
    )
  return (
    <Link href={href} className={style} {...rest}>
      {children}
    </Link>
  )
}
