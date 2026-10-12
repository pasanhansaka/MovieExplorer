import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Container, Box, Typography, Button, Paper } from '@mui/material'
import MovieFilterOutlinedIcon from '@mui/icons-material/MovieFilterOutlined'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'

export const NotFoundPage: React.FC = () => {
  return (
    <Container maxWidth="sm" sx={{ py: 12 }}>
      <Paper
        sx={{
          py: 8,
          px: 4,
          textAlign: 'center',
          borderRadius: 4,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Box
          sx={{
            display: 'inline-flex',
            p: 3,
            borderRadius: '50%',
            bgcolor: 'action.hover',
            mb: 2.5,
          }}
        >
          <MovieFilterOutlinedIcon sx={{ fontSize: 64, color: 'primary.main' }} />
        </Box>
        <Typography variant="h2" sx={{ fontWeight: 800, fontFamily: '"Outfit", sans-serif' }} gutterBottom>
          404
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 700 }} gutterBottom>
          Page Not Found
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto', mb: 4 }}>
          The scene you are looking for has been cut from the final reel or doesn't exist.
        </Typography>
        <Button
          component={RouterLink}
          to="/"
          variant="contained"
          color="primary"
          size="large"
          startIcon={<HomeRoundedIcon />}
          sx={{ px: 4, py: 1.25, fontWeight: 700 }}
        >
          Return to Home
        </Button>
      </Paper>
    </Container>
  )
}
