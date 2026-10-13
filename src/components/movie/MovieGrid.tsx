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
  const animatedIdsRef = useRef<Set<number>>(new Set())
  const prevFirstIdRef = useRef<number | null>(null)

  // Identify the first movie to detect catalog / filter changes
  const firstMovie = movies[0]
  const currentFirstId = firstMovie
    ? 'tmdb_movie_id' in firstMovie
      ? firstMovie.tmdb_movie_id
      : firstMovie.id
    : null

  // If catalog completely resets or switches (e.g. new search query or tab switch), reset animated IDs
  if (currentFirstId !== prevFirstIdRef.current) {
    prevFirstIdRef.current = currentFirstId
    animatedIdsRef.current = new Set()
  }

  useEffect(() => {
    if (!animateOnMount || !containerRef.current) return

    const cardElements = containerRef.current.querySelectorAll<HTMLElement>('.movie-grid-item')
    const unAnimatedElements: HTMLElement[] = []

    cardElements.forEach((el) => {
      const idStr = el.getAttribute('data-movie-id')
      const id = idStr ? parseInt(idStr, 10) : 0
      if (id && !animatedIdsRef.current.has(id)) {
        animatedIdsRef.current.add(id)
        unAnimatedElements.push(el)
      }
    })

    // If all cards were already animated (e.g. during infinite scrolling appending new items),
    // NEVER re-animate or reset existing cards to avoid any screen blackout or reload flickering!
    if (unAnimatedElements.length === 0) return

    const cleanup = animateEntrance(unAnimatedElements, {
      duration: 350,
      translateY: [16, 0],
      delay: (_el, i) => Math.min(i * 30, 240),
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
          <Box key={id} data-movie-id={id} className="movie-grid-item">
            <MovieCard movie={movie} />
          </Box>
        )
      })}
    </Box>
  )
}
