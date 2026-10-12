import React, { useState } from 'react'
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom'
import {
  Container,
  Box,
  Typography,
  Button,
  Chip,
  Paper,
  CircularProgress,
  Divider,
} from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded'
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded'
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded'
import BookmarkRoundedIcon from '@mui/icons-material/BookmarkRounded'
import MovieCreationOutlinedIcon from '@mui/icons-material/MovieCreationOutlined'
import {
  useMovieDetails,
  useMovieCredits,
  useMovieVideos,
} from '../features/movies/queries.ts'
import { useFavorites } from '../features/favorites/FavoritesContext.tsx'
import { CastList } from '../components/movie/CastList.tsx'
import { TrailerModal } from '../components/movie/TrailerModal.tsx'
import { ErrorState } from '../components/feedback/ErrorState.tsx'
import { EmptyState } from '../components/feedback/EmptyState.tsx'
import {
  formatDate,
  formatRating,
  formatRuntime,
  getTMDBImageUrl,
} from '../utils/formatters.ts'
import { isValidMovieId } from '../utils/validation.ts'
import { normalizeApiError } from '../utils/apiError.ts'
import { animateFavoritePop } from '../utils/animations.ts'

export const MovieDetailsPage: React.FC = () => {
  const { movieId } = useParams<{ movieId: string }>()
  const navigate = useNavigate()
  const { isFavorite, toggleFavorite } = useFavorites()
  const [trailerOpen, setTrailerOpen] = useState(false)
  const [posterError, setPosterError] = useState(false)
  const favBtnRef = React.useRef<HTMLButtonElement | null>(null)

  const numericId = movieId && isValidMovieId(movieId) ? parseInt(movieId, 10) : 0

  const {
    data: movie,
    isLoading: detailsLoading,
    isError: detailsError,
    error,
  } = useMovieDetails(numericId)

  const { data: creditsData, isLoading: creditsLoading } = useMovieCredits(numericId)
  const { data: videosData } = useMovieVideos(numericId)

  if (!numericId) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <EmptyState
          title="Invalid Movie Identifier"
          description="The movie ID in the URL is invalid or malformed."
          actionLabel="Back to Home"
          onAction={() => navigate('/')}
        />
      </Container>
    )
  }

  if (detailsLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 12, textAlign: 'center' }}>
        <CircularProgress size={56} sx={{ color: 'primary.main', mb: 3 }} />
        <Typography variant="h6" color="text.secondary">
          Loading movie details...
        </Typography>
      </Container>
    )
  }

  if (detailsError || !movie) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <ErrorState
          title="Movie Not Found"
          message={normalizeApiError(error)}
          actionLabel="Back to Discovery"
          onRetry={() => navigate('/search')}
        />
      </Container>
    )
  }

  const favorited = isFavorite(movie.id)
  const backdropUrl = getTMDBImageUrl(movie.backdrop_path, 'original')
  const posterUrl = getTMDBImageUrl(movie.poster_path, 'w500')
  const officialTrailer = videosData?.results?.find(
    (v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
  )

  const handleFavoriteClick = () => {
    if (favBtnRef.current) {
      animateFavoritePop(favBtnRef.current)
    }
    toggleFavorite(movie)
  }

  return (
    <>
      {/* Backdrop Header with Cinematic Atmosphere */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          minHeight: { xs: 300, md: 460 },
          backgroundImage: backdropUrl ? `url(${backdropUrl})` : 'none',
          backgroundColor: '#0F121A',
          backgroundSize: 'cover',
          backgroundPosition: 'center 20%',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: (theme) =>
              theme.palette.mode === 'dark'
                ? `linear-gradient(to bottom, rgba(11, 13, 19, 0.4) 0%, rgba(11, 13, 19, 0.85) 75%, #0B0D13 100%)`
                : `linear-gradient(to bottom, rgba(248, 249, 252, 0.3) 0%, rgba(248, 249, 252, 0.9) 75%, #F8F9FC 100%)`,
          }}
        />

        {/* Back navigation button */}
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2, pt: 3 }}>
          <Button
            startIcon={<ArrowBackRoundedIcon />}
            onClick={() => navigate(-1)}
            variant="contained"
            size="small"
            sx={{
              bgcolor: 'rgba(11, 13, 19, 0.75)',
              backdropFilter: 'blur(8px)',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              '&:hover': { bgcolor: 'rgba(11, 13, 19, 0.95)' },
            }}
          >
            Back
          </Button>
        </Container>
      </Box>

      {/* Main Details Body */}
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 3, mt: { xs: -12, md: -24 }, pb: 8 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: 4, md: 5 },
          }}
        >
          {/* Movie Poster */}
          <Box
            sx={{
              width: { xs: 200, sm: 260, md: 320 },
              mx: { xs: 'auto', md: 0 },
              flexShrink: 0,
            }}
          >
            <Paper
              elevation={8}
              sx={{
                width: '100%',
                aspectRatio: '2 / 3',
                borderRadius: 4,
                overflow: 'hidden',
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
              }}
            >
              {posterUrl && !posterError ? (
                <Box
                  component="img"
                  src={posterUrl}
                  alt={movie.title}
                  onError={() => setPosterError(true)}
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
                    p: 3,
                    textAlign: 'center',
                  }}
                >
                  <MovieCreationOutlinedIcon sx={{ fontSize: 60, opacity: 0.4, mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    No Poster Available
                  </Typography>
                </Box>
              )}
            </Paper>
          </Box>

          {/* Movie Information & Actions */}
          <Box sx={{ flexGrow: 1, minWidth: 0, width: '100%' }}>
            {/* Title & Tagline */}
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '1.9rem', sm: '2.5rem', md: '3.2rem' },
                lineHeight: 1.15,
                mb: 1,
              }}
            >
              {movie.title}
            </Typography>

            {movie.tagline && (
              <Typography
                variant="subtitle1"
                color="text.secondary"
                sx={{ mb: 2.5, fontSize: '1.05rem', fontStyle: 'italic' }}
              >
                "{movie.tagline}"
              </Typography>
            )}

            {/* Quick Meta Stats */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', mb: 3 }}>
              {/* Rating */}
              <Chip
                icon={<StarRoundedIcon sx={{ fontSize: '1.2rem !important', color: '#F5A623 !important' }} />}
                label={`${formatRating(movie.vote_average)} / 10 (${movie.vote_count.toLocaleString()} votes)`}
                sx={{
                  bgcolor: 'action.hover',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                }}
              />

              {/* Release date */}
              <Chip
                icon={<CalendarTodayRoundedIcon sx={{ fontSize: '1rem !important' }} />}
                label={formatDate(movie.release_date)}
                sx={{ bgcolor: 'action.hover', fontSize: '0.85rem' }}
              />

              {/* Runtime */}
              {movie.runtime && (
                <Chip
                  icon={<AccessTimeRoundedIcon sx={{ fontSize: '1rem !important' }} />}
                  label={formatRuntime(movie.runtime)}
                  sx={{ bgcolor: 'action.hover', fontSize: '0.85rem' }}
                />
              )}
            </Box>

            {/* Genres */}
            {movie.genres && movie.genres.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {movie.genres.map((g) => (
                  <Chip
                    key={g.id}
                    label={g.name}
                    variant="outlined"
                    size="small"
                    component={RouterLink}
                    to={`/search?genre=${g.id}`}
                    clickable
                    sx={{
                      borderColor: 'divider',
                      fontWeight: 600,
                      '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' },
                    }}
                  />
                ))}
              </Box>
            )}

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', mb: 4 }}>
              {officialTrailer ? (
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<PlayArrowRoundedIcon />}
                  onClick={() => setTrailerOpen(true)}
                  sx={{ px: 3.5, py: 1.25, fontWeight: 700 }}
                >
                  Watch Official Trailer
                </Button>
              ) : (
                <Chip
                  label="No Official Trailer Available"
                  variant="outlined"
                  sx={{ color: 'text.secondary' }}
                />
              )}

              <Button
                ref={favBtnRef}
                variant={favorited ? 'outlined' : 'contained'}
                color={favorited ? 'primary' : 'inherit'}
                size="large"
                startIcon={favorited ? <BookmarkRoundedIcon /> : <BookmarkBorderRoundedIcon />}
                onClick={handleFavoriteClick}
                sx={{
                  px: 3,
                  py: 1.25,
                  bgcolor: favorited ? 'transparent' : 'action.hover',
                  borderColor: 'primary.main',
                  color: favorited ? 'primary.main' : 'text.primary',
                }}
              >
                {favorited ? 'Saved in Favorites' : 'Add to Favorites'}
              </Button>
            </Box>

            {/* Overview Section */}
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, fontSize: '1.3rem' }}>
              Overview
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ lineHeight: 1.7, fontSize: '1.05rem', mb: 5 }}
            >
              {movie.overview || 'No synopsis provided for this movie.'}
            </Typography>

            <Divider sx={{ mb: 4 }} />

            {/* Top Cast Section */}
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, fontSize: '1.3rem', mb: 2 }}>
              Top Billed Cast
            </Typography>
            {creditsLoading ? (
              <Box sx={{ display: 'flex', gap: 2, py: 2 }}>
                <CircularProgress size={28} />
                <Typography variant="body2" color="text.secondary">
                  Loading cast list...
                </Typography>
              </Box>
            ) : (
              <CastList cast={creditsData?.cast || []} />
            )}
          </Box>
        </Box>
      </Container>

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
