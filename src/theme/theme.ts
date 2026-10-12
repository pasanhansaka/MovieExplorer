import { createTheme, responsiveFontSizes, type Theme } from '@mui/material/styles'

export type ThemeMode = 'dark' | 'light'

const typographyTokens = {
  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  h1: {
    fontFamily: '"Outfit", "Inter", sans-serif',
    fontWeight: 800,
    letterSpacing: '-0.025em',
  },
  h2: {
    fontFamily: '"Outfit", "Inter", sans-serif',
    fontWeight: 700,
    letterSpacing: '-0.02em',
  },
  h3: {
    fontFamily: '"Outfit", "Inter", sans-serif',
    fontWeight: 700,
    letterSpacing: '-0.015em',
  },
  h4: {
    fontFamily: '"Outfit", "Inter", sans-serif',
    fontWeight: 600,
    letterSpacing: '-0.01em',
  },
  h5: {
    fontFamily: '"Outfit", "Inter", sans-serif',
    fontWeight: 600,
  },
  h6: {
    fontFamily: '"Outfit", "Inter", sans-serif',
    fontWeight: 600,
  },
  button: {
    fontFamily: '"Inter", sans-serif',
    fontWeight: 600,
    textTransform: 'none' as const,
    letterSpacing: '0.01em',
  },
}

export function createAppTheme(mode: ThemeMode): Theme {
  const isDark = mode === 'dark'

  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: '#F5A623', // Cinematic Amber
        light: '#FFBD59',
        dark: '#C77F0A',
        contrastText: '#0A0C10',
      },
      secondary: {
        main: '#8A63D2', // Subtle violet accent
        light: '#AA88EA',
        dark: '#6840B0',
        contrastText: '#FFFFFF',
      },
      background: {
        default: isDark ? '#0B0D13' : '#F8F9FC',
        paper: isDark ? '#141722' : '#FFFFFF',
      },
      text: {
        primary: isDark ? '#F5F7FA' : '#11151F',
        secondary: isDark ? '#98A2B3' : '#475467',
      },
      divider: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
      action: {
        hover: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)',
        selected: isDark ? 'rgba(245, 166, 35, 0.15)' : 'rgba(245, 166, 35, 0.12)',
      },
    },
    shape: {
      borderRadius: 12,
    },
    typography: typographyTokens,
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: isDark ? '#0B0D13' : '#F8F9FC',
            color: isDark ? '#F5F7FA' : '#11151F',
            minHeight: '100vh',
            transition: 'background-color 0.25s ease, color 0.25s ease',
          },
          '::selection': {
            backgroundColor: '#F5A623',
            color: '#0A0C10',
          },
          '*::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '*::-webkit-scrollbar-track': {
            background: isDark ? '#0B0D13' : '#F1F3F7',
          },
          '*::-webkit-scrollbar-thumb': {
            background: isDark ? '#262C3E' : '#C4CDD5',
            borderRadius: '4px',
          },
          '*::-webkit-scrollbar-thumb:hover': {
            background: '#F5A623',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: isDark ? '#141722' : '#FFFFFF',
            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 0, 0, 0.06)'}`,
            borderRadius: 14,
            boxShadow: isDark
              ? '0 4px 20px rgba(0, 0, 0, 0.4)'
              : '0 4px 20px rgba(0, 0, 0, 0.05)',
            transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            padding: '8px 18px',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: isDark
                ? '0 4px 14px rgba(245, 166, 35, 0.25)'
                : '0 4px 14px rgba(245, 166, 35, 0.2)',
            },
          },
          contained: {
            fontWeight: 700,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: isDark ? 'rgba(11, 13, 19, 0.85)' : 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(16px)',
            borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
            boxShadow: 'none',
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            backgroundColor: isDark ? '#141722' : '#FFFFFF',
            borderRadius: 18,
            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`,
          },
        },
      },
    },
  })

  return responsiveFontSizes(theme)
}
