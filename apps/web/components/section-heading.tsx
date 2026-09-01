import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function SectionHeading({
  eyebrow,
  title,
  description,
  action
}: {
  eyebrow?: string
  title: string
  description?: string
  action?: { label: string; href: string }
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow && (
          <span className="text-brand-600 dark:text-brand-400 mb-2 inline-block text-sm font-semibold uppercase tracking-wide">
            {eyebrow}
          </span>
        )}
        <h2 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          {title}
        </h2>
        {description && <p className="mt-3 text-slate-500 dark:text-slate-400">{description}</p>}
      </div>
      {action && (
        <Link
          href={action.href}
          className="text-brand-600 hover:text-brand-700 dark:text-brand-400 group inline-flex flex-none items-center gap-1.5 text-sm font-semibold transition"
        >
          {action.label}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  )
}
