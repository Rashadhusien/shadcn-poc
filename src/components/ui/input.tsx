import * as React from 'react'
import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type={type}
      className={cn(
        'border-input bg-background text-foreground placeholder:text-muted-foreground flex min-h-11 w-full rounded-lg border px-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-60 aria-[invalid=true]:border-destructive',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
