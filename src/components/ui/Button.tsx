import type { ButtonHTMLAttributes } from 'react'
import type { ButtonVariant, ButtonProps, ButtonAsAnchor } from '@/types/button'
import { cn } from '@/lib/utils'

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:opacity-90',
  outline:
    'border-2 border-primary text-primary bg-transparent hover:bg-primary/10',
  ghost:
    'bg-transparent text-foreground hover:bg-muted',
}

const baseClasses =
  'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'

export function Button({ children, variant = 'primary', className, ...props }: ButtonProps) {
  const classes = cn(baseClasses, variantClasses[variant], className)

  if ('href' in props && props.href !== undefined) {
    const { href, ...anchorProps } = props as ButtonAsAnchor
    return (
      <a href={href} className={classes} {...anchorProps}>
        {children}
      </a>
    )
  }

  const buttonProps = props as ButtonHTMLAttributes<HTMLButtonElement>
  return (
    <button type="button" className={classes} {...buttonProps}>
      {children}
    </button>
  )
}
