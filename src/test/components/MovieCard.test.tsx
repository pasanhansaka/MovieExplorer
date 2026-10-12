import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import { MovieCard } from '../../components/movie/MovieCard.tsx'
import { AppProviders } from '../../app/providers.tsx'
import type { Movie } from '../../types/movie.ts'

const mockMovie: Movie = {
  id: 101,
  title: 'Blade Runner 2049',
  overview: 'A young blade runner discovers a long-buried secret.',
  poster_path: '/poster123.jpg',
  backdrop_path: '/backdrop123.jpg',
  release_date: '2017-10-06',
  vote_average: 8.0,
  vote_count: 12000,
}

describe('MovieCard Component', () => {
  it('renders title, release year, rating badge, and poster image', () => {
    render(
      <AppProviders>
        <BrowserRouter>
          <MovieCard movie={mockMovie} />
        </BrowserRouter>
      </AppProviders>
    )

    expect(screen.getByRole('heading', { name: 'Blade Runner 2049' })).toBeInTheDocument()
    expect(screen.getByText('2017')).toBeInTheDocument()
    expect(screen.getByText('8.0')).toBeInTheDocument()

    const poster = screen.getByRole('img', { name: 'Blade Runner 2049' })
    expect(poster).toHaveAttribute(
      'src',
      'https://image.tmdb.org/t/p/w500/poster123.jpg'
    )
  })

  it('renders fallback poster container when poster_path is null', () => {
    const movieNoPoster: Movie = {
      ...mockMovie,
      id: 102,
      title: 'Indie Film Without Poster',
      poster_path: null,
    }

    render(
      <AppProviders>
        <BrowserRouter>
          <MovieCard movie={movieNoPoster} />
        </BrowserRouter>
      </AppProviders>
    )

    expect(
      screen.getByRole('heading', { name: 'Indie Film Without Poster' })
    ).toBeInTheDocument()
    expect(screen.getByText('No Poster Available')).toBeInTheDocument()
  })

  it('allows toggling favorite state on button click', () => {
    render(
      <AppProviders>
        <BrowserRouter>
          <MovieCard movie={mockMovie} />
        </BrowserRouter>
      </AppProviders>
    )

    const favBtn = screen.getByRole('button', {
      name: /save blade runner 2049 to favorites/i,
    })
    expect(favBtn).toBeInTheDocument()

    fireEvent.click(favBtn)

    // Should update aria-label to remove
    const removeBtn = screen.getByRole('button', {
      name: /remove blade runner 2049 from favorites/i,
    })
    expect(removeBtn).toBeInTheDocument()
  })
})
