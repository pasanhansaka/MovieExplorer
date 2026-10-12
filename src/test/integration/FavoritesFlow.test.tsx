import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { FavoritesPage } from '../../pages/FavoritesPage.tsx'
import { MovieCard } from '../../components/movie/MovieCard.tsx'
import { AppProviders } from '../../app/providers.tsx'
import type { Movie } from '../../types/movie.ts'

const testMovie: Movie = {
  id: 42,
  title: 'The Hitchhiker Guide to the Galaxy',
  overview: 'Arthur Dent is swept off the planet.',
  poster_path: '/galaxy.jpg',
  backdrop_path: '/space.jpg',
  release_date: '2005-04-28',
  vote_average: 6.8,
  vote_count: 3500,
}

// Mock authenticated user so favorites can be saved and retrieved in tests
vi.mock('../../features/auth/AuthContext.tsx', () => ({
  useAuth: () => ({
    user: { id: 'test-user-id', email: 'tester@example.com', username: 'Tester' },
    session: null,
    loading: false,
    error: null,
    signIn: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    refreshProfile: vi.fn(),
    isConfigured: false,
  }),
  AuthProvider: ({ children }: any) => <>{children}</>,
}))

describe('Favorites Flow Integration', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows empty state initially, adds favorite via MovieCard, and shows in FavoritesPage', async () => {
    // 1. Initial Favorites page is empty
    const { unmount } = render(
      <AppProviders>
        <BrowserRouter>
          <FavoritesPage />
        </BrowserRouter>
      </AppProviders>
    )

    expect(screen.getByText(/your watchlist is empty/i)).toBeInTheDocument()
    unmount()

    // 2. Add movie to favorites via MovieCard for authenticated user
    const { unmount: unmountCard } = render(
      <AppProviders>
        <BrowserRouter>
          <MovieCard movie={testMovie} />
        </BrowserRouter>
      </AppProviders>
    )

    const saveBtn = screen.getByRole('button', {
      name: /save the hitchhiker guide to the galaxy to favorites/i,
    })
    fireEvent.click(saveBtn)
    unmountCard()

    // 3. Render Favorites page again: movie should now appear
    render(
      <AppProviders>
        <BrowserRouter>
          <FavoritesPage />
        </BrowserRouter>
      </AppProviders>
    )

    await waitFor(() => {
      expect(
        screen.getByText('The Hitchhiker Guide to the Galaxy')
      ).toBeInTheDocument()
    })
  })
})
