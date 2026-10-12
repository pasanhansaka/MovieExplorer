import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppThemeProvider } from '../features/theme/ThemeContext.tsx'
import { AuthProvider } from '../features/auth/AuthContext.tsx'
import { FavoritesProvider } from '../features/favorites/FavoritesContext.tsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: (failureCount, error: any) => {
        // Do not retry on 404 or 400 bad request
        if (error?.response?.status === 404 || error?.response?.status === 400) {
          return false
        }
        return failureCount < 2
      },
      refetchOnWindowFocus: false,
    },
  },
})

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppThemeProvider>
        <AuthProvider>
          <FavoritesProvider>{children}</FavoritesProvider>
        </AuthProvider>
      </AppThemeProvider>
    </QueryClientProvider>
  )
}
