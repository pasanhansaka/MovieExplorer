import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ErrorState } from '../../components/feedback/ErrorState.tsx'
import { EmptyState } from '../../components/feedback/EmptyState.tsx'

describe('Feedback Components', () => {
  describe('ErrorState', () => {
    it('renders the title, error message, and retry button', () => {
      const handleRetry = vi.fn()
      render(
        <ErrorState
          title="Network Connection Lost"
          message="Could not reach the movie catalog proxy."
          onRetry={handleRetry}
        />
      )

      expect(screen.getByText('Network Connection Lost')).toBeInTheDocument()
      expect(
        screen.getByText('Could not reach the movie catalog proxy.')
      ).toBeInTheDocument()

      const retryBtn = screen.getByRole('button', { name: /try again/i })
      expect(retryBtn).toBeInTheDocument()

      fireEvent.click(retryBtn)
      expect(handleRetry).toHaveBeenCalledTimes(1)
    })
  })

  describe('EmptyState', () => {
    it('renders title, description, and action button', () => {
      const handleAction = vi.fn()
      render(
        <EmptyState
          title="No Films Found"
          description="Try relaxing your filters."
          actionLabel="Clear Filters"
          onAction={handleAction}
        />
      )

      expect(screen.getByText('No Films Found')).toBeInTheDocument()
      expect(screen.getByText('Try relaxing your filters.')).toBeInTheDocument()

      const actionBtn = screen.getByRole('button', { name: /clear filters/i })
      fireEvent.click(actionBtn)
      expect(handleAction).toHaveBeenCalledTimes(1)
    })
  })
})
