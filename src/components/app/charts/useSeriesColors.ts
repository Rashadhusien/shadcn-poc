import { tokens } from '@/theme/tokens'
import { useTheme } from '@/theme/ThemeProvider'

/** Validated chart series colors for the active color mode. */
export function useSeriesColors(): readonly string[] {
  const { resolvedTheme } = useTheme()
  return tokens.modes[resolvedTheme].charts
}
