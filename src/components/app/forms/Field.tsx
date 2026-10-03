import { useId, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface FieldProps {
  label: string
  error?: string
  helperText?: string
  required?: boolean
  children: (field: { id: string; describedBy?: string; invalid: boolean }) => ReactNode
  className?: string
}

/**
 * Accessible field frame: label with required mark, error text linked via
 * aria-describedby, helper text. Validation display follows the same
 * validate-on-blur + submit-summary pattern on every form.
 */
export function Field({ label, error, helperText, required = false, children, className }: FieldProps) {
  const id = useId()
  const errorId = `${id}-error`
  const helperId = `${id}-helper`
  const describedBy = error != null ? errorId : helperText != null ? helperId : undefined
  return (
    <div className={className}>
      <label className="text-sm font-medium" htmlFor={id}>
        {label} {required && <span aria-hidden="true">*</span>}
      </label>
      {children({ id, describedBy, invalid: error != null })}
      {error != null ? (
        <p className="text-destructive mt-1 text-xs" id={errorId} role="alert">
          {error}
        </p>
      ) : helperText != null ? (
        <p className="text-muted-foreground mt-1 text-xs" id={helperId}>
          {helperText}
        </p>
      ) : null}
    </div>
  )
}

export function fieldInputClass(invalid: boolean, extra?: string): string {
  return cn(
    'border-input bg-background text-foreground placeholder:text-muted-foreground mt-1.5 min-h-11 w-full rounded-lg border px-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-60',
    invalid && 'border-destructive',
    extra,
  )
}
