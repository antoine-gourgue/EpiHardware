import 'server-only'
import { cookies } from 'next/headers'
import type { CartDTO, CartLineDTO } from '../types'
import { getProductsByIds } from './catalog'

const CART_COOKIE = 'epi_cart'
const MAX_QTY = 20

interface RawLine {
  id: string
  qty: number
}

/**
 * The cart lives in a cookie, so it persists across requests for guests and
 * signed-in users alike and needs no database round-trip to read. Quantities
 * are stored explicitly, fixing the original app's non-persisted-quantity bug.
 */
async function readRaw(): Promise<RawLine[]> {
  const store = await cookies()
  const raw = store.get(CART_COOKIE)?.value
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as RawLine[]
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((l) => l && typeof l.id === 'string' && Number.isFinite(l.qty))
      .map((l) => ({ id: l.id, qty: Math.min(MAX_QTY, Math.max(1, Math.floor(l.qty))) }))
  } catch {
    return []
  }
}

export async function writeRaw(lines: RawLine[]): Promise<void> {
  const store = await cookies()
  if (lines.length === 0) {
    store.delete(CART_COOKIE)
    return
  }
  store.set(CART_COOKIE, JSON.stringify(lines), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30
  })
}

export async function getCart(): Promise<CartDTO> {
  const raw = await readRaw()
  if (raw.length === 0) return { lines: [], itemCount: 0, subtotal: 0 }

  const products = await getProductsByIds(raw.map((l) => l.id))
  const byId = new Map(products.map((p) => [p.id, p]))

  const lines: CartLineDTO[] = raw
    .map((l) => {
      const p = byId.get(l.id)
      if (!p) return null
      return {
        productId: p.id,
        name: p.name,
        slug: p.slug,
        imageUrl: p.imageUrl,
        price: p.price,
        quantity: Math.min(l.qty, Math.max(1, p.stock)),
        stock: p.stock
      }
    })
    .filter((l): l is CartLineDTO => l !== null)

  return {
    lines,
    itemCount: lines.reduce((n, l) => n + l.quantity, 0),
    subtotal: lines.reduce((s, l) => s + l.price * l.quantity, 0)
  }
}

export async function mutateCart(
  productId: string,
  action: 'add' | 'set' | 'remove',
  quantity = 1
): Promise<void> {
  const raw = await readRaw()
  const idx = raw.findIndex((l) => l.id === productId)

  if (action === 'remove') {
    await writeRaw(raw.filter((l) => l.id !== productId))
    return
  }
  if (action === 'set') {
    const qty = Math.min(MAX_QTY, Math.max(1, quantity))
    if (idx >= 0) raw[idx]!.qty = qty
    else raw.push({ id: productId, qty })
    await writeRaw(raw)
    return
  }
  // add
  if (idx >= 0) raw[idx]!.qty = Math.min(MAX_QTY, raw[idx]!.qty + quantity)
  else raw.push({ id: productId, qty: Math.min(MAX_QTY, Math.max(1, quantity)) })
  await writeRaw(raw)
}

export async function clearCart(): Promise<void> {
  await writeRaw([])
}
