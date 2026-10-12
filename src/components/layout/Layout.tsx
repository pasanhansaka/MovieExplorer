import React from 'react'
import { Outlet } from 'react-router-dom'
import { Box } from '@mui/material'
import { Navbar } from './Navbar.tsx'
import { Footer } from './Footer.tsx'
import { ErrorBoundary } from '../feedback/ErrorBoundary.tsx'

export const Layout: React.FC = () => {
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
    </Box>
  )
}
