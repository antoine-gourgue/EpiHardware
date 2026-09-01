import * as React from 'react'
import { cn } from './cn'

/**
 * Minimal Slot — merges its props onto a single child element so components
 * can render `asChild` (e.g. a Button that is really a Next `<Link>`) without
 * pulling in a heavier dependency.
 */
export const Slot = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ children, className, ...props }, ref) => {
    if (!React.isValidElement(children)) return null
    const child = children as React.ReactElement<Record<string, unknown>>
    const childProps = child.props
    return React.cloneElement(child, {
      ...props,
      ...childProps,
      ref,
      className: cn(className, childProps.className as string | undefined)
    })
  }
)
Slot.displayName = 'Slot'
