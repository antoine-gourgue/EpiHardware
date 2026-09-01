import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowUpRight } from 'lucide-react'
import { Avatar, Container } from '@epihardware/ui'
import { getCurrentUser } from '@/lib/session'
import { Logo } from '@/components/logo'
import { ThemeToggle } from '@/components/theme-toggle'
import { AdminNav } from '@/components/admin/admin-nav'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  if (!user) redirect('/login?callbackUrl=/admin')
  if (user.role !== 'ADMIN') redirect('/')

  return (
    <div className="min-h-dvh bg-slate-50 dark:bg-slate-950">
      <header className="glass sticky top-0 z-40 border-b border-slate-200/70 dark:border-slate-800/70">
        <Container className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300 hidden rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide sm:inline">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="hover:text-brand-600 hidden items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition sm:inline-flex dark:text-slate-300"
            >
              Voir le site
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <ThemeToggle />
            <Avatar name={`${user.firstName} ${user.lastName}`} />
          </div>
        </Container>
      </header>

      <Container className="grid grid-cols-1 gap-8 py-8 lg:grid-cols-[15rem_1fr]">
        <aside>
          <div className="lg:sticky lg:top-24">
            <AdminNav />
          </div>
        </aside>
        <main className="min-w-0">{children}</main>
      </Container>
    </div>
  )
}
