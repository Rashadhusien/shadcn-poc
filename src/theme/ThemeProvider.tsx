import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { ThemeMode, ThemePreference } from './tokens'

interface ThemeContextValue {
  preference: ThemePreference
  resolvedTheme: ThemeMode
  setPreference: (preference: ThemePreference) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)
const storageKey = 'app-theme'

function readPreference(): ThemePreference {
  try {
    const stored = window.localStorage.getItem(storageKey)
    if (stored === 'light' || stored === 'dark' || stored === 'system')
      return stored
  } catch {
    // The HTML prepaint script already applied the best available initial theme.
  }
  return 'system'
}

function applyTheme(theme: ThemeMode) {
  const root = document.documentElement
  root.classList.toggle('dark', theme === 'dark')
  root.dataset.theme = theme
  root.style.colorScheme = theme
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreference] = useState<ThemePreference>(readPreference)
  const [systemPrefersDark, setSystemPrefersDark] = useState(
    () => window.matchMedia('(prefers-color-scheme: dark)').matches,
  )
  const resolvedTheme: ThemeMode =
    preference === 'system'
      ? systemPrefersDark
        ? 'dark'
        : 'light'
      : preference

  useEffect(() => {
    applyTheme(resolvedTheme)
    try {
      window.localStorage.setItem(storageKey, preference)
    } catch {
      // Theme remains available for the current session when storage is blocked.
    }
  }, [preference, resolvedTheme])

  useEffect(() => {
    if (preference !== 'system') return

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (event: MediaQueryListEvent) =>
      setSystemPrefersDark(event.matches)
    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [preference])

  const value = useMemo(
    () => ({ preference, resolvedTheme, setPreference }),
    [preference, resolvedTheme],
  )
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}
