import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
} from '@mui/material'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { isValidYouTubeKey } from '../../utils/validation.ts'

interface TrailerModalProps {
  open: boolean
  onClose: () => void
  videoKey?: string | null
  movieTitle?: string
}

export const TrailerModal: React.FC<TrailerModalProps> = ({
  open,
  onClose,
  videoKey,
  movieTitle = 'Movie Trailer',
}) => {
  const isValid = videoKey && isValidYouTubeKey(videoKey)

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      aria-labelledby="trailer-dialog-title"
      slotProps={{
        paper: {
          sx: {
            backgroundColor: '#0B0D13',
            backgroundImage: 'none',
            borderRadius: 3,
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
        },
      }}
    >
      <DialogTitle
        id="trailer-dialog-title"
        sx={{
          m: 0,
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: '#FFFFFF',
        }}
      >
        <Typography variant="h6" component="span" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
          {movieTitle} — Official Trailer
        </Typography>
        <IconButton
          aria-label="Close trailer dialog"
          onClick={onClose}
          size="small"
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            '&:hover': { color: '#FFFFFF', bgcolor: 'rgba(255, 255, 255, 0.1)' },
          }}
        >
          <CloseRoundedIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0, bgcolor: '#000000' }}>
        {isValid ? (
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              aspectRatio: '16 / 9',
            }}
          >
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${videoKey}?autoplay=1&rel=0&modestbranding=1`}
              title={`${movieTitle} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 0,
              }}
            />
          </Box>
        ) : (
          <Box
            sx={{
              py: 8,
              px: 3,
              textAlign: 'center',
              color: 'text.secondary',
            }}
          >
            <Typography variant="body1">
              Trailer is currently unavailable for this film.
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  )
}
