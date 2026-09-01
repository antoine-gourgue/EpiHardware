import type { NextAuthConfig, DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      login: string
      firstName: string
      lastName: string
      role: 'USER' | 'ADMIN'
    } & DefaultSession['user']
  }

  interface User {
    id?: string
    login: string
    firstName: string
    lastName: string
    role: 'USER' | 'ADMIN'
  }
}

/**
 * Edge-safe auth configuration shared by the middleware and the full server
 * instance. It deliberately declares no providers, so importing it never pulls
 * Prisma or bcrypt into the Edge Runtime bundle — the Credentials provider is
 * added only in `auth.ts` (Node runtime).
 */
export const authConfig: NextAuthConfig = {
  session: { strategy: 'jwt' },
  trustHost: true,
  pages: { signIn: '/login' },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id ?? token.sub ?? ''
        token.login = user.login
        token.firstName = user.firstName
        token.lastName = user.lastName
        token.role = user.role
      }
      return token
    },
    session({ session, token }) {
      // The default JWT carries an index signature, so we read our custom
      // claims back with narrow casts rather than a module augmentation.
      session.user.id = (token.id as string) ?? ''
      session.user.login = (token.login as string) ?? ''
      session.user.firstName = (token.firstName as string) ?? ''
      session.user.lastName = (token.lastName as string) ?? ''
      session.user.role = (token.role as 'USER' | 'ADMIN') ?? 'USER'
      return session
    }
  }
}
