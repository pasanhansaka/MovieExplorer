import axios from 'axios'

/**
 * Normalizes unknown errors (Axios, Supabase, network, runtime) into user-friendly messages.
 * Never leaks private tokens or server internals.
 */
export function normalizeApiError(error: unknown): string {
  if (!error) return 'An unexpected error occurred. Please try again.'

  if (axios.isAxiosError(error)) {
    if (error.response) {
      const status = error.response.status
      const data = error.response.data as { error?: string; message?: string } | undefined

      if (data?.error && typeof data.error === 'string') {
        return data.error
      }
      if (data?.message && typeof data.message === 'string') {
        return data.message
      }

      switch (status) {
        case 400:
          return 'Invalid request parameters. Please verify your search or filter options.'
        case 401:
          return 'API authentication failed. Please check configuration.'
        case 404:
          return 'The requested movie or resource was not found.'
        case 429:
          return 'Too many requests. Please wait a moment and try again.'
        case 500:
        case 502:
        case 503:
          return 'Movie service is temporarily unavailable. Please try again shortly.'
        default:
          return `Request failed with status ${status}.`
      }
    }

    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return 'Request timed out. Please check your internet connection.'
    }

    if (error.request) {
      return 'Network error. Please check your connection to the movie service.'
    }
  }

  if (error instanceof Error) {
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      return 'Unable to reach the server. Please check your connection or CORS configuration.'
    }
    return error.message
  }

  if (typeof error === 'string') {
    return error
  }

  return 'An unexpected error occurred. Please try again.'
}
