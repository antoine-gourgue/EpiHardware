import type { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@epihardware/ui'
import { getCurrentUser } from '@/lib/session'
import { isDemoMode } from '@/lib/env'
import { ProfileForm } from '@/components/account/profile-form'

export const metadata: Metadata = { title: 'Mon profil' }

export default async function AccountPage() {
  const user = await getCurrentUser()
  if (!user) return null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Mon profil
        </h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Gérez vos informations personnelles et votre mot de passe.
        </p>
      </div>

      {isDemoMode && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
          En mode démo, les modifications du profil ne sont pas enregistrées.
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Informations personnelles</CardTitle>
          <CardDescription>Ces informations apparaîtront sur vos factures.</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm user={user} />
        </CardContent>
      </Card>
    </div>
  )
}
