import React, { useState } from 'react'
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Container,
  Tooltip,
  Menu,
  MenuItem,
  Avatar,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material'
import MovieFilterRoundedIcon from '@mui/icons-material/MovieFilterRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import BookmarkRoundedIcon from '@mui/icons-material/BookmarkRounded'
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded'
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import { useAppTheme } from '../../features/theme/ThemeContext.tsx'
import { useAuth } from '../../features/auth/AuthContext.tsx'
import { useFavorites } from '../../features/favorites/FavoritesContext.tsx'

export const Navbar: React.FC = () => {
  const { mode, toggleTheme } = useAppTheme()
  const { user, signOut } = useAuth()
  const { favorites } = useFavorites()
  const navigate = useNavigate()
  const location = useLocation()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseUserMenu = () => {
    setAnchorEl(null)
  }

  const handleSignOut = async () => {
    handleCloseUserMenu()
    await signOut()
    navigate('/')
  }

  const navLinks = [
    { label: 'Home', path: '/', icon: <HomeRoundedIcon /> },
    { label: 'Discover & Search', path: '/search', icon: <SearchRoundedIcon /> },
    {
      label: 'Favorites',
      path: '/favorites',
      icon: (
        <Badge badgeContent={favorites.length} color="primary" max={99}>
          <BookmarkRoundedIcon />
        </Badge>
      ),
    },
  ]

  const username = user?.profile?.username || user?.email?.split('@')[0] || 'User'

  return (
    <AppBar position="sticky" elevation={0}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 72 } }}>
          {/* Mobile menu hamburger button */}
          <IconButton
            color="inherit"
            aria-label="Open mobile navigation menu"
            edge="start"
            onClick={() => setMobileOpen(true)}
            sx={{ mr: 1.5, display: { md: 'none' } }}
          >
            <MenuRoundedIcon />
          </IconButton>

          {/* Logo / Wordmark */}
          <Box
            component={RouterLink}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'inherit',
              mr: { xs: 2, md: 4 },
            }}
          >
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: 2.5,
                bgcolor: 'primary.main',
                color: '#0A0C10',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 1.25,
                boxShadow: '0 4px 12px rgba(245, 166, 35, 0.35)',
              }}
            >
              <MovieFilterRoundedIcon fontSize="medium" />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"Outfit", sans-serif',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                background:
                  mode === 'dark'
                    ? 'linear-gradient(90deg, #FFFFFF 0%, #F5A623 100%)'
                    : 'linear-gradient(90deg, #11151F 0%, #C77F0A 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              MOVIE<span style={{ fontWeight: 400, marginLeft: 4 }}>EXPLORER</span>
            </Typography>
          </Box>

          {/* Desktop Navigation Links */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path
              return (
                <Button
                  key={link.path}
                  component={RouterLink}
                  to={link.path}
                  startIcon={link.icon}
                  sx={{
                    px: 2,
                    py: 1,
                    color: isActive ? 'primary.main' : 'text.secondary',
                    fontWeight: isActive ? 700 : 500,
                    bgcolor: isActive ? 'action.selected' : 'transparent',
                    '&:hover': {
                      color: 'text.primary',
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  {link.label}
                </Button>
              )
            })}
          </Box>

          {/* Right Action Controls: Theme Toggle + Auth */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 }, ml: 'auto' }}>
            {/* Theme Toggle Button */}
            <Tooltip title={`Switch to ${mode === 'dark' ? 'Light' : 'Dark'} Mode`}>
              <IconButton
                onClick={toggleTheme}
                aria-label={`Switch to ${mode === 'dark' ? 'light' : 'dark'} theme`}
                sx={{
                  color: 'text.primary',
                  bgcolor: 'action.hover',
                  '&:hover': { bgcolor: 'action.selected' },
                }}
              >
                {mode === 'dark' ? (
                  <LightModeRoundedIcon sx={{ color: '#F5A623' }} />
                ) : (
                  <DarkModeRoundedIcon sx={{ color: '#6840B0' }} />
                )}
              </IconButton>
            </Tooltip>

            {/* Authenticated user menu vs Guest Login/Register */}
            {user ? (
              <>
                <Tooltip title="Account menu">
                  <IconButton
                    onClick={handleOpenUserMenu}
                    aria-label="Open account options"
                    sx={{ p: 0.5, border: '2px solid', borderColor: 'primary.main' }}
                  >
                    <Avatar
                      sx={{
                        width: 34,
                        height: 34,
                        bgcolor: 'primary.main',
                        color: '#0A0C10',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                      }}
                    >
                      {username.charAt(0).toUpperCase()}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleCloseUserMenu}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  slotProps={{
                    paper: {
                      sx: {
                        minWidth: 180,
                        mt: 1,
                        border: '1px solid',
                        borderColor: 'divider',
                      },
                    },
                  }}
                >
                  <Box sx={{ px: 2, py: 1.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {username}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user.email}
                    </Typography>
                  </Box>
                  <Divider />
                  <MenuItem
                    component={RouterLink}
                    to="/favorites"
                    onClick={handleCloseUserMenu}
                  >
                    <BookmarkRoundedIcon sx={{ mr: 1.5, fontSize: 20 }} />
                    My Saved Favorites
                  </MenuItem>
                  <MenuItem onClick={handleSignOut} sx={{ color: 'error.main' }}>
                    <LogoutRoundedIcon sx={{ mr: 1.5, fontSize: 20 }} />
                    Sign Out
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="outlined"
                  size="small"
                  sx={{
                    borderColor: 'divider',
                    color: 'text.primary',
                    '&:hover': { borderColor: 'primary.main' },
                  }}
                >
                  Sign In
                </Button>
                <Button
                  component={RouterLink}
                  to="/signup"
                  variant="contained"
                  color="primary"
                  size="small"
                  sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
                >
                  Sign Up
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: 280,
              bgcolor: 'background.paper',
              p: 2,
            },
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, px: 1 }}>
          <MovieFilterRoundedIcon sx={{ color: 'primary.main', mr: 1.5, fontSize: 30 }} />
          <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: '"Outfit", sans-serif' }}>
            MOVIE EXPLORER
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <List>
          {navLinks.map((link) => (
            <ListItem key={link.path} disablePadding>
              <ListItemButton
                component={RouterLink}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                selected={location.pathname === link.path}
                sx={{ borderRadius: 2, mb: 0.5 }}
              >
                <ListItemIcon sx={{ color: 'inherit' }}>{link.icon}</ListItemIcon>
                <ListItemText primary={link.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider sx={{ my: 2 }} />
        {user ? (
          <Box sx={{ px: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Signed in as <strong>{username}</strong>
            </Typography>
            <Button
              variant="outlined"
              color="error"
              fullWidth
              startIcon={<LogoutRoundedIcon />}
              onClick={() => {
                setMobileOpen(false)
                handleSignOut()
              }}
              sx={{ mt: 2 }}
            >
              Sign Out
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, px: 1 }}>
            <Button
              component={RouterLink}
              to="/login"
              variant="outlined"
              fullWidth
              onClick={() => setMobileOpen(false)}
            >
              Sign In
            </Button>
            <Button
              component={RouterLink}
              to="/signup"
              variant="contained"
              fullWidth
              onClick={() => setMobileOpen(false)}
            >
              Create Account
            </Button>
          </Box>
        )}
      </Drawer>
    </AppBar>
  )
}
