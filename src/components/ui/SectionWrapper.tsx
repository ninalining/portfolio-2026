import type { SectionWrapperProps } from '@/types/section-wrapper'
import { cn } from '@/lib/utils'

export function SectionWrapper({
  id,
  children,
  className,
  'aria-label': ariaLabel,
}: SectionWrapperProps) {
  return (
    <section id={id} aria-label={ariaLabel} className={cn('py-24 px-6', className)}>
      <div className="max-w-6xl mx-auto">{children}</div>
    </section>
  )
}
