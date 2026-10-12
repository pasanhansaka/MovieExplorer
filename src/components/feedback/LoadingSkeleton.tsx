import React from 'react'
import { Box, Card, Skeleton } from '@mui/material'

export const MovieCardSkeleton: React.FC = () => {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3.5,
        overflow: 'hidden',
      }}
    >
      {/* 2:3 Poster aspect ratio skeleton */}
      <Skeleton
        variant="rectangular"
        animation="wave"
        sx={{
          width: '100%',
          aspectRatio: '2 / 3',
          bgcolor: 'action.hover',
        }}
      />
      <Box sx={{ p: 2, flexGrow: 1 }}>
        <Skeleton variant="text" width="80%" height={24} sx={{ mb: 1 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Skeleton variant="text" width="30%" height={18} />
          <Skeleton variant="rounded" width={42} height={22} sx={{ borderRadius: 1 }} />
        </Box>
      </Box>
    </Card>
  )
}

export const MovieGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(2, 1fr)',
          sm: 'repeat(3, 1fr)',
          md: 'repeat(4, 1fr)',
          lg: 'repeat(5, 1fr)',
        },
        gap: { xs: 2, sm: 3 },
      }}
    >
      {Array.from({ length: count }).map((_, index) => (
        <MovieCardSkeleton key={index} />
      ))}
    </Box>
  )
}

export const HeroSkeleton: React.FC = () => {
  return (
    <Box
      sx={{
        width: '100%',
        minHeight: { xs: 360, md: 520 },
        borderRadius: 4,
        overflow: 'hidden',
        position: 'relative',
        bgcolor: 'action.hover',
        mb: 6,
        display: 'flex',
        alignItems: 'flex-end',
        p: { xs: 3, md: 6 },
      }}
    >
      <Box sx={{ maxWidth: 650, width: '100%', zIndex: 1 }}>
        <Skeleton variant="rounded" width={90} height={28} sx={{ mb: 2, borderRadius: 1 }} />
        <Skeleton variant="text" width="90%" height={52} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="100%" height={24} />
        <Skeleton variant="text" width="70%" height={24} sx={{ mb: 3 }} />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Skeleton variant="rounded" width={140} height={44} sx={{ borderRadius: 2 }} />
          <Skeleton variant="rounded" width={140} height={44} sx={{ borderRadius: 2 }} />
        </Box>
      </Box>
    </Box>
  )
}
