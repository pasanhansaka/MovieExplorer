import { describe, it, expect } from 'vitest'
import {
  sanitizeSearchQuery,
  isValidMovieId,
  isValidYouTubeKey,
} from '../../utils/validation.ts'

describe('Validation Utility', () => {
  describe('sanitizeSearchQuery', () => {
    it('trims leading and trailing whitespace', () => {
      expect(sanitizeSearchQuery('   Inception   ')).toBe('Inception')
    })

    it('returns empty string for null, undefined, or empty queries', () => {
      expect(sanitizeSearchQuery(null)).toBe('')
      expect(sanitizeSearchQuery(undefined)).toBe('')
      expect(sanitizeSearchQuery('    ')).toBe('')
    })
  })

  describe('isValidMovieId', () => {
    it('validates positive integers as numbers or strings', () => {
      expect(isValidMovieId(550)).toBe(true)
      expect(isValidMovieId('550')).toBe(true)
      expect(isValidMovieId('1')).toBe(true)
    })

    it('rejects non-integers, zeros, negative numbers, or non-numeric strings', () => {
      expect(isValidMovieId(0)).toBe(false)
      expect(isValidMovieId(-5)).toBe(false)
      expect(isValidMovieId('abc')).toBe(false)
      expect(isValidMovieId('123abc')).toBe(false)
      expect(isValidMovieId(null)).toBe(false)
      expect(isValidMovieId(undefined)).toBe(false)
    })
  })

  describe('isValidYouTubeKey', () => {
    it('accepts 11-character alphanumeric YouTube keys', () => {
      expect(isValidYouTubeKey('dQw4w9WgXcQ')).toBe(true)
      expect(isValidYouTubeKey('L_LUpnjgPso')).toBe(true)
    })

    it('rejects keys with invalid length or special characters', () => {
      expect(isValidYouTubeKey('short')).toBe(false)
      expect(isValidYouTubeKey('toolongvideokey123456')).toBe(false)
      expect(isValidYouTubeKey('invalid@key!')).toBe(false)
      expect(isValidYouTubeKey(null)).toBe(false)
      expect(isValidYouTubeKey('')).toBe(false)
    })
  })
})
