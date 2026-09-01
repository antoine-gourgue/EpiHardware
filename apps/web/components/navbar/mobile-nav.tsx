'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import {
  LogIn,
  LogOut,
  Menu,
  Package,
  Search,
  ShieldCheck,
  User as UserIcon,
  X
} from 'lucide-react'
import { Avatar } from '@epihardware/ui'
import type { CategoryDTO } from '@/lib/types'

export function MobileNav({ categories }: { categories: CategoryDTO[] }) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [query, setQuery] = useState('')
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => setMounted(true), [])

  // Lock background scroll and allow Escape to close while the drawer is open.
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const close = () => setOpen(false)

  function submitSearch(e: React.FormEvent) {
    e.preventDefault()
    const q = query.trim()
    close()
    router.push(q ? `/products?search=${encodeURIComponent(q)}` : '/products')
  }

  const user = session?.user

  const drawer = (
    // z above the sticky header; portaled to <body> so the header's
    // backdrop-filter doesn't trap this fixed overlay inside its 64px box.
    <div className="fixed inset-0 z-[100] lg:hidden">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={close}
        aria-hidden="true"
      />
      <div className="shadow-soft-lg absolute right-0 top-0 flex h-full w-80 max-w-[86%] flex-col bg-white dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 p-4 dark:border-slate-800">
          <span className="font-display text-lg font-extrabold">Menu</span>
          <button
            onClick={close}
            aria-label="Fermer le menu"
            className="inline-grid h-9 w-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="ec-scroll flex-1 overflow-y-auto p-4">
          <form onSubmit={submitSearch} className="relative mb-5">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher…"
              className="focus:border-brand-400 focus:ring-brand-500/10 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-4 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100"
            />
          </form>

          <nav className="flex flex-col gap-0.5 text-sm font-medium">
            <MobileLink href="/products" onClick={close}>
              Toute la boutique
            </MobileLink>
            <MobileLink href="/products?sort=newest" onClick={close}>
              Nouveautés
            </MobileLink>

            <p className="px-3 pb-1 pt-5 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Catégories
            </p>
            {categories.map((c) => (
              <MobileLink key={c.id} href={`/products?category=${c.slug}`} onClick={close}>
                {c.name}
              </MobileLink>
            ))}
          </nav>
        </div>

        <div className="border-t border-slate-100 p-4 dark:border-slate-800">
          {user ? (
            <div className="space-y-3">
              <Link
                href="/account"
                onClick={close}
                className="flex items-center gap-3 rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/60"
              >
                <Avatar name={`${user.firstName} ${user.lastName}`} />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-slate-900 dark:text-white">
                    {user.firstName} {user.lastName}
                  </span>
                  <span className="block truncate text-xs text-slate-500">{user.email}</span>
                </span>
              </Link>
              <div className="grid grid-cols-2 gap-2 text-sm font-medium">
                <MobileAction
                  href="/account"
                  onClick={close}
                  icon={<UserIcon className="h-4 w-4" />}
                >
                  Profil
                </MobileAction>
                <MobileAction
                  href="/account/orders"
                  onClick={close}
                  icon={<Package className="h-4 w-4" />}
                >
                  Commandes
                </MobileAction>
                {user.role === 'ADMIN' && (
                  <MobileAction
                    href="/admin"
                    onClick={close}
                    icon={<ShieldCheck className="h-4 w-4" />}
                  >
                    Admin
                  </MobileAction>
                )}
                <button
                  onClick={() => {
                    close()
                    signOut({ callbackUrl: '/' })
                  }}
                  className="col-span-2 flex items-center justify-center gap-2 rounded-xl border border-red-200 py-2.5 font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-500/30 dark:hover:bg-red-500/10"
                >
                  <LogOut className="h-4 w-4" />
                  Se déconnecter
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/login"
                onClick={close}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <LogIn className="h-4 w-4" />
                Connexion
              </Link>
              <Link
                href="/register"
                onClick={close}
                className="bg-brand-600 hover:bg-brand-500 flex items-center justify-center rounded-xl py-2.5 text-sm font-semibold text-white transition"
              >
                Créer un compte
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Ouvrir le menu"
        className="inline-grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 lg:hidden dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
      >
        <Menu className="h-[18px] w-[18px]" />
      </button>

      {mounted && open && createPortal(drawer, document.body)}
    </>
  )
}

function MobileLink({
  href,
  children,
  onClick
}: {
  href: string
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="hover:text-brand-700 dark:hover:text-brand-300 rounded-lg px-3 py-2.5 text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
    >
      {children}
    </Link>
  )
}

function MobileAction({
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
      className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
    >
      {icon}
      {children}
    </Link>
  )
}
