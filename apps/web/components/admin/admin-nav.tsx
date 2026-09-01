'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package } from 'lucide-react'
import { cn } from '@epihardware/ui'

const links = [
  { href: '/admin', label: 'Tableau de bord', icon: LayoutDashboard, exact: true },
  { href: '/admin/products', label: 'Produits', icon: Package, exact: false }
]

export function AdminNav() {
  const pathname = usePathname()
  return (
    <nav className="flex gap-1 lg:flex-col">
      {links.map((l) => {
        const active = l.exact ? pathname === l.href : pathname.startsWith(l.href)
        return (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition',
              active
                ? 'bg-brand-600 shadow-soft text-white'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
            )}
          >
            <l.icon className="h-[18px] w-[18px]" />
            {l.label}
          </Link>
        )
      })}
    </nav>
  )
}
