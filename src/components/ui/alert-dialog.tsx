import * as React from 'react'
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'
import { TriangleAlert } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './button'

function AlertDialog({ ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Root>) {
  return <AlertDialogPrimitive.Root {...props} />
}

function AlertDialogContent({ className, children, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Content>) {
  return (
    <AlertDialogPrimitive.Portal>
      <AlertDialogPrimitive.Overlay className="overlay-backdrop" />
      <AlertDialogPrimitive.Content className={cn('overlay-panel max-h-[85vh] overflow-y-auto', className)} {...props}>
        {children}
      </AlertDialogPrimitive.Content>
    </AlertDialogPrimitive.Portal>
  )
}

function AlertDialogTitle({ className, destructive = false, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Title> & { destructive?: boolean }) {
  return (
    <AlertDialogPrimitive.Title className={cn('text-section flex items-center gap-2 font-semibold tracking-tight', className)} {...props}>
      {destructive && <TriangleAlert aria-hidden="true" className="text-destructive size-5 shrink-0" />}
      {props.children}
    </AlertDialogPrimitive.Title>
  )
}

function AlertDialogDescription({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return <AlertDialogPrimitive.Description className={cn('text-muted-foreground mt-2 text-sm leading-6', className)} {...props} />
}

function AlertDialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)} {...props} />
}

function AlertDialogCancel({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Cancel>) {
  return (
    <AlertDialogPrimitive.Cancel asChild>
      <Button className={className} variant="outline" {...props} />
    </AlertDialogPrimitive.Cancel>
  )
}

function AlertDialogAction({ className, variant = 'primary', ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Action> & { variant?: 'primary' | 'danger' }) {
  return (
    <AlertDialogPrimitive.Action asChild>
      <Button className={className} variant={variant === 'danger' ? 'danger' : 'primary'} {...props} />
    </AlertDialogPrimitive.Action>
  )
}

export {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
}
