'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button, FieldError, Input, Label, Spinner } from '@epihardware/ui'
import { updateProfileAction } from '@/lib/actions/account'
import type { SessionUserDTO } from '@/lib/types'

export function ProfileForm({ user }: { user: SessionUserDTO }) {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [form, setForm] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    login: user.login,
    email: user.email,
    password: ''
  })

  function set(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})
    setLoading(true)
    const res = await updateProfileAction(form)
    setLoading(false)
    if (!res.ok) {
      if (res.fieldErrors) setErrors(res.fieldErrors)
      if (res.error) toast.error(res.error)
      return
    }
    toast.success('Profil mis à jour')
    setForm((f) => ({ ...f, password: '' }))
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="firstName">Prénom</Label>
          <Input id="firstName" value={form.firstName} onChange={set('firstName')} />
          <FieldError>{errors.firstName}</FieldError>
        </div>
        <div>
          <Label htmlFor="lastName">Nom</Label>
          <Input id="lastName" value={form.lastName} onChange={set('lastName')} />
          <FieldError>{errors.lastName}</FieldError>
        </div>
      </div>
      <div>
        <Label htmlFor="login">Identifiant</Label>
        <Input id="login" value={form.login} onChange={set('login')} />
        <FieldError>{errors.login}</FieldError>
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={form.email} onChange={set('email')} />
        <FieldError>{errors.email}</FieldError>
      </div>
      <div>
        <Label htmlFor="password">Nouveau mot de passe</Label>
        <Input
          id="password"
          type="password"
          value={form.password}
          onChange={set('password')}
          placeholder="Laisser vide pour ne pas changer"
        />
        <FieldError>{errors.password}</FieldError>
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={loading}>
          {loading && <Spinner className="h-4 w-4" />}
          Enregistrer
        </Button>
      </div>
    </form>
  )
}
