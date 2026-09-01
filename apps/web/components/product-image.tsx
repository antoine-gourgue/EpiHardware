'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@epihardware/ui'

/**
 * Product image with a graceful branded fallback: if the remote photo fails to
 * load, we render a gradient tile with the product initial instead of a broken
 * image, so the catalogue never looks unfinished.
 */
export function ProductImage({
  src,
  alt,
  className,
  sizes,
  priority,
  fit = 'cover'
}: {
  src: string
  alt: string
  className?: string
  sizes?: string
  priority?: boolean
  /** `contain` shows the whole product (use on a white tile); `cover` fills the frame. */
  fit?: 'cover' | 'contain'
}) {
  const [failed, setFailed] = useState(false)

  if (failed || !src) {
    return (
      <div
        className={cn(
          'from-brand-500/15 text-brand-500/60 flex items-center justify-center bg-gradient-to-br to-violet-500/15',
          className
        )}
      >
        <span className="font-display text-4xl font-extrabold">{alt.charAt(0).toUpperCase()}</span>
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes ?? '(max-width: 768px) 100vw, 33vw'}
      priority={priority}
      onError={() => setFailed(true)}
      className={cn(fit === 'contain' ? 'object-contain' : 'object-cover', className)}
    />
  )
}
