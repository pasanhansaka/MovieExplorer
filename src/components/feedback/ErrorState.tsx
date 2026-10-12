import React from 'react'
import { Box, Typography, Button, Paper } from '@mui/material'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'

interface ErrorStateProps {
  title?: string
  message: string
  onRetry?: () => void
  actionLabel?: string
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Unable to Load Movies',
  message,
  onRetry,
  actionLabel = 'Try Again',
}) => {
  return (
    <Paper
      role="alert"
      sx={{
        py: 6,
        px: 4,
        my: 4,
        textAlign: 'center',
        borderRadius: 3,
        border: '1px dashed',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
      }}
    >
      <Box sx={{ display: 'inline-flex', p: 2, borderRadius: '50%', bgcolor: 'rgba(245, 166, 35, 0.1)', mb: 2 }}>
        <WarningAmberRoundedIcon sx={{ fontSize: 44, color: 'primary.main' }} />
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 700 }} gutterBottom>
        {title}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ maxWidth: 460, mx: 'auto', mb: onRetry ? 3 : 0 }}
      >
        {message}
      </Typography>
      {onRetry && (
        <Button
          variant="contained"
          color="primary"
          startIcon={<RefreshRoundedIcon />}
          onClick={onRetry}
          aria-label={actionLabel}
        >
          {actionLabel}
        </Button>
      )}
    </Paper>
  )
}
