import * as React from 'react'
import * as SwitchPrimitive from '@radix-ui/react-switch'
import { cn } from '@/lib/utils'

function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        'bg-input data-[state=checked]:bg-primary h-6 w-11 shrink-0 cursor-pointer rounded-full p-0.5 outline-none disabled:cursor-not-allowed disabled:opacity-60 [&>span]:block [&>span]:size-5 [&>span]:rounded-full [&>span]:bg-white [&>span]:transition-transform [&>span]:data-[state=checked]:translate-x-5',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
