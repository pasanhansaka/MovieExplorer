import { describe, it, expect } from 'vitest'
import {
  formatReleaseYear,
  formatRating,
  formatRuntime,
  formatDate,
  getTMDBImageUrl,
} from '../../utils/formatters.ts'

describe('Formatters Utility', () => {
  describe('formatReleaseYear', () => {
    it('extracts a 4-digit release year from a valid date string', () => {
      expect(formatReleaseYear('2024-11-15')).toBe('2024')
      expect(formatReleaseYear('1999-03-31')).toBe('1999')
    })

    it('returns N/A for null, undefined, or malformed dates', () => {
      expect(formatReleaseYear(null)).toBe('N/A')
      expect(formatReleaseYear(undefined)).toBe('N/A')
      expect(formatReleaseYear('')).toBe('N/A')
      expect(formatReleaseYear('invalid-date')).toBe('N/A')
    })
  })

  describe('formatRating', () => {
    it('formats a float rating to 1 decimal place', () => {
      expect(formatRating(8.467)).toBe('8.5')
      expect(formatRating(7.0)).toBe('7.0')
      expect(formatRating(9)).toBe('9.0')
    })

    it('returns NR when rating is null or NaN', () => {
      expect(formatRating(null)).toBe('NR')
      expect(formatRating(undefined)).toBe('NR')
      expect(formatRating(NaN)).toBe('NR')
    })
  })

  describe('formatRuntime', () => {
    it('formats minutes into hours and minutes', () => {
      expect(formatRuntime(148)).toBe('2h 28m')
      expect(formatRuntime(60)).toBe('1h')
      expect(formatRuntime(45)).toBe('45m')
      expect(formatRuntime(120)).toBe('2h')
    })

    it('returns N/A for 0, negative, or undefined values', () => {
      expect(formatRuntime(0)).toBe('N/A')
      expect(formatRuntime(-10)).toBe('N/A')
      expect(formatRuntime(null)).toBe('N/A')
    })
  })

  describe('formatDate', () => {
    it('formats ISO dates into readable strings', () => {
      const formatted = formatDate('2024-05-24')
      expect(formatted).toContain('2024')
      expect(formatted).toContain('May')
    })

    it('handles missing dates gracefully', () => {
      expect(formatDate(null)).toBe('Unknown')
      expect(formatDate(undefined)).toBe('Unknown')
    })
  })

  describe('getTMDBImageUrl', () => {
    it('builds full URL with default w500 size', () => {
      expect(getTMDBImageUrl('/abc.jpg')).toBe('https://image.tmdb.org/t/p/w500/abc.jpg')
    })

    it('handles custom size and paths without leading slash', () => {
      expect(getTMDBImageUrl('poster.png', 'original')).toBe(
        'https://image.tmdb.org/t/p/original/poster.png'
      )
    })

    it('returns null for empty or null paths', () => {
      expect(getTMDBImageUrl(null)).toBeNull()
      expect(getTMDBImageUrl('')).toBeNull()
    })
  })
})
