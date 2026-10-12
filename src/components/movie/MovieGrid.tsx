import React, { useEffect, useRef } from 'react'
import { Box } from '@mui/material'
import type { Movie } from '../../types/movie.ts'
import type { FavoriteMovie } from '../../types/favorite.ts'
import { MovieCard } from './MovieCard.tsx'
import { animateEntrance } from '../../utils/animations.ts'

interface MovieGridProps {
  movies: (Movie | FavoriteMovie)[]
  animateOnMount?: boolean
}

export const MovieGrid: React.FC<MovieGridProps> = ({ movies, animateOnMount = true }) => {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!animateOnMount || !containerRef.current) return
    const cards = containerRef.current.querySelectorAll('.movie-grid-item')
    if (cards.length === 0) return

    const cleanup = animateEntrance(cards, {
      duration: 380,
      translateY: [20, 0],
      delay: (_el, i) => Math.min(i * 35, 300), // Max staggered delay cap
    })

    return cleanup
  }, [movies, animateOnMount])

  return (
    <Box
      ref={containerRef}
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(2, 1fr)',
          sm: 'repeat(3, 1fr)',
          md: 'repeat(4, 1fr)',
          lg: 'repeat(5, 1fr)',
        },
        gap: { xs: 2, sm: 2.5, md: 3 },
      }}
    >
      {movies.map((movie) => {
        const id = 'tmdb_movie_id' in movie ? movie.tmdb_movie_id : movie.id
        return (
          <Box key={id} className="movie-grid-item">
            <MovieCard movie={movie} />
          </Box>
        )
      })}
    </Box>
  )
}
