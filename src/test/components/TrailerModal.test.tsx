import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { TrailerModal } from '../../components/movie/TrailerModal.tsx'

describe('TrailerModal Component', () => {
  it('renders iframe with valid YouTube key', () => {
    render(
      <TrailerModal
        open={true}
        onClose={vi.fn()}
        videoKey="dQw4w9WgXcQ"
        movieTitle="Inception"
      />
    )

    expect(screen.getByText(/Inception — Official Trailer/i)).toBeInTheDocument()
    const iframe = screen.getByTitle(/Inception Trailer/i)
    expect(iframe).toBeInTheDocument()
    expect(iframe).toHaveAttribute(
      'src',
      'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1'
    )
  })

  it('renders graceful fallback when video key is invalid', () => {
    render(
      <TrailerModal
        open={true}
        onClose={vi.fn()}
        videoKey="invalid"
        movieTitle="Sample Film"
      />
    )

    expect(
      screen.getByText(/Trailer is currently unavailable for this film/i)
    ).toBeInTheDocument()
  })

  it('triggers onClose when close icon is clicked', () => {
    const handleClose = vi.fn()
    render(
      <TrailerModal
        open={true}
        onClose={handleClose}
        videoKey="dQw4w9WgXcQ"
        movieTitle="Inception"
      />
    )

    const closeBtn = screen.getByRole('button', { name: /close trailer dialog/i })
    fireEvent.click(closeBtn)
    expect(handleClose).toHaveBeenCalledTimes(1)
  })
})
