import { Toaster, toast } from 'sonner'
import { useTheme } from '@/theme/ThemeProvider'

export type ToastSeverity = 'success' | 'error' | 'info'

export interface ToastOptions {
  severity?: ToastSeverity
  description?: string
  actionLabel?: string
  onAction?: () => void
}

/**
 * Toast system: one toast visible at a time (a new toast replaces the
 * current one). Success/info use role="status" (polite); errors use
 * role="alert" (assertive). Errors with an action stay until dismissed.
 */
export function showToast(message: string, options?: ToastOptions): void {
  const severity = options?.severity ?? 'info'
  const action =
    options?.actionLabel != null && options.onAction != null
      ? { label: options.actionLabel, onClick: options.onAction }
      : undefined
  // Errors with an action persist; everything else auto-dismisses.
  const duration = severity === 'error' && action != null ? Infinity : 5000
  toast(message, { description: options?.description, action, duration })
}

export function dismissToast(): void {
  toast.dismiss()
}

/** Mount once near the app root. Follows the active color mode. */
export function ToastProvider() {
  const { resolvedTheme } = useTheme()
  return <Toaster position="bottom-center" theme={resolvedTheme} toastOptions={{}} />
}
