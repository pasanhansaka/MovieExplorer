import React from 'react'
import { Box, Typography, Button, Paper } from '@mui/material'
import MovieFilterOutlinedIcon from '@mui/icons-material/MovieFilterOutlined'

interface EmptyStateProps {
  title?: string
  description: string
  actionLabel?: string
  onAction?: () => void
  icon?: React.ReactNode
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Movies Found',
  description,
  actionLabel,
  onAction,
  icon,
}) => {
  return (
    <Paper
      sx={{
        py: 8,
        px: 4,
        my: 4,
        textAlign: 'center',
        borderRadius: 3,
        border: '1px dashed',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
      }}
    >
      <Box
        sx={{
          display: 'inline-flex',
          p: 2.5,
          borderRadius: '50%',
          bgcolor: 'action.hover',
          mb: 2,
        }}
      >
        {icon || <MovieFilterOutlinedIcon sx={{ fontSize: 48, color: 'text.secondary' }} />}
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 700 }} gutterBottom>
        {title}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ maxWidth: 440, mx: 'auto', mb: actionLabel ? 3 : 0 }}
      >
        {description}
      </Typography>
      {actionLabel && onAction && (
        <Button
          variant="outlined"
          color="primary"
          onClick={onAction}
          aria-label={actionLabel}
        >
          {actionLabel}
        </Button>
      )}
    </Paper>
  )
}
