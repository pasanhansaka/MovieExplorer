import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SearchBar, LAST_SEARCH_KEY } from '../../components/search/SearchBar.tsx'

describe('SearchBar Component', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders input with initial value and placeholder', () => {
    render(<SearchBar initialValue="Interstellar" onSearch={vi.fn()} />)
    const input = screen.getByRole('textbox', { name: /search movies by title/i })
    expect(input).toHaveValue('Interstellar')
  })

  it('calls onSearch and persists to localStorage on form submit', () => {
    const handleSearch = vi.fn()
    render(<SearchBar onSearch={handleSearch} />)

    const input = screen.getByRole('textbox', { name: /search movies by title/i })
    fireEvent.change(input, { target: { value: 'Oppenheimer' } })

    const submitBtn = screen.getByRole('button', { name: /submit search/i })
    fireEvent.click(submitBtn)

    expect(handleSearch).toHaveBeenCalledWith('Oppenheimer')
    expect(localStorage.getItem(LAST_SEARCH_KEY)).toBe('Oppenheimer')
  })

  it('clears input and triggers onSearch with empty string when clear icon is clicked', () => {
    const handleSearch = vi.fn()
    render(<SearchBar initialValue="Dune" onSearch={handleSearch} />)

    const clearBtn = screen.getByRole('button', { name: /clear search input/i })
    fireEvent.click(clearBtn)

    expect(handleSearch).toHaveBeenCalledWith('')
    const input = screen.getByRole('textbox', { name: /search movies by title/i })
    expect(input).toHaveValue('')
  })
})
