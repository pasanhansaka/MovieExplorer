import React from 'react'
import { Outlet } from 'react-router-dom'
import { Box } from '@mui/material'
import { Navbar } from './Navbar.tsx'
import { Footer } from './Footer.tsx'
import { ScrollToTopButton } from './ScrollToTopButton.tsx'
import { ErrorBoundary } from '../feedback/ErrorBoundary.tsx'
import { AuthPromptDialog } from '../auth/AuthPromptDialog.tsx'
import { useFavorites } from '../../features/favorites/FavoritesContext.tsx'

export const Layout: React.FC = () => {
  const { authPromptOpen, closeAuthPrompt, promptMovieTitle } = useFavorites()

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <Navbar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </Box>
      <Footer />
      <ScrollToTopButton />
      <AuthPromptDialog
        open={authPromptOpen}
        onClose={closeAuthPrompt}
        movieTitle={promptMovieTitle}
      />
    </Box>
  )
}
