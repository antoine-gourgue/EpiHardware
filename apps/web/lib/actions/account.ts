'use server'

import bcrypt from 'bcryptjs'
import { revalidatePath } from 'next/cache'
import { prisma } from '@epihardware/db'
import { isDemoMode } from '@/lib/env'
import { getCurrentUser } from '@/lib/session'
import { profileSchema } from '@/lib/validators'
import type { ActionState } from './auth'

export async function updateProfileAction(input: Record<string, unknown>): Promise<ActionState> {
  const user = await getCurrentUser()
  if (!user) return { ok: false, error: 'Non authentifié' }

  const parsed = profileSchema.safeParse(input)
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]
      if (typeof key === 'string' && !fieldErrors[key]) fieldErrors[key] = issue.message
    }
    return { ok: false, fieldErrors }
  }

  if (isDemoMode) {
    return { ok: false, error: 'Profil en lecture seule en mode démo.' }
  }

  const { login, firstName, lastName, email, password } = parsed.data
  const clash = await prisma.user.findFirst({
    where: {
      AND: [{ NOT: { id: user.id } }, { OR: [{ email: email.toLowerCase() }, { login }] }]
    }
  })
  if (clash) {
    return {
      ok: false,
      fieldErrors:
        clash.email === email.toLowerCase()
          ? { email: 'Cet email est déjà utilisé' }
          : { login: 'Cet identifiant est déjà pris' }
    }
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      login,
      firstName,
      lastName,
      email: email.toLowerCase(),
      ...(password ? { password: await bcrypt.hash(password, 10) } : {})
    }
  })

  revalidatePath('/account')
  return { ok: true }
}
