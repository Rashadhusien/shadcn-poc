import * as React from 'react'
import { cn } from '@/lib/utils'

function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        'border-input bg-background text-foreground placeholder:text-muted-foreground min-h-24 w-full rounded-lg border px-3 py-2 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-60 aria-[invalid=true]:border-destructive',
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
