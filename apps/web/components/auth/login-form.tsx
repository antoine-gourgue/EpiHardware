'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { toast } from 'sonner'
import { Button, FieldError, Input, Label, Spinner } from '@epihardware/ui'

export function LoginForm({ demo = false }: { demo?: boolean }) {
  const router = useRouter()
  const params = useSearchParams()
  const callbackUrl = params.get('callbackUrl') ?? '/'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(undefined)
    setLoading(true)
    const res = await signIn('credentials', { redirect: false, email, password })
    setLoading(false)
    if (res?.error) {
      setError('Email ou mot de passe incorrect.')
      return
    }
    toast.success('Bienvenue !')
    router.push(callbackUrl)
    router.refresh()
  }

  function fillDemo(kind: 'user' | 'admin') {
    setEmail(kind === 'admin' ? 'admin@epihardware.dev' : 'demo@epihardware.dev')
    setPassword('password')
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">
        Bon retour 👋
      </h1>
      <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
        Connectez-vous pour accéder à votre compte.
      </p>

      <form onSubmit={onSubmit} className="mt-7 space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vous@exemple.com"
          />
        </div>
        <div>
          <Label htmlFor="password">Mot de passe</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
          <FieldError>{error}</FieldError>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading && <Spinner className="h-4 w-4" />}
          Se connecter
        </Button>
      </form>

      {demo && (
        <div className="border-brand-200 bg-brand-50/60 dark:border-brand-500/30 dark:bg-brand-500/5 mt-5 rounded-xl border border-dashed p-3.5 text-sm">
          <p className="text-brand-800 dark:text-brand-200 font-medium">Comptes de démonstration</p>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={() => fillDemo('user')}
              className="text-brand-700 hover:bg-brand-100 dark:text-brand-300 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold shadow-sm transition dark:bg-slate-800"
            >
              Client
            </button>
            <button
              type="button"
              onClick={() => fillDemo('admin')}
              className="text-brand-700 hover:bg-brand-100 dark:text-brand-300 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold shadow-sm transition dark:bg-slate-800"
            >
              Admin
            </button>
            <span className="self-center text-xs text-slate-500">mot de passe : password</span>
          </div>
        </div>
      )}

      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Pas encore de compte ?{' '}
        <Link href="/register" className="text-brand-600 hover:text-brand-700 font-semibold">
          Créer un compte
        </Link>
      </p>
    </div>
  )
}
