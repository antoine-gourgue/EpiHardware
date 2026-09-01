const priceFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR'
})

const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
  day: '2-digit',
  month: 'long',
  year: 'numeric'
})

/** Accepts a number, string or Prisma Decimal-like value. */
export function formatPrice(value: number | string | { toString(): string }): string {
  const n = typeof value === 'number' ? value : Number(value.toString())
  return priceFormatter.format(n)
}

export function formatDate(value: Date | string): string {
  return dateFormatter.format(typeof value === 'string' ? new Date(value) : value)
}

export function toNumber(value: number | string | { toString(): string }): number {
  return typeof value === 'number' ? value : Number(value.toString())
}
