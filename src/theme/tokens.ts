import tokenValues from './tokens.json'

export type Color = string

export interface ThemeTokens {
  modes: Record<'light' | 'dark', ThemeModeTokens>
  scale: {
    radius: string
    spacing: string
    targetMinimum: string
    breakpoints: Record<'md' | 'lg' | 'xl' | '2xl', string>
    fonts: { sans: string; mono: string }
    type: Record<string, { size: string; lineHeight: string }>
  }
  shadcnVariables: Record<string, string>
  semanticVariables: Record<string, string>
}

export interface ThemeModeTokens {
  primary: { main: Color; hover: Color; tint: Color; onColor: Color }
  secondary: { main: Color; hover: Color; foreground: Color }
  success: Color
  warning: Color
  error: Color
  errorOnColor: Color
  info: Color
  background: Color
  surface: Color
  surfaceElevated: Color
  border: Color
  divider: Color
  inputBorder: Color
  text: { primary: Color; secondary: Color; disabled: Color }
  action: { hover: Color; selected: Color }
  table: { header: Color; rowHover: Color; rowSelected: Color }
  statusBadges: Record<
    'success' | 'warning' | 'error' | 'info' | 'neutral',
    { background: Color; foreground: Color }
  >
  charts: Color[]
  trendArea: Color
  focusRing: Color
  sidebar: {
    background: Color
    foreground: Color
    border: Color
    active: Color
    activeForeground: Color
  }
}

export const tokens = tokenValues satisfies ThemeTokens
export type ThemeMode = keyof typeof tokens.modes
export type ThemePreference = ThemeMode | 'system'
