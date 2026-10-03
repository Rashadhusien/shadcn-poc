import { Skeleton } from '@/components/ui/skeleton'
import { Field, fieldInputClass } from './Field'

interface FormTextFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  helperText?: string
  required?: boolean
  loading?: boolean
  disabled?: boolean
  type?: string
  placeholder?: string
  name?: string
  onBlur?: () => void
  multiline?: boolean
  minRows?: number
  min?: number
  max?: number
}

/**
 * Text input with normal / loading / empty / error / disabled states.
 * Controlled props work stand-alone or inside React Hook Form; domain rule
 * modules own every validation message.
 */
export function FormTextField({
  label,
  value,
  onChange,
  error,
  helperText,
  required = false,
  loading = false,
  disabled = false,
  type = 'text',
  placeholder,
  name,
  onBlur,
  multiline = false,
  minRows,
  min,
  max,
}: FormTextFieldProps) {
  if (loading) {
    return <Skeleton aria-label={`${label} loading`} className="h-14" role="status" />
  }
  return (
    <Field label={label} error={error} helperText={helperText} required={required}>
      {({ id, describedBy, invalid }) =>
        multiline ? (
          <textarea
            aria-describedby={describedBy}
            aria-invalid={invalid}
            aria-required={required}
            className={fieldInputClass(invalid, 'min-h-24 py-2')}
            disabled={disabled}
            id={id}
            name={name}
            onBlur={onBlur}
            onChange={(event) => {
              onChange(event.target.value)
            }}
            placeholder={placeholder}
            rows={minRows}
            value={value}
          />
        ) : (
          <input
            aria-describedby={describedBy}
            aria-invalid={invalid}
            aria-required={required}
            className={fieldInputClass(invalid)}
            disabled={disabled}
            id={id}
            max={max}
            min={min}
            name={name}
            onBlur={onBlur}
            onChange={(event) => {
              onChange(event.target.value)
            }}
            placeholder={placeholder}
            type={type}
            value={value}
          />
        )
      }
    </Field>
  )
}
