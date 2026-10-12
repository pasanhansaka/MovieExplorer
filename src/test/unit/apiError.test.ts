import { describe, it, expect } from 'vitest'
import { normalizeApiError } from '../../utils/apiError.ts'

describe('normalizeApiError Utility', () => {
  it('handles standard Error instances', () => {
    const error = new Error('Database connection failed')
    expect(normalizeApiError(error)).toBe('Database connection failed')
  })

  it('normalizes string error values', () => {
    expect(normalizeApiError('Invalid session')).toBe('Invalid session')
  })

  it('provides safe fallbacks for null or undefined errors', () => {
    expect(normalizeApiError(null)).toBe('An unexpected error occurred. Please try again.')
    expect(normalizeApiError(undefined)).toBe('An unexpected error occurred. Please try again.')
  })

  it('handles network failure errors gracefully', () => {
    const error = new Error('Failed to fetch from upstream')
    expect(normalizeApiError(error)).toContain('Unable to reach the server')
  })

  it('normalizes mock Axios errors by status code', () => {
    const axiosError404 = {
      isAxiosError: true,
      response: { status: 404, data: {} },
    }
    expect(normalizeApiError(axiosError404)).toBe(
      'The requested movie or resource was not found.'
    )

    const axiosError429 = {
      isAxiosError: true,
      response: { status: 429, data: {} },
    }
    expect(normalizeApiError(axiosError429)).toBe(
      'Too many requests. Please wait a moment and try again.'
    )

    const axiosCustomMessage = {
      isAxiosError: true,
      response: { status: 400, data: { error: 'Invalid movie filter provided' } },
    }
    expect(normalizeApiError(axiosCustomMessage)).toBe('Invalid movie filter provided')
  })
})
