import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getInitialTheme } from '../../features/theme/themeUtils.ts'

describe('Theme Persistence and Initialization', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('reads light theme from localStorage if stored', () => {
    localStorage.setItem('movie-explorer:theme', 'light')
    expect(getInitialTheme()).toBe('light')
  })

  it('reads dark theme from localStorage if stored', () => {
    localStorage.setItem('movie-explorer:theme', 'dark')
    expect(getInitialTheme()).toBe('dark')
  })

  it('respects system prefers-color-scheme when nothing is stored', () => {
    // Mock system preference dark
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query.includes('dark'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))

    expect(getInitialTheme()).toBe('dark')
  })

  it('respects system preference light when nothing is stored', () => {
    // Mock system preference light
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: !query.includes('dark'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))

    expect(getInitialTheme()).toBe('light')
  })
})
