import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Field } from './Field'
import { cn } from '@/lib/utils'

export interface FormSelectOption<T extends string | number> {
  value: T
  label: string
}

interface FormSelectProps<T extends string | number> {
  label: string
  options: FormSelectOption<T>[]
  value: T | null
  onChange: (value: T | null) => void
  error?: string
  loading?: boolean
  emptyText?: string
  disabled?: boolean
  required?: boolean
  name?: string
  onBlur?: () => void
  placeholder?: string
}

/**
 * Select with normal / loading / empty / error / disabled states.
 * Keyboard-capable themed popover (native popup rejected for parity).
 */
export function FormSelect<T extends string | number>({
  label,
  options,
  value,
  onChange,
  error,
  loading = false,
  emptyText = 'No options available',
  disabled = false,
  required = false,
  name,
  onBlur,
  placeholder = 'Select…',
}: FormSelectProps<T>) {
  if (loading) {
    return <Skeleton aria-label={`${label} loading`} className="h-14" role="status" />
  }
  const isEmpty = options.length === 0
  const effectiveDisabled = disabled || isEmpty
  return (
    <Field label={label} error={error ?? (isEmpty ? emptyText : undefined)} required={required}>
      {({ id, describedBy, invalid }) => (
        <Select
          disabled={effectiveDisabled}
          name={name}
          onValueChange={(next) => {
            if (next === '') {
              onChange(null)
              return
            }
            const match = options.find((option) => String(option.value) === next)
            onChange(match?.value ?? (next as T))
          }}
          required={required}
          value={value == null ? '' : String(value)}
        >
          <SelectTrigger
            aria-describedby={describedBy}
            aria-invalid={invalid}
            aria-required={required}
            id={id}
            onBlur={onBlur}
            className={cn('mt-1.5', invalid && 'border-destructive')}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {isEmpty ? (
              <SelectItem disabled value="">
                {emptyText}
              </SelectItem>
            ) : (
              options.map((option) => (
                <SelectItem key={String(option.value)} value={String(option.value)}>
                  {option.label}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      )}
    </Field>
  )
}
