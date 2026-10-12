import React, { useState } from 'react'
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Link,
} from '@mui/material'
import MovieFilterRoundedIcon from '@mui/icons-material/MovieFilterRounded'
import LoginRoundedIcon from '@mui/icons-material/LoginRounded'
import { useAuth } from '../features/auth/AuthContext.tsx'

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

export const LoginPage: React.FC = () => {
  const { signIn, isConfigured } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [authError, setAuthError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const from = (location.state as any)?.from?.pathname || '/'

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    setAuthError(null)
    setSubmitting(true)

    const result = await signIn(data.email, data.password)
    setSubmitting(false)

    if (result.success) {
      navigate(from, { replace: true })
    } else {
      setAuthError(result.error || 'Failed to authenticate')
    }
  }

  return (
    <Container maxWidth="xs" sx={{ py: { xs: 6, md: 10 } }}>
      <Paper
        elevation={6}
        sx={{
          p: { xs: 3, sm: 4.5 },
          borderRadius: 3.5,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 3.5 }}>
          <Box
            sx={{
              display: 'inline-flex',
              p: 1.5,
              borderRadius: 2.5,
              bgcolor: 'primary.main',
              color: '#0A0C10',
              mb: 1.5,
            }}
          >
            <MovieFilterRoundedIcon fontSize="large" />
          </Box>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 800, fontFamily: '"Outfit", sans-serif' }}>
            Welcome Back
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sign in to manage your saved watchlist
          </Typography>
        </Box>

        {!isConfigured && (
          <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
            Supabase is not configured yet. Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to enable cloud authentication.
          </Alert>
        )}

        {authError && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {authError}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            margin="normal"
            fullWidth
            id="email"
            label="Email Address"
            autoComplete="email"
            autoFocus
            {...register('email')}
            error={Boolean(errors.email)}
            helperText={errors.email?.message}
            sx={{ mb: 2 }}
          />

          <TextField
            margin="normal"
            fullWidth
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            {...register('password')}
            error={Boolean(errors.password)}
            helperText={errors.password?.message}
            sx={{ mb: 3 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <LoginRoundedIcon />}
            sx={{ py: 1.25, fontWeight: 700, mb: 2.5 }}
          >
            {submitting ? 'Signing In...' : 'Sign In'}
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Link component={RouterLink} to="/signup" color="primary.main" sx={{ fontWeight: 600 }}>
                Create an Account
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}
