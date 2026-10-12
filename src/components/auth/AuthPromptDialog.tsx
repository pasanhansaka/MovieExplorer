import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  IconButton,
} from '@mui/material'
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import LoginRoundedIcon from '@mui/icons-material/LoginRounded'
import PersonAddAlt1RoundedIcon from '@mui/icons-material/PersonAddAlt1Rounded'

interface AuthPromptDialogProps {
  open: boolean
  onClose: () => void
  movieTitle?: string
}

export const AuthPromptDialog: React.FC<AuthPromptDialogProps> = ({
  open,
  onClose,
  movieTitle,
}) => {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogin = () => {
    onClose()
    navigate('/login', { state: { from: location.pathname } })
  }

  const handleSignup = () => {
    onClose()
    navigate('/signup', { state: { from: location.pathname } })
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 4,
            p: 1.5,
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
          },
        },
      }}
      aria-labelledby="auth-prompt-dialog-title"
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <IconButton
          onClick={onClose}
          size="small"
          aria-label="Close auth dialog"
          sx={{ color: 'text.secondary' }}
        >
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </Box>

      <DialogContent sx={{ textAlign: 'center', pt: 0, pb: 2 }}>
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 64,
            height: 64,
            borderRadius: '50%',
            bgcolor: 'rgba(245, 166, 35, 0.15)',
            color: 'primary.main',
            mb: 2.5,
          }}
        >
          <BookmarkBorderRoundedIcon sx={{ fontSize: 36 }} />
        </Box>

        <Typography
          id="auth-prompt-dialog-title"
          variant="h5"
          component="h2"
          sx={{ fontWeight: 800, mb: 1.25, fontSize: '1.3rem' }}
        >
          Sign in to Bookmark
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, px: 1 }}>
          {movieTitle ? (
            <>
              You must be logged in to save <strong>"{movieTitle}"</strong> to your personal watchlist.
            </>
          ) : (
            'You must be logged in to save movies to your personal favorites and sync your watchlist.'
          )}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ flexDirection: 'column', gap: 1.25, px: 3, pb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          startIcon={<LoginRoundedIcon />}
          onClick={handleLogin}
          sx={{
            py: 1.25,
            fontWeight: 700,
            borderRadius: 2.5,
          }}
        >
          Sign In
        </Button>

        <Button
          variant="outlined"
          color="inherit"
          fullWidth
          size="large"
          startIcon={<PersonAddAlt1RoundedIcon />}
          onClick={handleSignup}
          sx={{
            py: 1.25,
            fontWeight: 600,
            borderRadius: 2.5,
            borderColor: 'divider',
            '&:hover': {
              borderColor: 'primary.main',
              bgcolor: 'action.hover',
            },
          }}
        >
          Create Free Account
        </Button>

        <Button
          onClick={onClose}
          size="small"
          sx={{ color: 'text.secondary', mt: 0.5, fontWeight: 500 }}
        >
          Maybe Later
        </Button>
      </DialogActions>
    </Dialog>
  )
}
