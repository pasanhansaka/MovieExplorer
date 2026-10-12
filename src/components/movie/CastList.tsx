import React, { useRef, useState, useEffect, useCallback } from 'react'
import { Box, Typography, Avatar, IconButton } from '@mui/material'
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import type { CastMember } from '../../types/movie.ts'
import { getTMDBImageUrl } from '../../utils/formatters.ts'

interface CastListProps {
  cast: CastMember[]
}

export const CastList: React.FC<CastListProps> = ({ cast }) => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const isDraggingRef = useRef(false)
  const startXRef = useRef(0)
  const scrollLeftRef = useRef(0)

  // Update arrow button visibility based on scroll position
  const checkScroll = useCallback(() => {
    const el = scrollContainerRef.current
    if (!el) return
    const { scrollLeft, scrollWidth, clientWidth } = el
    setCanScrollLeft(scrollLeft > 10)
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10)
  }, [])

  useEffect(() => {
    checkScroll()
    const el = scrollContainerRef.current
    if (!el) return

    const handleResize = () => checkScroll()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [cast, checkScroll])

  const handleScroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current
    if (!el) return
    const scrollAmount = direction === 'left' ? -350 : 350
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  }

  // Mouse drag-to-scroll listeners for effortless desktop navigation
  const handleMouseDown = (e: React.MouseEvent) => {
    const el = scrollContainerRef.current
    if (!el) return
    isDraggingRef.current = true
    startXRef.current = e.pageX - el.offsetLeft
    scrollLeftRef.current = el.scrollLeft
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return
    e.preventDefault()
    const el = scrollContainerRef.current
    if (!el) return
    const x = e.pageX - el.offsetLeft
    const walk = (x - startXRef.current) * 1.5 // multiplier for responsiveness
    el.scrollLeft = scrollLeftRef.current - walk
  }

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false
  }

  if (!cast || cast.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No cast information available.
      </Typography>
    )
  }

  // Display top 20 cast members
  const displayedCast = cast.slice(0, 20)

  return (
    <Box sx={{ position: 'relative', width: '100%', minWidth: 0 }}>
      {/* Left Scroll Button */}
      {canScrollLeft && (
        <IconButton
          onClick={() => handleScroll('left')}
          aria-label="Scroll cast left"
          size="small"
          sx={{
            position: 'absolute',
            left: -12,
            top: '40%',
            transform: 'translateY(-50%)',
            zIndex: 4,
            width: 38,
            height: 38,
            bgcolor: 'rgba(11, 13, 19, 0.85)',
            backdropFilter: 'blur(8px)',
            color: '#FFFFFF',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            '&:hover': {
              bgcolor: 'primary.main',
              color: '#0A0C10',
            },
            display: { xs: 'none', sm: 'flex' },
          }}
        >
          <ChevronLeftRoundedIcon fontSize="medium" />
        </IconButton>
      )}

      {/* Right Scroll Button */}
      {canScrollRight && (
        <IconButton
          onClick={() => handleScroll('right')}
          aria-label="Scroll cast right"
          size="small"
          sx={{
            position: 'absolute',
            right: -12,
            top: '40%',
            transform: 'translateY(-50%)',
            zIndex: 4,
            width: 38,
            height: 38,
            bgcolor: 'rgba(11, 13, 19, 0.85)',
            backdropFilter: 'blur(8px)',
            color: '#FFFFFF',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            '&:hover': {
              bgcolor: 'primary.main',
              color: '#0A0C10',
            },
            display: { xs: 'none', sm: 'flex' },
          }}
        >
          <ChevronRightRoundedIcon fontSize="medium" />
        </IconButton>
      )}

      {/* Scrollable Cast Container */}
      <Box
        ref={scrollContainerRef}
        onScroll={checkScroll}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        sx={{
          display: 'flex',
          gap: 2.5,
          overflowX: 'auto',
          overflowY: 'hidden',
          width: '100%',
          minWidth: 0,
          pb: 2,
          pt: 1,
          px: 0.5,
          cursor: 'grab',
          '&:active': { cursor: 'grabbing' },
          userSelect: 'none',
          scrollBehavior: 'smooth',
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': { height: 7 },
          '&::-webkit-scrollbar-track': {
            bgcolor: 'action.hover',
            borderRadius: 4,
          },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: 'primary.main',
            borderRadius: 4,
            '&:hover': {
              bgcolor: 'primary.light',
            },
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
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  transition: 'transform 0.2s ease, border-color 0.2s ease',
                  '&:hover': {
                    transform: 'scale(1.06)',
                    borderColor: 'primary.main',
                  },
                }}
              >
                {member.name.charAt(0)}
              </Avatar>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  lineHeight: 1.25,
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
    </Box>
  )
}
