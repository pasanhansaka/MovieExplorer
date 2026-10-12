import React, { useState } from 'react'
import {
  Container,
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material'
import WhatshotRoundedIcon from '@mui/icons-material/WhatshotRounded'
import { useTrendingMovies } from '../features/movies/queries.ts'
import { HeroSection } from '../components/movie/HeroSection.tsx'
import { MovieGrid } from '../components/movie/MovieGrid.tsx'
import { HeroSkeleton, MovieGridSkeleton } from '../components/feedback/LoadingSkeleton.tsx'
import { ErrorState } from '../components/feedback/ErrorState.tsx'
import { EmptyState } from '../components/feedback/EmptyState.tsx'
import { normalizeApiError } from '../utils/apiError.ts'

export const HomePage: React.FC = () => {
  const [timeWindow, setTimeWindow] = useState<'day' | 'week'>('week')

  const {
    data: trendingData,
    isLoading,
    isError,
    error,
    refetch,
  } = useTrendingMovies(timeWindow)

  const movies = trendingData?.results || []
  const heroMovie = movies.length > 0 ? movies[0] : null
  const trendingList = movies.slice(1)

  return (
    <Box sx={{ pb: 8 }}>
      {/* Hero Section */}
      <Container maxWidth="xl" disableGutters sx={{ px: { xs: 2, sm: 3 } }}>
        {isLoading ? (
          <HeroSkeleton />
        ) : heroMovie ? (
          <HeroSection movie={heroMovie} />
        ) : null}
      </Container>

      {/* Trending Section */}
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 } }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2,
            mb: 3.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 38,
                height: 38,
                borderRadius: 2,
                bgcolor: 'rgba(245, 166, 35, 0.12)',
                color: 'primary.main',
              }}
            >
              <WhatshotRoundedIcon />
            </Box>
            <div>
              <Typography
                variant="h4"
                component="h2"
                sx={{ fontWeight: 700, fontSize: { xs: '1.4rem', md: '1.75rem' } }}
              >
                Trending Now
              </Typography>
              <Typography variant="body2" color="text.secondary">
                The most watched and talked about movies right now
              </Typography>
            </div>
          </Box>

          {/* Time window selector */}
          <ToggleButtonGroup
            value={timeWindow}
            exclusive
            onChange={(_e, val) => val && setTimeWindow(val)}
            size="small"
            aria-label="Trending time window"
            sx={{
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              '& .MuiToggleButton-root': {
                px: 2,
                py: 0.75,
                fontWeight: 600,
                fontSize: '0.82rem',
                border: 'none',
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: '#0A0C10',
                  '&:hover': { bgcolor: 'primary.light' },
                },
              },
            }}
          >
            <ToggleButton value="week">This Week</ToggleButton>
            <ToggleButton value="day">Today</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Content State Handling */}
        {isLoading ? (
          <MovieGridSkeleton count={10} />
        ) : isError ? (
          <ErrorState
            title="Failed to Load Trending Movies"
            message={normalizeApiError(error)}
            onRetry={() => refetch()}
          />
        ) : trendingList.length === 0 && !heroMovie ? (
          <EmptyState
            title="No Trending Movies Available"
            description="Could not find current trending films. Please try again shortly or configure your TMDb proxy credentials."
            onAction={() => refetch()}
            actionLabel="Refresh Catalog"
          />
        ) : (
          <MovieGrid movies={trendingList} />
        )}
      </Container>
    </Box>
  )
}
