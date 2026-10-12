import React, { useState, useEffect, useRef, useCallback } from 'react'
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
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import type { Movie } from '../../types/movie.ts'
import { formatRating, formatReleaseYear, getTMDBImageUrl } from '../../utils/formatters.ts'
import { useFavorites } from '../../features/favorites/FavoritesContext.tsx'
import { useMovieVideos } from '../../features/movies/queries.ts'
import { TrailerModal } from './TrailerModal.tsx'
import { animateEntrance, animateFavoritePop } from '../../utils/animations.ts'

interface HeroSectionProps {
  movies?: Movie[]
  movie?: Movie
}

export const HeroSection: React.FC<HeroSectionProps> = ({ movies, movie }) => {
  const { isFavorite, toggleFavorite } = useFavorites()
  const [trailerOpen, setTrailerOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const heroContentRef = useRef<HTMLDivElement | null>(null)
  const favBtnRef = useRef<HTMLButtonElement | null>(null)

  // Construct featured movie list (up to 6 trending films)
  const featuredList = movies && movies.length > 0 ? movies.slice(0, 6) : (movie ? [movie] : [])
  const hasMultiple = featuredList.length > 1
  const activeMovie = featuredList[currentIndex] || featuredList[0]

  const { data: videosData } = useMovieVideos(activeMovie ? activeMovie.id : 0)
  const officialTrailer = videosData?.results?.find(
    (v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
  )

  const handleNext = useCallback(() => {
    if (!hasMultiple) return
    setCurrentIndex((prev) => (prev + 1) % featuredList.length)
  }, [hasMultiple, featuredList.length])

  const handlePrev = useCallback(() => {
    if (!hasMultiple) return
    setCurrentIndex((prev) => (prev - 1 + featuredList.length) % featuredList.length)
  }, [hasMultiple, featuredList.length])

  // Auto rotation timer (advances every 7 seconds when not hovered)
  useEffect(() => {
    if (!hasMultiple || isPaused) return
    const timer = setInterval(() => {
      handleNext()
    }, 7000)
    return () => clearInterval(timer)
  }, [hasMultiple, isPaused, handleNext])

  // Trigger entrance animation on slide change
  useEffect(() => {
    if (!heroContentRef.current) return
    const cleanup = animateEntrance(heroContentRef.current, {
      duration: 500,
      translateY: [20, 0],
      opacity: [0, 1],
    })
    return cleanup
  }, [currentIndex])

  if (!activeMovie) return null

  const favorited = isFavorite(activeMovie.id)
  const backdropUrl = getTMDBImageUrl(activeMovie.backdrop_path, 'original')
  const rating = formatRating(activeMovie.vote_average)
  const releaseYear = formatReleaseYear(activeMovie.release_date)

  const handleFavoriteClick = () => {
    if (favBtnRef.current) {
      animateFavoritePop(favBtnRef.current)
    }
    toggleFavorite(activeMovie)
  }

  return (
    <>
      <Box
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        sx={{
          position: 'relative',
          width: '100%',
          minHeight: { xs: 480, sm: 530, md: 590 },
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
          transition: 'background-image 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)',
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
            {/* Meta Tags & Slide Indicator */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Chip
                label={hasMultiple ? `TRENDING #${currentIndex + 1}` : 'FEATURED FILM'}
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
              {activeMovie.title}
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
              {activeMovie.overview || 'No synopsis available for this featured presentation.'}
            </Typography>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
              <Button
                component={RouterLink}
                to={`/movie/${activeMovie.id}`}
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

        {/* Carousel Navigation Arrows & Indicators (Displayed if multiple movies) */}
        {hasMultiple && (
          <>
            {/* Previous Slide Button */}
            <IconButton
              onClick={handlePrev}
              aria-label="Previous featured movie"
              sx={{
                position: 'absolute',
                left: { xs: 8, md: 24 },
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 3,
                width: { xs: 38, sm: 44 },
                height: { xs: 38, sm: 44 },
                bgcolor: 'rgba(11, 13, 19, 0.7)',
                backdropFilter: 'blur(8px)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
                '&:hover': {
                  bgcolor: 'primary.main',
                  color: '#0A0C10',
                },
              }}
            >
              <ChevronLeftRoundedIcon />
            </IconButton>

            {/* Next Slide Button */}
            <IconButton
              onClick={handleNext}
              aria-label="Next featured movie"
              sx={{
                position: 'absolute',
                right: { xs: 8, md: 24 },
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 3,
                width: { xs: 38, sm: 44 },
                height: { xs: 38, sm: 44 },
                bgcolor: 'rgba(11, 13, 19, 0.7)',
                backdropFilter: 'blur(8px)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
                '&:hover': {
                  bgcolor: 'primary.main',
                  color: '#0A0C10',
                },
              }}
            >
              <ChevronRightRoundedIcon />
            </IconButton>

            {/* Bottom Slide Indicator Pills */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 20,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 1.25,
                p: '6px 14px',
                borderRadius: 5,
                bgcolor: 'rgba(11, 13, 19, 0.65)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              {featuredList.map((m, index) => {
                const isActive = index === currentIndex
                return (
                  <Box
                    key={m.id}
                    onClick={() => setCurrentIndex(index)}
                    sx={{
                      cursor: 'pointer',
                      width: isActive ? 28 : 8,
                      height: 8,
                      borderRadius: 4,
                      bgcolor: isActive ? 'primary.main' : 'rgba(255, 255, 255, 0.35)',
                      boxShadow: isActive ? '0 0 10px rgba(245, 166, 35, 0.6)' : 'none',
                      transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
                      '&:hover': {
                        bgcolor: isActive ? 'primary.main' : 'rgba(255, 255, 255, 0.7)',
                      },
                    }}
                    title={m.title}
                  />
                )
              })}
            </Box>
          </>
        )}
      </Box>

      {/* Trailer Dialog */}
      <TrailerModal
        open={trailerOpen}
        onClose={() => setTrailerOpen(false)}
        videoKey={officialTrailer?.key}
        movieTitle={activeMovie.title}
      />
    </>
  )
}
