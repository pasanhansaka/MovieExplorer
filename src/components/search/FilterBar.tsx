import React from 'react'
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material'
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded'
import type { Genre, MovieFilterParams } from '../../types/movie.ts'

interface FilterBarProps {
  genres: Genre[]
  filters: MovieFilterParams
  onFilterChange: (updated: Partial<MovieFilterParams>) => void
  onReset: () => void
}

const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Most Popular' },
  { value: 'vote_average.desc', label: 'Highest Rated' },
  { value: 'primary_release_date.desc', label: 'Release Date (Newest)' },
  { value: 'vote_count.desc', label: 'Most Voted' },
]

const RATING_OPTIONS = [
  { value: '', label: 'Any Rating' },
  { value: '8', label: '8.0+ Exceptional' },
  { value: '7', label: '7.0+ Great' },
  { value: '6', label: '6.0+ Good' },
  { value: '5', label: '5.0+ Average' },
]

const currentYear = new Date().getFullYear()
const YEAR_OPTIONS = [
  { value: '', label: 'All Years' },
  ...Array.from({ length: 15 }, (_, i) => ({
    value: String(currentYear - i),
    label: String(currentYear - i),
  })),
  { value: '2010', label: '2010' },
  { value: '2000', label: '2000' },
  { value: '1995', label: '1995' },
]

export const FilterBar: React.FC<FilterBarProps> = ({
  genres,
  filters,
  onFilterChange,
  onReset,
}) => {
  const hasActiveFilters = Boolean(
    filters.genreId ||
      filters.year ||
      filters.minRating ||
      (filters.sortBy && filters.sortBy !== 'popularity.desc')
  )

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 2.5 },
        bgcolor: 'background.paper',
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        mb: 4,
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr) auto',
          },
          gap: 2,
          alignItems: 'center',
        }}
      >
        {/* Genre Filter */}
        <FormControl fullWidth size="small">
          <InputLabel id="filter-genre-label">Genre</InputLabel>
          <Select
            labelId="filter-genre-label"
            id="filter-genre-select"
            value={filters.genreId ? String(filters.genreId) : ''}
            label="Genre"
            onChange={(e) => onFilterChange({ genreId: e.target.value })}
          >
            <MenuItem value="">All Genres</MenuItem>
            {genres.map((g) => (
              <MenuItem key={g.id} value={String(g.id)}>
                {g.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Release Year Filter */}
        <FormControl fullWidth size="small">
          <InputLabel id="filter-year-label">Release Year</InputLabel>
          <Select
            labelId="filter-year-label"
            id="filter-year-select"
            value={filters.year ? String(filters.year) : ''}
            label="Release Year"
            onChange={(e) => onFilterChange({ year: e.target.value })}
          >
            {YEAR_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Minimum Rating Filter */}
        <FormControl fullWidth size="small">
          <InputLabel id="filter-rating-label">Min Rating</InputLabel>
          <Select
            labelId="filter-rating-label"
            id="filter-rating-select"
            value={filters.minRating ? String(filters.minRating) : ''}
            label="Min Rating"
            onChange={(e) => onFilterChange({ minRating: e.target.value })}
          >
            {RATING_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Sort Order */}
        <FormControl fullWidth size="small">
          <InputLabel id="filter-sort-label">Sort By</InputLabel>
          <Select
            labelId="filter-sort-label"
            id="filter-sort-select"
            value={filters.sortBy || 'popularity.desc'}
            label="Sort By"
            onChange={(e) => onFilterChange({ sortBy: e.target.value })}
          >
            {SORT_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Reset Button */}
        <Button
          variant="outlined"
          color="inherit"
          disabled={!hasActiveFilters}
          onClick={onReset}
          startIcon={<RestartAltRoundedIcon />}
          size="small"
          sx={{
            height: 40,
            whiteSpace: 'nowrap',
            color: hasActiveFilters ? 'primary.main' : 'text.disabled',
            borderColor: hasActiveFilters ? 'primary.main' : 'divider',
          }}
        >
          Reset
        </Button>
      </Box>
    </Box>
  )
}
