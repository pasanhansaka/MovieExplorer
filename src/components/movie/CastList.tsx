import React from 'react'
import { Box, Typography, Avatar } from '@mui/material'
import type { CastMember } from '../../types/movie.ts'
import { getTMDBImageUrl } from '../../utils/formatters.ts'

interface CastListProps {
  cast: CastMember[]
}

export const CastList: React.FC<CastListProps> = ({ cast }) => {
  if (!cast || cast.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No cast information available.
      </Typography>
    )
  }

  // Display top 15 cast members
  const displayedCast = cast.slice(0, 15)

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2.5,
        overflowX: 'auto',
        pb: 2,
        pt: 1,
        scrollbarWidth: 'thin',
        '&::-webkit-scrollbar': { height: 6 },
        '&::-webkit-scrollbar-thumb': {
          bgcolor: 'action.hover',
          borderRadius: 3,
        },
      }}
    >
      {displayedCast.map((member) => {
        const profileUrl = getTMDBImageUrl(member.profile_path, 'w185')

        return (
          <Box
            key={member.id}
            sx={{
              minWidth: 105,
              maxWidth: 105,
              textAlign: 'center',
              flexShrink: 0,
            }}
          >
            <Avatar
              src={profileUrl || undefined}
              alt={member.name}
              sx={{
                width: 76,
                height: 76,
                mx: 'auto',
                mb: 1.25,
                border: '2px solid',
                borderColor: 'divider',
                bgcolor: 'action.hover',
                fontSize: '1rem',
                fontWeight: 600,
              }}
            >
              {member.name.charAt(0)}
            </Avatar>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                fontSize: '0.8rem',
                lineHeight: 1.2,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {member.name}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                fontSize: '0.72rem',
                lineHeight: 1.2,
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {member.character}
            </Typography>
          </Box>
        )
      })}
    </Box>
  )
}
