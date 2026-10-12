import React from 'react'
import { Box, Container, Typography, Divider, Stack, Link } from '@mui/material'
import MovieFilterRoundedIcon from '@mui/icons-material/MovieFilterRounded'

export const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        borderTop: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        py: { xs: 5, md: 6 },
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            gap: 3,
            mb: 4,
          }}
        >
          {/* Brand info */}
          <Box sx={{ maxWidth: 450 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
              <MovieFilterRoundedIcon sx={{ color: 'primary.main', mr: 1, fontSize: 28 }} />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  fontFamily: '"Outfit", sans-serif',
                  letterSpacing: '-0.02em',
                }}
              >
                MOVIE EXPLORER
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              A cinematic movie discovery and personal collection management platform built for the Loons Lab Developer Selection Test.
            </Typography>
          </Box>

          {/* TMDb Attribution Notice */}
          <Box
            sx={{
              p: 2,
              borderRadius: 2.5,
              bgcolor: 'action.hover',
              border: '1px solid',
              borderColor: 'divider',
              maxWidth: 420,
            }}
          >
            <Typography variant="caption" color="text.primary" sx={{ display: 'block', fontWeight: 600 }} gutterBottom>
              Data & Media Attribution
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              This product uses the TMDb API but is not endorsed or certified by TMDb. All movie metadata, imagery, and video references are copyright of their respective owners.
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            © {new Date().getFullYear()} Movie Explorer. Built with React, TypeScript, Material UI & Supabase.
          </Typography>

          <Stack direction="row" spacing={3}>
            <Link
              href="https://developer.themoviedb.org/docs"
              target="_blank"
              rel="noopener noreferrer"
              variant="caption"
              color="text.secondary"
              sx={{ '&:hover': { color: 'primary.main' } }}
            >
              TMDb API Docs
            </Link>
            <Link
              href="https://supabase.com"
              target="_blank"
              rel="noopener noreferrer"
              variant="caption"
              color="text.secondary"
              sx={{ '&:hover': { color: 'primary.main' } }}
            >
              Supabase Platform
            </Link>
          </Stack>
        </Box>
      </Container>
    </Box>
  )
}
