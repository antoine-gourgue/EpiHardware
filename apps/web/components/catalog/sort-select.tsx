'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Select } from '@epihardware/ui'
import { SORT_OPTIONS } from '@/lib/query'

export function SortSelect({ value }: { value: string }) {
  const router = useRouter()
  const params = useSearchParams()

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const sp = new URLSearchParams(params.toString())
    if (e.target.value === 'featured') sp.delete('sort')
    else sp.set('sort', e.target.value)
    sp.delete('page')
    router.push(`/products?${sp.toString()}`)
  }

  return (
    <Select value={value} onChange={onChange} className="w-48" aria-label="Trier">
      {SORT_OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </Select>
  )
}
