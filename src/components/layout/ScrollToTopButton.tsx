import React, { useState, useEffect } from 'react'
import { Fab, Zoom, Tooltip } from '@mui/material'
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded'

export const ScrollToTopButton: React.FC = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setVisible(window.scrollY > 400)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <Zoom in={visible} unmountOnExit>
      <Tooltip title="Back to top" placement="left" arrow>
        <Fab
          onClick={handleScrollToTop}
          size="medium"
          aria-label="Scroll back to top"
          sx={{
            position: 'fixed',
            bottom: { xs: 20, sm: 28 },
            right: { xs: 20, sm: 28 },
            zIndex: 1100,
            bgcolor: 'rgba(16, 20, 29, 0.88)',
            backdropFilter: 'blur(12px)',
            color: 'primary.main',
            border: '1px solid rgba(245, 166, 35, 0.35)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5), 0 0 12px rgba(245, 166, 35, 0.2)',
            transition: 'all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)',
            '&:hover': {
              bgcolor: 'primary.main',
              color: '#0A0C10',
              transform: 'translateY(-4px) scale(1.05)',
              borderColor: 'primary.light',
              boxShadow: '0 12px 28px rgba(245, 166, 35, 0.45)',
            },
            '&:active': {
              transform: 'translateY(-1px) scale(0.98)',
            },
          }}
        >
          <KeyboardArrowUpRoundedIcon sx={{ fontSize: '1.8rem' }} />
        </Fab>
      </Tooltip>
    </Zoom>
  )
}
