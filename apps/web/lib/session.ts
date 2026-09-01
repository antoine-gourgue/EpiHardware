import 'server-only'
import { auth } from './auth'
import type { SessionUserDTO } from './types'

/** Current authenticated user as a plain DTO, or null. */
export async function getCurrentUser(): Promise<SessionUserDTO | null> {
  const session = await auth()
  if (!session?.user) return null
  return {
    id: session.user.id,
    login: session.user.login,
    email: session.user.email ?? '',
    firstName: session.user.firstName,
    lastName: session.user.lastName,
    role: session.user.role
  }
}

export async function requireUser(): Promise<SessionUserDTO> {
  const user = await getCurrentUser()
  if (!user) throw new Error('UNAUTHENTICATED')
  return user
}

export async function requireAdmin(): Promise<SessionUserDTO> {
  const user = await requireUser()
  if (user.role !== 'ADMIN') throw new Error('FORBIDDEN')
  return user
}
