import React, { useState, useMemo } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Container,
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  AlertTitle,
} from '@mui/material'
import BookmarkRoundedIcon from '@mui/icons-material/BookmarkRounded'
import CloudSyncRoundedIcon from '@mui/icons-material/CloudSyncRounded'
import { useFavorites } from '../features/favorites/FavoritesContext.tsx'
import { useAuth } from '../features/auth/AuthContext.tsx'
import { MovieGrid } from '../components/movie/MovieGrid.tsx'
import { EmptyState } from '../components/feedback/EmptyState.tsx'
import { MovieGridSkeleton } from '../components/feedback/LoadingSkeleton.tsx'

export const FavoritesPage: React.FC = () => {
  const { favorites, loading } = useFavorites()
  const { user } = useAuth()
  const [sortBy, setSortBy] = useState<'recent' | 'rating' | 'title'>('recent')

  const sortedFavorites = useMemo(() => {
    const list = [...favorites]
    if (sortBy === 'rating') {
      return list.sort((a, b) => (b.vote_average ?? 0) - (a.vote_average ?? 0))
    }
    if (sortBy === 'title') {
      return list.sort((a, b) => a.title.localeCompare(b.title))
    }
    // Default: 'recent' (chronological by created_at or insertion order)
    return list
  }, [favorites, sortBy])

  return (
    <Container maxWidth="xl" sx={{ py: 5, px: { xs: 2, sm: 3 } }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2,
          mb: 4,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 44,
              height: 44,
              borderRadius: 2.5,
              bgcolor: 'primary.main',
              color: '#0A0C10',
            }}
          >
            <BookmarkRoundedIcon fontSize="medium" />
          </Box>
          <div>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 800, fontSize: { xs: '1.6rem', md: '2rem' } }}>
              My Saved Movies
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {favorites.length} {favorites.length === 1 ? 'title' : 'titles'} saved in your personal library
            </Typography>
          </div>
        </Box>

        {favorites.length > 0 && (
          <FormControl size="small" sx={{ minWidth: 170 }}>
            <InputLabel id="sort-favorites-label">Sort By</InputLabel>
            <Select
              labelId="sort-favorites-label"
              id="sort-favorites-select"
              value={sortBy}
              label="Sort By"
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <MenuItem value="recent">Recently Added</MenuItem>
              <MenuItem value="rating">Highest Rated</MenuItem>
              <MenuItem value="title">Alphabetical (A-Z)</MenuItem>
            </Select>
          </FormControl>
        )}
      </Box>

      {/* Guest Sync Banner if unauthenticated */}
      {!user && favorites.length > 0 && (
        <Alert
          severity="info"
          icon={<CloudSyncRoundedIcon />}
          sx={{
            mb: 4,
            borderRadius: 3,
            bgcolor: 'action.hover',
            border: '1px solid',
            borderColor: 'divider',
          }}
          action={
            <Button component={RouterLink} to="/login" color="primary" size="small" variant="contained">
              Sign In to Sync
            </Button>
          }
        >
          <AlertTitle sx={{ fontWeight: 700 }}>Guest Mode Active</AlertTitle>
          Your favorites are currently stored on this browser only. Sign in or create a free account to sync your watchlist to the cloud.
        </Alert>
      )}

      {/* Content */}
      {loading ? (
        <MovieGridSkeleton count={8} />
      ) : favorites.length === 0 ? (
        <EmptyState
          title="Your Watchlist is Empty"
          description="You haven't saved any movies yet. Explore trending releases and tap the bookmark icon to start building your personal collection."
          icon={<BookmarkRoundedIcon sx={{ fontSize: 52, color: 'primary.main' }} />}
          actionLabel="Explore Movies Now"
          onAction={() => {
            window.location.href = '/search'
          }}
        />
      ) : (
        <MovieGrid movies={sortedFavorites} />
      )}
    </Container>
  )
}
