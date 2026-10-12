import React, { useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
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
import HowToRegRoundedIcon from '@mui/icons-material/HowToRegRounded'
import MovieFilterRoundedIcon from '@mui/icons-material/MovieFilterRounded'
import { useAuth } from '../features/auth/AuthContext.tsx'

const signupSchema = z
  .object({
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(30, 'Username cannot exceed 30 characters')
      .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type SignupFormData = z.infer<typeof signupSchema>

export const SignupPage: React.FC = () => {
  const { signUp, isConfigured } = useAuth()
  const navigate = useNavigate()
  const [authError, setAuthError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: SignupFormData) => {
    setAuthError(null)
    setSubmitting(true)

    const result = await signUp(data.email, data.password, data.username)
    setSubmitting(false)

    if (result.success) {
      setSuccessMsg('Account created successfully! Redirecting...')
      setTimeout(() => {
        navigate('/')
      }, 1200)
    } else {
      setAuthError(result.error || 'Failed to create account')
    }
  }

  return (
    <Container maxWidth="xs" sx={{ py: { xs: 5, md: 8 } }}>
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
        <Box sx={{ textAlign: 'center', mb: 3 }}>
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
            Create an Account
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sync your movie watchlist across all your devices
          </Typography>
        </Box>

        {!isConfigured && (
          <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
            Supabase is not configured yet. Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to enable cloud registration.
          </Alert>
        )}

        {authError && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {authError}
          </Alert>
        )}

        {successMsg && (
          <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
            {successMsg}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            margin="normal"
            fullWidth
            id="username"
            label="Username"
            autoComplete="username"
            autoFocus
            {...register('username')}
            error={Boolean(errors.username)}
            helperText={errors.username?.message}
            sx={{ mb: 1.5 }}
          />

          <TextField
            margin="normal"
            fullWidth
            id="email"
            label="Email Address"
            autoComplete="email"
            {...register('email')}
            error={Boolean(errors.email)}
            helperText={errors.email?.message}
            sx={{ mb: 1.5 }}
          />

          <TextField
            margin="normal"
            fullWidth
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            {...register('password')}
            error={Boolean(errors.password)}
            helperText={errors.password?.message}
            sx={{ mb: 1.5 }}
          />

          <TextField
            margin="normal"
            fullWidth
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            {...register('confirmPassword')}
            error={Boolean(errors.confirmPassword)}
            helperText={errors.confirmPassword?.message}
            sx={{ mb: 3 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <HowToRegRoundedIcon />}
            sx={{ py: 1.25, fontWeight: 700, mb: 2.5 }}
          >
            {submitting ? 'Registering...' : 'Sign Up'}
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Link component={RouterLink} to="/login" color="primary.main" sx={{ fontWeight: 600 }}>
                Sign In
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}
