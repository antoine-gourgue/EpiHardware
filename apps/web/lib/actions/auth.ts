'use server'

import bcrypt from 'bcryptjs'
import { prisma } from '@epihardware/db'
import { isDemoMode } from '@/lib/env'
import { registerSchema } from '@/lib/validators'

export interface ActionState {
  ok: boolean
  error?: string
  fieldErrors?: Record<string, string>
}

export async function registerAction(input: Record<string, unknown>): Promise<ActionState> {
  const parsed = registerSchema.safeParse(input)
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]
      if (typeof key === 'string' && !fieldErrors[key]) fieldErrors[key] = issue.message
    }
    return { ok: false, fieldErrors }
  }

  if (isDemoMode) {
    return {
      ok: false,
      error:
        'Inscription désactivée en mode démo. Connectez-vous avec demo@epihardware.dev / password.'
    }
  }

  const { login, firstName, lastName, email, password } = parsed.data
  const existing = await prisma.user.findFirst({
    where: { OR: [{ email: email.toLowerCase() }, { login }] }
  })
  if (existing) {
    return {
      ok: false,
      fieldErrors:
        existing.email === email.toLowerCase()
          ? { email: 'Cet email est déjà utilisé' }
          : { login: 'Cet identifiant est déjà pris' }
    }
  }

  await prisma.user.create({
    data: {
      login,
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: await bcrypt.hash(password, 10),
      cart: { create: {} }
    }
  })

  return { ok: true }
}
