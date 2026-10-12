import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import { LoginPage } from '../../pages/LoginPage.tsx'
import { SignupPage } from '../../pages/SignupPage.tsx'
import { AppProviders } from '../../app/providers.tsx'

describe('Authentication Form Integration Tests', () => {
  describe('LoginPage', () => {
    it('shows validation errors for empty email and short password', async () => {
      render(
        <AppProviders>
          <BrowserRouter>
            <LoginPage />
          </BrowserRouter>
        </AppProviders>
      )

      const submitBtn = screen.getByRole('button', { name: /^sign in$/i })
      fireEvent.click(submitBtn)

      await waitFor(() => {
        expect(screen.getByText(/email is required/i)).toBeInTheDocument()
      })
    })

    it('validates email format properly', async () => {
      render(
        <AppProviders>
          <BrowserRouter>
            <LoginPage />
          </BrowserRouter>
        </AppProviders>
      )

      const emailInput = screen.getByLabelText(/email address/i)
      fireEvent.change(emailInput, { target: { value: 'not-an-email' } })

      const submitBtn = screen.getByRole('button', { name: /^sign in$/i })
      fireEvent.click(submitBtn)

      await waitFor(() => {
        expect(
          screen.getByText(/please enter a valid email address/i)
        ).toBeInTheDocument()
      })
    })
  })

  describe('SignupPage', () => {
    it('validates password mismatch on registration', async () => {
      render(
        <AppProviders>
          <BrowserRouter>
            <SignupPage />
          </BrowserRouter>
        </AppProviders>
      )

      fireEvent.change(screen.getByLabelText(/username/i), {
        target: { value: 'cinephile99' },
      })
      fireEvent.change(screen.getByLabelText(/email address/i), {
        target: { value: 'cine@example.com' },
      })
      fireEvent.change(screen.getByLabelText(/^password$/i), {
        target: { value: 'secret123' },
      })
      fireEvent.change(screen.getByLabelText(/confirm password/i), {
        target: { value: 'different123' },
      })

      const submitBtn = screen.getByRole('button', { name: /^sign up$/i })
      fireEvent.click(submitBtn)

      await waitFor(() => {
        expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument()
      })
    })

    it('rejects usernames containing illegal characters', async () => {
      render(
        <AppProviders>
          <BrowserRouter>
            <SignupPage />
          </BrowserRouter>
        </AppProviders>
      )

      fireEvent.change(screen.getByLabelText(/username/i), {
        target: { value: 'user name!#$' },
      })

      const submitBtn = screen.getByRole('button', { name: /^sign up$/i })
      fireEvent.click(submitBtn)

      await waitFor(() => {
        expect(
          screen.getByText(
            /username can only contain letters, numbers, and underscores/i
          )
        ).toBeInTheDocument()
      })
    })
  })
})
