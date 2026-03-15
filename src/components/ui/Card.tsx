import type { CardProps } from '@/types/card'
import { cn } from '@/lib/utils'

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-card rounded-[var(--radius)] shadow-lg',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
