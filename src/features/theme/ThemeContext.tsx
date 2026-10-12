import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material'
import { createAppTheme, type ThemeMode } from '../../theme/theme.ts'
import { getInitialTheme, THEME_STORAGE_KEY } from './themeUtils.ts'

interface ThemeContextType {
  mode: ThemeMode
  toggleTheme: () => void
  setMode: (mode: ThemeMode) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const AppThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>(getInitialTheme)

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newMode)
    } catch {
      // Storage unavailable or quota exceeded
    }
  }

  const toggleTheme = () => {
    setMode(mode === 'dark' ? 'light' : 'dark')
  }

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode)
  }, [mode])

  const theme = useMemo(() => createAppTheme(mode), [mode])

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, setMode }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  )
}

export function useAppTheme(): ThemeContextType {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useAppTheme must be used within an AppThemeProvider')
  }
  return context
}
