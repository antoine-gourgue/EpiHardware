'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { User, Package, LogOut, ShieldCheck } from 'lucide-react'
import { cn } from '@epihardware/ui'

const links = [
  { href: '/account', label: 'Mon profil', icon: User, exact: true },
  { href: '/account/orders', label: 'Mes commandes', icon: Package, exact: false }
]

export function AccountNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname()

  function isActive(href: string, exact: boolean) {
    return exact ? pathname === href : pathname.startsWith(href)
  }

  return (
    <nav className="flex flex-col gap-1">
      {links.map((l) => {
        const active = isActive(l.href, l.exact)
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
      {isAdmin && (
        <Link
          href="/admin"
          className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <ShieldCheck className="h-[18px] w-[18px]" />
          Administration
        </Link>
      )}
      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        className="mt-1 flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:hover:bg-red-500/10"
      >
        <LogOut className="h-[18px] w-[18px]" />
        Se déconnecter
      </button>
    </nav>
  )
}
