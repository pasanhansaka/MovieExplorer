import type { ThemeMode } from '../../theme/theme.ts'

export const THEME_STORAGE_KEY = 'movie-explorer:theme'

export function getInitialTheme(): ThemeMode {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY)
    if (saved === 'dark' || saved === 'light') {
      return saved
    }
  } catch {
    // Ignore storage errors
  }

  if (typeof window !== 'undefined' && window.matchMedia) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (prefersDark) return 'dark'
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches
    if (prefersLight) return 'light'
  }

  return 'dark' // Cinematic default
}
