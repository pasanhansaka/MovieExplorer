import React from 'react'
import { Box, Container, Typography, Divider, Stack, Link } from '@mui/material'
import MovieFilterRoundedIcon from '@mui/icons-material/MovieFilterRounded'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import GitHubIcon from '@mui/icons-material/GitHub'

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
          {/* Brand & Creator info */}
          <Box sx={{ maxWidth: 480 }}>
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
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, lineHeight: 1.6 }}>
              A cinematic movie discovery and personal collection management platform built with React 19, TypeScript, Material UI & Supabase.
            </Typography>
            <Typography
              variant="caption"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.75,
                color: 'text.secondary',
                fontWeight: 500,
              }}
            >
              Made with{' '}
              <FavoriteRoundedIcon sx={{ fontSize: 14, color: '#EF4444' }} /> for the community.
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
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.5 }}>
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
            © 2026{' '}
            <Link
              href="https://github.com/pasanhansaka"
              target="_blank"
              rel="noopener noreferrer"
              color="primary.main"
              sx={{ fontWeight: 700, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
            >
              Pasan Hansaka
            </Link>
            . All rights reserved.
          </Typography>

          <Stack direction="row" spacing={3} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
            <Link
              href="https://github.com/pasanhansaka/MovieExplorer"
              target="_blank"
              rel="noopener noreferrer"
              variant="caption"
              color="text.secondary"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                '&:hover': { color: 'primary.main' },
              }}
            >
              <GitHubIcon sx={{ fontSize: 16 }} /> GitHub Repository
            </Link>
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
