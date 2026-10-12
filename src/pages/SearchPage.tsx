import React, { useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Container,
  Box,
  Typography,
  Button,
  CircularProgress,
} from '@mui/material'
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'
import { useInView } from 'react-intersection-observer'
import {
  useInfiniteMovieSearch,
  useInfiniteMovieDiscover,
  useMovieGenres,
} from '../features/movies/queries.ts'
import { SearchBar, LAST_SEARCH_KEY } from '../components/search/SearchBar.tsx'
import { FilterBar } from '../components/search/FilterBar.tsx'
import { MovieGrid } from '../components/movie/MovieGrid.tsx'
import { MovieGridSkeleton } from '../components/feedback/LoadingSkeleton.tsx'
import { ErrorState } from '../components/feedback/ErrorState.tsx'
import { EmptyState } from '../components/feedback/EmptyState.tsx'
import { normalizeApiError } from '../utils/apiError.ts'
import type { Movie, MovieFilterParams } from '../types/movie.ts'

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const query = searchParams.get('q') || ''
  const genreId = searchParams.get('genre') || ''
  const year = searchParams.get('year') || ''
  const minRating = searchParams.get('rating') || ''
  const sortBy = searchParams.get('sort') || 'popularity.desc'

  const { data: genresData } = useMovieGenres()
  const genres = genresData || []

  // Check last search on initial visit if query is blank
  useEffect(() => {
    if (!query && !genreId && !year && !minRating) {
      try {
        const last = localStorage.getItem(LAST_SEARCH_KEY)
        if (last && last.trim().length > 0) {
          // Keep current state clean or restore search
        }
      } catch {
        // Safe no-op
      }
    }
  }, [query, genreId, year, minRating])

  // Active filter payload
  const filters: MovieFilterParams = {
    genreId: genreId || undefined,
    year: year || undefined,
    minRating: minRating || undefined,
    sortBy: sortBy || undefined,
  }

  // Choose between Text Search query and Discovery query
  const isTextSearch = query.trim().length > 0

  const searchQuery = useInfiniteMovieSearch(query)
  const discoverQuery = useInfiniteMovieDiscover(filters)

  const activeQuery = isTextSearch ? searchQuery : discoverQuery

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = activeQuery

  // Setup infinite scroll intersection observer
  const { ref: loadMoreObserverRef, inView } = useInView({
    threshold: 0,
    rootMargin: '200px',
  })

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  // Flatten and deduplicate movies across pages
  const movies = useMemo(() => {
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

  const handleSearchSubmit = (newQuery: string) => {
    const params = new URLSearchParams(searchParams)
    if (newQuery) {
      params.set('q', newQuery)
    } else {
      params.delete('q')
    }
    setSearchParams(params)
  }

  const handleFilterChange = (updated: Partial<MovieFilterParams>) => {
    const params = new URLSearchParams(searchParams)

    if (updated.genreId !== undefined) {
      if (updated.genreId) params.set('genre', String(updated.genreId))
      else params.delete('genre')
    }
    if (updated.year !== undefined) {
      if (updated.year) params.set('year', String(updated.year))
      else params.delete('year')
    }
    if (updated.minRating !== undefined) {
      if (updated.minRating) params.set('rating', String(updated.minRating))
      else params.delete('rating')
    }
    if (updated.sortBy !== undefined) {
      if (updated.sortBy) params.set('sort', updated.sortBy)
      else params.delete('sort')
    }

    setSearchParams(params)
  }

  const handleResetFilters = () => {
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    setSearchParams(params)
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4, px: { xs: 2, sm: 3 } }}>
      {/* Search Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 800, fontSize: { xs: '1.8rem', md: '2.5rem' } }}
        >
          {isTextSearch ? `Search Results for "${query}"` : 'Discover & Explore Movies'}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', mb: 3 }}>
          Find films by title, filter across genres, release periods, and ratings, or browse top trending selections.
        </Typography>

        <SearchBar
          initialValue={query}
          onSearch={handleSearchSubmit}
        />
      </Box>

      {/* Filter Controls Bar (Visible during discovery) */}
      {!isTextSearch && (
        <FilterBar
          genres={genres}
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
        />
      )}

      {/* Results View */}
      {isLoading ? (
        <MovieGridSkeleton count={10} />
      ) : isError ? (
        <ErrorState
          title="Search Request Failed"
          message={normalizeApiError(error)}
          onRetry={() => refetch()}
        />
      ) : movies.length === 0 ? (
        <EmptyState
          title={isTextSearch ? `No matches found for "${query}"` : 'No movies found'}
          description="Try adjusting your keywords, changing the genre filter, or resetting search criteria."
          actionLabel={isTextSearch ? 'Clear Search' : 'Reset Filters'}
          onAction={() => {
            if (isTextSearch) handleSearchSubmit('')
            else handleResetFilters()
          }}
        />
      ) : (
        <>
          <MovieGrid movies={movies} />

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

            {!hasNextPage && movies.length > 0 && (
              <Typography variant="caption" color="text.secondary">
                You've reached the end of the results.
              </Typography>
            )}
          </Box>
        </>
      )}
    </Container>
  )
}
