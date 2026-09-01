import {
  Cpu,
  CircuitBoard,
  Monitor,
  Keyboard,
  Mouse,
  HardDrive,
  MemoryStick,
  Headphones,
  Package,
  type LucideIcon
} from 'lucide-react'

const MAP: Record<string, LucideIcon> = {
  Cpu,
  CircuitBoard,
  Monitor,
  Keyboard,
  Mouse,
  HardDrive,
  MemoryStick,
  Headphones
}

export function CategoryIcon({
  name,
  className
}: {
  name: string | null | undefined
  className?: string
}) {
  const Icon = (name && MAP[name]) || Package
  return <Icon className={className} />
}
