import React, { useState, useEffect } from 'react'
import {
  Paper,
  InputBase,
  IconButton,
} from '@mui/material'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import ClearRoundedIcon from '@mui/icons-material/ClearRounded'

interface SearchBarProps {
  initialValue?: string
  placeholder?: string
  onSearch: (query: string) => void
  autoFocus?: boolean
}

export const LAST_SEARCH_KEY = 'movie-explorer:last-search'

export const SearchBar: React.FC<SearchBarProps> = ({
  initialValue = '',
  placeholder = 'Search movies by title, franchise, or keywords...',
  onSearch,
  autoFocus = false,
}) => {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = value.trim()
    if (trimmed) {
      try {
        localStorage.setItem(LAST_SEARCH_KEY, trimmed)
      } catch {
        // Safe no-op
      }
    }
    onSearch(trimmed)
  }

  const handleClear = () => {
    setValue('')
    onSearch('')
  }

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      elevation={0}
      sx={{
        p: '4px 8px',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        maxWidth: 720,
        mx: 'auto',
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        boxShadow: (theme) =>
          theme.palette.mode === 'dark'
            ? '0 4px 20px rgba(0, 0, 0, 0.4)'
            : '0 4px 20px rgba(0, 0, 0, 0.05)',
        '&:focus-within': {
          borderColor: 'primary.main',
          boxShadow: (theme) =>
            theme.palette.mode === 'dark'
              ? '0 0 0 2px rgba(245, 166, 35, 0.25)'
              : '0 0 0 2px rgba(245, 166, 35, 0.2)',
        },
      }}
    >
      <IconButton
        type="submit"
        aria-label="Submit search"
        sx={{ p: '10px', color: 'primary.main' }}
      >
        <SearchRoundedIcon />
      </IconButton>
      <InputBase
        sx={{ ml: 1, flex: 1, fontSize: { xs: '0.95rem', md: '1.05rem' } }}
        placeholder={placeholder}
        inputProps={{ 'aria-label': 'Search movies by title' }}
        value={value}
        autoFocus={autoFocus}
        onChange={(e) => setValue(e.target.value)}
      />
      {value && (
        <IconButton
          aria-label="Clear search input"
          onClick={handleClear}
          size="small"
          sx={{ p: '6px', color: 'text.secondary' }}
        >
          <ClearRoundedIcon fontSize="small" />
        </IconButton>
      )}
    </Paper>
  )
}
