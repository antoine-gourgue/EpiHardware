import { redirect } from 'next/navigation'
import { Container, Avatar } from '@epihardware/ui'
import { getCurrentUser } from '@/lib/session'
import { AccountNav } from '@/components/account/account-nav'

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  if (!user) redirect('/login?callbackUrl=/account')

  return (
    <Container className="py-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[16rem_1fr]">
        <aside>
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center gap-3 px-1.5">
              <Avatar name={`${user.firstName} ${user.lastName}`} className="h-11 w-11 text-sm" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                  {user.firstName} {user.lastName}
                </p>
                <p className="truncate text-xs text-slate-500">{user.email}</p>
              </div>
            </div>
            <AccountNav isAdmin={user.role === 'ADMIN'} />
          </div>
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </Container>
  )
}
