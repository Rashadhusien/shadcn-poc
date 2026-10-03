import { Loader2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface ConfirmDialogProps {
  open: boolean
  title: string
  body: string
  confirmLabel: string
  cancelLabel?: string
  destructive?: boolean
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

/**
 * ConfirmDialog: mandatory confirmation for cancel/delete. Traps focus,
 * returns focus to the trigger on close, Esc cancels (unless loading).
 * Destructive variant styles the confirm button danger.
 */
export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel,
  cancelLabel = 'Cancel',
  destructive = false,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        if (!next && !loading) onCancel()
      }}
    >
      <AlertDialogContent
        aria-describedby="confirm-dialog-body"
        aria-labelledby="confirm-dialog-title"
        onEscapeKeyDown={(event) => {
          if (loading) event.preventDefault()
        }}
      >
        <AlertDialogTitle destructive={destructive} id="confirm-dialog-title">
          {title}
        </AlertDialogTitle>
        <AlertDialogDescription id="confirm-dialog-body">{body}</AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            onClick={(event) => {
              event.preventDefault()
              onConfirm()
            }}
            variant={destructive ? 'danger' : 'primary'}
          >
            {loading && <Loader2 aria-hidden="true" className="animate-spin" />}
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
