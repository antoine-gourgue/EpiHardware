'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { toast } from 'sonner'
import { Button, FieldError, Input, Label, Spinner } from '@epihardware/ui'
import { registerAction } from '@/lib/actions/auth'
import { registerSchema } from '@/lib/validators'

type Errors = Record<string, string>

export function RegisterForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    login: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  function set(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})

    const parsed = registerSchema.safeParse(form)
    if (!parsed.success) {
      const fe: Errors = {}
      for (const issue of parsed.error.issues) {
        const k = issue.path[0]
        if (typeof k === 'string' && !fe[k]) fe[k] = issue.message
      }
      setErrors(fe)
      return
    }

    setLoading(true)
    const res = await registerAction(form)
    if (!res.ok) {
      setLoading(false)
      if (res.fieldErrors) setErrors(res.fieldErrors)
      if (res.error) toast.error(res.error)
      return
    }

    // Auto sign-in after successful registration.
    const signRes = await signIn('credentials', {
      redirect: false,
      email: form.email,
      password: form.password
    })
    setLoading(false)
    if (signRes?.error) {
      toast.success('Compte créé, veuillez vous connecter.')
      router.push('/login')
      return
    }
    toast.success('Compte créé, bienvenue !')
    router.push('/')
    router.refresh()
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">
        Créer un compte
      </h1>
      <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
        Quelques secondes suffisent.
      </p>

      <form onSubmit={onSubmit} className="mt-7 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="firstName">Prénom</Label>
            <Input id="firstName" value={form.firstName} onChange={set('firstName')} required />
            <FieldError>{errors.firstName}</FieldError>
          </div>
          <div>
            <Label htmlFor="lastName">Nom</Label>
            <Input id="lastName" value={form.lastName} onChange={set('lastName')} required />
            <FieldError>{errors.lastName}</FieldError>
          </div>
        </div>
        <div>
          <Label htmlFor="login">Identifiant</Label>
          <Input id="login" value={form.login} onChange={set('login')} required />
          <FieldError>{errors.login}</FieldError>
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={form.email} onChange={set('email')} required />
          <FieldError>{errors.email}</FieldError>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              value={form.password}
              onChange={set('password')}
              required
            />
            <FieldError>{errors.password}</FieldError>
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirmer</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={set('confirmPassword')}
              required
            />
            <FieldError>{errors.confirmPassword}</FieldError>
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading && <Spinner className="h-4 w-4" />}
          Créer mon compte
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Déjà inscrit ?{' '}
        <Link href="/login" className="text-brand-600 hover:text-brand-700 font-semibold">
          Se connecter
        </Link>
      </p>
    </div>
  )
}
