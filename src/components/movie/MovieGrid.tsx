import React from 'react'
import { Box } from '@mui/material'
import type { Movie } from '../../types/movie.ts'
import type { FavoriteMovie } from '../../types/favorite.ts'
import { MovieCard } from './MovieCard.tsx'

interface MovieGridProps {
  movies: (Movie | FavoriteMovie)[]
  animateOnMount?: boolean
}

export const MovieGrid: React.FC<MovieGridProps> = ({ movies, animateOnMount = true }) => {
  return (
    <Box
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
          <Box
            key={id}
            className="movie-grid-item"
            sx={{
              willChange: 'opacity, transform',
              animation: animateOnMount
                ? 'movieCardEntrance 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) both'
                : 'none',
              '@keyframes movieCardEntrance': {
                '0%': {
                  opacity: 0,
                  transform: 'translateY(12px)',
                },
                '100%': {
                  opacity: 1,
                  transform: 'translateY(0)',
                },
              },
            }}
          >
            <MovieCard movie={movie} />
          </Box>
        )
      })}
    </Box>
  )
}
