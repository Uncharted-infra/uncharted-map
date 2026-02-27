import * as React from 'react'
import type { VariantProps } from 'class-variance-authority'
import { Button, type buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface GrowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: VariantProps<typeof buttonVariants>['size']
  children?: React.ReactNode
  asChild?: boolean
}

const PrimaryGrowButton = React.forwardRef<HTMLButtonElement, GrowButtonProps>(
  ({ children, asChild = false, size, className, ...rest }, ref) => (
    <Button
      ref={ref}
      variant="ghost"
      size={size}
      asChild={asChild}
      className={cn(
        'rounded-lg duration-200 ease-in-out active:-translate-x-0.5 active:translate-y-0.5',

        // Light theme: light/white button with dark text
        'bg-card text-card-foreground border-0 shadow-none hover:bg-accent hover:text-accent-foreground',

        // Dark theme: dark button with light text
        'dark:bg-card dark:text-card-foreground dark:hover:bg-accent dark:hover:text-accent-foreground',

        // size-based adjustments
        size === 'lg' && 'text-base has-[>svg]:px-6',

        className
      )}
      {...rest}
    >
      {children}
    </Button>
  )
)
PrimaryGrowButton.displayName = 'PrimaryGrowButton'

const SecondaryGrowButton = React.forwardRef<HTMLButtonElement, GrowButtonProps>(
  ({ children, size, asChild = false, className, ...rest }, ref) => (
    <Button
      ref={ref}
      variant="ghost"
      size={size}
      asChild={asChild}
      className={cn(
        'cursor-pointer rounded-lg active:scale-95',

        // Light theme: light/white button with dark text
        'bg-card text-card-foreground border-0 hover:bg-accent hover:text-accent-foreground',

        // Dark theme: dark button with light text
        'dark:bg-card dark:text-card-foreground dark:hover:bg-accent dark:hover:text-accent-foreground',

        // size-based adjustments
        size === 'lg' && 'text-base has-[>svg]:px-6',

        className
      )}
      {...rest}
    >
      {children}
    </Button>
  )
)
SecondaryGrowButton.displayName = 'SecondaryGrowButton'

const DestructiveGrowButton = React.forwardRef<HTMLButtonElement, GrowButtonProps>(
  ({ children, size, asChild = false, className, ...rest }, ref) => (
    <Button
      ref={ref}
      variant="ghost"
      size={size}
      asChild={asChild}
      className={cn(
        'cursor-pointer rounded-lg active:scale-95',
        'bg-destructive text-destructive-foreground border-0 hover:bg-destructive/90',
        size === 'lg' && 'text-base has-[>svg]:px-6',
        className
      )}
      {...rest}
    >
      {children}
    </Button>
  )
)
DestructiveGrowButton.displayName = 'DestructiveGrowButton'

export { PrimaryGrowButton, SecondaryGrowButton, DestructiveGrowButton, type GrowButtonProps }
