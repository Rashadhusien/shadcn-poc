import { Monitor, Moon, Sun } from 'lucide-react'
import { useId } from 'react'
import { useTheme } from './ThemeProvider'
import type { ThemePreference } from './tokens'

const options: { value: ThemePreference; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
]

export function ThemeSwitcher() {
  const { preference, setPreference } = useTheme()
  const id = useId()
  const Icon =
    preference === 'light' ? Sun : preference === 'dark' ? Moon : Monitor

  return (
    <div className="border-border bg-card flex min-h-[var(--dx-target-minimum)] items-center gap-2 rounded-xl border px-3">
      <Icon
        aria-hidden="true"
        className="text-muted-foreground size-4 shrink-0"
      />
      <label className="sr-only" htmlFor={id}>
        Color theme
      </label>
      <select
        className="text-foreground min-h-[var(--dx-target-minimum)] min-w-24 cursor-pointer bg-transparent pr-1 text-sm font-medium outline-none"
        id={id}
        onChange={(event) =>
          setPreference(event.target.value as ThemePreference)
        }
        value={preference}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
