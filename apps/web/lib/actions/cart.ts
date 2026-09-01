'use server'

import { revalidatePath } from 'next/cache'
import { mutateCart } from '@/lib/data/cart'

export async function addToCartAction(productId: string, quantity = 1): Promise<void> {
  await mutateCart(productId, 'add', quantity)
  revalidatePath('/cart')
  revalidatePath('/', 'layout')
}

export async function setCartQtyAction(productId: string, quantity: number): Promise<void> {
  await mutateCart(productId, 'set', quantity)
  revalidatePath('/cart')
  revalidatePath('/', 'layout')
}

export async function removeFromCartAction(productId: string): Promise<void> {
  await mutateCart(productId, 'remove')
  revalidatePath('/cart')
  revalidatePath('/', 'layout')
}
