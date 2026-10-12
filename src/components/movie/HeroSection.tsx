import React, { useState, useEffect, useRef } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Button,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material'
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded'
import BookmarkRoundedIcon from '@mui/icons-material/BookmarkRounded'
import type { Movie } from '../../types/movie.ts'
import { formatRating, formatReleaseYear, getTMDBImageUrl } from '../../utils/formatters.ts'
import { useFavorites } from '../../features/favorites/FavoritesContext.tsx'
import { useMovieVideos } from '../../features/movies/queries.ts'
import { TrailerModal } from './TrailerModal.tsx'
import { animateEntrance, animateFavoritePop } from '../../utils/animations.ts'

interface HeroSectionProps {
  movie: Movie
}

export const HeroSection: React.FC<HeroSectionProps> = ({ movie }) => {
  const { isFavorite, toggleFavorite } = useFavorites()
  const [trailerOpen, setTrailerOpen] = useState(false)
  const heroContentRef = useRef<HTMLDivElement | null>(null)
  const favBtnRef = useRef<HTMLButtonElement | null>(null)

  const { data: videosData } = useMovieVideos(movie.id)
  const officialTrailer = videosData?.results?.find(
    (v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
  )

  const favorited = isFavorite(movie.id)
  const backdropUrl = getTMDBImageUrl(movie.backdrop_path, 'original')
  const rating = formatRating(movie.vote_average)
  const releaseYear = formatReleaseYear(movie.release_date)

  useEffect(() => {
    if (!heroContentRef.current) return
    const cleanup = animateEntrance(heroContentRef.current, {
      duration: 600,
      translateY: [30, 0],
    })
    return cleanup
  }, [movie.id])

  const handleFavoriteClick = () => {
    if (favBtnRef.current) {
      animateFavoritePop(favBtnRef.current)
    }
    toggleFavorite(movie)
  }

  return (
    <>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          minHeight: { xs: 460, sm: 520, md: 580 },
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          borderRadius: { xs: 0, md: 4 },
          mt: { xs: 0, md: 3 },
          mb: { xs: 4, md: 6 },
          backgroundImage: backdropUrl ? `url(${backdropUrl})` : 'none',
          backgroundColor: '#10141E',
          backgroundSize: 'cover',
          backgroundPosition: 'center 20%',
        }}
      >
        {/* Dark Cinematic Gradient Overlay */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: (theme) =>
              theme.palette.mode === 'dark'
                ? `linear-gradient(to right, #0B0D13 0%, rgba(11, 13, 19, 0.9) 45%, rgba(11, 13, 19, 0.4) 100%),
                   linear-gradient(to top, #0B0D13 0%, transparent 60%)`
                : `linear-gradient(to right, #F8F9FC 0%, rgba(248, 249, 252, 0.95) 45%, rgba(248, 249, 252, 0.4) 100%),
                   linear-gradient(to top, #F8F9FC 0%, transparent 60%)`,
          }}
        />

        {/* Content Container */}
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, py: { xs: 6, md: 8 } }}>
          <Box ref={heroContentRef} sx={{ maxWidth: { xs: '100%', md: 680 } }}>
            {/* Meta Tags */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Chip
                label="FEATURED FILM"
                size="small"
                sx={{
                  bgcolor: 'primary.main',
                  color: '#0A0C10',
                  fontWeight: 800,
                  fontSize: '0.72rem',
                  letterSpacing: '0.06em',
                }}
              />
              <Chip
                icon={<StarRoundedIcon sx={{ fontSize: '1.1rem !important', color: '#F5A623 !important' }} />}
                label={rating}
                size="small"
                sx={{
                  bgcolor: 'rgba(0, 0, 0, 0.6)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                {releaseYear}
              </Typography>
            </Box>

            {/* Title */}
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '2.1rem', sm: '2.8rem', md: '3.6rem' },
                lineHeight: 1.08,
                letterSpacing: '-0.03em',
                mb: 2,
                color: 'text.primary',
                textShadow: '0 2px 10px rgba(0,0,0,0.3)',
              }}
            >
              {movie.title}
            </Typography>

            {/* Overview excerpt */}
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                fontSize: { xs: '0.95rem', md: '1.1rem' },
                lineHeight: 1.55,
                mb: 4,
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textShadow: '0 1px 4px rgba(0,0,0,0.4)',
              }}
            >
              {movie.overview || 'No synopsis available for this featured presentation.'}
            </Typography>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
              <Button
                component={RouterLink}
                to={`/movie/${movie.id}`}
                variant="contained"
                color="primary"
                size="large"
                startIcon={<InfoOutlinedIcon />}
                sx={{ px: 3, py: 1.25, fontWeight: 700 }}
              >
                View Details
              </Button>

              {officialTrailer && (
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => setTrailerOpen(true)}
                  startIcon={<PlayArrowRoundedIcon />}
                  sx={{
                    px: 3,
                    py: 1.25,
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    borderColor: 'rgba(255, 255, 255, 0.25)',
                    color: 'text.primary',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      borderColor: 'primary.main',
                    },
                  }}
                >
                  Watch Trailer
                </Button>
              )}

              <Tooltip title={favorited ? 'Remove from saved' : 'Save to my favorites'}>
                <IconButton
                  ref={favBtnRef}
                  onClick={handleFavoriteClick}
                  aria-label={favorited ? 'Remove from favorites' : 'Save to favorites'}
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2.5,
                    bgcolor: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid',
                    borderColor: favorited ? 'primary.main' : 'divider',
                    color: favorited ? 'primary.main' : 'text.primary',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.18)',
                    },
                  }}
                >
                  {favorited ? <BookmarkRoundedIcon /> : <BookmarkBorderRoundedIcon />}
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Trailer Dialog */}
      <TrailerModal
        open={trailerOpen}
        onClose={() => setTrailerOpen(false)}
        videoKey={officialTrailer?.key}
        movieTitle={movie.title}
      />
    </>
  )
}
