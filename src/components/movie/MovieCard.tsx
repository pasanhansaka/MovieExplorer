import React, { useRef, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  IconButton,
  Chip,
  Tooltip,
} from '@mui/material'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded'
import BookmarkRoundedIcon from '@mui/icons-material/BookmarkRounded'
import MovieCreationOutlinedIcon from '@mui/icons-material/MovieCreationOutlined'
import type { Movie } from '../../types/movie.ts'
import type { FavoriteMovie } from '../../types/favorite.ts'
import { formatRating, formatReleaseYear, getTMDBImageUrl } from '../../utils/formatters.ts'
import { useFavorites } from '../../features/favorites/FavoritesContext.tsx'
import { animateFavoritePop } from '../../utils/animations.ts'

interface MovieCardProps {
  movie: Movie | FavoriteMovie
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const { isFavorite, toggleFavorite } = useFavorites()
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const favBtnRef = useRef<HTMLButtonElement | null>(null)

  const movieId = 'tmdb_movie_id' in movie ? movie.tmdb_movie_id : movie.id
  const favorited = isFavorite(movieId)
  const posterUrl = getTMDBImageUrl(movie.poster_path, 'w500')
  const rating = formatRating(movie.vote_average)
  const releaseYear = formatReleaseYear(movie.release_date)

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (favBtnRef.current) {
      animateFavoritePop(favBtnRef.current)
    }
    toggleFavorite(movie)
  }

  return (
    <Card
      component={RouterLink}
      to={`/movie/${movieId}`}
      sx={{
        textDecoration: 'none',
        color: 'inherit',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        height: '100%',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.28s ease',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: (theme) =>
            theme.palette.mode === 'dark'
              ? '0 14px 28px rgba(0, 0, 0, 0.6), 0 0 1px 1px rgba(245, 166, 35, 0.3)'
              : '0 14px 28px rgba(0, 0, 0, 0.12), 0 0 1px 1px rgba(245, 166, 35, 0.2)',
          '& .movie-poster': {
            transform: 'scale(1.04)',
          },
        },
      }}
      aria-label={`View details for ${movie.title}`}
    >
      {/* 2:3 Aspect ratio container */}
      <Box sx={{ position: 'relative', width: '100%', aspectRatio: '2 / 3', overflow: 'hidden', bgcolor: 'background.paper' }}>
        {/* Placeholder skeleton shimmer while image loads */}
        {posterUrl && !imageLoaded && !imageError && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmerPulse 1.5s infinite linear',
              '@keyframes shimmerPulse': {
                '0%': { backgroundPosition: '200% 0' },
                '100%': { backgroundPosition: '-200% 0' },
              },
            }}
          />
        )}

        {posterUrl && !imageError ? (
          <CardMedia
            component="img"
            image={posterUrl}
            alt={movie.title}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className="movie-poster"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: imageLoaded ? 1 : 0,
              transition: 'opacity 0.28s ease, transform 0.35s ease',
            }}
          />
        ) : (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              p: 2,
              bgcolor: 'action.hover',
              color: 'text.secondary',
              textAlign: 'center',
            }}
          >
            <MovieCreationOutlinedIcon sx={{ fontSize: 48, mb: 1, opacity: 0.5 }} />
            <Typography variant="caption" sx={{ fontWeight: 600, opacity: 0.7 }}>
              {movie.title}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.5 }}>
              No Poster Available
            </Typography>
          </Box>
        )}

        {/* Rating Badge */}
        <Chip
          icon={<StarRoundedIcon sx={{ fontSize: '1.1rem !important', color: '#F5A623 !important' }} />}
          label={rating}
          size="small"
          sx={{
            position: 'absolute',
            top: 10,
            left: 10,
            bgcolor: 'rgba(11, 13, 19, 0.85)',
            backdropFilter: 'blur(8px)',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '0.75rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            zIndex: 2,
          }}
        />

        {/* Favorite Button */}
        <Tooltip title={favorited ? 'Remove from favorites' : 'Save to favorites'}>
          <IconButton
            ref={favBtnRef}
            onClick={handleFavoriteClick}
            aria-label={favorited ? `Remove ${movie.title} from favorites` : `Save ${movie.title} to favorites`}
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'rgba(11, 13, 19, 0.75)',
              backdropFilter: 'blur(8px)',
              color: favorited ? 'primary.main' : 'rgba(255, 255, 255, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              zIndex: 3,
              '&:hover': {
                bgcolor: 'rgba(11, 13, 19, 0.95)',
                color: 'primary.main',
              },
            }}
          >
            {favorited ? (
              <BookmarkRoundedIcon sx={{ fontSize: '1.25rem', color: 'primary.main' }} />
            ) : (
              <BookmarkBorderRoundedIcon sx={{ fontSize: '1.25rem' }} />
            )}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Card Content */}
      <CardContent sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Typography
          variant="subtitle1"
          component="h2"
          sx={{
            fontWeight: 600,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.25,
            mb: 0.75,
            fontSize: { xs: '0.9rem', sm: '0.95rem' },
          }}
        >
          {movie.title}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, fontSize: '0.8rem' }}>
          {releaseYear}
        </Typography>
      </CardContent>
    </Card>
  )
}
