import type { Metadata } from 'next'
import { Suspense } from 'react'
import { LoginForm } from '@/components/auth/login-form'
import { isDemoMode } from '@/lib/env'

export const metadata: Metadata = { title: 'Connexion' }

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm demo={isDemoMode} />
    </Suspense>
  )
}
