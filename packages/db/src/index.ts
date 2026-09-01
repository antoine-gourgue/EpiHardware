import { PrismaClient } from '@prisma/client'

export * from '@prisma/client'
export * from './demo-data'

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

/**
 * Prisma singleton — reused across hot reloads in development so we don't
 * exhaust the connection pool. In demo mode this client is never queried.
 */
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error']
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
