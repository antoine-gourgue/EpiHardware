import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from '@epihardware/db'
import { DEMO_USERS } from '@epihardware/db/demo'
import { isDemoMode } from './env'
import { authConfig } from './auth.config'

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' }
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? '')
          .trim()
          .toLowerCase()
        const password = String(credentials?.password ?? '')
        if (!email || !password) return null

        if (isDemoMode) {
          const demo = DEMO_USERS.find((u) => u.email === email)
          if (!demo || password !== demo.password) return null
          return {
            id: demo.login,
            email: demo.email,
            name: `${demo.firstName} ${demo.lastName}`,
            login: demo.login,
            firstName: demo.firstName,
            lastName: demo.lastName,
            role: demo.role
          }
        }

        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) return null
        const valid = await bcrypt.compare(password, user.password)
        if (!valid) return null
        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          login: user.login,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        }
      }
    })
  ]
})
