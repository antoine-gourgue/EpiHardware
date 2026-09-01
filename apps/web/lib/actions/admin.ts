'use server'

import { revalidatePath } from 'next/cache'
import { prisma, Prisma } from '@epihardware/db'
import { isDemoMode } from '@/lib/env'
import { getCurrentUser } from '@/lib/session'
import { productSchema } from '@/lib/validators'
import { slugify } from '@/lib/slug'
import type { ActionState } from './auth'

async function guard(): Promise<ActionState | null> {
  const user = await getCurrentUser()
  if (!user) return { ok: false, error: 'Non authentifié' }
  if (user.role !== 'ADMIN') return { ok: false, error: 'Accès réservé aux administrateurs' }
  if (isDemoMode) return { ok: false, error: 'Écriture désactivée en mode démo.' }
  return null
}

function parse(input: Record<string, unknown>) {
  const parsed = productSchema.safeParse(input)
  if (parsed.success) return { data: parsed.data }
  const fieldErrors: Record<string, string> = {}
  for (const issue of parsed.error.issues) {
    const key = issue.path[0]
    if (typeof key === 'string' && !fieldErrors[key]) fieldErrors[key] = issue.message
  }
  return { fieldErrors }
}

export async function createProductAction(input: Record<string, unknown>): Promise<ActionState> {
  const denied = await guard()
  if (denied) return denied
  const { data, fieldErrors } = parse(input)
  if (!data) return { ok: false, fieldErrors }

  let slug = slugify(data.name)
  if (await prisma.product.findUnique({ where: { slug } })) {
    slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`
  }

  await prisma.product.create({
    data: {
      name: data.name,
      slug,
      description: data.description,
      price: new Prisma.Decimal(data.price),
      stock: data.stock,
      imageUrl: data.imageUrl,
      featured: Boolean(data.featured),
      categoryId: data.categoryId,
      brandId: data.brandId || null
    }
  })
  revalidatePath('/admin/products')
  revalidatePath('/products')
  return { ok: true }
}

export async function updateProductAction(
  id: string,
  input: Record<string, unknown>
): Promise<ActionState> {
  const denied = await guard()
  if (denied) return denied
  const { data, fieldErrors } = parse(input)
  if (!data) return { ok: false, fieldErrors }

  await prisma.product.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      price: new Prisma.Decimal(data.price),
      stock: data.stock,
      imageUrl: data.imageUrl,
      featured: Boolean(data.featured),
      categoryId: data.categoryId,
      brandId: data.brandId || null
    }
  })
  revalidatePath('/admin/products')
  revalidatePath('/products')
  return { ok: true }
}

export async function deleteProductAction(id: string): Promise<ActionState> {
  const denied = await guard()
  if (denied) return denied
  await prisma.product.delete({ where: { id } })
  revalidatePath('/admin/products')
  revalidatePath('/products')
  return { ok: true }
}
