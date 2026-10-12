import React, { useState, useMemo, useEffect } from 'react'
import {
  Container,
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Button,
  CircularProgress,
} from '@mui/material'
import WhatshotRoundedIcon from '@mui/icons-material/WhatshotRounded'
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'
import { useInView } from 'react-intersection-observer'
import { useInfiniteTrendingMovies } from '../features/movies/queries.ts'
import { HeroSection } from '../components/movie/HeroSection.tsx'
import { MovieGrid } from '../components/movie/MovieGrid.tsx'
import { HeroSkeleton, MovieGridSkeleton } from '../components/feedback/LoadingSkeleton.tsx'
import { ErrorState } from '../components/feedback/ErrorState.tsx'
import { EmptyState } from '../components/feedback/EmptyState.tsx'
import { normalizeApiError } from '../utils/apiError.ts'
import type { Movie } from '../types/movie.ts'

export const HomePage: React.FC = () => {
  const [timeWindow, setTimeWindow] = useState<'day' | 'week'>('week')

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteTrendingMovies(timeWindow)

  // Flatten and deduplicate movies across pages
  const allMovies = useMemo(() => {
    if (!data?.pages) return []
    const seen = new Set<number>()
    const list: Movie[] = []

    for (const page of data.pages) {
      for (const item of page.results) {
        if (!seen.has(item.id)) {
          seen.add(item.id)
          list.push(item)
        }
      }
    }
    return list
  }, [data])

  const heroMovies = allMovies.slice(0, 6)
  const trendingList = allMovies.length > 6 ? allMovies.slice(6) : allMovies

  // Infinite scroll observer sentinel
  const { ref: loadMoreObserverRef, inView } = useInView({
    rootMargin: '400px',
    threshold: 0,
  })

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  return (
    <Box sx={{ pb: 8 }}>
      {/* Hero Carousel Section */}
      <Container maxWidth="xl" disableGutters sx={{ px: { xs: 2, sm: 3 } }}>
        {isLoading ? (
          <HeroSkeleton />
        ) : heroMovies.length > 0 ? (
          <HeroSection movies={heroMovies} />
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
        ) : allMovies.length === 0 ? (
          <EmptyState
            title="No Trending Movies Available"
            description="Could not find current trending films. Please try again shortly or configure your TMDb proxy credentials."
            onAction={() => refetch()}
            actionLabel="Refresh Catalog"
          />
        ) : (
          <>
            <MovieGrid movies={trendingList} />

            {/* Load More and Infinite Scroll Trigger */}
            <Box sx={{ mt: 6, mb: 4, textAlign: 'center' }}>
              {hasNextPage && (
                <>
                  <Button
                    variant="outlined"
                    size="large"
                    disabled={isFetchingNextPage}
                    onClick={() => fetchNextPage()}
                    endIcon={
                      isFetchingNextPage ? (
                        <CircularProgress size={18} color="inherit" />
                      ) : (
                        <KeyboardArrowDownRoundedIcon />
                      )
                    }
                    sx={{
                      px: 4,
                      py: 1.25,
                      fontWeight: 700,
                      borderRadius: 3,
                      borderColor: 'divider',
                      color: 'text.primary',
                      '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' },
                    }}
                  >
                    {isFetchingNextPage ? 'Loading more movies...' : 'Load More Movies'}
                  </Button>

                  {/* Invisible Intersection Observer sentinel element */}
                  <Box ref={loadMoreObserverRef} sx={{ height: 40 }} />
                </>
              )}

              {!hasNextPage && trendingList.length > 0 && (
                <Typography variant="caption" color="text.secondary">
                  You've caught up with all current trending movies.
                </Typography>
              )}
            </Box>
          </>
        )}
      </Container>
    </Box>
  )
}
