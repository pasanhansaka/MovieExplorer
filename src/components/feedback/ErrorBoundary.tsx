import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Typography, Button, Container, Paper } from '@mui/material'
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded'
import RefreshIcon from '@mui/icons-material/Refresh'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo)
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.reload()
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <Container maxWidth="sm" sx={{ py: 8 }}>
          <Paper
            sx={{
              p: 4,
              textAlign: 'center',
              borderRadius: 3,
              border: '1px solid rgba(255, 80, 80, 0.2)',
            }}
          >
            <ErrorOutlineRoundedIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 700 }} gutterBottom>
              Something went wrong
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              An unexpected application error occurred. We have contained the error to preserve your session.
            </Typography>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={this.handleReset}
              aria-label="Reload application"
            >
              Reload Page
            </Button>
          </Paper>
        </Container>
      )
    }

    return this.props.children
  }
}
