'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { LogOut, Package, Settings, ShieldCheck, User as UserIcon } from 'lucide-react'
import { Avatar, Button } from '@epihardware/ui'

export function UserMenu() {
  const { data: session, status } = useSession()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  if (status === 'loading') {
    return <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
  }

  if (!session?.user) {
    return (
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
          <Link href="/login">Connexion</Link>
        </Button>
        <Button asChild size="sm">
          <Link href="/register">Créer un compte</Link>
        </Button>
      </div>
    )
  }

  const user = session.user
  const fullName = `${user.firstName} ${user.lastName}`

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 rounded-xl border border-transparent p-0.5 pr-2 transition hover:border-slate-200 hover:bg-slate-50 dark:hover:border-slate-700 dark:hover:bg-slate-800"
      >
        <Avatar name={fullName} />
        <span className="hidden text-sm font-medium text-slate-700 lg:block dark:text-slate-200">
          {user.firstName}
        </span>
      </button>

      {open && (
        <div className="shadow-soft-lg absolute right-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
          <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-800">
            <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
              {fullName}
            </p>
            <p className="truncate text-xs text-slate-500">{user.email}</p>
          </div>
          <nav className="p-1.5 text-sm">
            <MenuLink
              href="/account"
              icon={<UserIcon className="h-4 w-4" />}
              onClick={() => setOpen(false)}
            >
              Mon profil
            </MenuLink>
            <MenuLink
              href="/account/orders"
              icon={<Package className="h-4 w-4" />}
              onClick={() => setOpen(false)}
            >
              Mes commandes
            </MenuLink>
            {user.role === 'ADMIN' && (
              <MenuLink
                href="/admin"
                icon={<ShieldCheck className="h-4 w-4" />}
                onClick={() => setOpen(false)}
              >
                Administration
              </MenuLink>
            )}
          </nav>
          <div className="border-t border-slate-100 p-1.5 dark:border-slate-800">
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:hover:bg-red-500/10"
            >
              <LogOut className="h-4 w-4" />
              Se déconnecter
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function MenuLink({
  href,
  icon,
  children,
  onClick
}: {
  href: string
  icon: React.ReactNode
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="hover:text-brand-700 dark:hover:text-brand-300 flex items-center gap-2.5 rounded-lg px-3 py-2 font-medium text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
    >
      {icon}
      {children}
    </Link>
  )
}
