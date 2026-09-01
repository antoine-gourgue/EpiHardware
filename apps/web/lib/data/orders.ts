import 'server-only'
import { cookies } from 'next/headers'
import { prisma, Prisma } from '@epihardware/db'
import { isDemoMode } from '../env'
import { toNumber } from '../format'
import type { OrderDTO, SessionUserDTO } from '../types'
import { getCart } from './cart'

const DEMO_ORDERS_COOKIE = 'epi_orders'

function reference(): string {
  return `EPI-${Math.random().toString(36).slice(2, 10).toUpperCase()}`
}

async function readDemoOrders(): Promise<OrderDTO[]> {
  const store = await cookies()
  const raw = store.get(DEMO_ORDERS_COOKIE)?.value
  if (!raw) return []
  try {
    return JSON.parse(raw) as OrderDTO[]
  } catch {
    return []
  }
}

async function writeDemoOrders(orders: OrderDTO[]): Promise<void> {
  const store = await cookies()
  // Keep the cookie small — only the most recent orders.
  store.set(DEMO_ORDERS_COOKIE, JSON.stringify(orders.slice(0, 10)), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30
  })
}

/** Turn the current cart into an order. Returns the created order id. */
export async function checkout(user: SessionUserDTO): Promise<string | null> {
  const cart = await getCart()
  if (cart.lines.length === 0) return null

  if (isDemoMode) {
    const order: OrderDTO = {
      id: reference(),
      reference: reference(),
      status: 'PAID',
      total: cart.subtotal,
      createdAt: new Date().toISOString(),
      items: cart.lines.map((l) => ({
        id: l.productId,
        name: l.name,
        imageUrl: l.imageUrl,
        unitPrice: l.price,
        quantity: l.quantity,
        productSlug: l.slug
      }))
    }
    const existing = await readDemoOrders()
    await writeDemoOrders([order, ...existing])
    return order.id
  }

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        reference: reference(),
        userId: user.id,
        status: 'PAID',
        total: new Prisma.Decimal(cart.subtotal),
        items: {
          create: cart.lines.map((l) => ({
            productId: l.productId,
            name: l.name,
            imageUrl: l.imageUrl,
            unitPrice: new Prisma.Decimal(l.price),
            quantity: l.quantity
          }))
        }
      }
    })
    // Decrement stock, never below zero.
    for (const line of cart.lines) {
      await tx.product.update({
        where: { id: line.productId },
        data: { stock: { decrement: Math.min(line.quantity, line.stock) } }
      })
    }
    return created
  })

  return order.id
}

export async function getUserOrders(user: SessionUserDTO): Promise<OrderDTO[]> {
  if (isDemoMode) return readDemoOrders()
  const rows = await prisma.order.findMany({
    where: { userId: user.id },
    include: { items: { include: { product: { select: { slug: true } } } } },
    orderBy: { createdAt: 'desc' }
  })
  return rows.map((o) => ({
    id: o.id,
    reference: o.reference,
    status: o.status,
    total: toNumber(o.total),
    createdAt: o.createdAt.toISOString(),
    items: o.items.map((it) => ({
      id: it.id,
      name: it.name,
      imageUrl: it.imageUrl,
      unitPrice: toNumber(it.unitPrice),
      quantity: it.quantity,
      productSlug: it.product?.slug ?? null
    }))
  }))
}

export async function getOrderById(id: string, user: SessionUserDTO): Promise<OrderDTO | null> {
  if (isDemoMode) {
    return (await readDemoOrders()).find((o) => o.id === id) ?? null
  }
  const o = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: { select: { slug: true } } } } }
  })
  if (!o) return null
  if (o.userId !== user.id && user.role !== 'ADMIN') return null
  return {
    id: o.id,
    reference: o.reference,
    status: o.status,
    total: toNumber(o.total),
    createdAt: o.createdAt.toISOString(),
    items: o.items.map((it) => ({
      id: it.id,
      name: it.name,
      imageUrl: it.imageUrl,
      unitPrice: toNumber(it.unitPrice),
      quantity: it.quantity,
      productSlug: it.product?.slug ?? null
    }))
  }
}
