import { Badge, type BadgeProps } from '@epihardware/ui'
import type { OrderDTO } from '@/lib/types'

const LABELS: Record<OrderDTO['status'], { label: string; variant: BadgeProps['variant'] }> = {
  PENDING: { label: 'En attente', variant: 'warning' },
  PAID: { label: 'Payée', variant: 'success' },
  SHIPPED: { label: 'Expédiée', variant: 'brand' },
  DELIVERED: { label: 'Livrée', variant: 'neutral' },
  CANCELLED: { label: 'Annulée', variant: 'danger' }
}

export function OrderStatusBadge({ status }: { status: OrderDTO['status'] }) {
  const { label, variant } = LABELS[status]
  return <Badge variant={variant}>{label}</Badge>
}
